import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasAccessKey: !!process.env.APP_AWS_ACCESS_KEY_ID,
    hasSecretKey: !!process.env.APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.APP_AWS_REGION || 'not set',
    nodeEnv: process.env.NODE_ENV,
    // Safely show first 4 chars of key if it exists
    keyPrefix: process.env.APP_AWS_ACCESS_KEY_ID ? process.env.APP_AWS_ACCESS_KEY_ID.substring(0, 4) + '...' : 'none'
  });
}
