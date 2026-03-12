# NovaDoc: Professional AI Medical Assistant
**Hackathon Submission Document**

## 🎯 Submission Category
- **Primary Category**: Multimodal Understanding
- **Secondary Track**: Voice AI (Real-time conversational experience)

## 📖 Project Summary
NovaDoc is an enterprise-grade AI medical assistant designed to democratize access to advanced clinical document analysis and real-time medical guidance. By leveraging **Amazon Nova 2 Lite** for multimodal document processing and **Amazon Nova 2 Sonic** for zero-latency voice synthesis, NovaDoc provides a seamless, high-fidelity experience for patients and clinical professionals.

## 🧠 Leveraging Amazon Nova
- **Multimodal Understanding (Nova 2 Lite)**: We utilize Nova 2 Lite's capability to process complex medical PDFs, lab reports, and radiology images (PNG/JPG) simultaneously with text queries. This allows users to "ask" their medical documents questions in natural language.
- **Real-time Voice Synthesis (Nova 2 Sonic)**: NovaDoc implements the latest **Nova 2 Sonic 2026 bidirectional streaming API**. This ensures that the assistant's verbal responses are generated with near-zero latency, creating a natural, conversational feel for medical consultation.
- **Clinical Logic**: The assistant is governed by strict medical guardrails using Nova's high-reasoning context windows to ensure professional tone and specialized healthcare focus.

## 🛠️ Technical Stack
- **Foundation Models**: Amazon Nova 2 Lite (Vision/Text), Amazon Nova 2 Sonic (TTS).
- **Core Framework**: Next.js 15+ (App Router), React 19.
- **Connectivity**: AWS SDK for JavaScript v3 (Bedrock Runtime).
- **Mobile Experience**: Fully responsive CSS, Progressive Web App (PWA) with Service Worker caching and custom installation triggers.
- **Design System**: Premium Dark Glassmorphism (Vanilla CSS).

## 🚀 Testing Instructions
1. **GitHub Repository**: [Insert Your Repo URL]
   - *If private, please share with: testing@devpost.com and Amazon-Nova-hackathon@amazon.com*
2. **Demo Link**: [Insert Your Deployed URL, e.g., Vercel Link]
   - **Note**: For the best experience (including PWA installation), please access via **HTTPS**.
3. **AWS Credentials**: The application requires `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION` (us-east-1) to be set in the environment.
4. **Local Setup**:
   ```bash
   npm install
   npm run dev
   ```

## 🎥 Demonstration Video (Outline for User)
*The submission requires a 3-minute video. Here is a suggested script:*
- **0:00 - 0:45**: Problem Statement (High volume of complex medical data) and Introduction of NovaDoc.
- **0:45 - 1:30**: Demo of File Upload. Upload a sample lab report/PDF and ask "What does my hemoglobin level indicate?" using Nova 2 Lite.
- **1:30 - 2:30**: Demo of Voice AI. Show the real-time voice response from Nova 2 Sonic.
- **2:30 - 3:00**: Mobile Showcase. Show the PWA "Install App" button and responsive UI.
- **Hashtag**: #AmazonNova

---
*Note: Ensure your demo video does not contain copyrighted music and is set to "Public" on YouTube/Vimeo.*
