import { z } from 'zod';

export const createPropertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.preprocess((val) => parseFloat(val as string), z.number().positive('Price must be positive')),
  location: z.string().min(2, 'Location is required'),
  city: z.string().min(2, 'City is required'),
  area: z.string().min(2, 'Area is required'),
  bhk: z.preprocess((val) => parseInt(val as string), z.number().int().positive('BHK must be positive')),
  size: z.preprocess((val) => parseInt(val as string), z.number().int().positive('Size must be positive')),
  type: z.string().min(2, 'Property type is required'),
  images: z.array(z.string().url()).optional(),
  amenities: z.preprocess((val) => {
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch { return [val]; }
    }
    return val;
  }, z.array(z.string()).default([])),
  status: z.enum(['AVAILABLE', 'BOOKED', 'SOLD']).default('AVAILABLE'),
  isFeatured: z.preprocess((val) => val === 'true', z.boolean().default(false)),
});

export const updatePropertySchema = createPropertySchema.partial();

export const propertyFilterSchema = z.object({
  searchTerm: z.string().optional(),
  city: z.string().optional(),
  type: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  bhk: z.string().optional(),
  status: z.string().optional(),
  page: z.string().default('1'),
  limit: z.string().default('10'),
  sortBy: z.string().optional(),
  agentId: z.string().optional(),
});
