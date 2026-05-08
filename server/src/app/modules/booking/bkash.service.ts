import axios from 'axios';
import env, { getServerUrl } from '../../../config';

let bkashToken: string | null = null;
let tokenExpiry: number | null = null;

export const getBkashToken = async () => {
  const now = Date.now();
  if (bkashToken && tokenExpiry && now < tokenExpiry) {
    return bkashToken;
  }

  const response = await axios.post(
    `${env.BKASH_BASE_URL}/tokenized/checkout/token/grant`,
    {
      app_key: env.BKASH_APP_KEY,
      app_secret: env.BKASH_APP_SECRET,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        username: env.BKASH_USERNAME,
        password: env.BKASH_PASSWORD,
      },
    }
  );

  bkashToken = response.data.id_token;
  tokenExpiry = now + response.data.expires_in * 1000;
  return bkashToken;
};

export const createPayment = async (amount: number, invoiceNumber: string, userId: string) => {
  const token = await getBkashToken();
  const serverUrl = getServerUrl();
  const callbackURL = `${serverUrl}/api/v1/bookings/callback`;

  const response = await axios.post(
    `${env.BKASH_BASE_URL}/tokenized/checkout/create`,
    {
      mode: '0011',
      payerReference: userId,
      callbackURL,
      amount,
      currency: 'BDT',
      intent: 'sale',
      merchantInvoiceNumber: invoiceNumber,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
        'x-app-key': env.BKASH_APP_KEY,
      },
    }
  );

  return response.data;
};

export const executePayment = async (paymentID: string) => {
  const token = await getBkashToken();

  const response = await axios.post(
    `${env.BKASH_BASE_URL}/tokenized/checkout/execute`,
    { paymentID },
    {
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
        'x-app-key': env.BKASH_APP_KEY,
      },
    }
  );

  return response.data;
};
