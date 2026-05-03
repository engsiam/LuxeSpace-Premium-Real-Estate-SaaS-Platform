'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';
import { ImagePlus, X, Home } from 'lucide-react';
import Image from 'next/image';

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  location: z.string().min(2, 'Location is required'),
  city: z.string().min(2, 'City is required'),
  area: z.string().min(2, 'Area is required'),
  bhk: z.coerce.number().int().positive('BHK must be positive'),
  size: z.coerce.number().int().positive('Size must be positive'),
  type: z.string().min(2, 'Property type is required'),
});

export default function AddProperty() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const form = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      location: '',
      city: '',
      area: '',
      bhk: 1,
      size: 0,
      type: '',
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...files]);
      
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: z.infer<typeof propertySchema>) => {
    if (selectedImages.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });
      
      selectedImages.forEach((image) => {
        formData.append('images', image);
      });

      await axiosInstance.post('/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Property added successfully!');
      router.push('/dashboard/agent/my-properties');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 space-y-12 bg-background min-h-screen">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-0.5 bg-primary rounded-full" />
          <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Property Management</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Add <span className="text-primary italic">Property</span></h1>
      </div>

      <div className="bg-card border border-border shadow-2xl rounded-[2.5rem] overflow-hidden p-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Home size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Property Details</h2>
            <p className="text-sm text-muted-foreground">Fill in the information below</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Property Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Modern Penthouse in Gulshan" {...field} className="bg-background/50 border-white/10 px-6 text-white placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the property, amenities, etc." 
                      className="min-h-[120px] bg-background/50 border-white/10 px-6 py-4 text-white placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Price (BDT)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value as any} className="bg-background/50 border-white/10 px-6 text-white focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">City</FormLabel>
                    <FormControl>
                      <Input placeholder="Dhaka" {...field} className="bg-background/50 border-white/10 px-6 text-white placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Gulshan 2" {...field} className="bg-background/50 border-white/10 px-6 text-white placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="area"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Area (Thana/Block)</FormLabel>
                    <FormControl>
                      <Input placeholder="Road 12" {...field} className="bg-background/50 border-white/10 px-6 text-white placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bhk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">BHK</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value as any} className="bg-background/50 border-white/10 px-6 text-white focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">Size (sqft)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value as any} className="bg-background/50 border-white/10 px-6 text-white focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Property Type</FormLabel>
                  <Select onValueChange={(val) => field.onChange(val || '')} defaultValue={field.value as string}>
                    <FormControl>
                      <SelectTrigger className="h-14 bg-background/50 border-white/10 rounded-2xl px-6 text-white focus:ring-primary/20 transition-all">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="Luxury Apartment" className="text-white focus:bg-primary/10">Luxury Apartment</SelectItem>
                      <SelectItem value="Penthouse" className="text-white focus:bg-primary/10">Penthouse</SelectItem>
                      <SelectItem value="Commercial Space" className="text-white focus:bg-primary/10">Commercial Space</SelectItem>
                      <SelectItem value="Villa" className="text-white focus:bg-primary/10">Villa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel className="text-muted-foreground">Property Images</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-border">
                    <Image 
                      src={preview} 
                      alt={`Preview ${index}`} 
                      fill 
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-card transition-colors">
                  <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground text-center px-2">Click to upload</span>
                  <input 
                    type="file" 
                    multiple 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full max-w-md h-16 text-xl bg-primary text-secondary-foreground rounded-[2rem] font-black shadow-[0_0_40px_-10px_rgba(201,167,77,0.4)] hover:shadow-[0_0_50px_-5px_rgba(201,167,77,0.5)] hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? 'PUBLISHING LISTING...' : 'CREATE LISTING'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
