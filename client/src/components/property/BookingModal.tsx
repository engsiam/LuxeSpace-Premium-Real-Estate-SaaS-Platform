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
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initiate booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Property</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">{property.title}</h3>
            <p className="text-2xl font-bold text-primary">
              ৳{property.price.toLocaleString()}
            </p>
          </div>

          <div>
            <Label htmlFor="visitDate">Preferred Visit Date (Optional)</Label>
            <Input
              id="visitDate"
              type="datetime-local"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
            />
          </div>

          <Button onClick={handleBooking} disabled={loading} className="w-full">
            {loading ? 'Processing...' : 'Proceed to Payment'}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            You will be redirected to bKash for payment
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
