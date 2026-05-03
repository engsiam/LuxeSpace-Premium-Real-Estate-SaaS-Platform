'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import axiosInstance from '@/lib/axiosInstance';
import { Blog } from '@/types';
import { toast } from 'sonner';
import { Plus, BookOpen } from 'lucide-react';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get('/blogs/all');
        setBlogs(response.data.data || []);
        setError(null);
      } catch (error) {
        setError('Failed to fetch blogs');
        toast.error('Failed to fetch blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (error) {
    return (
      <div className="p-10">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-12 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Content Management</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Manage <span className="text-primary italic">Blogs</span></h1>
        </div>
        <Link href="/dashboard/agent/add-property">
          <Button className="bg-primary text-secondary-foreground hover:bg-white rounded-xl font-bold">
            <Plus size={18} className="mr-2" />
            Create Blog
          </Button>
        </Link>
      </div>

      <div className="bg-card border border-border shadow-xl rounded-2xl overflow-hidden p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">All Blogs</h2>
            <p className="text-sm text-muted-foreground">{blogs.length} articles found</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-background animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-background border border-border rounded-xl p-6 hover:border-primary/30 transition-all">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{blog.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {blog.category} • {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={blog.isPublished ? 'bg-emerald-500' : 'bg-yellow-500'}>
                    {blog.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
