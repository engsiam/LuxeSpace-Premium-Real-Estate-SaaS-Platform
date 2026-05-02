'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import axiosInstance from '@/lib/axiosInstance';
import { Blog } from '@/types';

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axiosInstance.get(`/blogs/${slug}`);
        setBlog(response.data.data);
      } catch (error) {
        console.error('Failed to fetch blog', error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Skeleton className="h-64 w-full mb-8" />
        <Skeleton className="h-8 w-96 mb-4" />
        <Skeleton className="h-6 w-48 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!blog) {
    return <div className="text-center py-12">Blog not found</div>;
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {blog.coverImage && (
        <div className="h-64 md:h-96 bg-gray-200 rounded-xl mb-8 overflow-hidden">
          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="mb-8">
        <span className="text-sm text-muted-foreground">{blog.category}</span>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">{blog.title}</h1>
        <p className="text-muted-foreground mt-2">
          By {blog.author?.name} • {new Date(blog.createdAt).toLocaleDateString()}
        </p>
      </div>
      <div className="prose max-w-none">
        <p>{blog.content}</p>
      </div>
    </article>
  );
}
