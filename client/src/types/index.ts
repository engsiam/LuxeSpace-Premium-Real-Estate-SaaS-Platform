export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city: string;
  area: string;
  bhk: number;
  size: number;
  type: string;
  images: string[];
  amenities: string[];
  status: 'AVAILABLE' | 'BOOKED' | 'SOLD';
  isFeatured: boolean;
  agentId: string;
  agent: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  reviews?: Review[];
  _count?: {
    reviews: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'AGENT' | 'USER';
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  propertyId: string;
  bKashTrxId?: string;
  bKashPaymentID?: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  visitDate?: string;
  property: {
    id: string;
    title: string;
    location: string;
    images: string[];
  };
  user?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  propertyId: string;
  rating: number;
  comment: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage: string;
  category: string;
  tags: string[];
  authorId: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
