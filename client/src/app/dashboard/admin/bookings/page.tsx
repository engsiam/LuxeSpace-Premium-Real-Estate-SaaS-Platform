'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import axiosInstance from '@/lib/axiosInstance';
import { Booking } from '@/types';
import { toast } from 'sonner';
import { Calendar, DollarSign } from 'lucide-react';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axiosInstance.get('/bookings/all');
        setBookings(response.data.data || []);
        setError(null);
      } catch (error) {
        setError('Failed to fetch bookings');
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
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 w-full bg-card animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

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
          <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Booking Management</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">All <span className="text-primary italic">Bookings</span></h1>
      </div>

      <div className="bg-card border border-border shadow-xl rounded-2xl overflow-hidden p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Calendar size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Booking Records</h2>
            <p className="text-sm text-muted-foreground">{bookings.length} bookings found</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">User</TableHead>
                <TableHead className="text-muted-foreground">Property</TableHead>
                <TableHead className="text-muted-foreground">Amount</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">bKash TrxID</TableHead>
                <TableHead className="text-muted-foreground">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} className="border-border hover:bg-background/50">
                  <TableCell className="text-white">{booking.user?.name || 'N/A'}</TableCell>
                  <TableCell className="text-muted-foreground">{booking.property?.title || 'N/A'}</TableCell>
                  <TableCell className="text-white font-medium">৳{booking.amount.toLocaleString()}</TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="text-muted-foreground">{booking.bKashTrxId || 'N/A'}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
