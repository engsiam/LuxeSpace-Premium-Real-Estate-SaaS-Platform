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
import { ImagePlus, X, Home, Sparkles, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const AMENITIES_LIST = [
  'Swimming Pool',
  'Gym/Fitness Center',
  'Smart Home System',
  'Private Garden',
  'Concierge Service',
  'High-Speed WiFi',
  '24/7 Security',
  'Parking Space',
  'Helipad Access',
  'Wine Cellar',
  'Home Cinema',
  'Spa/Sauna',
];

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
  amenities: z.array(z.string()).default([]),
});

export default function AddProperty() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const form = useForm<
    z.infer<typeof propertySchema>
  >({
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
      amenities: [] as string[],
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

  const toggleAmenity = (amenity: string) => {
    const current =
      (form.getValues('amenities') as string[]) || [];

    if (current.includes(amenity)) {
      form.setValue(
        'amenities',
        current.filter((a) => a !== amenity)
      );
    } else {
      form.setValue('amenities', [
        ...current,
        amenity,
      ]);
    }
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
        if (key === 'amenities') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
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
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-4 md:space-y-6 lg:space-y-12 bg-background min-h-screen">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-0.5 bg-primary rounded-full" />
          <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Property Management</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Add <span className="text-primary italic">Property</span></h1>
      </div>

      <div className="bg-card border border-border shadow-2xl rounded-xl lg:rounded-[2.5rem] overflow-hidden p-4 md:p-6 lg:p-10 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Home size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Property Details</h2>
            <p className="text-sm text-muted-foreground">Fill in the information below</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 md:space-y-8 lg:space-y-10">
            <div className="space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">Price (BDT)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} value={field.value as any} className="bg-background/50 border-white/10 px-4 md:px-6 text-white h-12 md:h-14 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20" />
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
                        <Input placeholder="Dhaka" {...field} className="bg-background/50 border-white/10 px-4 md:px-6 text-white placeholder:text-muted-foreground h-12 md:h-14 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20" />
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
                        <Input placeholder="Gulshan 2" {...field} className="bg-background/50 border-white/10 px-4 md:px-6 text-white placeholder:text-muted-foreground h-12 md:h-14 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/20" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
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
                        <SelectTrigger className="h-12 md:h-14 bg-background/50 border-white/10 rounded-xl lg:rounded-2xl px-4 md:px-6 text-white focus:ring-primary/20 transition-all">
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
            </div>

            {/* Amenities Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Sparkles className="text-primary w-5 h-5" />
                <FormLabel className="text-lg font-black text-white m-0">Signature Amenities</FormLabel>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {AMENITIES_LIST.map((amenity) => {
                  const selectedAmenities = form.watch('amenities') || [];
                  const isSelected = Array.isArray(selectedAmenities) && selectedAmenities.includes(amenity);
                  return (
                    <motion.button
                      key={amenity}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleAmenity(amenity)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${isSelected
                        ? 'bg-primary/10 border-primary text-primary shadow-[0_0_20px_-5px_rgba(201,167,77,0.3)]'
                        : 'bg-background/50 border-white/5 text-muted-foreground hover:border-white/20'
                        }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary' : 'border-white/20'
                        }`}>
                        {isSelected && <CheckCircle2 size={14} className="text-secondary" />}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">{amenity}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3">
                <ImagePlus className="text-primary w-4 h-4 md:w-5 md:h-5" />
                <FormLabel className="text-base md:text-lg font-black text-white m-0">Property Visuals</FormLabel>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                {previews.map((preview, index) => (
                  <div key={index} className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group">
                    <Image
                      src={preview}
                      alt={`Preview ${index}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-110 duration-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 shadow-xl"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 transition-all group">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
                    <ImagePlus className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Add Media</span>
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

            <div className="flex justify-center pt-6 md:pt-8 lg:pt-10">
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
