'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, LLMEngine, LLMMode, SYSTEM_PROMPTS } from '../lib/llm/types';
import { GeminiEngine } from '../lib/llm/gemini-engine';
import { WebLLMEngine } from '../lib/llm/web-llm-engine';
import { InitProgressReport } from "@mlc-ai/web-llm";

export function useChatManager() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [mode, setMode] = useState<LLMMode>('gloves_on');
    const [engine, setEngine] = useState<LLMEngine | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [progress, setProgress] = useState(0);

    // Load messages from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('nebula_messages');
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to load memory:", e);
            }
        }
    }, []);

    // Persist messages to localStorage
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('nebula_messages', JSON.stringify(messages));
        }
    }, [messages]);

    useEffect(() => {
        const initEngine = async () => {
            const webLLM = new WebLLMEngine((report: InitProgressReport) => {
                const match = report.text.match(/(\d+)%/);
                if (match) setProgress(parseInt(match[1]));
            });

            if (await webLLM.isAvailable()) {
                setEngine(webLLM);
            } else {
                const gemini = new GeminiEngine(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
                setEngine(gemini);
            }
        };
        initEngine();
    }, []);

    const sendMessage = useCallback(async (text: string) => {
        if (!engine || !text.trim()) return;

        const newUserMessage: ChatMessage = { role: 'user', content: text };
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setIsTyping(true);

        const systemPrompt: ChatMessage = { role: 'system', content: SYSTEM_PROMPTS[mode] };
        const messagesWithSystem = [systemPrompt, ...updatedMessages];

        let assistantContent = "";
        setMessages(prev => [...prev, { role: 'assistant', content: "" }]);

        try {
            await engine.generateResponse(messagesWithSystem, (chunk: string) => {
                assistantContent += chunk;
                setMessages(prev => {
                    const last = prev[prev.length - 1];
                    if (last && last.role === 'assistant') {
                        return [...prev.slice(0, -1), { ...last, content: assistantContent }];
                    }
                    return prev;
                });
            });
        } catch (error) {
            console.error("Inference error:", error);
        } finally {
            setIsTyping(false);
        }
    }, [engine, messages, mode]);

    return { messages, sendMessage, isTyping, mode, setMode, engine, progress, setMessages };
}
