import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import AssistantPanel from './AssistantPanel';
import {
  chittiWelcomeGreetings,
  sectionWelcomePrompts,
  sectionSuggestions,
  companionResponses,
} from './assistantData';
import { sendChittiMessage } from '../../services/apiClient';

const DISMISS_STORAGE_KEY = 'nexforever_chitti_bubble_dismissed';
const CHAT_STORAGE_KEY = 'nexforever_chitti_history';

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
  const [suggestions, setSuggestions] = useState(sectionSuggestions.home);
  const [modeInfo, setModeInfo] = useState({ aiConfigured: false, label: 'Studio Companion (Offline Safe)' });
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(CHAT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    const greeting = chittiWelcomeGreetings[Math.floor(Math.random() * chittiWelcomeGreetings.length)];
    return [
      {
        id: 'chitti-welcome-init',
        sender: 'bot',
        text: greeting,
        action: { label: 'Explore Services', target: '#services' },
      },
    ];
  });

  // Persist conversation across the active browser session
  useEffect(() => {
    try {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore storage errors
    }
  }, [messages]);

  const typingTimerRef = useRef(null);
  const followerRef = useRef(null);
  const botRef = useRef(null);

  // Track active section via IntersectionObserver for contextual CHITTI prompts
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

  // Update contextual companion suggestions as visitor explores different sections
  useEffect(() => {
    if (sectionSuggestions[activeSection]) {
      setSuggestions(sectionSuggestions[activeSection]);
    }
  }, [activeSection]);

  // Bounded spring-like mouse follow & gaze tracking via requestAnimationFrame
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(hover: none)').matches;
    if (reducedMotion || coarsePointer) return;

    const target = { x: 0, y: 0, lookX: 0, lookY: 0 };
    const current = { x: 0, y: 0, lookX: 0, lookY: 0 };
    const velocity = { x: 0, y: 0 };
    let rafId = null;

    const handlePointerMove = (e) => {
      if (!botRef.current) return;
      const rect = botRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const normX = Math.max(-1, Math.min(1, (e.clientX - cx) / 420));
      const normY = Math.max(-1, Math.min(1, (e.clientY - cy) / 420));

      // Subtle bounded chase (±14px X, ±10px Y) + eye/visor gaze
      target.x = normX * 14;
      target.y = normY * 10;
      target.lookX = normX * 3.4;
      target.lookY = normY * 2.4;
    };

    const handlePointerLeave = () => {
      target.x = 0;
      target.y = 0;
      target.lookX = 0;
      target.lookY = 0;
    };

    const tick = () => {
      // Soft damped spring physics
      const stiffness = 0.09;
      const damping = 0.78;

      velocity.x = (velocity.x + (target.x - current.x) * stiffness) * damping;
      velocity.y = (velocity.y + (target.y - current.y) * stiffness) * damping;

      current.x += velocity.x;
      current.y += velocity.y;
      current.lookX += (target.lookX - current.lookX) * 0.14;
      current.lookY += (target.lookY - current.lookY) * 0.14;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;
      }
      if (botRef.current) {
        botRef.current.style.setProperty('--look-x', `${current.lookX.toFixed(2)}px`);
        botRef.current.style.setProperty('--look-y', `${current.lookY.toFixed(2)}px`);
      }

      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave, { passive: true });
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
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

  const dispatchChittiQuery = async ({ userText, questionId = null, fallbackItem = null }) => {
    if (isTyping) return;

    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, sender: 'user', text: userText },
    ]);

    setIsTyping(true);
    const localFallback = (questionId && companionResponses[questionId]) || fallbackItem;

    try {
      const response = await sendChittiMessage({
        message: userText,
        questionId,
        activeSection,
      });

      if (response && typeof response.aiConfigured === 'boolean') {
        setModeInfo({
          aiConfigured: response.aiConfigured,
          label: response.providerName || 'Studio Companion (Offline Safe)',
        });
      }
      if (Array.isArray(response?.suggestions) && response.suggestions.length > 0) {
        setSuggestions(response.suggestions);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `chitti-${Date.now() + 1}`,
          sender: 'bot',
          text: response?.reply || localFallback?.reply || localFallback?.answer || "I'm right here with you! Let's explore how NexForever can help build your idea.",
          action: response?.action || localFallback?.action || null,
        },
      ]);
    } catch {
      const offlineText =
        localFallback?.reply ||
        localFallback?.answer ||
        "I'm right here with you! You can explore our Services, Our Work gallery, or reach our team directly using the Project Inquiry Wizard.";
      setMessages((prev) => [
        ...prev,
        {
          id: `chitti-${Date.now() + 1}`,
          sender: 'bot',
          text: offlineText,
          action: localFallback?.action || { label: 'Open Inquiry Wizard', target: '#contact' },
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectSuggestion = (item) => {
    dispatchChittiQuery({
      userText: item.question,
      questionId: item.id,
      fallbackItem: item,
    });
  };

  const handleSendMessage = (text) => {
    dispatchChittiQuery({
      userText: text,
      questionId: null,
      fallbackItem: null,
    });
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
    <div
      className="robot-assistant-root"
      data-chitti-name="CHITTI"
      aria-live="polite"
    >
      <AssistantPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        isTyping={isTyping}
        onSelectSuggestion={handleSelectSuggestion}
        onSendMessage={handleSendMessage}
        onNavigate={handleNavigate}
        suggestions={suggestions}
        modeInfo={modeInfo}
      />

      {/* Contextual Welcome Speech Bubble */}
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
            aria-label="Dismiss CHITTI prompt"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Futuristic Pearl-White & Metallic Silver 3D-Styled CHITTI */}
      <button
        ref={botRef}
        type="button"
        className={`robot-trigger ${isOpen ? 'robot-trigger--active' : ''}`}
        onClick={handleTogglePanel}
        aria-label={isOpen ? 'Close CHITTI Studio Assistant' : 'Open CHITTI Studio Assistant'}
        aria-expanded={isOpen}
      >
        <div ref={followerRef} className="robot-chitti-follower">
          <span className="robot-trigger__aura" aria-hidden="true" />
          <svg
            className="robot-svg"
            viewBox="0 0 88 88"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="chittiPearlShell" x1="16" y1="10" x2="72" y2="76" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#E6ECF5" />
                <stop offset="78%" stopColor="#B8C3D4" />
                <stop offset="100%" stopColor="#7C889B" />
              </linearGradient>
              <linearGradient id="chittiChromeBand" x1="18" y1="54" x2="70" y2="76" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F5F8FC" />
                <stop offset="50%" stopColor="#9DA8BA" />
                <stop offset="100%" stopColor="#5D6778" />
              </linearGradient>
              <linearGradient id="chittiVisorGlass" x1="22" y1="26" x2="66" y2="54" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#161C27" />
                <stop offset="65%" stopColor="#080B10" />
                <stop offset="100%" stopColor="#040507" />
              </linearGradient>
              <radialGradient id="chittiMintGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#69E5C1" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#69E5C1" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ambient Floor Reflection */}
            <ellipse cx="44" cy="79" rx="19" ry="4" fill="url(#chittiMintGlow)" />

            {/* Dual Antenna Fin + Glowing Mint Beacon */}
            <rect x="42.4" y="8" width="3.2" height="10" rx="1.6" fill="url(#chittiChromeBand)" />
            <circle cx="44" cy="7.5" r="3.8" fill="#69E5C1" className="robot-svg__beacon" />

            {/* Articulated Side Pods */}
            <rect x="10" y="33" width="7" height="18" rx="3.5" fill="url(#chittiChromeBand)" />
            <rect x="71" y="33" width="7" height="18" rx="3.5" fill="url(#chittiChromeBand)" />
            <circle cx="13.5" cy="42" r="1.6" fill="#69E5C1" />
            <circle cx="74.5" cy="42" r="1.6" fill="#69E5C1" />

            {/* Pearl-Chrome Curved Head */}
            <rect
              x="16"
              y="17"
              width="56"
              height="44"
              rx="22"
              fill="url(#chittiPearlShell)"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="0.8"
            />

            {/* Compact Rounded Shoulder/Torso with Mint Chest Core */}
            <path
              d="M27 62.5C27 59.8 29.5 58 33 58H55C58.5 58 61 59.8 61 62.5V67C61 71.5 53.5 74.5 44 74.5C34.5 74.5 27 71.5 27 67V62.5Z"
              fill="url(#chittiPearlShell)"
            />
            <circle cx="44" cy="67.5" r="2.6" fill="#69E5C1" opacity="0.9" />

            {/* Studio Specular Rim on Helmet */}
            <path
              d="M26 23.5C31 19.8 37.5 19 44 19C50.5 19 57 19.8 62 23.5"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Deep Obsidian Visor */}
            <rect
              x="22"
              y="26"
              width="44"
              height="28"
              rx="13"
              fill="url(#chittiVisorGlass)"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1"
            />

            {/* Visor Glint Streak */}
            <path
              d="M27 31C30 28.5 34.5 28 38 28.5"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.4"
              strokeLinecap="round"
            />

            {/* Cursor-Tracking Mint-Green Glowing Eyes & Smile */}
            <g className="robot-svg__face">
              <rect x="30.5" y="34.5" width="7" height="9" rx="3.5" fill="#69E5C1" className="robot-svg__eye robot-svg__eye--animated" />
              <rect x="50.5" y="34.5" width="7" height="9" rx="3.5" fill="#69E5C1" className="robot-svg__eye robot-svg__eye--animated" />
              <circle cx="32.5" cy="36.8" r="1.1" fill="#FFFFFF" opacity="0.85" />
              <circle cx="52.5" cy="36.8" r="1.1" fill="#FFFFFF" opacity="0.85" />
              <path
                d="M39.5 47.2C41.5 49.2 46.5 49.2 48.5 47.2"
                stroke="#69E5C1"
                strokeWidth="1.9"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>
      </button>
    </div>
  );
}
