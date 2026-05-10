'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import axiosInstance from '@/lib/axiosInstance';
import { Booking } from '@/types';
import { toast } from 'sonner';
import { Calendar, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

export default function UserBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(4);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/bookings', {
          params: { page, limit },
        });
        setBookings(response.data.data || []);
        setTotalPages(response.data.meta?.totalPages || 1);
        setTotal(response.data.meta?.total || 0);
      } catch (error) {
        toast.error('Failed to fetch bookings');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [page]);

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-4 md:space-y-6 lg:space-y-12 bg-background min-h-screen">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-0.5 bg-primary rounded-full" />
          <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Bookings</span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter text-white">My <span className="text-primary italic">Bookings</span></h1>
      </div>

      <div className="bg-card border border-border shadow-xl rounded-xl lg:rounded-[2.5rem] overflow-hidden p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="w-10 md:w-12 h-10 md:h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Calendar className="md:w-6" size={20} />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-white">Booking History</h2>
            <p className="text-sm text-muted-foreground">{total} bookings found</p>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 md:h-28 lg:h-32 bg-background border border-border rounded-xl lg:rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar size={48} className="mx-auto mb-4 opacity-50" />
              <p>No bookings found</p>
            </div>
          ) : (
            bookings.map((booking) => (
            <div key={booking.id} className="bg-background border border-border rounded-xl lg:rounded-2xl p-4 md:p-6 lg:p-8 hover:border-primary/30 transition-all">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3 md:mb-4">
                <div>
                  <h3 className="font-semibold text-white text-base md:text-lg">{booking.property?.title}</h3>
                  <p className="text-muted-foreground mt-1 text-sm">{booking.property?.location}</p>
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
              <div className="flex flex-wrap gap-4 md:gap-8 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <DollarSign size={14} className="text-primary" />
                  ৳{booking.amount.toLocaleString()}
                </span>
                <span className="hidden sm:inline">bKash: {booking.bKashTrxId || 'N/A'}</span>
                <span>{new Date(booking.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
