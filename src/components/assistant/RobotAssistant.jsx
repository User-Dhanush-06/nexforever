import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import AssistantPanel from './AssistantPanel';
import { sectionWelcomePrompts } from './assistantData';

const DISMISS_STORAGE_KEY = 'nexforever_assistant_bubble_dismissed';

export default function RobotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [bubbleDismissed, setBubbleDismissed] = useState(() => {
    try {
      return sessionStorage.getItem(DISMISS_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-init',
      sender: 'bot',
      text: "Welcome to NexForever. I'm Nex, your studio guide — ask me about our services, process, work or how to start a project.",
      action: { label: 'Explore Services', target: '#services' },
    },
  ]);

  const typingTimerRef = useRef(null);
  const botRef = useRef(null);

  // Track currently visible section for contextual greeting prompt
  useEffect(() => {
    const sectionIds = ['home', 'about', 'services', 'portfolio', 'approach', 'contact'];
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: 0.01 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  // Subtle eye-tracking tilt toward cursor when pointer moves
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const handleMove = (e) => {
      if (!botRef.current) return;
      const rect = botRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / 360));
      const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / 360));
      botRef.current.style.setProperty('--look-x', `${(dx * 3).toFixed(2)}px`);
      botRef.current.style.setProperty('--look-y', `${(dy * 2.2).toFixed(2)}px`);
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, []);

  const handleDismissBubble = (e) => {
    e.stopPropagation();
    setBubbleDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_STORAGE_KEY, 'true');
    } catch {
      // Ignore storage restriction errors
    }
  };

  const handleTogglePanel = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next && !bubbleDismissed) {
        setBubbleDismissed(true);
        try {
          sessionStorage.setItem(DISMISS_STORAGE_KEY, 'true');
        } catch {
          // Ignore storage restriction errors
        }
      }
      return next;
    });
  };

  const handleSelectSuggestion = (item) => {
    if (isTyping) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: item.question,
    };
    setMessages((prev) => [...prev, userMsg]);

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now() + 1}`,
          sender: 'bot',
          text: item.answer,
          action: item.action,
        },
      ]);
      return;
    }

    setIsTyping(true);
    typingTimerRef.current = setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now() + 1}`,
          sender: 'bot',
          text: item.answer,
          action: item.action,
        },
      ]);
    }, 420);
  };

  const handleNavigate = (targetSelector) => {
    const targetEl = document.querySelector(targetSelector);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const contextualPrompt =
    sectionWelcomePrompts[activeSection] || sectionWelcomePrompts.home;

  return (
    <div className="robot-assistant-root" aria-live="polite">
      <AssistantPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        isTyping={isTyping}
        onSelectSuggestion={handleSelectSuggestion}
        onNavigate={handleNavigate}
      />

      {/* Contextual Floating Prompt Bubble (only shown once per session until dismissed/opened) */}
      {!isOpen && !bubbleDismissed && (
        <div className="robot-bubble" role="status">
          <button
            type="button"
            className="robot-bubble__text"
            onClick={handleTogglePanel}
          >
            {contextualPrompt}
          </button>
          <button
            type="button"
            className="robot-bubble__close"
            onClick={handleDismissBubble}
            aria-label="Dismiss assistant prompt"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Futuristic Pearl-Chrome SVG Robot Mascot Trigger */}
      <button
        ref={botRef}
        type="button"
        className={`robot-trigger ${isOpen ? 'robot-trigger--active' : ''}`}
        onClick={handleTogglePanel}
        aria-label={isOpen ? 'Close NexForever Assistant' : 'Open NexForever Studio Assistant'}
        aria-expanded={isOpen}
      >
        <span className="robot-trigger__aura" aria-hidden="true" />
        <svg
          className="robot-svg"
          viewBox="0 0 84 84"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="nexBotShell" x1="18" y1="12" x2="66" y2="72" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#DDE4EE" />
              <stop offset="100%" stopColor="#8E9AAE" />
            </linearGradient>
            <linearGradient id="nexBotVisor" x1="22" y1="28" x2="62" y2="54" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#141923" />
              <stop offset="100%" stopColor="#07090D" />
            </linearGradient>
            <radialGradient id="nexBotGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#69E5C1" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#69E5C1" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Soft Under-shadow */}
          <ellipse cx="42" cy="75" rx="18" ry="4" fill="url(#nexBotGlow)" />

          {/* Antenna Stem & Glowing Beacon */}
          <rect x="40.5" y="10" width="3" height="9" rx="1.5" fill="#AEB8C9" />
          <circle cx="42" cy="8.5" r="3.6" fill="#69E5C1" className="robot-svg__beacon" />

          {/* Side Ear Pods */}
          <rect x="11" y="33" width="6" height="16" rx="3" fill="#B6C0D0" />
          <rect x="67" y="33" width="6" height="16" rx="3" fill="#B6C0D0" />
          <circle cx="14" cy="41" r="1.4" fill="#69E5C1" />
          <circle cx="70" cy="41" r="1.4" fill="#69E5C1" />

          {/* Pearl-Chrome Head & Compact Torso */}
          <rect x="16" y="18" width="52" height="44" rx="20" fill="url(#nexBotShell)" />
          <path
            d="M27 63.5C27 61 29 59.5 32 59.5H52C55 59.5 57 61 57 63.5V66C57 69.5 51 72 42 72C33 72 27 69.5 27 66V63.5Z"
            fill="url(#nexBotShell)"
          />

          {/* Top Specular Highlight */}
          <path
            d="M26 24.5C30 21 36 20 42 20C48 20 54 21 58 24.5"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Obsidian Glass Visor */}
          <rect
            x="22"
            y="27"
            width="40"
            height="27"
            rx="12"
            fill="url(#nexBotVisor)"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
          />

          {/* Interactive Mint-Green Eyes & Friendly Smile */}
          <g className="robot-svg__face">
            <rect x="30" y="35.5" width="6" height="8" rx="3" fill="#69E5C1" className="robot-svg__eye" />
            <rect x="48" y="35.5" width="6" height="8" rx="3" fill="#69E5C1" className="robot-svg__eye" />
            <path
              d="M38.5 46.5C39.8 48.2 44.2 48.2 45.5 46.5"
              stroke="#69E5C1"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </button>
    </div>
  );
}

