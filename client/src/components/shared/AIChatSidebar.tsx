'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Loader2, Copy, ThumbsUp, ThumbsDown, ArrowRight, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/useChatStore';
import Image from 'next/image';
import Link from 'next/link';

interface PropertyCard {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string | null;
}

const parseProperties = (content: string): { text: string; properties: PropertyCard[]; exploreLink: string | null } => {
  // Support both [PROPERTY] and [PROP] tags
  const propertyRegex = /\[PROP\]\s*(\{[^}]+\})\s*\[\/PROP\]/g;
  const properties: PropertyCard[] = [];
  let match;
  
  while ((match = propertyRegex.exec(content)) !== null) {
    try {
      const prop = JSON.parse(match[1]);
      properties.push(prop);
    } catch (e) {
      // Invalid JSON, skip
    }
  }
  
  // Check for explore link
  const linkMatch = content.match(/\[LINK\](.*?)\[\/LINK\]/);
  const exploreLink = linkMatch ? linkMatch[1] : null;
  
  const text = content
    .replace(/\[PROP\]\s*\{[^}]+\}\s*\[\/PROP\]/g, '')
    .replace(/\[PROPERTY\]\s*\{[^}]+\}\s*\[\/PROPERTY\]/g, '')
    .replace(/\[LINK\].*?\[\/LINK\]/g, '')
    .trim();
  
  return { text, properties, exploreLink };
};

