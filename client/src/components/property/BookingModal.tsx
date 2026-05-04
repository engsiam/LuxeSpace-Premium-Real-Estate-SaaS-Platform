'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';
import { Property } from '@/types';

import { Calendar, CreditCard, Sparkles, ShieldCheck, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function generateDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);
  return days;
}

interface BookingModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ property, isOpen, onClose }: BookingModalProps) {
  const [loading, setLoading] = useState(false);
  const [visitDate, setVisitDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const days = generateDays(year, month);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0,
    }).format(price).replace('BDT', '৳');
  };

  const handleDateSelect = (day: number | null) => {
    if (!day) return;
    const selected = new Date(year, month, day);
    setVisitDate(selected.toISOString().slice(0, 16));
    setShowCalendar(false);
  };

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
        <div className="bg-primary/10 p-6 text-center border-b border-border/50">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/20">
            <Sparkles className="text-secondary-foreground" size={28} />
          </div>
          <DialogTitle className="text-xl font-black text-foreground">Reserve Your <span className="text-primary italic">Dream Home</span></DialogTitle>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="flex justify-between items-center bg-background/50 p-5 rounded-2xl border border-border">
            <div>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Property Price</p>
              <h3 className="font-black text-foreground line-clamp-1 text-sm">{property.title}</h3>
            </div>
            <div className="text-right">
              <p className="text-xl font-black text-primary">
                {formatPrice(property.price)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Calendar size={14} className="text-primary" />
              Select Visit Date & Time
            </div>
            
            <div className="border border-border rounded-xl p-3">
              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex h-10 w-full items-center justify-between px-3 rounded-lg bg-muted/30 text-sm text-foreground hover:bg-muted/50"
              >
                <span>{visitDate ? new Date(visitDate).toLocaleDateString() : 'Select a date'}</span>
                <Calendar size={16} className="text-primary" />
              </button>

              {showCalendar && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <button type="button" onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-1.5 hover:bg-muted rounded-lg">
                      <ChevronLeft size={16} className="text-muted-foreground" />
                    </button>
                    <span className="font-bold text-sm text-foreground">{MONTHS[month]} {year}</span>
                    <button type="button" onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-1.5 hover:bg-muted rounded-lg">
                      <ChevronRight size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    {DAYS.map(d => (
                      <span key={d} className="text-[9px] text-muted-foreground font-bold">{d}</span>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {days.map((day, i) => (
                      <button
                        key={i}
                        type="button"
                        disabled={!day || (year === today.getFullYear() && month === today.getMonth() && day < today.getDate())}
                        onClick={() => handleDateSelect(day)}
                        className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                          !day ? 'invisible' : 
                          (year === today.getFullYear() && month === today.getMonth() && day < today.getDate()) ? 'text-muted-foreground/30 cursor-not-allowed' :
                          'hover:bg-primary hover:text-secondary-foreground text-foreground'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button 
            onClick={handleBooking} 
            disabled={loading} 
            className="w-full h-12 bg-primary text-secondary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse text-sm">Processing...</span>
            ) : (
              <>
                <CreditCard size={18} />
                <span>Proceed to Payment</span>
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider bg-muted/30 py-2 rounded-lg">
            <ShieldCheck size={12} className="text-primary" />
            Secure Checkout via bKash
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}