# 🚀 Deployment Guide: NovaDoc on AWS Amplify

Since this is an **AWS Hackathon**, deploying on **AWS Amplify** is the best way to earn technical points and ensure a seamless integration with your Bedrock models.

## Phase 1: Push to GitHub
Amplify works best when connected to a Git repository. 

1. **Commit your changes**:
   Run these commands in your terminal:
   ```bash
   git add .
   git commit -m "feat: complete premium medical assistant with PWA and Bedrock integration"
   ```

2. **Create a Repository**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/parulmalhotraiitk/novadoc.git
   git push -u origin main
   ```

## Phase 2: Deploy on AWS Amplify
1. Log in to the [AWS Management Console](https://console.aws.amazon.com/amplify).
2. Click **"Create new app"** -> **"GitHub"**.
3. Authorize AWS and select your `novadoc` repository.
4. **Build settings**: Amplify automatically detects Next.js. 
5. **Environment Variables**: 
   - Click **"Advanced settings"** during setup.
   - Add your keys here:
     - `APP_AWS_ACCESS_KEY_ID`
     - `APP_AWS_SECRET_ACCESS_KEY`
     - `APP_AWS_REGION` (us-east-1)
6. Click **"Save and Deploy"**.

## Phase 3: Final Verification
- Once the build is complete (usually 3-5 minutes), Amplify will provide a `https://...amplifyapp.com` link.
- **PWA Check**: Open this link on your Android phone. The **"INSTALL APP"** button will now appear because the connection is secure (HTTPS).
- **Bedrock Check**: Send a message to ensure your keys are working in the live environment.

---
**Why Amplify?** 
- It provides automatic **HTTPS**, which is required for PWAs.
- It's an AWS service, satisfying the "Generative AI on AWS" requirement.
- It's faster than manually setting up EC2 or S3 for Next.js.
