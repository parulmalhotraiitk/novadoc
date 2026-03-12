import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

const region = process.env.APP_AWS_REGION || "us-east-1";

// Only provide credentials object if keys are actually present
const credentials = process.env.APP_AWS_ACCESS_KEY_ID && process.env.APP_AWS_SECRET_ACCESS_KEY
  ? {
      accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
    }
  : undefined;

export const bedrockClient = new BedrockRuntimeClient({
  region,
  credentials,
});

export const MODELS = {
  NOVA_LITE: "amazon.nova-lite-v1:0",
  NOVA_SONIC: "amazon.nova-2-sonic-v1:0",
};
