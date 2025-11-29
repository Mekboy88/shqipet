import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, AtSign, Zap, Link2 } from "lucide-react";

interface ChatTypingBarProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatTypingBar: React.FC<ChatTypingBarProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const lastTouchYRef = React.useRef<number | null>(null);

  const handleWheelCapture = (e: React.WheelEvent<HTMLTextAreaElement>) => {
    const el = textareaRef.current;
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    el.scrollTop += e.deltaY;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLTextAreaElement>) => {
    lastTouchYRef.current = e.touches[0].clientY;
  };

  const handleTouchMoveCapture = (e: React.TouchEvent<HTMLTextAreaElement>) => {
    const el = textareaRef.current;
    const lastY = lastTouchYRef.current;
    if (!el || lastY == null) return;
    const currentY = e.touches[0].clientY;
    const delta = lastY - currentY;
    e.preventDefault();
    e.stopPropagation();
    el.scrollTop += delta;
    lastTouchYRef.current = currentY;
  };

  const handleTouchEnd = () => { lastTouchYRef.current = null; };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <style>{`
        .smoke-wrap {
          position: relative;
          border-radius: 1.25rem;
          overflow: visible;
          z-index: 1;
        }

        /* Neon glow around border */
        .smoke-wrap::before {
          content: "";
          position: absolute;
          inset: -4px;
          border-radius: 1.25rem;
          background: rgba(239, 68, 68, 0.3);
          filter: url(#smoke-turbulence) blur(12px);
          animation: smoke-color-shift 12s ease-in-out infinite alternate; animation-fill-mode: both;
          pointer-events: none;
          z-index: -1;
        }

        @keyframes smoke-color-shift {
          0% {
            background-color: rgba(239, 68, 68, 0.35);
          }
          100% {
            background-color: rgba(31, 41, 55, 0.1);
          }
        }

        /* Base typing box with very thin neon border */
        .smoke-inner {
          position: relative;
          border-radius: 1.25rem;
          background: white;
          border: 0.5px solid rgba(255, 255, 255, 0.3);
          z-index: 2;
        }

        /* Hide native scrollbars (internal scroll only, no indicator) */
        .no-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE 10+ */
        }
        .no-scrollbar::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none; /* Safari and Chrome */
        }
        .scroll-isolated { overscroll-behavior: contain; touch-action: pan-y; }
        .scroll-lock { overscroll-behavior: none; }
        .scroll-capture { touch-action: none; }
      `}</style>
      {/* SVG filter for organic smoke turbulence */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="smoke-turbulence" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" seed="2">
            <animate attributeName="baseFrequency" values="0.02;0.04;0.02" dur="10s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="15">
            <animate attributeName="scale" values="10;20;10" dur="8s" repeatCount="indefinite" />
          </feDisplacementMap>
        </filter>
      </svg>

      <div className="smoke-wrap">
        <div className="smoke-inner px-4 py-3 space-y-2">
          {/* Textarea field */}
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask anything..."
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onWheelCapture={handleWheelCapture}
            onTouchStart={handleTouchStart}
            onTouchMoveCapture={handleTouchMoveCapture}
            onTouchEnd={handleTouchEnd}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            style={{
              lineHeight: "1.5rem",
              fontSize: "1rem",
              caretColor: "hsl(var(--destructive))",
              height: (isFocused || message.trim().length > 0) ? "60px" : "20px",
            }}
            className={`w-full min-h-0 resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#888] text-[#111] px-0 py-0 leading-6 text-base no-scrollbar scroll-isolated scroll-lock scroll-capture ${isFocused || message.trim().length > 0 ? 'overflow-y-auto' : 'overflow-hidden'} transition-all duration-[3500ms] ease-in-out`}
          />

          {/* Icons row */}
          <div className="flex items-center justify-center gap-3 pt-1">
            {[AtSign, Zap, Link2, Mic].map((Icon, i) => (
              <Button
                key={i}
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:scale-110 transition-all ease-in-out duration-200"
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
            <Button
              type="submit"
              disabled={!message.trim() || disabled}
              size="sm"
              className="h-9 w-9 p-0 bg-transparent hover:bg-transparent disabled:opacity-50 hover:scale-110 transition-all ease-in-out duration-200"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(-45)matrix(-1, 0, 0, 1, 0, 0)" className="w-6 h-6">
                <path d="M21.2897 17.0198L19.5497 13.5398C19.0697 12.5698 19.0697 11.4398 19.5497 10.4698L21.2897 6.98983C22.7797 3.99983 19.5697 0.859829 16.6197 2.41983L15.0797 3.23983C14.8697 3.34983 14.6997 3.52983 14.5997 3.74983L8.89969 16.3898C8.66969 16.9098 8.87969 17.5198 9.37969 17.7798L16.6197 21.5898C19.5697 23.1498 22.7797 19.9998 21.2897 17.0198Z" fill={message.trim() ? "#ef4444" : "#292D32"} />
                <path opacity="0.4" d="M7.68953 15.6L11.4195 7.31996C11.8395 6.38996 10.8395 5.44996 9.93953 5.92996L4.16953 8.95996C1.71953 10.25 1.71953 13.75 4.16953 15.04L6.20953 16.11C6.75953 16.4 7.42953 16.17 7.68953 15.6Z" fill={message.trim() ? "#ef4444" : "#292D32"} />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ChatTypingBar;
