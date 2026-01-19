'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, LLMEngine, LLMMode, SYSTEM_PROMPTS } from '../lib/llm/types';
import { GeminiEngine } from '../lib/llm/gemini-engine';
import { WebLLMEngine } from '../lib/llm/web-llm-engine';
import { NebulaAdminEngine } from '../lib/llm/nebula-admin-engine';
import { InitProgressReport } from "@mlc-ai/web-llm";

export function useChatManager() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [mode, setMode] = useState<LLMMode>('gloves_on');
    const [engine, setEngine] = useState<LLMEngine | null>(null);
    const [engineType, setEngineType] = useState<'local' | 'cloud' | 'admin'>('local');
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
            if (engineType === 'admin') {
                setEngine(new NebulaAdminEngine());
                return;
            }

            if (engineType === 'local') {
                const webLLM = new WebLLMEngine((report: InitProgressReport) => {
                    const match = report.text.match(/(\d+)%/);
                    if (match) setProgress(parseInt(match[1]));
                });
                if (await webLLM.isAvailable()) {
                    setEngine(webLLM);
                } else {
                    setEngineType('cloud');
                }
            } else {
                const gemini = new GeminiEngine(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
                setEngine(gemini);
            }
        };
        initEngine();
    }, [engineType]);

    const sendMessage = useCallback(async (text: string) => {
        if (!engine || !text.trim()) return;

        const newUserMessage: ChatMessage = { role: 'user', content: text };
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setIsTyping(true);

        const systemPrompt: ChatMessage = { role: 'system', content: `${SYSTEM_PROMPTS[mode]} | Engine: ${engine.name}` };
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

            // CRITICAL FIX: Ensure bubble is NOT empty
            if (!assistantContent.trim()) {
                const fallbackText = "Nebula neural link active, but output was silent. Re-transmitting...";
                setMessages(prev => {
                    const last = prev[prev.length - 1];
                    if (last && last.role === 'assistant') {
                        return [...prev.slice(0, -1), { ...last, content: fallbackText }];
                    }
                    return prev;
                });
            }
        } catch (error) {
            console.error("Inference error:", error);
        } finally {
            setIsTyping(false);
        }
    }, [engine, messages, mode]);

    return { messages, sendMessage, isTyping, mode, setMode, engine, progress, setMessages, engineType, setEngineType };
}

