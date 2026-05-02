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

export const getBlogs = async (filters: any) => {
  const { limit } = filters;
  
  const blogs = await prisma.blog.findMany({
    where: { isPublished: true },
    include: {
      author: {
        select: { id: true, name: true, avatar: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit ? parseInt(limit) : undefined,
  });

  if (blogs.length === 0) {
    return limit ? PLACEHOLDER_BLOGS.slice(0, parseInt(limit)) : PLACEHOLDER_BLOGS;
  }

  return blogs;
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
