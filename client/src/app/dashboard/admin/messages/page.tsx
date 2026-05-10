'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/lib/axiosInstance';
import { Contact } from '@/types';
import { toast } from 'sonner';
import { MessageSquare, Mail, Send, Search, Trash2, Check, Calendar, Clock, CheckCircle, Reply, Inbox, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface ContactWithReply extends Contact {
  reply?: string;
  repliedAt?: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactWithReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactWithReply | null>(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'replied'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get('/contact');
      setMessages(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await axiosInstance.patch(`/contact/${id}/read`);
      setMessages(messages.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axiosInstance.delete(`/contact/${deleteId}`);
      setMessages(messages.filter((m) => m.id !== deleteId));
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
    } finally {
      setDeleteId(null);
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    setSendingReply(true);
    try {
      await axiosInstance.post(`/contact/${selectedMessage.id}/reply`, {
        reply: replyText,
      });
      setMessages(messages.map((m) => 
        m.id === selectedMessage.id 
          ? { ...m, reply: replyText, repliedAt: new Date().toISOString(), status: 'REPLIED' }
          : m
      ));
      setReplyOpen(false);
      setReplyText('');
      setSelectedMessage(null);
      toast.success('Reply sent successfully!');
    } catch (error) {
      toast.error('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    if (filter === 'unread' && msg.isRead) return false;
    if (filter === 'replied' && msg.status !== 'REPLIED') return false;
    if (searchTerm) {
      return (
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const repliedCount = messages.filter((m) => m.status === 'REPLIED').length;

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-4 md:space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-8 lg:w-12 h-0.5 lg:h-1 bg-primary rounded-full" />
          <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px] lg:text-xs">Communication</span>
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
          Contact <span className="text-primary italic">Messages</span>
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 lg:p-5 flex items-center gap-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
              <Inbox size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xl lg:text-2xl font-black text-foreground">{messages.length}</p>
              <p className="text-xs lg:text-sm text-muted-foreground truncate">Total Messages</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 lg:p-5 flex items-center gap-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-rose-500/10 rounded-xl flex items-center justify-center text-rose-500 shrink-0">
              <Mail size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xl lg:text-2xl font-black text-foreground">{unreadCount}</p>
              <p className="text-xs lg:text-sm text-muted-foreground truncate">Unread</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 lg:p-5 flex items-center gap-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 shrink-0">
              <CheckCircle size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xl lg:text-2xl font-black text-foreground">{repliedCount}</p>
              <p className="text-xs lg:text-sm text-muted-foreground truncate">Replied</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 lg:p-5 flex items-center gap-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
              <Clock size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-xl lg:text-2xl font-black text-foreground">{messages.length - repliedCount}</p>
              <p className="text-xs lg:text-sm text-muted-foreground truncate">Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Row */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
          {[
            { label: 'All', value: 'all', count: messages.length },
            { label: 'Unread', value: 'unread', count: unreadCount },
            { label: 'Replied', value: 'replied', count: repliedCount },
          ].map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.value as typeof filter)}
              className={`whitespace-nowrap ${filter === f.value ? 'bg-primary text-secondary-foreground' : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/50'}`}
            >
              {f.label} ({f.count})
            </Button>
          ))}
        </div>
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
      </div>

      {/* Messages List */}
      <Card className="bg-card border-border shadow-xl overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-background animate-pulse rounded-xl" />
              ))}
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-12 text-center">
              <Inbox className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">No messages found</h3>
              <p className="text-sm text-muted-foreground">No contact messages match your filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 lg:p-5 hover:bg-background/50 transition-colors ${!message.isRead ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Left - Message Info */}
                    <div 
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                          {message.name[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground truncate max-w-[200px] lg:max-w-none">{message.subject}</h3>
                            {!message.isRead && (
                              <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{message.name} • {message.email}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{message.message}</p>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(message.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {message.status === 'REPLIED' && (
                              <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px] px-2">
                                <CheckCircle className="w-3 h-3 mr-1" /> Replied
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right - Actions */}
                    <div className="flex items-center gap-2 lg:ml-4 shrink-0 lg:flex-shrink-0">
                      {!message.isRead && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkRead(message.id)}
                          className="border-primary/20 text-primary hover:bg-primary hover:text-secondary-foreground"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedMessage(message);
                          setReplyOpen(true);
                        }}
                        className="border-primary/20 text-primary hover:bg-primary hover:text-secondary-foreground"
                        title="Reply"
                      >
                        <Reply className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteId(message.id)}
                        className="border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Message Dialog */}
      <Dialog open={!!selectedMessage && !replyOpen} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader className="pb-4 border-b border-border">
            <DialogTitle className="text-xl lg:text-2xl font-black flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-primary" />
              Message Details
            </DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-5 pt-4">
              {/* Sender Info */}
              <div className="flex items-center gap-4 p-4 bg-background rounded-xl">
                <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                  {selectedMessage.name[0]?.toUpperCase() || '?'}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-foreground text-lg truncate">{selectedMessage.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 truncate">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span className="truncate">{selectedMessage.email}</span>
                  </p>
                </div>
                <Badge 
                  variant={selectedMessage.isRead ? 'secondary' : 'default'} 
                  className={`shrink-0 ${selectedMessage.isRead ? 'bg-border text-muted-foreground' : 'bg-primary text-secondary-foreground'}`}
                >
                  {selectedMessage.isRead ? 'Read' : 'Unread'}
                </Badge>
              </div>

              {/* Subject */}
              <div>
                <Label className="text-muted-foreground text-xs font-black uppercase tracking-wider">Subject</Label>
                <p className="font-semibold text-foreground mt-1 text-base">{selectedMessage.subject}</p>
              </div>

              {/* Message */}
              <div>
                <Label className="text-muted-foreground text-xs font-black uppercase tracking-wider">Message</Label>
                <div className="mt-2 p-4 bg-background rounded-xl text-foreground whitespace-pre-wrap text-sm leading-relaxed max-h-[200px] overflow-y-auto">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Reply */}
              {selectedMessage.reply && (
                <div>
                  <Label className="text-green-500 text-xs font-black uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Your Reply
                  </Label>
                  <div className="mt-2 p-4 bg-green-500/5 border border-green-500/20 rounded-xl text-foreground whitespace-pre-wrap text-sm leading-relaxed">
                    {selectedMessage.reply}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Replied on {selectedMessage.repliedAt ? new Date(selectedMessage.repliedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                {!selectedMessage.isRead && (
                  <Button 
                    onClick={() => handleMarkRead(selectedMessage.id)} 
                    variant="outline" 
                    className="border-primary/20 text-primary hover:bg-primary hover:text-secondary-foreground"
                  >
                    <Check className="w-4 h-4 mr-2" /> Mark as Read
                  </Button>
                )}
                <Button 
                  onClick={() => setReplyOpen(true)} 
                  className="bg-primary text-secondary-foreground"
                >
                  <Reply className="w-4 h-4 mr-2" /> Reply
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto bg-card border-border">
          <DialogHeader className="pb-4 border-b border-border">
            <DialogTitle className="text-xl lg:text-2xl font-black flex items-center gap-3">
              <Send className="w-6 h-6 text-primary" />
              Reply to {selectedMessage?.name || 'User'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {/* Original Message */}
            <div className="p-4 bg-background rounded-xl">
              <p className="text-xs text-muted-foreground font-black uppercase tracking-wider mb-2">Original Message:</p>
              <p className="text-sm text-foreground whitespace-pre-wrap line-clamp-4">{selectedMessage?.message}</p>
              {selectedMessage?.email && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {selectedMessage.email}
                </p>
              )}
            </div>

            {/* Reply Input */}
            <div>
              <Label htmlFor="reply" className="text-foreground font-black uppercase tracking-wider text-xs">Your Reply</Label>
              <Textarea
                id="reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your personalized reply..."
                className="mt-2 min-h-[150px] bg-background border-border text-sm"
              />
            </div>
          </div>
          <DialogFooter className="pt-4 border-t border-border mt-4">
            <Button variant="outline" onClick={() => { setReplyOpen(false); setReplyText(''); }} className="border-border">
              Cancel
            </Button>
            <Button 
              onClick={handleSendReply} 
              disabled={!replyText.trim() || sendingReply}
              className="bg-primary text-secondary-foreground"
            >
              {sendingReply ? (
                'Sending...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" /> Send Reply
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-md w-[95vw] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-rose-500" />
              Delete Message?
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            This action cannot be undone. This will permanently delete the message.
          </p>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)} className="border-border">
              Cancel
            </Button>
            <Button onClick={handleDelete} className="bg-rose-500 hover:bg-rose-600 text-white">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}