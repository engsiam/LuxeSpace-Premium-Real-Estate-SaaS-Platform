import prisma from '../../../prisma/client';
import ApiError from '../../utils/ApiError';

export const createReview = async (
  userId: string,
  propertyId: string,
  rating: number,
  comment: string
) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  const review = await prisma.review.create({
    data: {
      userId,
      propertyId,
      rating,
      comment,
    },
    include: {
      user: {
        select: { id: true, name: true, avatar: true },
      },
    },
  });

  // Update property rating (optional - can add average rating field)
  return review;
};

export const getPropertyReviews = async (propertyId: string) => {
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  return prisma.review.findMany({
    where: { propertyId },
    include: {
      user: {
        select: { id: true, name: true, avatar: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};
