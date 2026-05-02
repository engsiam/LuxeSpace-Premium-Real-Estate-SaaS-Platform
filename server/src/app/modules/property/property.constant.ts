
export const PLACEHOLDER_PROPERTIES = [
  {
    id: 'placeholder-1',
    title: 'Modern Luxury Villa in Gulshan',
    description: 'A stunning 5-bedroom villa with a private pool and landscaped garden. Features high-end finishes, smart home automation, and 24/7 security. Perfect for families looking for elegance and comfort.',
    price: 85000000,
    location: 'Gulshan 2, Dhaka',
    city: 'Dhaka',
    area: 'Gulshan',
    bhk: 5,
    size: 4500,
    type: 'Villa',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop'
    ],
    amenities: ['Pool', 'Garden', 'Smart Home', 'Security', 'Parking', 'Gym'],
    status: 'AVAILABLE',
    isFeatured: true,
    agent: {
      id: 'agent-1',
      name: 'Sarah Rahman',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    },
    _count: { reviews: 12 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'placeholder-2',
    title: 'Elegant Apartment in Banani',
    description: 'Spacious 3-bedroom apartment with panoramic city views. Located in a prime area with easy access to shopping malls and restaurants. Includes modern kitchen and designer bathrooms.',
    price: 32000000,
    location: 'Banani Road 11, Dhaka',
    city: 'Dhaka',
    area: 'Banani',
    bhk: 3,
    size: 2200,
    type: 'Apartment',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop'
    ],
    amenities: ['Elevator', 'Security', 'Generator', 'Parking', 'Balcony'],
    status: 'AVAILABLE',
    isFeatured: true,
    agent: {
      id: 'agent-2',
      name: 'Ahmed Karim',
      avatar: 'https://i.pravatar.cc/150?u=ahmed'
    },
    _count: { reviews: 8 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'placeholder-3',
    title: 'Contemporary Penthouse in Uttara',
    description: 'Exclusive 4-bedroom penthouse with a large private terrace. Features open-plan living, floor-to-ceiling windows, and premium appliances. Enjoy luxury living in the heart of Uttara.',
    price: 45000000,
    location: 'Sector 4, Uttara, Dhaka',
    city: 'Dhaka',
    area: 'Uttara',
    bhk: 4,
    size: 3500,
    type: 'Penthouse',
    images: [
      'https://images.unsplash.com/photo-1600607687940-4e7a002ed84d?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070&auto=format&fit=crop'
    ],
    amenities: ['Terrace', 'Security', 'Smart Home', 'Parking', 'View'],
    status: 'AVAILABLE',
    isFeatured: true,
    agent: {
      id: 'agent-3',
      name: 'Nadia Islam',
      avatar: 'https://i.pravatar.cc/150?u=nadia'
    },
    _count: { reviews: 5 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'placeholder-4',
    title: 'Premium Office Space in Dhanmondi',
    description: 'High-visibility commercial space ideal for corporate offices or showrooms. Located on a busy main road with ample parking and excellent connectivity.',
    price: 55000000,
    location: 'Satmasjid Road, Dhanmondi, Dhaka',
    city: 'Dhaka',
    area: 'Dhanmondi',
    bhk: 0,
    size: 2800,
    type: 'Commercial',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop'
    ],
    amenities: ['Elevator', 'Security', 'Central AC', 'Parking', 'Generator'],
    status: 'AVAILABLE',
    isFeatured: false,
    agent: {
      id: 'agent-1',
      name: 'Sarah Rahman',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    },
    _count: { reviews: 3 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
