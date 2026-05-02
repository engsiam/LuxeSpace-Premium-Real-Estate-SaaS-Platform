'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import axiosInstance from '@/lib/axiosInstance';
import { Blog } from '@/types';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, User, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get('/blogs');
        setBlogs(response.data.data);
      } catch (error) {
        // Handled globally
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredBlog = blogs[0];
  const otherBlogs = searchTerm ? filteredBlogs : blogs.slice(1);

  if (loading) {
    return (
      <div className="bg-background min-h-screen pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-12 w-48 mb-8" />
          <Skeleton className="h-[500px] w-full mb-16 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[400px] rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="space-y-4">
            <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">Insights & News</span>
            <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter">LuxeSpace <span className="text-primary italic">Journal</span></h1>
            <p className="text-muted-foreground font-medium max-w-xl text-lg">
              Expert commentary on premium real estate, market trends, and luxury lifestyle in Bangladesh.
            </p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary w-5 h-5" />
            <Input 
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 bg-card border border-border rounded-2xl pl-12 pr-6 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/30"
            />
          </div>
        </div>

        {!searchTerm && featuredBlog && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-20"
          >
            <Link href={`/blog/${featuredBlog.slug}`} className="group">
              <div className="relative h-[500px] rounded-3xl overflow-hidden border border-border shadow-2xl">
                {featuredBlog.coverImage && (
                  <img
                    src={featuredBlog.coverImage}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-12 max-w-3xl space-y-6">
                  <Badge className="bg-primary text-secondary font-black px-4 py-1 text-sm uppercase">
                    Featured Article
                  </Badge>
                  <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight group-hover:text-primary transition-colors">
                    {featuredBlog.title}
                  </h2>
                  <div className="flex items-center gap-6 text-muted-foreground font-bold text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-primary" />
                      <span>{new Date(featuredBlog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={18} className="text-primary" />
                      <span>By LuxeSpace Team</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherBlogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/blog/${blog.slug}`} className="group">
                <Card className="h-full overflow-hidden bg-card border border-border rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
                  <div className="h-64 relative overflow-hidden">
                    {blog.coverImage && (
                      <img
                        src={blog.coverImage}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                    <Badge className="absolute top-6 left-6 bg-primary text-secondary font-black">
                      {blog.category}
                    </Badge>
                  </div>
                  <CardContent className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-black uppercase tracking-widest mb-4">
                      <Calendar size={14} className="text-primary" />
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-2xl font-black text-foreground mb-6 group-hover:text-primary transition-colors leading-tight line-clamp-2">
                      {blog.title}
                    </h3>
                    <div className="mt-auto flex items-center gap-2 text-primary font-black text-sm">
                      <span>Read Full Article</span>
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-2" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="text-center py-24">
            <h3 className="text-2xl font-black text-foreground">No articles found</h3>
            <p className="text-muted-foreground font-medium">Try different keywords or clear your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
