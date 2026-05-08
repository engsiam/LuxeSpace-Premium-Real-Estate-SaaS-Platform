import { mockBkashProvider } from './providers/mock-bkash.provider';
import prisma from '../../../prisma/client';
import ApiError from '../../utils/ApiError';
import crypto from 'crypto';

export type PaymentMethod = 'bkash' | 'stripe' | 'nagad';

export class PaymentService {
  async initiatePayment(bookingId: string, userId: string, amount: number, method: PaymentMethod) {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new ApiError(404, 'Booking record not found');
    }

    // Check for existing INITIATED transaction for this booking
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        bookingId,
        status: 'INITIATED',
      },
    });

    let transaction;
    if (existingTransaction) {
      // Reuse existing transaction
      transaction = existingTransaction;
    } else {
      // Create a new transaction record in INITIATED status
      transaction = await prisma.transaction.create({
        data: {
          bookingId,
          userId,
          amount,
          method,
          status: 'INITIATED',
          trxId: `TRX-${crypto.randomUUID()}`,
        },
      });
    }

    // Use Strategy pattern logic here
    let paymentURL = '';
    if (method === 'bkash') {
      paymentURL = await mockBkashProvider.createPayment(amount, bookingId);
    } else {
      throw new ApiError(400, 'Unsupported payment method');
    }

    // Update booking with the payment method
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        paymentMethod: method,
      },
    });

    return { paymentURL, transactionId: transaction.id };
  }

  async verifyAndExecutePayment(paymentID: string, method: PaymentMethod, invoiceNumber: string) {
    let result;
    if (method === 'bkash') {
      result = await mockBkashProvider.executePayment(paymentID);
    } else {
      throw new ApiError(400, 'Unsupported payment method');
    }

    const booking = await prisma.booking.findUnique({
      where: { id: invoiceNumber },
    });

    if (!booking) {
      throw new ApiError(404, 'Booking not found for this transaction');
    }

    if (result.success) {
      // Update Transaction record
      await prisma.transaction.updateMany({
        where: { bookingId: booking.id, status: 'INITIATED' },
        data: {
          status: 'COMPLETED',
          trxId: result.transactionId,
          paymentId: result.paymentID,
        },
      });

      // Update Booking
      await prisma.booking.update({
        where: { id: booking.id },
        data: {
          status: 'PAID',
          paymentStatus: 'PAID',
          paymentDate: new Date(),
          transactionId: result.transactionId,
          // Compatibility
          bKashTrxId: result.transactionId,
          bKashPaymentID: result.paymentID,
        },
      });

      // Mark property as booked
      await prisma.property.update({
        where: { id: booking.propertyId },
        data: { status: 'BOOKED' },
      });

      return { success: true, bookingId: booking.id, transactionId: result.transactionId };
    } else {
      // Update Transaction record
      await prisma.transaction.updateMany({
        where: { bookingId: booking.id, status: 'INITIATED' },
        data: {
          status: 'FAILED',
        },
      });

      await prisma.booking.update({
        where: { id: booking.id },
        data: { 
          status: 'FAILED',
          paymentStatus: 'FAILED',
        },
      });
      return { success: false, message: result.message };
    }
  }
}

export const paymentService = new PaymentService();
