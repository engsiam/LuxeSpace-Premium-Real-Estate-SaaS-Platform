import prisma from '../src/prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker/locale/en_IN';

const locations = ['Gulshan', 'Banani', 'Dhanmondi', 'Uttara', 'Baridhara', 'Bashundhara'];
const propertyTypes = ['Luxury Apartment', 'Penthouse', 'Commercial Space', 'Villa'];
const amenitiesList = ['Swimming Pool', 'Gym', 'Parking', 'Garden', 'Security', 'Elevator', 'Generator', 'CCTV'];

async function main() {
  await prisma.booking.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.review.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.property.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@luxespace.com',
      password: adminPassword,
      role: 'ADMIN',
      phone: '+8801711111111',
    },
  });

  const agents = [];
  for (let i = 0; i < 3; i++) {
    const agentPassword = await bcrypt.hash('Agent@123', 12);
    const agent = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: `agent${i + 1}@luxespace.com`,
        password: agentPassword,
        role: 'AGENT',
        phone: faker.phone.number('+8801#########'),
        avatar: faker.image.avatar(),
      },
    });
    agents.push(agent);
  }

  const users = [];
  for (let i = 0; i < 10; i++) {
    const userPassword = await bcrypt.hash('User@123', 12);
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: `user${i + 1}@luxespace.com`,
        password: userPassword,
        role: 'USER',
        phone: faker.phone.number('+8801#########'),
        avatar: faker.image.avatar(),
      },
    });
    users.push(user);
  }

  const properties = [];
  for (let i = 0; i < 30; i++) {
    const agent = agents[i % agents.length];
    const property = await prisma.property.create({
      data: {
        title: `${faker.location.street()} ${propertyTypes[i % propertyTypes.length]}`,
        description: faker.lorem.paragraphs(3),
        price: faker.number.int({ min: 2000000, max: 50000000 }),
        location: locations[i % locations.length],
        city: 'Dhaka',
        area: faker.location.street(),
        bhk: faker.number.int({ min: 1, max: 5 }),
        size: faker.number.int({ min: 800, max: 5000 }),
        type: propertyTypes[i % propertyTypes.length],
        images: [faker.image.url(), faker.image.url(), faker.image.url()],
        amenities: amenitiesList.slice(0, faker.number.int({ min: 3, max: 8 })),
        status: 'AVAILABLE',
        isFeatured: i < 8,
        agentId: agent.id,
      },
    });
    properties.push(property);
  }

  for (let i = 0; i < 20; i++) {
    const user = users[i % users.length];
    const property = properties[i % properties.length];
    await prisma.review.create({
      data: {
        userId: user.id,
        propertyId: property.id,
        rating: faker.number.int({ min: 3, max: 5 }),
        comment: faker.lorem.sentence(),
      },
    });
  }

  const blogContents = [
    {
      title: "10 Essential Tips for First-Time Home Buyers in Bangladesh",
      slug: "10-essential-tips-first-time-home-buyers-bangladesh",
      content: `Buying your first home is one of the most significant decisions you'll ever make. In Bangladesh's dynamic real estate market, knowing what to look for can make all the difference.

First, establish your budget. Consider not just the property price but also registration costs, taxes, and potential renovation expenses. Banks offer various home loan products, so compare interest rates carefully.

Location is everything. In Dhaka, proximity to your workplace, schools, and healthcare facilities should be top priorities. Areas like Gulshan, Banani, and Dhanmondi remain premium, but emerging neighborhoods offer good value.

Always verify the property documents. Ensure clear title deeds and no encumbrances. Engage a qualified lawyer who specializes in property law.

Consider the builder's reputation. Established developers with track records are generally safer bets.

Inspect the property multiple times, at different times of day. Check water supply, electricity, and parking facilities.

Don't rush. Take your time to compare options. The perfect property is worth the wait.

Lastly,Trust your instincts. If something feels off, walk away. There are always other options in the market.`
    },
    {
      title: "Investment Properties: Why Gulshan is the Smart Choice",
      slug: "investment-properties-gulshan-smart-choice",
      content: `Gulshan remains Dhaka's most prestigious neighborhood, and for good reason. Here's why smart investors flock here:

Strategic Location: Gulshan offers unparalleled connectivity to business districts, embassies, and international schools.

High Rental Yields: Properties in Gulshan command premium rents, often yielding 6-8% annually.

Capital Appreciation: Real estate in Gulshan has consistently appreciated over the years, making it a safe investment.

Quality Tenants: The area attracts expatriates, diplomats, and corporate executives - reliable tenants who pay on time.

Infrastructure: Excellent roads, reliable utilities, and world-class amenities make it continuously desirable.

When investing in Gulshan, consider both residential and commercial properties. Commercial spaces in main roads command premium rentals.

The key is buying during market downturns when prices are reasonable, then holding for long-term appreciation.`
    },
    {
      title: "Luxury Living Redefined: The Penthouse Trend",
      slug: "luxury-living-redefined-penthouse-trend",
      content: `Penthouse living has become the ultimate status symbol in Dhaka. These rooftop residences offer:

360-Degree Views: Panoramic views of the city skyline, especially stunning at night.

Privacy: No shared walls or neighbors above. Complete seclusion.

Premium Amenities: Private terraces, jacuzzis, and personal elevators.

Space: Expansive layouts exceeding 5,000 square feet in some cases.

Modern Design: Smart home technology, Italian marble, and premium fixtures.

For the ultra-high-net-worth individuals, penthouses in Banani and Gulshan command prices upwards of 10 crore takah.

The trend shows no signs of slowing. New developments constantly push boundaries with innovative features.`
    },
    {
      title: "Commercial Real Estate: The New Investment Frontier",
      slug: "commercial-real-estate-new-investment-frontier",
      content: `Beyond residential, commercial real estate in Bangladesh offers exceptional opportunities:

Office Spaces: Demand for Grade A offices in prime locations remains high, driven by multinational companies.

Retail: Shopping complexes in strategic locations guarantee consistent returns.

Warehousing: E-commerce growth has created massive demand for logistics spaces.

Hotels: Tourism growth makes hotel investments increasingly attractive.

Commercial properties typically offer higher yields than residential - often 8-12% annually.

However, they require more due diligence. Location, tenant quality, and lease terms are critical.

Work with established developers and ensure proper rental agreements before purchasing.`
    },
    {
      title: "Interior Design Tips for Modern Bangladeshi Homes",
      slug: "interior-design-tips-modern-bangladeshi-homes",
      content: `Creating a modern home in Bangladesh requires balancing aesthetics with practicality:

Space Optimization: Use multi-functional furniture. In smaller apartments, every inch counts.

Natural Light: Maximize windows and use light colors to create spaciousness.

Ventilation: Essential in Dhaka's climate. Ceiling fans and cross-ventilation matter.

Local Materials: Incorporate Bengali craftsmanship - jamdani textiles, bamboo furniture, terracotta accents.

Color Palette: Soft neutrals with bold accent colors work well. Consider gold and emerald as accent colors.

Outdoor Living: Balconies and terraces can become extended living spaces with proper planning.

Technology: Smart home systems are increasingly affordable and practical.

Storage: Custom built-ins maximize every corner.

Hire professionals who understand local climate and lifestyle needs. The best designs merge modern comfort with Bengali cultural elements.`
    },
    {
      title: "Understanding Property Registration Process in Bangladesh",
      slug: "understanding-property-registration-process-bangladesh",
      content: `Navigating property registration in Bangladesh involves several steps:

Document Verification: Ensure all documents are authentic. Check khatiyan, mutation records, and development levy receipts.

Title Search: Conduct at the local sub-registry office. This reveals any encumbrances.

Token Money: Pay to show intent, typically 10-20% of the agreed price.

Registration: Visit the sub-registry office with all parties. Pay stamp duty and registration fees.

Mutation: After registration, update the khatiyan in the new owner's name.

Taxes: Property transfer tax varies. Consult a tax professional.

Process times vary by area. In Dhaka, it can take 2-4 weeks.

Always engage a qualified lawyer. Their fee is worth the peace of mind.`
    },
    {
      title: "Future of Dhaka Real Estate: 2026 and Beyond",
      slug: "future-dhaka-real-estate-2026-and-beyond",
      content: `Dhaka's real estate landscape is evolving rapidly:

Emerging Areas: Uttara, Purbachal, and Badda offer new opportunities.

Transit-Oriented Development: Properties near metro stations command premium prices.

Sustainability: Green buildings are gaining preference. LEED-certified properties command higher values.

Technology: Virtual property tours and digital transactions are becoming standard.

Mixed-Use: Developments combining residential, commercial, and retail are increasingly popular.

Affordable Housing: Government initiatives support affordable housing projects.

Smart Cities: Concepts like Bashundhara R/A are redefining urban living.

Investors should watch these trends carefully. Location remains key, but emerging areas offer significant upside potential.`
    }
  ];

  for (const blog of blogContents) {
    await prisma.blog.create({
      data: {
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        coverImage: faker.image.url(),
        authorId: admin.id,
        isPublished: true,
      },
    });
  }

  await prisma.settings.create({
    data: {
      siteName: 'LuxeSpace',
      heroTitle: 'Discover Your Dream Property',
      heroSubtitle: 'Bangladesh\'s Premier Luxury Real Estate Platform',
    },
  });

  console.log('Seed completed!');
  console.log('Admin: admin@luxespace.com / Admin@123');
  console.log('Agent: agent1@luxespace.com / Agent@123');
  console.log('User: user1@luxespace.com / User@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });