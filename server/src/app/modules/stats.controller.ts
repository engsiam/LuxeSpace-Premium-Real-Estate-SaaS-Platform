import { Response } from 'express';
import prisma from '../../prisma/client';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';

export const getStatsOverview = catchAsync(async (req, res) => {
  const [
    totalProperties,
    totalUsers,
    totalRevenue,
    pendingBookings,
    totalBookings,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.user.count(),
    prisma.booking.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true },
    }),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.count(),
  ]);

  const monthlyBookings: any = await prisma.$runCommandRaw({
    aggregate: 'Booking',
    pipeline: [
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
          revenue: { $sum: '$amount' },
        },
      },
      { $sort: { _id: 1 } },
    ],
    cursor: {},
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Stats retrieved',
    data: {
      totalProperties,
      totalUsers,
      totalRevenue: totalRevenue._sum.amount || 0,
      pendingBookings,
      totalBookings,
      monthlyBookings: monthlyBookings.cursor.firstBatch,
    },
  });
});
