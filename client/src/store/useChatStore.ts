import { create } from 'zustand';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatState {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  inputValue: string;
  suggestions: string[];
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  setInputValue: (value: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  sendMessage: (content: string) => Promise<void>;
  clearHistory: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: "Welcome to LuxeSpace. I am your elite AI concierge. How can I assist you with your property search today?",
      timestamp: new Date(),
    }
  ],
  isLoading: false,
  inputValue: '',
  suggestions: [
    "Find luxury apartments",
    "Investment advice",
    "Pricing help",
    "Booking support",
    "Become an agent",
    "Explore penthouses"
  ],

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  setInputValue: (value) => set({ inputValue: value }),

  addMessage: (msg) => set((state) => ({
    messages: [...state.messages, { ...msg, id: Date.now().toString(), timestamp: new Date() }]
  })),

  sendMessage: async (content) => {
    if (!content.trim() || get().isLoading) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    set((state) => ({ 
      messages: [...state.messages, userMsg],
      isLoading: true,
      inputValue: '' // Clear input on send
    }));

    try {
      const response = await axiosInstance.post('/ai/chat', { prompt: content });
      
      // Backend wraps reply as: { success, message, data: { response: "..." } }
      const aiText: string =
        response.data?.data?.response ||
        response.data?.data ||
        response.data?.message ||
        'No response received.';

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiText,
        timestamp: new Date()
      };

      set((state) => ({ 
        messages: [...state.messages, assistantMsg],
        isLoading: false 
      }));
    } catch (error: any) {
      set({ isLoading: false });
      toast.error("Connection error. Please try again.");
      
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      };
      
      set((state) => ({ messages: [...state.messages, errorMsg] }));
    }
  },

  clearHistory: () => set({ 
    messages: [get().messages[0]] // Keep welcome message
  })
}));
