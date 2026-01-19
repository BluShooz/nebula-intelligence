'use client';

import { useState } from 'react';
import { useChatManager } from '@/hooks/use-chat-manager';
import { LLMMode } from '@/lib/llm/types';
import { Send, Cpu, Shield, Zap, Terminal, Trash2 } from 'lucide-react';
import ParticleBackground from '@/components/ParticleBackground';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const {
    messages, sendMessage, isTyping, mode, setMode, setMessages
  } = useChatManager();
  const [input, setInput] = useState('');

  const clearMemory = () => {
    if (confirm("Clear local memory?")) {
      setMessages([]);
      localStorage.removeItem('nebula_messages');
    }
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <main className="main-container" data-theme={mode}>
      <ParticleBackground />
      <img
        src="/nebula-face.jpg"
        id="nebula-bg-avatar"
        aria-hidden="true"
      />
      <aside className="sidebar glass">
        <div className="logo-container">
          <div id="avatar-stage">
            <img id="nebula-avatar" src="/nebula-face.jpg" alt="Nebula" />
          </div>
          <h1>NEBULA</h1>
        </div>

        <nav className="mode-selector">
          <button
            className={mode === 'gloves_off' ? 'active alert' : ''}
            onClick={() => setMode('gloves_off')}
          >
            <Terminal size={18} /> GLOVES OFF
          </button>
          <button
            className={mode === 'gloves_on' ? 'active' : ''}
            onClick={() => setMode('gloves_on')}
          >
            <Zap size={18} /> GLOVES ON
          </button>
          <button
            className={mode === 'stealth' ? 'active' : ''}
            onClick={() => setMode('stealth')}
          >
            <Shield size={18} /> STEALTH
          </button>

          <button className="clear-btn" onClick={clearMemory}>
            <Trash2 size={18} /> CLEAR MEMORY
          </button>
        </nav>

        <div className="engine-status">
          <div className="status-header">
            <Cpu size={14} /> <span>NEURAL CORE ACTIVE</span>
          </div>
          <div className="active-engine-name">
            NEBULA HYBRID v1.0
          </div>
        </div>
      </aside>

      <section className="chat-window">
        <header className="chat-header glass">
          <div className="header-info">
            <div className="status-dot online"></div>
            <span>Nebula Intelligence Systems</span>
          </div>
        </header>

        <div className="message-list">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                className="welcome-message"
              >
                <h2>Awaiting command...</h2>
                <p>State your objective. Nebula is ready to execute.</p>
              </motion.div>
            )}
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`message-bubble ${m.role} glass`}
              >
                <div className="message-content">{m.content}</div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="typing-indicator"
              >
                Connecting to neural link...
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="input-area glass">
          <input
            type="text"
            placeholder="Type your command..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isTyping}
          />
          <button onClick={handleSend} disabled={isTyping || !input.trim()}>
            <Send size={20} />
          </button>
        </footer>
      </section>

      <style jsx global>{`
        .main-container {
          display: flex;
          height: 100vh;
          width: 100vw;
          background: radial-gradient(circle at center, hsl(var(--bg-surface)), hsl(var(--bg-deep)));
        }

        .sidebar {
          width: 280px;
          display: flex;
          flex-direction: column;
          padding: 2rem 1.5rem;
          border-right: 1px solid hsla(var(--border-glass));
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 3rem;
        }

        .logo-container h1 {
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: 0.2rem;
          color: hsl(var(--accent-cyan));
          text-shadow: var(--glow-cyan);
        }

        /* === IMAGE PLACEMENT ONLY — NO OTHER UI CHANGES === */
        #avatar-stage {
          display: flex;
          justify-content: center; /* horizontal centering */
          align-items: center;     /* vertical centering */
          width: 48px;
          height: 48px;
          position: relative;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid hsl(var(--accent-cyan));
          box-shadow: var(--glow-cyan);
          animation: logo-pulse 4s infinite alternate;
        }

        #nebula-avatar {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(1.2) contrast(1.1);
        }

        @keyframes logo-pulse {
          from { transform: scale(1); box-shadow: var(--glow-cyan); }
          to { transform: scale(1.05); box-shadow: 0 0 30px hsla(180, 100%, 50%, 0.5); }
        }

        .mode-selector {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
        }

        .mode-selector button {
          background: transparent;
          border: 1px solid hsla(var(--text-muted) / 0.2);
          color: hsl(var(--text-secondary));
          padding: 0.75rem 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }

        .mode-selector button:hover {
          background: hsla(var(--text-muted) / 0.1);
          color: hsl(var(--text-primary));
        }

        .mode-selector button.active {
          background: hsla(var(--accent-cyan) / 0.1);
          border-color: hsl(var(--accent-cyan));
          color: hsl(var(--accent-cyan));
          box-shadow: var(--glow-cyan);
        }

        .mode-selector button.alert.active {
          background: hsla(0, 100%, 50%, 0.1);
          border-color: hsl(0, 100%, 50%);
          color: hsl(0, 100%, 50%);
          box-shadow: 0 0 15px hsla(0, 100%, 50%, 0.3);
        }

        .clear-btn {
          margin-top: 1rem;
          opacity: 0.5;
        }

        .clear-btn:hover {
          opacity: 1;
          color: #ef4444 !important;
          border-color: #ef4444 !important;
        }

        .engine-status {
          margin-top: auto;
          padding: 1rem;
          background: hsla(var(--bg-deep) / 0.5);
          border-radius: 12px;
          border: 1px solid hsla(var(--border-glass));
        }

        .active-engine-name {
          font-size: 0.7rem;
          color: hsl(var(--accent-cyan));
          margin-bottom: 0.5rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: hsl(var(--text-muted));
          margin-bottom: 0.5rem;
        }

        .chat-window {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .chat-header {
          height: 60px;
          display: flex;
          align-items: center;
          padding: 0 2rem;
          border-bottom: 1px solid hsla(var(--border-glass));
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px #4ade80;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 700;
          font-size: 0.9rem;
          letter-spacing: 0.05rem;
        }

        .message-list {
          flex: 1;
          overflow-y: auto;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .welcome-message {
          margin: auto;
          text-align: center;
          opacity: 0.5;
        }

        .welcome-message h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          letter-spacing: 0.2rem;
        }

        .message-bubble {
          max-width: 80%;
          padding: 1rem 1.5rem;
          border-radius: 18px;
          line-height: 1.6;
          font-size: 1rem;
        }

        .message-bubble.user {
          align-self: flex-end;
          background: hsla(var(--accent-purple) / 0.1);
          border-color: hsla(var(--accent-purple) / 0.3);
          border-bottom-right-radius: 4px;
        }

        .message-bubble.assistant {
          align-self: flex-start;
          background: hsla(var(--bg-glass));
          border-bottom-left-radius: 4px;
        }

        .input-area {
          margin: 2rem;
          padding: 0.5rem;
          border-radius: 50px;
          display: flex;
          gap: 0.5rem;
        }

        .input-area input {
          flex: 1;
          background: transparent;
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          outline: none;
        }

        .input-area button {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: hsl(var(--accent-cyan));
          border: none;
          color: black;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .input-area button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: var(--glow-cyan);
        }

        .input-area button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .typing-indicator {
          font-size: 0.8rem;
          color: hsl(var(--text-muted));
          font-style: italic;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* === BACKGROUND AVATAR — PLACEMENT ONLY === */
        #nebula-bg-avatar {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);

          opacity: 0.08;              /* light background presence */
          z-index: 0;                 /* stays behind chat */
          pointer-events: none;       /* NEVER blocks input */

          max-width: 420px;           /* safe visual size */
          width: 60vw;
          height: auto;
        }

        /* Ensure chat stays above avatar */
        .sidebar,
        .chat-window,
        .message-list,
        .input-area {
          position: relative;
          z-index: 1;
        }
      `}</style>
    </main>
  );
}
