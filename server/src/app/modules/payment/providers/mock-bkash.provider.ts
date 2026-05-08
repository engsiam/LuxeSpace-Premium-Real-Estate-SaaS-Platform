import crypto from 'crypto';
import { getClientUrl } from '../../../../config';

export interface IPaymentResponse {
  success: boolean;
  transactionId: string;
  paymentID: string;
  method: string;
  status: 'completed' | 'failed' | 'cancelled';
  message?: string;
  amount: number;
  merchantInvoiceNumber: string;
}

export class MockBkashProvider {
  async createPayment(amount: number, invoiceNumber: string): Promise<string> {
    const clientUrl = getClientUrl();
    return `${clientUrl}/payment/processing?invoice=${invoiceNumber}&amount=${amount}&method=bkash`;
  }

  async executePayment(paymentID: string): Promise<IPaymentResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate occasional failures (5% chance)
    const isSuccess = Math.random() > 0.05;

    if (!isSuccess) {
      return {
        success: false,
        transactionId: '',
        paymentID,
        method: 'bkash',
        status: 'failed',
        message: 'Insufficient balance or network issue',
        amount: 0,
        merchantInvoiceNumber: '',
      };
    }

    return {
      success: true,
      transactionId: 'TRX' + crypto.randomBytes(8).toString('hex').toUpperCase(),
      paymentID: 'BKASH_' + Date.now(),
      method: 'bkash',
      status: 'completed',
      amount: 0, // In real, we'd get this from bKash
      merchantInvoiceNumber: '', // In real, we'd get this from bKash
    };
  }
}

export const mockBkashProvider = new MockBkashProvider();
