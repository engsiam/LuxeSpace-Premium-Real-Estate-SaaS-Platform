import { Response } from 'express';
import prisma from '../../prisma/client';
import catchAsync from '../utils/catchAsync';
import sendResponse from '../utils/sendResponse';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const getStatsOverview = catchAsync(async (req, res) => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const [
    totalProperties,
    totalUsers,
    totalRevenue,
    pendingBookings,
    totalBookings,
    recentBookings,
    recentUsers,
    recentProperties,
    allBookings,
  ] = await Promise.all([
    prisma.property.count(),
    prisma.user.count(),
    prisma.booking.aggregate({
      where: { status: 'PAID' },
      _sum: { amount: true },
    }),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.count(),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        property: { select: { title: true } },
      },
    }),
    prisma.user.findMany({
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: { name: true, role: true, createdAt: true },
    }),
    prisma.property.findMany({
      take: 2,
      orderBy: { createdAt: 'desc' },
      select: { title: true, createdAt: true },
    }),
    prisma.booking.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      select: { amount: true, status: true, createdAt: true },
    }),
  ]);

  const monthlyData: Record<string, { revenue: number; bookings: number }> = {};
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthlyData[months[d.getMonth()]] = { revenue: 0, bookings: 0 };
  }

  allBookings.forEach((b) => {
    const monthKey = months[new Date(b.createdAt).getMonth()];
    if (monthKey in monthlyData) {
      monthlyData[monthKey].bookings += 1;
      if (b.status === 'PAID') {
        monthlyData[monthKey].revenue += b.amount || 0;
      }
    }
  });

  const monthlyBookings = Object.entries(monthlyData).reverse().map(([month, data]) => ({
    _id: month,
    count: data.bookings,
    revenue: data.revenue,
  }));

  const recentActivity = [
    ...recentBookings.map((b) => ({
      user: b.user?.name || 'User',
      action: `booked ${b.property?.title || 'property'}`,
      time: getRelativeTime(b.createdAt),
      icon: 'DollarSign',
      color: 'text-emerald-500',
    })),
    ...recentUsers.map((u) => ({
      user: u.name || 'User',
      action: `registered as ${u.role}`,
      time: getRelativeTime(u.createdAt),
      icon: 'Users',
      color: 'text-blue-500',
    })),
    ...recentProperties.map((p) => ({
      user: 'Agent',
      action: `added ${p.title}`,
      time: getRelativeTime(p.createdAt),
      icon: 'Building2',
      color: 'text-primary',
    })),
  ].slice(0, 6);

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
      monthlyBookings,
      recentActivity,
    },
  });
});

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} mins ago`;
  if (hours < 24) return `${hours} hours ago`;
  return `${days} days ago`;
}
