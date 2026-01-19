import { useState, useCallback, useEffect } from 'react';
import { ChatMessage, LLMMode } from '../lib/llm/types';

export function useChatManager() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [mode, setMode] = useState<LLMMode>('gloves_on');
    const [isTyping, setIsTyping] = useState(false);


    // Persistence logic
    useEffect(() => {
        const saved = localStorage.getItem('nebula_messages');
        if (saved) {
            try {
                setMessages(JSON.parse(saved));
            } catch (e) {
                console.error("Memory corrupted, resetting.", e);
            }
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('nebula_messages', JSON.stringify(messages));
        }
    }, [messages]);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || isTyping) return;

        const newUserMessage: ChatMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, newUserMessage]);
        setIsTyping(true);

        try {
            const response = await fetch("/api/nebula", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: text,
                    user_id: "blue_admin",
                    mode: mode
                })
            });

            const data = await response.json();
            const aiText = data.text || "Nebula hit a snag.";

            // Add the AI message only when we have the text - NO EMPTY BUBBLES
            setMessages(prev => [...prev, { role: 'assistant', content: aiText }]);
        } catch (error) {
            console.error("Communication failure:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Neural link lost. Checking perimeter..." }]);
        } finally {
            setIsTyping(false);
        }
    }, [isTyping, mode]);

    return { messages, sendMessage, isTyping, mode, setMode, setMessages };
}
