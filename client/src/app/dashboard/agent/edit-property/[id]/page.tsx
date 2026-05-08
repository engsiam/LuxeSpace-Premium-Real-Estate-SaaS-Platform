'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axiosInstance from '@/lib/axiosInstance';
import { ImagePlus, X, Home, Sparkles, CheckCircle2, Loader2, Save, ArrowLeft } from 'lucide-react';
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
  status: z.enum(['AVAILABLE', 'BOOKED', 'SOLD']).default('AVAILABLE'),
});

export default function EditProperty() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
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
      status: 'AVAILABLE',
    },
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axiosInstance.get(`/properties/${id}`);
        const property = response.data.data;

        form.reset({
          title: property.title,
          description: property.description,
          price: property.price,
          location: property.location,
          city: property.city,
          area: property.area,
          bhk: property.bhk,
          size: property.size,
          type: property.type,
          amenities: Array.isArray(property.amenities) ? property.amenities : [],
          status: property.status,
        });

        setExistingImages(property.images || []);
      } catch (error) {
        toast.error('Failed to load property data');
        router.push('/dashboard/agent/my-properties');
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchProperty();
  }, [id, form, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedImages((prev) => [...prev, ...files]);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeNewImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((u) => u !== url));
  };

  const toggleAmenity = (amenity: string) => {
    const current = form.getValues('amenities') || [];
    if (current.includes(amenity)) {
      form.setValue('amenities', current.filter((a) => a !== amenity), { shouldValidate: true, shouldDirty: true });
    } else {
      form.setValue('amenities', [...current, amenity], { shouldValidate: true, shouldDirty: true });
    }
  };

  const onSubmit = async (values: z.infer<typeof propertySchema>) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Explicitly append each field
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('price', values.price.toString());
      formData.append('location', values.location);
      formData.append('city', values.city);
      formData.append('area', values.area);
      formData.append('bhk', values.bhk.toString());
      formData.append('size', values.size.toString());
      formData.append('type', values.type);
      formData.append('status', values.status);

      // Handle amenities correctly
      formData.append('amenities', JSON.stringify(values.amenities));

      // Handle existing images
      formData.append('existingImages', JSON.stringify(existingImages));

      // Handle new images
      selectedImages.forEach((image) => {
        formData.append('images', image);
      });

      await axiosInstance.patch(`/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Property updated successfully!');
      router.push('/dashboard/agent/my-properties');
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Synchronizing Portfolio...</p>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-12 bg-background min-h-screen pb-24">
      <div className="flex justify-between items-center max-w-5xl mx-auto w-full">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-primary font-black uppercase tracking-[0.4em] text-xs">Management Suite</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">Refine <span className="text-primary italic">Property</span></h1>
        </div>
        <Button variant="outline" onClick={() => router.back()} className="rounded-2xl border-white/10 text-white gap-2">
          <ArrowLeft size={18} />
          Back
        </Button>
      </div>

      <div className="bg-card border border-border shadow-2xl rounded-[2.5rem] overflow-hidden p-10 max-w-5xl mx-auto relative">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
            {/* Title & Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground uppercase tracking-widest text-[10px] font-black">Property Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Modern Penthouse" {...field} className="bg-background/50 border-white/10 px-6 text-white h-14 rounded-2xl focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground uppercase tracking-widest text-[10px] font-black">Availability</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-14 bg-background/50 border-white/10 rounded-2xl px-6 text-white">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="AVAILABLE" className="text-emerald-500 font-black">AVAILABLE</SelectItem>
                        <SelectItem value="BOOKED" className="text-amber-500 font-black">BOOKED</SelectItem>
                        <SelectItem value="SOLD" className="text-rose-500 font-black">SOLD</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground uppercase tracking-widest text-[10px] font-black">Exquisite Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Narrate the property's unique charm..."
                      className="min-h-[160px] bg-background/50 border-white/10 px-8 py-6 text-white rounded-[2rem] focus:border-primary text-lg leading-relaxed"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground uppercase tracking-widest text-[10px] font-black">Valuation (BDT)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value as number | string}
                        onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                        className="bg-background/50 border-white/10 px-6 text-white h-14 rounded-2xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground uppercase tracking-widest text-[10px] font-black">Asset Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-14 bg-background/50 border-white/10 rounded-2xl px-6 text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Luxury Apartment">Luxury Apartment</SelectItem>
                        <SelectItem value="Penthouse">Penthouse</SelectItem>
                        <SelectItem value="Commercial Space">Commercial Space</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground uppercase tracking-widest text-[10px] font-black">Dimension (sqft)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value as number | string}
                        onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                        className="bg-background/50 border-white/10 px-6 text-white h-14 rounded-2xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground uppercase tracking-widest text-[10px] font-black">Metropolis</FormLabel>
                      <FormControl>
                        <Input placeholder="Dhaka" {...field} className="bg-background/50 border-white/10 px-6 text-white h-14 rounded-2xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground uppercase tracking-widest text-[10px] font-black">Neighborhood</FormLabel>
                    <FormControl>
                      <Input placeholder="Gulshan" {...field} className="bg-background/50 border-white/10 px-6 text-white h-14 rounded-2xl" />
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
                    <FormLabel className="text-muted-foreground uppercase tracking-widest text-[10px] font-black">Bedrooms</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value as number | string}
                        onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                        className="bg-background/50 border-white/10 px-6 text-white h-14 rounded-2xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Amenities Section */}
            <div className="space-y-8 pt-6 border-t border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white leading-none mb-1">Signature Amenities</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Select multiple features</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {AMENITIES_LIST.map((amenity) => {
                  const isSelected = form.watch('amenities')?.includes(amenity) || false;
                  return (
                    <motion.button
                      key={amenity}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleAmenity(amenity)}
                      className={`flex items-center gap-3 p-5 rounded-2xl border transition-all text-left ${isSelected
                          ? 'bg-primary/10 border-primary text-primary shadow-[0_0_20px_-5px_rgba(201,167,77,0.3)]'
                          : 'bg-background/50 border-white/5 text-muted-foreground hover:border-white/20'
                        }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-primary border-primary' : 'border-white/20'
                        }`}>
                        {isSelected && <CheckCircle2 size={14} className="text-secondary" />}
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest">{amenity}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Visuals Section */}
            <div className="space-y-8 pt-6 border-t border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <ImagePlus size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white leading-none mb-1">Portfolio Visuals</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Manage your gallery</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Existing Images */}
                {existingImages.map((url, index) => (
                  <div key={`existing-${index}`} className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group">
                    <Image src={url} alt="Property" fill className="object-cover transition-transform group-hover:scale-110 duration-500" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      className="absolute top-3 right-3 bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-[8px] font-black uppercase text-primary border border-primary/20">Current</div>
                  </div>
                ))}

                {/* New Image Previews */}
                {previews.map((preview, index) => (
                  <div key={`new-${index}`} className="relative aspect-video rounded-2xl overflow-hidden border-2 border-primary/30 group">
                    <Image src={preview} alt="New Preview" fill className="object-cover transition-transform group-hover:scale-110 duration-500" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-3 right-3 bg-rose-500 text-white p-2 rounded-full hover:bg-rose-600 transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-primary/80 backdrop-blur-md px-3 py-1 rounded-lg text-[8px] font-black uppercase text-secondary-foreground">New Asset</div>
                  </div>
                ))}

                <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/5 transition-all group">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                    <ImagePlus className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-center">Add Media</span>
                  <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            <div className="flex justify-center pt-10">
              <Button
                type="submit"
                disabled={loading}
                className="w-full max-w-md h-20 text-xl bg-primary text-secondary-foreground rounded-[2rem] font-black shadow-[0_20px_40px_-10px_rgba(201,167,77,0.4)] hover:shadow-[0_25px_50px_-10px_rgba(201,167,77,0.5)] hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center gap-4"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Save className="w-6 h-6" />}
                <span>{loading ? 'SYNCHRONIZING...' : 'UPDATE PORTFOLIO'}</span>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
