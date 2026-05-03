'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';
import { Property } from '@/types';

import { Calendar, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';

interface BookingModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ property, isOpen, onClose }: BookingModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [visitDate, setVisitDate] = useState('');

  const handleBooking = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/bookings/init', {
        propertyId: property.id,
        visitDate,
      });
      
      const { bkashURL } = response.data.data;
      if (bkashURL) {
        window.location.href = bkashURL;
      } else {
        toast.error('Payment gateway is currently unavailable');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initiate booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border rounded-3xl p-0 overflow-hidden">
        <div className="bg-primary/10 p-8 text-center border-b border-border/50">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <Sparkles className="text-secondary-foreground" size={32} />
          </div>
          <DialogTitle className="text-2xl font-black text-foreground">Finalize Your <span className="text-primary italic">Reservation</span></DialogTitle>
          <p className="text-muted-foreground text-sm mt-2 font-medium">Initiate your journey towards elite living.</p>
        </div>
        
        <div className="p-8 space-y-8">
          <style jsx>{`
            .custom-date-input::-webkit-calendar-picker-indicator {
              filter: invert(0.8);
              cursor: pointer;
              position: absolute;
              right: 15px;
              width: 20px;
              height: 20px;
            }
          `}</style>
          <div className="flex justify-between items-center bg-background/50 p-6 rounded-2xl border border-border">
            <div>
              <p className="text-xs text-muted-foreground font-black uppercase tracking-widest mb-1">Total Premium</p>
              <h3 className="font-black text-foreground line-clamp-1">{property.title}</h3>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-primary">
                ৳{property.price.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="visitDate" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
              <Calendar size={14} className="text-primary" />
              Preferred Visit Date
            </Label>
            <Input
              id="visitDate"
              type="datetime-local"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="h-14 bg-background border-border rounded-xl focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary text-white custom-date-input relative"
            />
            <p className="text-[10px] text-muted-foreground italic ml-1">* Date selection is optional for initial booking.</p>
          </div>

          <Button 
            onClick={handleBooking} 
            disabled={loading} 
            className="w-full h-16 bg-primary text-secondary-foreground font-black text-lg rounded-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
          >
            {loading ? (
              <span className="flex items-center gap-2 animate-pulse">Processing...</span>
            ) : (
              <>
                <CreditCard size={22} />
                <span>PROCEED TO PAYMENT</span>
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest bg-muted/30 py-3 rounded-lg">
            <ShieldCheck size={12} className="text-primary" />
            SECURE CHECKOUT VIA BKASH GATEWAY
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
