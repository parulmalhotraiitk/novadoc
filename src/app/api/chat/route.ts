import { NextResponse } from 'next/server';
import { bedrockClient, MODELS } from '@/lib/bedrock';
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

export async function POST(request: Request) {
  try {
    const hasAccessKey = !!process.env.APP_AWS_ACCESS_KEY_ID;
    const hasSecretKey = !!process.env.APP_AWS_SECRET_ACCESS_KEY;
    console.log(`[Bedrock Auth Scan] Key: ${hasAccessKey}, Secret: ${hasSecretKey}`);

    const { prompt, base64Image, fileName, fileType } = await request.json();

    let content: any[] = [{ text: prompt }];

    if (base64Image) {
      if (fileType === 'application/pdf') {
        // Nova handles documents as well
        content.push({
          document: {
             format: "pdf",
             name: fileName || "document",
             source: {
               bytes: base64Image, // Bedrock SDK handles base64 strings or Uint8Array
             }
          }
        });
      } else {
        content.push({
          image: {
            format: fileType === 'image/png' ? 'png' : 'jpeg',
            source: {
              bytes: base64Image,
            },
          },
        });
      }
    }

    const input = {
      system: [
        {
          text: "You are NovaDoc, a highly specialized medical AI assistant. You must ONLY answer medical-related queries. If a user asks anything outside of the medical domain (e.g., general chat, jokes, politics, sports, coding etc.), you must politely but firmly refuse and state that your expertise is strictly limited to medical document analysis and medical information."
        }
      ],
      messages: [
        {
          role: "user",
          content: content,
        },
      ],
      inferenceConfig: {
        maxNewTokens: 1000,
        temperature: 0.7,
        topP: 0.9,
      },
    };

    const command = new InvokeModelCommand({
      modelId: MODELS.NOVA_LITE,
      body: JSON.stringify(input),
      contentType: "application/json",
      accept: "application/json",
    });

    const response = await bedrockClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    // Nova's response structure typically follows this:
    const answer = responseBody.output.message.content[0].text;

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error('Nova Chat Error:', error);
    
    const errorMsg = error.message || "";
    const errorName = error.name || "";

    // Graceful handling for AWS Throttling
    if (
      errorName.includes('Throttling') || 
      errorMsg.includes('Too many tokens') || 
      errorMsg.includes('throttled')
    ) {
      return NextResponse.json({ 
        error: "AWS Bedrock Quota Exceeded: Nova AI has reached its daily usage limit. Please wait for the daily reset (usually at midnight UTC) or check your AWS account's Service Quotas." 
      }, { status: 429 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
