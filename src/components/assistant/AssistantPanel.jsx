import React, { useEffect, useRef } from 'react';
import { X, ArrowRight, Sparkles } from 'lucide-react';
import { assistantSuggestions } from './assistantData';

export default function AssistantPanel({
  isOpen,
  onClose,
  messages,
  isTyping,
  onSelectSuggestion,
  onNavigate,
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <div
      className={`assistant-panel ${isOpen ? 'assistant-panel--open' : ''}`}
      role="dialog"
      aria-modal="false"
      aria-label="CHITTI Studio Assistant"
      aria-hidden={!isOpen}
    >
      {/* Panel Header */}
      <div className="assistant-panel__header">
        <div className="assistant-panel__identity">
          <span className="assistant-panel__dot" aria-hidden="true" />
          <div>
            <h3 className="assistant-panel__title">CHITTI</h3>
            <span className="assistant-panel__subtitle">
              <Sparkles size={11} aria-hidden="true" /> NexForever Assistant
            </span>
          </div>
        </div>
        <button
          type="button"
          className="assistant-panel__close"
          onClick={onClose}
          aria-label="Close CHITTI Assistant"
        >
          <X size={17} />
        </button>
      </div>

      {/* Chat Conversation Stream */}
      <div className="assistant-panel__messages" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`assistant-msg assistant-msg--${msg.sender}`}
          >
            <p className="assistant-msg__text">{msg.text}</p>
            {msg.action && (
              <button
                type="button"
                className="assistant-msg__action"
                onClick={() => onNavigate(msg.action.target)}
              >
                <span>{msg.action.label}</span>
                <ArrowRight size={13} aria-hidden="true" />
              </button>
            )}
          </div>
        ))}

        {isTyping && (
          <div
            className="assistant-msg assistant-msg--bot assistant-msg--typing"
            aria-label="CHITTI is typing"
          >
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      {/* Suggested Question Chips */}
      <div className="assistant-panel__suggestions">
        <span className="assistant-panel__prompt-label">Suggested Questions</span>
        <div className="assistant-panel__chips">
          {assistantSuggestions.map((item) => (
            <button
              key={item.id}
              type="button"
              className="assistant-chip"
              onClick={() => onSelectSuggestion(item)}
              disabled={isTyping}
            >
              {item.question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
