import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMessage, LLMEngine } from "./types";

export class GeminiEngine implements LLMEngine {
    name = "Gemini Cloud";
    private genAI: GoogleGenerativeAI;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async isAvailable(): Promise<boolean> {
        return true; // Always available if API key is valid
    }

    async generateResponse(
        messages: ChatMessage[],
        onUpdate: (chunk: string) => void
    ): Promise<string> {
        const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Adapt messages to Google format
        const history = messages.slice(0, -1).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

        const lastMessage = messages[messages.length - 1].content;

        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessageStream(lastMessage);
        let fullText = "";

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;
            onUpdate(chunkText);
        }

        return fullText;
    }
}
