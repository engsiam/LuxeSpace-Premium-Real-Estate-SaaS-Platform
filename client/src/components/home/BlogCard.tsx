// Blog Card - REBUILT FROM ZERO
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Blog } from '@/types';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  blog: Blog;
  index?: number;
}

export function BlogCard({ blog, index = 0 }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="h-full"
    >
      <Link href={`/blog/${blog.slug}`} className="block h-full">
        <div className="overflow-hidden h-full bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-2xl transition-all duration-500 group">
          {/* Image - Fixed 16:9 Ratio */}
          <div className="relative aspect-video overflow-hidden">
            <Image 
              src={blog.coverImage || 'https://images.unsplash.com/photo-1585829491330-bf6a3f5f79f?q=80&w=800&auto=format&fit=crop'}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>

          {/* Content - Same Padding Everywhere */}
          <div className="p-6 space-y-3">
            {/* Category */}
            <div className="flex items-center gap-2 text-primary">
              <span className="text-xs font-bold uppercase tracking-[0.3em]">{blog.category}</span>
            </div>

            {/* Title - 2 Lines Max */}
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
              {blog.title}
            </h3>

            {/* Excerpt */}
            <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
              {blog.excerpt}
            </p>

            {/* Meta */}
            <div className="pt-3 border-t border-border/50 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>
              <span className="text-xs text-primary font-medium hover:text-foreground transition-colors">
                Read More →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
