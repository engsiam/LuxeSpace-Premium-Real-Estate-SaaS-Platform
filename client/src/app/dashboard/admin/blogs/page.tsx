'use client';

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Pagination } from '@/components/ui/pagination';
import { Plus, BookOpen, Pencil, Trash2, X, Image as ImageIcon, Loader2, Upload, Eye, ImagePlus } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import { Blog } from '@/types';
import Image from 'next/image';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
const ITEMS_PER_PAGE = 8;

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    coverImage: '',
    isPublished: true,
  });

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const fetchBlogs = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/blogs/all?page=${page}&limit=${ITEMS_PER_PAGE}`);
      const data = response.data.data;
      const meta = response.data.meta;
      if (Array.isArray(data)) {
        setBlogs(data);
        setTotalPages(meta?.totalPages || 1);
        setTotalItems(meta?.total || data.length);
      } else {
        setBlogs([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } catch {
      toast.error('Failed to fetch blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openCreateModal = () => {
    setSelectedBlog(null);
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      coverImage: '',
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (blog: Blog) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title || '',
      content: blog.content || '',
      excerpt: blog.excerpt || '',
      category: blog.category || '',
      coverImage: blog.coverImage || blog.image || '',
      isPublished: blog.isPublished ?? true,
    });
    setModalOpen(true);
  };

  const openDeleteModal = (blog: Blog) => {
    setSelectedBlog(blog);
    setDeleteModalOpen(true);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    setUploadingImage(true);
    try {
      const response = await axiosInstance.post('/upload', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.url) {
        setFormData({ ...formData, coverImage: response.data.url });
        toast.success('Image uploaded successfully');
      }
    } catch {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        coverImage: formData.coverImage,
        isPublished: formData.isPublished,
      };

      if (selectedBlog) {
        await axiosInstance.patch(`/blogs/${selectedBlog.id}`, payload);
        toast.success('Blog updated successfully');
      } else {
        await axiosInstance.post('/blogs', payload);
        toast.success('Blog created successfully');
      }
      setModalOpen(false);
      fetchBlogs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save blog');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBlog) return;
    setSubmitting(true);

    try {
      await axiosInstance.delete(`/blogs/${selectedBlog.id}`);
      toast.success('Blog deleted successfully');
      setDeleteModalOpen(false);
      fetchBlogs();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete blog');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-6 lg:space-y-12 bg-background min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 lg:gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 lg:w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-[10px] lg:text-xs">Content Management</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-black tracking-tighter text-white">Manage <span className="text-primary italic">Blogs</span></h1>
        </div>
        <Button onClick={openCreateModal} className="bg-primary text-secondary-foreground hover:bg-white rounded-xl font-bold text-sm lg:text-base px-4 lg:px-6 py-2 lg:py-3">
          <Plus size={16} className="mr-2" />
          Create Blog
        </Button>
      </div>

      <div className="bg-card border border-border shadow-xl rounded-2xl lg:rounded-3xl overflow-hidden">
        <div className="p-4 lg:p-8 border-b border-border bg-background/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 lg:w-12 h-10 lg:h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <BookOpen size={20} className="lg:w-6 lg:h-6" />
            </div>
            <div>
              <h2 className="text-lg lg:text-xl font-bold text-white">All Blogs</h2>
              <p className="text-xs lg:text-sm text-muted-foreground">{blogs.length} articles found</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-4 lg:p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 lg:h-24 bg-background animate-pulse rounded-xl" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="p-8 lg:p-12 text-center">
            <BookOpen size={40} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No blogs yet. Create your first blog!</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {blogs.map((blog) => (
              <div key={blog.id} className="p-4 lg:p-6 hover:bg-background/30 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                  <div className="w-32 sm:w-40 lg:w-48 h-20 lg:h-24 rounded-xl overflow-hidden bg-background shrink-0">
                    {blog.coverImage || blog.image ? (
                      <Image src={blog.coverImage || blog.image || ''} alt={blog.title} width={192} height={96} className="w-full h-full object-cover" unoptimized />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                        <ImageIcon size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 w-full min-w-[200px]">
                    <h3 className="font-bold text-white text-sm lg:text-lg truncate">{blog.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 lg:gap-3 mt-2">
                      <Badge className={`text-[10px] lg:text-xs ${blog.isPublished ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'}`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <span className="text-[10px] lg:text-xs text-muted-foreground">{blog.category}</span>
                      <span className="text-[10px] lg:text-xs text-muted-foreground hidden sm:inline">•</span>
                      <span className="text-[10px] lg:text-xs text-muted-foreground hidden sm:inline">{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(blog)} className="text-muted-foreground hover:text-white hover:bg-white/10 p-2">
                      <Pencil size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => openDeleteModal(blog)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-2">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange}
        totalItems={totalItems}
        limit={ITEMS_PER_PAGE}
        showLimitSelector={false}
      />

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-card border-border w-[98vw] max-w-[1200px] max-h-[95vh] overflow-y-auto rounded-3xl p-0">
          <div className="sticky top-0 bg-card/95 backdrop-blur-md border-b border-border p-4 lg:p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl lg:text-2xl font-black text-white">{selectedBlog ? 'Edit Blog' : 'Create Blog'}</h2>
                <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                  {selectedBlog ? 'Update your blog content' : 'Create a new blog post'}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-white p-2">
                <X size={20} />
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 lg:p-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter blog title"
                  className="h-12 bg-background/50 border-white/10 rounded-xl text-white focus-visible:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Category *</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Real Estate, Lifestyle, Investment"
                  className="h-12 bg-background/50 border-white/10 rounded-xl text-white focus-visible:border-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Excerpt</Label>
              <Input
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief description of the blog (optional)"
                className="h-12 bg-background/50 border-white/10 rounded-xl text-white focus-visible:border-primary"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Cover Image</Label>
              <div className="border-2 border-dashed border-white/10 rounded-2xl p-4 lg:p-6 hover:border-primary/30 transition-all">
                {formData.coverImage ? (
                  <div className="relative">
                    <Image src={formData.coverImage} alt="Cover" width={800} height={400} className="w-full h-48 lg:h-64 object-cover rounded-xl" unoptimized />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button type="button" variant="secondary" size="sm" onClick={() => window.open(formData.coverImage, '_blank')} className="bg-background/80 text-white hover:bg-background">
                        <Eye size={14} className="mr-1" />
                        Preview
                      </Button>
                      <Button type="button" variant="destructive" size="sm" onClick={() => setFormData({ ...formData, coverImage: '' })} className="bg-red-500/80 hover:bg-red-600">
                        <X size={14} className="mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                    <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage} className="mx-auto flex flex-col items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
                      {uploadingImage ? (
                        <Loader2 size={40} className="animate-spin text-primary" />
                      ) : (
                        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                          <ImagePlus size={32} className="text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-white">Click to upload image</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Content *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog content here..."
                className="min-h-[300px] md:min-h-[400px] lg:min-h-[500px] bg-background/50 border-white/10 rounded-xl text-white focus-visible:border-primary resize-none text-sm lg:text-base leading-relaxed"
                required
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-background/30 rounded-xl">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-5 h-5 rounded border-white/20 bg-background accent-primary"
              />
              <Label htmlFor="isPublished" className="text-sm font-medium text-white cursor-pointer">
                Publish immediately
              </Label>
              {formData.isPublished && (
                <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 ml-auto">
                  Will be visible
                </Badge>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-border">
              <Button type="button" variant="ghost" onClick={() => setModalOpen(false)} className="flex-1 text-muted-foreground hover:text-white rounded-xl h-12">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="flex-1 bg-primary text-secondary-foreground hover:bg-white font-black rounded-xl h-12">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {selectedBlog ? 'Update Blog' : 'Create Blog'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="bg-card border-border rounded-3xl max-w-md p-0">
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-white">Delete Blog</h3>
              <Button variant="ghost" size="sm" onClick={() => setDeleteModalOpen(false)} className="text-muted-foreground hover:text-white p-2">
                <X size={20} />
              </Button>
            </div>
            <div className="flex items-start gap-4 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                <Trash2 size={24} />
              </div>
              <div>
                <p className="text-white font-medium">This action cannot be undone</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Are you sure you want to delete <span className="text-white font-bold">"{selectedBlog?.title}"</span>?
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-6 pt-4">
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)} className="flex-1 text-muted-foreground hover:text-white rounded-xl h-12">
              Cancel
            </Button>
            <Button onClick={handleDelete} disabled={submitting} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl h-12">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}