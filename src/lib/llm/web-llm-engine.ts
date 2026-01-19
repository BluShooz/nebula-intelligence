import { CreateMLCEngine, MLCEngine, InitProgressReport } from "@mlc-ai/web-llm";
import { ChatMessage, LLMEngine } from "./types";

export class WebLLMEngine implements LLMEngine {
    name = "Local WebLLM";
    private engine: MLCEngine | null = null;
    private selectedModel = "Llama-3-8B-Instruct-v0.1-q4f32_1-MLC"; // Efficient default

    constructor(private onProgress: (report: InitProgressReport) => void) { }

    async isAvailable(): Promise<boolean> {
        if (typeof window === 'undefined') return false;
        return !!(navigator as any).gpu;
    }

    async generateResponse(
        messages: ChatMessage[],
        onUpdate: (chunk: string) => void
    ): Promise<string> {
        if (!this.engine) {
            this.engine = await CreateMLCEngine(this.selectedModel, {
                initProgressCallback: this.onProgress,
            });
        }

        const reply = await this.engine.chat.completions.create({
            messages: messages as any,
            stream: true,
        });

        let fullText = "";
        for await (const chunk of reply) {
            const content = chunk.choices[0]?.delta?.content || "";
            fullText += content;
            onUpdate(content);
        }

        return fullText;
    }
}
