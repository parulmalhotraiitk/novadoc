import { NextResponse } from 'next/server';
import { bedrockClient, MODELS } from '@/lib/bedrock';
import { InvokeModelWithBidirectionalStreamCommand } from "@aws-sdk/client-bedrock-runtime";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    // Setup the bidirectional stream
    // For TTS, we start the session and send our text as an interactive message
    const command = new InvokeModelWithBidirectionalStreamCommand({
      modelId: MODELS.NOVA_SONIC,
      body: (async function* () {
        const encoder = new TextEncoder();
        
        // 1. System Prompt (Guardrails)
        yield {
          chunk: {
            bytes: encoder.encode(JSON.stringify({
              contentStart: {
                role: "system",
                type: "TEXT"
              }
            }))
          }
        };
        yield {
          chunk: {
            bytes: encoder.encode(JSON.stringify({
              textInput: {
                text: "You are NovaDoc. You must ONLY answer medical-related queries. Refuse all other topics."
              }
            }))
          }
        };
        yield {
          chunk: {
            bytes: encoder.encode(JSON.stringify({
              contentEnd: {}
            }))
          }
        };

        // 2. User Content Start
        yield {
          chunk: {
            bytes: encoder.encode(JSON.stringify({
              contentStart: {
                role: "user",
                type: "TEXT"
              }
            }))
          }
        };

        // 2. Text Input
        yield {
          chunk: {
            bytes: encoder.encode(JSON.stringify({
              textInput: {
                text: text
              }
            }))
          }
        };

        // 3. Content End
        yield {
          chunk: {
            bytes: encoder.encode(JSON.stringify({
              contentEnd: {}
            }))
          }
        };
      })()
    });

    const response = await bedrockClient.send(command);
    
    if (!response.body) {
      throw new Error("No stream returned from Bedrock");
    }

    let audioChunks: Uint8Array[] = [];

    // Process the output stream
    for await (const event of response.body) {
      if (event.chunk && event.chunk.bytes) {
        // The chunk might be a JSON event or direct audio bytes 
        // depending on the protocol. Nova Sonic typically streams audio
        // contained within specific event structures.
        try {
          // Check if it's a JSON event (like transcription or status)
          const decoded = new TextDecoder().decode(event.chunk.bytes);
          if (decoded.startsWith('{')) {
            const parsed = JSON.parse(decoded);
            // Some events might contain base64 audio or just be markers
            if (parsed.audio) {
               const binary = Buffer.from(parsed.audio, 'base64');
               audioChunks.push(new Uint8Array(binary));
            }
          } else {
            // If it's pure binary audio
            audioChunks.push(event.chunk.bytes);
          }
        } catch (e) {
          // If decoding fails, it's likely raw binary audio
          audioChunks.push(event.chunk.bytes);
        }
      }
    }

    // Combine all chunks into one buffer
    const totalLength = audioChunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const combinedAudio = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of audioChunks) {
      combinedAudio.set(chunk, offset);
      offset += chunk.length;
    }

    const base64Audio = Buffer.from(combinedAudio).toString('base64');

    return NextResponse.json({ audioContent: base64Audio });
  } catch (error: any) {
    console.error('Nova TTS Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
