'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/axiosInstance';
import { Contact } from '@/types';
import { toast } from 'sonner';
import { MessageSquare, Mail } from 'lucide-react';

export default function AdminMessages() {
  const [messages, setMessages] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get('/contact');
        setMessages(response.data.data || []);
        setError(null);
      } catch (error) {
        setError('Failed to fetch messages');
        toast.error('Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await axiosInstance.patch(`/contact/${id}/read`);
      setMessages(messages.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
      toast.success('Message marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  if (error) {
    return (
      <div className="p-10">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-12 bg-background min-h-screen">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-0.5 bg-primary rounded-full" />
          <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Communication</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Contact <span className="text-primary italic">Messages</span></h1>
      </div>

      <div className="bg-card border border-border shadow-xl rounded-2xl overflow-hidden p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <MessageSquare size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Inbox</h2>
            <p className="text-sm text-muted-foreground">{messages.length} messages found</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-background animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="bg-background border border-border rounded-xl p-6 hover:border-primary]/30 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{message.subject}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      From: {message.name} ({message.email})
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={message.isRead ? 'secondary' : 'default'} className={message.isRead ? 'bg-border text-muted-foreground' : 'bg-primary text-secondary-foreground'}>
                      {message.isRead ? 'Read' : 'Unread'}
                    </Badge>
                    {!message.isRead && (
                      <Button size="sm" variant="outline" onClick={() => handleMarkRead(message.id)} className="border-primary]/20 text-primary hover:bg-primary hover:text-secondary-foreground">
                        Mark Read
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-muted-foreground">{message.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