const formatContent = (content: string) => {
  const { text, properties, exploreLink } = parseProperties(content);
  
  return (
    <div>
      {text.split('\n').map((line, i) => (
        line.trim() && (
          <p
            key={i}
            className="mb-1.5 last:mb-0 text-[13px] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/http:\/\/localhost:3000/g, '') }}
          />
        )
      ))}
      
      {properties.length > 0 && (
        <div className="mt-3 space-y-2">
          {properties.map((prop, i) => (
            <Link
              key={prop.id || i}
              href={`/properties/${prop.id}`}
              target="_blank"
              className="block group"
            >
              <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5 border border-white/10 hover:border-primary/50 transition-all">
                {prop.image ? (
                  <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 relative">
                    <Image 
                      src={prop.image} 
                      alt={prop.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{prop.title}</p>
                  <p className="text-primary text-xs font-bold">{prop.price}</p>
                  <p className="text-white/50 text-xs truncate">{prop.location}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
          
          {exploreLink ? (
            <Link 
              href={exploreLink}
              target="_blank"
              className="flex items-center justify-center gap-2 mt-3 py-2 px-4 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/30 transition-colors"
            >
              View More Properties <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link 
              href="/explore" 
              target="_blank"
              className="flex items-center justify-center gap-2 mt-3 py-2 px-4 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium hover:bg-primary/30 transition-colors"
            >
              View More Properties <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

const initialOptions = [
  { label: 'Find luxury apartments', emoji: '🏢' },
  { label: 'Pricing and payment questions', emoji: '💰' },
  { label: 'Explore penthouses', emoji: '🏙️' },
  { label: 'Schedule a property tour', emoji: '📅' },
  { label: 'Contact an agent', emoji: '👤' },
];

const quickActions = [
  { label: 'How to book?', emoji: '📖' },
  { label: 'Pricing info', emoji: '💵' },
  { label: 'Browse spaces', emoji: '🏠' },
  { label: 'Elite Rewards', emoji: '⭐' },
  { label: 'Contact', emoji: '📞' },
  { label: 'Latest properties', emoji: '🆕' },
  { label: 'Investment', emoji: '📈' },
  { label: 'Agent support', emoji: '🤝' },
];

export default function AIChatSidebar() {
  const { isOpen, messages, isLoading, closeChat, sendMessage, inputValue, setInputValue } = useChatStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 350);
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); useChatStore.getState().toggleChat(); }
      if (e.key === 'Escape' && isOpen) closeChat();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, closeChat]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = () => {
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  // Dark mode detection — runs on client after hydration
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const sidebarBg = isDark ? '#0F172A' : '#ffffff';
  const chatAreaBg = isDark ? '#111827' : '#F5F7FB';
  const cardBg = isDark ? '#1E293B' : '#ffffff';
  const cardBorder = isDark ? '#ffffff15' : '#e5e7eb';
  const textPrimary = isDark ? '#e2e8f0' : '#374151';
  const textMuted = isDark ? '#6b7280' : '#9ca3af';
  const inputBg = isDark ? '#1E293B' : '#f9fafb';
  const chipBg = isDark ? '#1E293B' : '#eff6ff';
  const chipText = isDark ? '#93c5fd' : '#2563eb';
  const chipBorder = isDark ? '#ffffff10' : '#dbeafe';
  const bottomBg = isDark ? '#0F172A' : '#ffffff';
  const bottomBorder = isDark ? '#ffffff10' : '#e5e7eb';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="ai-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeChat}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 9998 }}
          />

          {/* Sidebar Panel */}
          <motion.div
            key="ai-sidebar"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '380px',
              maxWidth: '100vw',
              display: 'flex',
              flexDirection: 'column',
              background: sidebarBg,
              boxShadow: '-8px 0 40px rgba(0,0,0,0.3)',
              zIndex: 9999,
              minHeight: 0,
            }}
          >
            {/* Header */}
            <div style={{ background: '#3D3B9E', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <Sparkles style={{ color: 'white', width: 20, height: 20 }} />
                </div>
                <div>
                  <h3 style={{ color: 'white', fontWeight: 700, fontSize: 15, lineHeight: 1, marginBottom: 3 }}>Assistant</h3>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>LuxeSpace Support</p>
                </div>
              </div>
              <button
                onClick={closeChat}
                style={{ width: 36, height: 36, borderRadius: 10, background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12, background: chatAreaBg }}
            >
              {/* Empty state */}
              {messages.length <= 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16, borderTopLeftRadius: 4, padding: 16, color: textPrimary, fontSize: 13, lineHeight: 1.6 }}>
                    I'd be happy to help! Here are some things I can assist with:
                  </div>
                  {initialOptions.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(opt.label)}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px', background: cardBg, border: `1px solid ${cardBorder}`,
                        borderRadius: 12, cursor: 'pointer', textAlign: 'left', fontSize: 13, color: textPrimary,
                        transition: 'border-color 0.15s, background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3D3B9E'; e.currentTarget.style.background = isDark ? '#1e3a5f' : '#eff6ff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = cardBorder; e.currentTarget.style.background = cardBg; }}
                    >
                      <span style={{ fontSize: 18 }}>{opt.emoji}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                  <p style={{ textAlign: 'center', color: textMuted, fontSize: 11, fontStyle: 'italic', padding: '8px 0' }}>
                    Could you tell me more about what you're looking for?
                  </p>
                </div>
              )}

              {/* Messages */}
              {messages.map((msg) => (
                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '82%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{
                      padding: '12px 16px', borderRadius: 16, fontSize: 13, lineHeight: 1.6,
                      ...(msg.role === 'assistant'
                        ? { background: cardBg, border: `1px solid ${cardBorder}`, color: textPrimary, borderTopLeftRadius: 4 }
                        : { background: '#3D3B9E', color: 'white', borderTopRightRadius: 4 }
                      ),
                    }}>
                      {formatContent(msg.content)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 4px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                      <span style={{ fontSize: 10, color: textMuted }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.role === 'assistant' && (
                        <div style={{ display: 'flex', gap: 6, color: textMuted }}>
                          <Copy size={11} style={{ cursor: 'pointer' }} />
                          <ThumbsUp size={11} style={{ cursor: 'pointer' }} />
                          <ThumbsDown size={11} style={{ cursor: 'pointer' }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading */}
              {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: 16, borderTopLeftRadius: 4, padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[0, 150, 300].map((d) => (
                        <div key={d} className="animate-bounce" style={{ width: 8, height: 8, background: 'rgba(61,59,158,0.4)', borderRadius: '50%', animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom */}
            <div style={{ padding: 16, background: bottomBg, borderTop: `1px solid ${bottomBorder}`, flexShrink: 0 }}>
              {/* Quick chips - horizontal scroll with visible scrollbar */}
              <div 
                style={{ 
                  display: 'flex', 
                  gap: 8, 
                  overflowX: 'auto', 
                  paddingBottom: 10, 
                  marginBottom: 10,
                  scrollbarWidth: 'auto',
                }} 
                className="scrollbar-draggable"
              >
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => sendMessage(action.label)}
                    style={{
                      whiteSpace: 'nowrap', padding: '8px 14px', background: '#3D3B9E', color: 'white',
                      fontSize: 12, fontWeight: 600, borderRadius: 20, border: 'none',
                      cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#2D2B8E'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#3D3B9E'; }}
                  >
                    <span>{action.emoji}</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>

              {/* Input row */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Ask anything about LuxeSpace..."
                  style={{
                    flex: 1, minHeight: 46, maxHeight: 120, padding: '12px 16px',
                    background: inputBg, border: '2px solid rgba(61,59,158,0.2)',
                    borderRadius: 12, fontSize: 13, color: textPrimary, resize: 'none',
                    outline: 'none', transition: 'border-color 0.15s', height: 'auto',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#3D3B9E')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(61,59,158,0.2)')}
                  onInput={(e) => {
                    const t = e.target as HTMLTextAreaElement;
                    t.style.height = 'auto';
                    t.style.height = `${t.scrollHeight}px`;
                  }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !inputValue.trim()}
                  style={{
                    width: 44, height: 44, background: '#3D3B9E', color: 'white', borderRadius: 12,
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, opacity: (isLoading || !inputValue.trim()) ? 0.4 : 1,
                    transition: 'background 0.15s, opacity 0.15s',
                  }}
                  onMouseEnter={(e) => { if (!isLoading && inputValue.trim()) e.currentTarget.style.background = '#2D2B8E'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#3D3B9E'; }}
                >
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>

              <p style={{ marginTop: 8, fontSize: 10, textAlign: 'center', color: textMuted }}>
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
