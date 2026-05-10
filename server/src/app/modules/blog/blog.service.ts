import prisma from '../../../prisma/client';
import ApiError from '../../utils/ApiError';
import { PLACEHOLDER_BLOGS } from './blog.constant';

export const createBlog = async (data: any, authorId: string) => {
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const existing = await prisma.blog.findUnique({
    where: { slug },
  });

  if (existing) {
    throw new ApiError(409, 'Blog with similar title already exists');
  }

  return prisma.blog.create({
    data: {
      ...data,
      slug,
      authorId,
    },
    include: {
      author: {
        select: { id: true, name: true, avatar: true },
      },
    },
  });
};

export const getBlogs = async (filters: { page?: string; limit?: string; category?: string }) => {
  const { page = '1', limit = '10', category } = filters;
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);
  
  const where: any = { isPublished: true };
  if (category) {
    where.category = category;
  }
  
  const [blogs, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.blog.count({ where }),
  ]);

  if (blogs.length === 0) {
    return {
      data: take > 0 ? PLACEHOLDER_BLOGS.slice(0, take) : PLACEHOLDER_BLOGS,
      pagination: { page: parseInt(page), limit: take, total: PLACEHOLDER_BLOGS.length, totalPages: 1 },
    };
  }

  return {
    data: blogs,
    pagination: { page: parseInt(page), limit: take, total, totalPages: Math.ceil(total / take) },
  };
};

export const getBlogBySlug = async (slug: string) => {
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: {
      author: {
        select: { id: true, name: true, avatar: true },
      },
    },
  });

  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  return blog;
};

export const getAllBlogs = async () => {
  return prisma.blog.findMany({
    include: {
      author: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateBlog = async (id: string, data: any) => {
  const blog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  let slug = blog.slug;
  if (data.title && data.title !== blog.title) {
    slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  return prisma.blog.update({
    where: { id },
    data: {
      ...data,
      slug,
    },
    include: {
      author: {
        select: { id: true, name: true, avatar: true },
      },
    },
  });
};

export const deleteBlog = async (id: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!blog) {
    throw new ApiError(404, 'Blog not found');
  }

  return prisma.blog.delete({
    where: { id },
  });
};
