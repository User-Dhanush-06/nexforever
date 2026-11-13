import React, { useEffect, useRef, useState } from 'react';
import { X, ArrowRight, Sparkles, Send, Compass, Minus } from 'lucide-react';
import { sectionSuggestions } from './assistantData';

export default function AssistantPanel({
  isOpen,
  onClose,
  messages,
  isTyping,
  onSelectSuggestion,
  onSendMessage,
  onNavigate,
  suggestions = sectionSuggestions.home,
  modeInfo = { aiConfigured: false, label: 'Studio Companion (Offline-Safe)' },
}) {
  const scrollRef = useRef(null);
  const [inputText, setInputText] = useState('');

  // Smoothly scroll to bottom on new messages or typing state changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isTyping) return;
    setInputText('');
    if (onSendMessage) {
      onSendMessage(trimmed);
    }
  };

  return (
    <div
      className={`assistant-panel ${isOpen ? 'assistant-panel--open' : ''}`}
      role="dialog"
      aria-modal="false"
      aria-label="CHITTI Studio Companion"
      aria-hidden={!isOpen}
    >
      {/* Panel Header */}
      <div className="assistant-panel__header">
        <div className="assistant-panel__identity">
          <span className="assistant-panel__dot" aria-hidden="true" />
          <div>
            <div className="assistant-panel__title-row">
              <h3 className="assistant-panel__title">CHITTI</h3>
              <span className="assistant-panel__pill">Studio Companion</span>
            </div>
            <span className="assistant-panel__subtitle">
              <Sparkles size={11} aria-hidden="true" />{' '}
              {modeInfo.aiConfigured ? 'AI Companion' : 'Studio Knowledge (Offline Safe)'}
            </span>
          </div>
        </div>
        <div className="assistant-panel__actions-head">
          <button
            type="button"
            className="assistant-panel__ctrl-btn"
            onClick={onClose}
            aria-label="Minimize CHITTI Companion"
            title="Minimize"
          >
            <Minus size={15} />
          </button>
          <button
            type="button"
            className="assistant-panel__close"
            onClick={onClose}
            aria-label="Close CHITTI Companion"
            title="Close"
          >
            <X size={17} />
          </button>
        </div>
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

      {/* Compact Contextual Suggestion Pills */}
      <div className="assistant-panel__suggestions">
        <div className="assistant-panel__prompt-row">
          <span className="assistant-panel__prompt-label">
            <Compass size={11} aria-hidden="true" />
            <span>Quick Suggestions</span>
          </span>
        </div>
        <div className="assistant-panel__chips assistant-panel__chips--wrap">
          {(suggestions && suggestions.length > 0 ? suggestions : sectionSuggestions.home).map((item) => (
            <button
              key={item.id}
              type="button"
              className="assistant-chip assistant-chip--wrap"
              onClick={() => onSelectSuggestion(item)}
              disabled={isTyping}
            >
              {item.question}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Question Input */}
      <form className="assistant-panel__form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="assistant-panel__input"
          placeholder="Ask Chitti about services, packages, work..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          aria-label="Ask CHITTI a question"
          disabled={isTyping}
          maxLength={300}
        />
        <button
          type="submit"
          className="assistant-panel__send"
          disabled={isTyping || !inputText.trim()}
          aria-label="Send message to CHITTI"
        >
          <Send size={15} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
