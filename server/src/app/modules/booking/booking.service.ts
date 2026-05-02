import prisma from '../../../prisma/client';
import ApiError from '../../utils/ApiError';
import env from '../../../config';
import axios from 'axios';

import * as bkashService from './bkash.service';

export const initiateBooking = async (
  userId: string,
  propertyId: string,
  visitDate?: string
) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  if (property.status !== 'AVAILABLE') {
    throw new ApiError(400, 'Property is not available for booking');
  }

  const booking = await prisma.booking.create({
    data: {
      userId,
      propertyId,
      amount: property.price,
      visitDate: visitDate ? new Date(visitDate) : undefined,
      status: 'PENDING',
    },
  });

  // Create bKash payment
  const paymentData = await bkashService.createPayment(
    property.price,
    booking.id,
    userId
  );

  return {
    booking,
    bkashURL: paymentData.bkashURL,
  };
};

export const executeBooking = async (paymentID: string) => {
  const paymentData = await bkashService.executePayment(paymentID);

  const { transactionStatus, trxID, paymentID: pID } = paymentData;

  const booking = await prisma.booking.findFirst({
    where: { id: paymentData.merchantInvoiceNumber },
  });

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (transactionStatus === 'Completed') {
    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: 'PAID',
        bKashTrxId: trxID,
        bKashPaymentID: pID,
      },
    });

    await prisma.property.update({
      where: { id: booking.propertyId },
      data: { status: 'BOOKED' },
    });
  } else {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'FAILED' },
    });
  }

  return booking;
};


export const getMyBookings = async (userId: string) => {
  return prisma.booking.findMany({
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
  });
};

export const getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      property: {
        select: { id: true, title: true, location: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};
