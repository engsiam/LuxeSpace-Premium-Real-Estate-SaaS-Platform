'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import axiosInstance from '@/lib/axiosInstance';
import { Blog } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Share2, Bookmark, Tag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogRes = await axiosInstance.get(`/blogs/${slug}`);
        setBlog(blogRes.data.data);
        
        const allBlogsRes = await axiosInstance.get('/blogs');
        setAllBlogs(allBlogsRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch blog', error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchData();
  }, [slug]);

  const relatedBlogs = allBlogs.filter(b => 
    b.id !== blog?.id && 
    (b.category === blog?.category || b.tags?.some(t => blog?.tags?.includes(t)))
  ).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-48 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Blog Not Found</h2>
          <Button onClick={() => router.push('/blog')}>Back to Blog</Button>
        </div>
      </div>
    );
  }

  const readTime = Math.ceil((blog.content?.split(/\s+/).length || 0) / 200);
  const isHtmlContent = blog.content?.includes('<') && blog.content?.includes('>');

  const renderContent = () => {
    if (isHtmlContent) {
      return <div dangerouslySetInnerHTML={{ __html: blog.content }} className="prose-content" />;
    }
    
    return blog.content?.split('\n\n').map((paragraph, idx) => {
      if (paragraph.trim() === '') return null;
      return <p key={idx} className="mb-6 leading-relaxed text-muted-foreground">{paragraph}</p>;
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="relative h-[50vh] md:h-[40vh] overflow-hidden">
        {blog.coverImage ? (
          <>
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-background" />
        )}
        
        <div className="absolute top-24 left-0 right-0 px-4">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => router.push('/blog')}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Blog</span>
            </button>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-full">
                  {blog.category || 'Article'}
                </span>
                <span className="flex items-center gap-1.5 text-white/70 text-sm">
                  <Clock className="w-4 h-4" />
                  {readTime} min read
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                {blog.title}
              </h1>
              
              <div className="flex items-center gap-4 text-white/80">
                {blog.author?.avatar ? (
                  <Image 
                    src={blog.author.avatar} 
                    alt={blog.author.name || 'Author'} 
                    width={40} 
                    height={40} 
                    className="rounded-full border-2 border-primary/50 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">
                      {(blog.author?.name || 'L')[0]}
                    </span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-medium text-white">{blog.author?.name || 'LuxeSpace Team'}</span>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(blog.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-between border-y border-border/50 py-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="text-sm">Share</span>
            </button>
            <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Bookmark className="w-4 h-4" />
              <span className="text-sm">Save</span>
            </button>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Tag className="w-4 h-4" />
            {blog.category}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="prose-content"
        >
          {renderContent()}
        </motion.div>

        {blog.excerpt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 p-6 bg-card border border-border rounded-2xl"
          >
            <p className="text-lg font-medium text-foreground italic">"{blog.excerpt}"</p>
          </motion.div>
        )}

        {blog.tags && blog.tags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border/50"
          >
            {blog.tags.map((tag, idx) => (
              <Link 
                key={idx} 
                href={`/blog?tag=${tag}`}
                className="px-3 py-1.5 bg-card border border-border text-sm text-muted-foreground rounded-full hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                #{tag}
              </Link>
            ))}
          </motion.div>
        )}

        {relatedBlogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold">Related Articles</h3>
              <Link 
                href="/blog" 
                className="flex items-center gap-2 text-primary hover:gap-3 transition-all font-medium"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedBlogs.map((related, idx) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                >
                  <Link href={`/blog/${related.slug}`} className="group block">
                    <div className="relative h-48 rounded-xl overflow-hidden mb-4 border border-border">
                      {related.coverImage ? (
                        <Image
                          src={related.coverImage}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <Tag className="w-10 h-10 text-primary/30" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary/90 text-primary-foreground text-[10px] font-bold uppercase">
                          {related.category}
                        </Badge>
                      </div>
                    </div>
                    <h4 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {related.title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(related.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      {Math.ceil((related.content?.split(/\s+/).length || 0) / 200)} min
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {relatedBlogs.length === 0 && allBlogs.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold mb-8">More Articles</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {allBlogs.filter(b => b.id !== blog.id).slice(0, 3).map((related, idx) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                >
                  <Link href={`/blog/${related.slug}`} className="group block">
                    <div className="relative h-48 rounded-xl overflow-hidden mb-4 border border-border">
                      {related.coverImage ? (
                        <Image
                          src={related.coverImage}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <Tag className="w-10 h-10 text-primary/30" />
                        </div>
                      )}
                    </div>
                    <h4 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {related.title}
                    </h4>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}