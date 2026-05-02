'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';

export default function SidebarAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Welcome to LuxeSpace. I am your elite property concierge. How can I assist you with your search for excellence today?' }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    
    const userMessage = { role: 'user' as const, content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');
    setLoading(true);

    try {
      const response = await axiosInstance.post('/ai/chat', { prompt });
      const aiMessage = {
        role: 'ai' as const,
        content: response.data.data.response,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai', content: "I apologize, but I'm having trouble connecting to our systems. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Premium Floating Button */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="fixed bottom-8 right-8 z-[60]"
      >
        <Button
          className="rounded-3xl w-16 h-16 p-0 bg-primary text-secondary shadow-[0_20px_40px_-10px_rgba(212,175,55,0.4)] hover:bg-white hover:text-secondary transition-all duration-500 group"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-7 w-7 group-hover:scale-110 transition-transform" />
        </Button>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-28 right-8 w-[400px] max-w-[calc(100vw-4rem)] z-[60]"
          >
            <Card className="border border-primary/20 bg-background/95 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden">
              <CardHeader className="bg-primary p-6 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary shadow-lg">
                    <Bot size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-secondary text-lg font-black leading-none mb-1">LuxeAI Concierge</CardTitle>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
                      <span className="text-secondary/70 text-xs font-black uppercase tracking-widest">Active Excellence</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full hover:bg-secondary/10 text-secondary"
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              
              <CardContent className="p-0 flex flex-col h-[500px]">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border ${
                          msg.role === 'user' 
                            ? 'bg-primary/10 border-primary/20 text-primary' 
                            : 'bg-secondary border-white/5 text-primary'
                        }`}>
                          {msg.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
                        </div>
                        <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                          msg.role === 'user'
                            ? 'bg-primary text-secondary rounded-tr-none'
                            : 'bg-secondary/50 text-foreground border border-border rounded-tl-none'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="flex gap-3 items-center">
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary border border-white/5 animate-pulse">
                          <Bot size={14} />
                        </div>
                        <div className="flex gap-1">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                
                <div className="p-6 border-t border-border bg-secondary/30">
                  <div className="flex gap-3 bg-background p-2 rounded-2xl border border-border focus-within:border-primary/50 transition-all shadow-inner">
                    <Input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ask about Gulshan villas..."
                      className="border-none bg-transparent focus-visible:ring-0 text-sm font-medium placeholder:text-muted-foreground/50 h-10"
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <Button 
                      onClick={handleSend} 
                      disabled={loading || !prompt.trim()}
                      className="rounded-xl w-10 h-10 p-0 bg-primary text-secondary hover:bg-white transition-all shadow-lg"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
