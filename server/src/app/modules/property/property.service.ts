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
