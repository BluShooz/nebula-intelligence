import { ChatMessage, LLMEngine, LLMMode } from "./types";

export class NebulaAdminEngine implements LLMEngine {
    name = "Nebula Admin (Hybrid)";

    async isAvailable(): Promise<boolean> {
        return true; // Always available as an API route
    }

    async generateResponse(
        messages: ChatMessage[],
        onUpdate: (chunk: string) => void
    ): Promise<string> {
        const lastPrompt = messages[messages.length - 1].content;
        const mode = messages[0].role === 'system' ? messages[0].content.split('|')[0].trim() : 'gloves_on';

        const response = await fetch("/api/nebula", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                prompt: lastPrompt,
                user_id: "blue_admin",
                mode: mode.toLowerCase().replace(' ', '_')
            })
        });

        const data = await response.json();
        const text = data.text || "Nebula is thinking... but hit a snag.";

        // Simulate streaming for the hybrid engine to match UI expectations
        const words = text.split(" ");
        let currentText = "";
        for (const word of words) {
            currentText += (currentText ? " " : "") + word;
            onUpdate(word + " ");
            await new Promise(r => setTimeout(r, 50)); // Cinematic delay
        }

        return text;
    }
}
