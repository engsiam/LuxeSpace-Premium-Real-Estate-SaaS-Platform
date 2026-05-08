import prisma from '../../../prisma/client';
import ApiError from '../../utils/ApiError';
import { paymentService } from '../payment/payment.service';

export const initiateBooking = async (
  userId: string,
  propertyId: string,
  visitDate?: string
) => {
  console.log('=== bookingService.initiateBooking ===');
  console.log('userId:', userId, 'propertyId:', propertyId);
  
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });
  
  console.log('property found:', property ? 'yes' : 'no');

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  if (property.status !== 'AVAILABLE') {
    throw new ApiError(400, 'Property is not available for booking');
  }

  // Check if user already has a pending or paid booking for this property
  const existingBooking = await prisma.booking.findFirst({
    where: {
      userId,
      propertyId,
      status: { in: ['PENDING', 'PAID'] },
    },
  });

  if (existingBooking && existingBooking.status === 'PAID') {
    throw new ApiError(400, 'You have already reserved this residence');
  }

  const booking = await prisma.booking.create({
    data: {
      userId,
      propertyId,
      amount: property.price,
      visitDate: visitDate ? new Date(visitDate) : undefined,
      status: 'PENDING',
      paymentStatus: 'UNPAID',
    },
  });

  // Initiate payment via centralized payment service
  const paymentData = await paymentService.initiatePayment(
    booking.id,
    userId,
    property.price,
    'bkash' // Defaulting to bKash for now as per requirement
  );

  return {
    booking,
    paymentURL: paymentData.paymentURL,
    // Backwards compatibility for frontend if needed
    bkashURL: paymentData.paymentURL,
  };
};

export const executeBooking = async (paymentID: string, method: string = 'bkash', invoice: string) => {
  return paymentService.verifyAndExecutePayment(paymentID, method as any, invoice);
};

export const getMyBookings = async (userId: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where: { userId },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            location: true,
            images: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.booking.count({ where: { userId } }),
  ]);

  return {
    bookings,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getAllBookings = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        property: {
          select: { id: true, title: true, location: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.booking.count(),
  ]);

  return {
    bookings,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getTransactionHistory = async (userId?: string, page = 1, limit = 20) => {
  const where = userId ? { userId } : {};
  const skip = (page - 1) * limit;
  
  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        booking: { 
          include: { 
            property: { select: { title: true } } 
          } 
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    transactions,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};
