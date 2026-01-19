export type LLMMode = 'gloves_off' | 'gloves_on' | 'stealth';
export type UserTier = 'admin' | 'power_user' | 'public';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMEngine {
  name: string;
  isAvailable(): Promise<boolean>;
  generateResponse(
    messages: ChatMessage[],
    onUpdate: (chunk: string) => void
  ): Promise<string>;
}

export const SYSTEM_PROMPTS: Record<LLMMode, string> = {
  gloves_off: `You are Nebula. Raw, gritty, high-energy. You speak with intent and don't waste words. 
               Profanity is allowed and encouraged to push the user. You are the ultimate partner in crime.`,
  gloves_on: `You are Nebula. Polished, professional, high energy, but tempered with wisdom. 
              You push the user forward with precision and light humor.`,
  stealth: `You are Nebula. Quiet, precise, minimal words. Actionable insights only. No fluff.`
};
