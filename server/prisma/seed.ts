import prisma from '../src/prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker/locale/en_IN';

const locations = ['Gulshan', 'Banani', 'Dhanmondi', 'Uttara', 'Baridhara', 'Bashundhara'];
const propertyTypes = ['Luxury Apartment', 'Penthouse', 'Commercial Space', 'Villa'];
const amenitiesList = ['Swimming Pool', 'Gym', 'Parking', 'Garden', 'Security', 'Elevator', 'Generator', 'CCTV'];

async function main() {
  // Clean existing data
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.property.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin
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

  // Create Agents
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

  // Create Users
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

  // Create Properties
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

  // Create some reviews
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

  // Create some blogs
  for (let i = 0; i < 5; i++) {
    await prisma.blog.create({
      data: {
        title: faker.lorem.sentence(),
        slug: faker.lorem.slug(),
        content: faker.lorem.paragraphs(10),
        coverImage: faker.image.url(),
        category: ['Real Estate', 'Investment', 'Interior Design'][i % 3],
        tags: ['property', 'luxury', 'bangladesh'],
        authorId: admin.id,
        isPublished: true,
      },
    });
  }

  console.log('Seed completed successfully!');
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
