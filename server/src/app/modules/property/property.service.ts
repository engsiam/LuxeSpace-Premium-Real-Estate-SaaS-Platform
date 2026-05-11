import { Prisma } from '@prisma/client';
import prisma from '../../../prisma/client';
import ApiError from '../../utils/ApiError';
import { PLACEHOLDER_PROPERTIES } from './property.constant';

export interface IPropertyData {
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  area: string;
  bhk: number;
  size: number;
  type: string;
  images?: string[];
  amenities?: string[];
  status?: 'AVAILABLE' | 'BOOKED' | 'SOLD';
  isFeatured?: boolean;
}

export const createProperty = async (data: IPropertyData, agentId: string) => {
  return prisma.property.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      location: data.location,
      city: data.city,
      area: data.area,
      bhk: data.bhk,
      size: data.size,
      type: data.type,
      images: data.images || [],
      amenities: data.amenities || [],
      status: data.status || 'AVAILABLE',
      isFeatured: data.isFeatured || false,
      agentId,
    },
    include: {
      agent: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
  });
};

export const getProperties = async (filters: {
  searchTerm?: string;
  city?: string;
  type?: string;
  minPrice?: string;
  maxPrice?: string;
  bhk?: string;
  status?: string;
  page?: string;
  limit?: string;
  sortBy?: string;
  agentId?: string;
}) => {
  const {
    searchTerm,
    city,
    type,
    minPrice,
    maxPrice,
    bhk,
    status,
    page = '1',
    limit = '10',
    sortBy,
    agentId,
  } = filters;

  const where: Prisma.PropertyWhereInput = {};

  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } },
      { location: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  if (city) where.city = city;
  if (type) where.type = type;
  if (status) where.status = status as any;
  if (bhk) where.bhk = parseInt(bhk);
  if (agentId) where.agentId = agentId;

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as any).gte = parseFloat(minPrice);
    if (maxPrice) (where.price as any).lte = parseFloat(maxPrice);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  let orderBy: Prisma.PropertyOrderByWithRelationInput = { createdAt: 'desc' };
  if (sortBy === 'price-asc') orderBy = { price: 'asc' };
  if (sortBy === 'price-desc') orderBy = { price: 'desc' };
  if (sortBy === 'newest') orderBy = { createdAt: 'desc' };

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        agent: {
          select: { id: true, name: true, avatar: true },
        },
        _count: {
          select: { reviews: true },
        },
      },
    }),
    prisma.property.count({ where }),
  ]);

  if (properties.length === 0 && !searchTerm && !city && !type && !minPrice && !maxPrice && !bhk && !agentId) {
    return {
      data: PLACEHOLDER_PROPERTIES,
      meta: {
        total: PLACEHOLDER_PROPERTIES.length,
        page: 1,
        limit: parseInt(limit),
        totalPages: 1,
      },
    };
  }

  return {
    data: properties,
    meta: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

export const getPropertyById = async (id: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      agent: {
        select: { id: true, name: true, email: true, phone: true, avatar: true },
      },
      reviews: {
        include: {
          user: {
            select: { id: true, name: true, avatar: true },
          },
        },
      },
    },
  });

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  return property;
};

export const updateProperty = async (id: string, data: Partial<IPropertyData>, userId: string, userRole?: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  if (userRole !== 'ADMIN' && property.agentId !== userId) {
    throw new ApiError(403, 'Forbidden: You can only update your own properties');
  }

  return prisma.property.update({
    where: { id },
    data,
    include: {
      agent: {
        select: { id: true, name: true, avatar: true },
      },
    },
  });
};

export const deleteProperty = async (id: string, userId: string, userRole?: string) => {
  const property = await prisma.property.findUnique({
    where: { id },
  });

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  if (userRole !== 'ADMIN' && property.agentId !== userId) {
    throw new ApiError(403, 'Forbidden: You can only delete your own properties');
  }

  await prisma.property.delete({
    where: { id },
  });
};

export const getFeaturedProperties = async () => {
  const properties = await prisma.property.findMany({
    where: { isFeatured: true, status: 'AVAILABLE' },
    take: 8,
    include: {
      agent: {
        select: { id: true, name: true, avatar: true },
      },
    },
  });

  if (properties.length === 0) {
    return PLACEHOLDER_PROPERTIES.filter(p => p.isFeatured).slice(0, 8);
  }

  return properties;
};

