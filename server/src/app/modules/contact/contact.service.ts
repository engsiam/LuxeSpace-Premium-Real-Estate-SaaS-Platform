import prisma from '../../../prisma/client';
import ApiError from '../../utils/ApiError';

export const submitContact = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  return prisma.contact.create({
    data,
  });
};

export const getContacts = async () => {
  return prisma.contact.findMany({
    orderBy: { createdAt: 'desc' },
  });
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
