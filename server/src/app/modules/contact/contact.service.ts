import prisma from '../../../prisma/client';
import ApiError from '../../utils/ApiError';
import { sendContactConfirmation, sendReplyEmail } from '../../utils/email';

export const submitContact = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const result = await prisma.contact.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      status: 'PENDING',
    },
  });

  await sendContactConfirmation(data.email, data.name);

  return result;
};

export const getContacts = async () => {
  return prisma.contact.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const getContactById = async (id: string) => {
  const contact = await prisma.contact.findUnique({
    where: { id },
  });

  if (!contact) {
    throw new ApiError(404, 'Contact not found');
  }

  return contact;
};

export const markAsRead = async (id: string) => {
  const contact = await prisma.contact.findUnique({
    where: { id },
  });

  if (!contact) {
    throw new ApiError(404, 'Contact not found');
  }

  return prisma.contact.update({
    where: { id },
    data: { isRead: true },
  });
};

export const replyToContact = async (id: string, reply: string) => {
  const contact = await prisma.contact.findUnique({
    where: { id },
  });

  if (!contact) {
    throw new ApiError(404, 'Contact not found');
  }

  const result = await prisma.contact.update({
    where: { id },
    data: {
      reply,
      repliedAt: new Date(),
      status: 'REPLIED',
    },
  });

  await sendReplyEmail(contact.email, contact.name, reply, contact.subject);

  return result;
};

export const deleteContact = async (id: string) => {
  const contact = await prisma.contact.findUnique({
    where: { id },
  });

  if (!contact) {
    throw new ApiError(404, 'Contact not found');
  }

  return prisma.contact.delete({
    where: { id },
  });
};