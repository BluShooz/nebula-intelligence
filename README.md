# Nebula Intelligence

![Nebula Face](./public/nebula-face.jpg)

**Nebula Intelligence** is a high-performance, futuristic AI chat platform that pushes the boundaries of browser-based inference. By combining **WebGPU-accelerated local LLMs** with cloud-based intelligence, Nebula delivers a private, low-latency, and state-of-the-art conversational experience.

## ✨ Features

- **Local Inference (WebLLM)**: Run large language models (like Llama 3) directly in your browser. No API keys, no server costs, maximum privacy.
- **Intelligent Fallback**: Seamlessly switches to Google's **Gemini 1.5 Flash** if WebGPU is unavailable.
- **Persona-Driven Intelligence**:
    - **Gloves Off**: Grit-fueled, high-energy responses for elite users.
    - **Gloves On**: Professional, precise, and balanced.
    - **Stealth**: Minimalist, high-utility insights.
- **Futuristic UI**: Glassmorphism design system, particle backgrounds, and fluid motion animations.
- **Session Persistence**: Nebula remembers your context across browser sessions through local memory.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Intelligence**: [@mlc-ai/web-llm](https://webllm.mlc.ai/), [@google/generative-ai](https://ai.google.dev/)
- **Styling**: Vanilla CSS (HSL-based Design System), [styled-jsx](https://github.com/vercel/styled-jsx)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🛠️ Local Setup

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd nebula-intelligence
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file and add your Gemini API Key:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

## 🌐 Deployment

Deployed on **Vercel** with full WebGPU optimization support:  
👉 [nebula-intelligence.vercel.app](https://nebula-intelligence-4cbj22jlc-jon-smiths-projects-a3dfc292.vercel.app)

---

*Engineered for the highest level of execution.*
