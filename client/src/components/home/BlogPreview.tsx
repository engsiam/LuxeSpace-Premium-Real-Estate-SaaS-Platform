'use client';

import { motion } from 'framer-motion';
import { Button } from '@/design-system/components';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Section, Heading, Grid } from '@/design-system/components';
import { Blog } from '@/types';
import { BlogCard } from '@/components/home/BlogCard';
import axiosInstance from '@/lib/axiosInstance';
import { useState, useEffect } from 'react';

export default function BlogPreview() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get('/blogs?limit=3');
        setBlogs(response.data.data || []);
      } catch (error) {
        // Handled globally
      }
    };
    fetchBlogs();
  }, []);

  return (
    <Section id="journal">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-primary" />
            <span className="text-primary font-bold uppercase tracking-[0.4em] text-xs">Journal</span>
          </div>
          <Heading level={2}>Elite Property <span className="text-primary italic">Journal</span></Heading>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Button href="/blog" variant="outline">
            VIEW ALL ARTICLES
            <ArrowRight size={14} className="ml-2" />
          </Button>
        </motion.div>
      </div>

      <Grid cols={3}>
        {blogs.map((blog, index) => (
          <BlogCard key={blog.id} blog={blog} index={index} />
        ))}
      </Grid>
    </Section>
  );
}
