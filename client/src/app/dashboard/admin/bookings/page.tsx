'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import axiosInstance from '@/lib/axiosInstance';
import { Booking } from '@/types';
import { toast } from 'sonner';
import { Calendar, RefreshCw } from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get('/bookings/all');
      setBookings(response.data.data || []);
      setError(null);
    } catch {
      setError('Failed to fetch bookings');
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (error) {
    return (
      <div className="p-4 md:p-6 lg:p-10">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchBookings} variant="outline" className="rounded-xl">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-6 lg:space-y-12 bg-background min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 lg:gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 lg:w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">Booking Management</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tighter text-white">All <span className="text-primary italic">Bookings</span></h1>
        </div>
        <Button onClick={fetchBookings} variant="outline" className="h-10 lg:h-12 rounded-xl border-white/10 text-white hover:bg-white/10">
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </Button>
      </div>

      <div className="bg-card border border-border shadow-xl rounded-xl lg:rounded-2xl overflow-hidden p-4 lg:p-8">
        <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6">
          <div className="w-10 lg:w-12 h-10 lg:h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Calendar size={20} className="lg:w-6 lg:h-6" />
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-white">Booking Records</h2>
            <p className="text-xs lg:text-sm text-muted-foreground">{loading ? 'Loading...' : `${bookings.length} bookings`}</p>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12">User</TableHead>
                <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 hidden sm:table-cell">Property</TableHead>
                <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 text-center">Amount</TableHead>
                <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 text-center">Status</TableHead>
                <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 hidden md:table-cell">TrxID</TableHead>
                <TableHead className="text-muted-foreground font-black uppercase tracking-widest text-[10px] h-12 hidden sm:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id} className="border-border hover:bg-background/50">
                    <TableCell className="text-white font-medium text-sm">{booking.user?.name || 'N/A'}</TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell text-sm max-w-[150px] truncate">{booking.property?.title || 'N/A'}</TableCell>
                    <TableCell className="text-white font-medium text-center text-sm">৳{booking.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={`rounded-full px-2 lg:px-3 py-0.5 text-[9px] lg:text-xs font-black uppercase tracking-wider border-0 ${
                          booking.status === 'PAID'
                            ? 'bg-emerald-500/10 text-emerald-500'
                            : booking.status === 'PENDING'
                            ? 'bg-yellow-500/10 text-yellow-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell text-xs">{booking.bKashTrxId || 'N/A'}</TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell text-xs">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}