export const getPropertiesByCity = async () => {
  const result = await prisma.property.groupBy({
    by: ['city'],
    _count: {
      city: true,
    },
  });

  if (result.length === 0) {
    return [
      { city: 'Dhaka', count: 12 },
      { city: 'Chittagong', count: 5 },
      { city: 'Sylhet', count: 3 },
      { city: 'Rajshahi', count: 2 },
    ];
  }

  return result.map((item) => ({
    city: item.city,
    count: item._count.city,
  }));
};

export const getAgentStats = async (agentId: string) => {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  // Debug: list all users with AGENT role to see which IDs exist
  const allAgents = await prisma.user.findMany({
    where: { role: 'AGENT' },
    select: { id: true, name: true, email: true },
    take: 10
  });
  console.log('[AgentStats] All AGENT users:', JSON.stringify(allAgents.map(a => ({ id: a.id, name: a.name }))));

  // Get all properties with their agent IDs to understand the data
  const allProps = await prisma.property.findMany({
    select: { id: true, title: true, agentId: true },
    take: 5
  });
  console.log('[AgentStats] Sample properties:', JSON.stringify(allProps.map(p => ({ id: p.id, agentId: p.agentId, title: p.title.substring(0, 20) }))));

  // Check the exact agentId we're searching with
  console.log('[AgentStats] Looking for properties where agentId =', agentId);

  const [properties, revenueData, bookingsData, allBookings, paidBookings, reviewsData] = await Promise.all([
    prisma.property.findMany({ 
      where: { agentId },
      include: { _count: { select: { bookings: true, reviews: true } } }
    }),
    prisma.booking.aggregate({
      where: {
        property: { agentId },
        status: 'PAID',
      },
      _sum: { amount: true },
    }),
    prisma.booking.findMany({
      where: {
        property: { agentId },
        createdAt: { gte: sixMonthsAgo },
      },
      select: { amount: true, status: true, createdAt: true },
    }),
    prisma.booking.findMany({
      where: { property: { agentId } },
      select: { id: true },
    }),
    prisma.booking.findMany({
      where: { property: { agentId }, status: 'PAID' },
      select: { amount: true },
    }),
    prisma.review.findMany({
      where: { property: { agentId } },
      select: { id: true, rating: true },
    }),
  ]);

  console.log('[AgentStats] Found properties:', properties.length);

  const propertyCount = properties.length;
  const totalRevenue = revenueData._sum.amount || 0;
  const totalInquiries = allBookings.length;
  const totalBookings = paidBookings.length;
  const totalReviews = reviewsData.length;
  const avgRating = reviewsData.length > 0 
    ? reviewsData.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewsData.length 
    : 0;
  
  // Total views = each property gets base views + bookings * 10
  const totalViews = properties.reduce((sum, p) => {
    const propertyBookings = p._count?.bookings || 0;
    const baseViews = 10;
    return sum + baseViews + (propertyBookings * 5);
  }, 0);

  const monthlyData: Record<string, { views: number; inquiries: number }> = {};
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    
    const monthBookings = bookingsData.filter(b => {
      const created = new Date(b.createdAt);
      return created >= monthStart && created <= monthEnd;
    });
    
    const monthProperties = properties.filter(p => {
      const created = new Date(p.createdAt);
      return created >= monthStart && created <= monthEnd;
    });
    
    monthlyData[months[d.getMonth()]] = { 
      views: monthProperties.length + monthBookings.length,
      inquiries: monthBookings.length,
    };
  }

  const engagementData = Object.entries(monthlyData).reverse().map(([name, data]) => ({
    name,
    value1: data.views,
    value2: data.inquiries,
  }));

  console.log('[AgentStats] returning:', { totalProperties: propertyCount, totalViews, totalInquiries, totalRevenue, totalBookings, totalReviews, avgRating });

  return {
    totalProperties: propertyCount,
    totalViews,
    totalInquiries,
    totalRevenue,
    engagementData,
    totalBookings,
    totalReviews,
    avgRating: Math.round(avgRating * 10) / 10,
  };
};
