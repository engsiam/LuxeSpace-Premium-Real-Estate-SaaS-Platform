'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import axiosInstance from '@/lib/axiosInstance';
import { Booking } from '@/types';
import { toast } from 'sonner';
import { Calendar, DollarSign } from 'lucide-react';

export default function UserBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get('/bookings');
        setBookings(response.data.data || []);
      } catch (error) {
        toast.error('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="p-10">
        <div className="h-8 w-64 bg-card animate-pulse rounded-xl mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-card animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-12 bg-background min-h-screen">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-0.5 bg-primary rounded-full" />
          <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Bookings</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">My <span className="text-primary italic">Bookings</span></h1>
      </div>

      <div className="bg-card border border-border shadow-xl rounded-[2.5rem] overflow-hidden p-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Calendar size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Booking History</h2>
            <p className="text-sm text-muted-foreground">{bookings.length} bookings found</p>
          </div>
        </div>

        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-background border border-border rounded-xl p-6 hover:border-primary/30 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-white text-lg">{booking.property?.title}</h3>
                  <p className="text-muted-foreground mt-1">{booking.property?.location}</p>
                </div>
                <Badge
                  className={
                    booking.status === 'PAID'
                      ? 'bg-emerald-500'
                      : booking.status === 'PENDING'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }
                >
                  {booking.status}
                </Badge>
              </div>
              <div className="flex gap-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <DollarSign size={14} className="text-primary" />
                  ৳{booking.amount.toLocaleString()}
                </span>
                <span>bKash: {booking.bKashTrxId || 'N/A'}</span>
                <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
