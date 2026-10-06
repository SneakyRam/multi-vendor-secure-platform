import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  try {
    // Clear existing data (in reverse dependency order to avoid FK constraints)
    console.log('Clearing existing data...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.orderGroup.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.vendor.deleteMany();
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();

    // Prepare passwords
    console.log('Hashing passwords...');
    const adminPassword = await argon2.hash('Admin123!');
    const defaultPassword = await argon2.hash('Password123!');

    // Create Admin
    console.log('Creating Admin...');
    await prisma.user.create({
      data: {
        email: 'admin@markethub.local',
        passwordHash: adminPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
      }
    });

    // Create Vendors with their profiles
    console.log('Creating Vendors...');
    const vendorUser1 = await prisma.user.create({
      data: {
        email: 'vendor1@markethub.local',
        passwordHash: defaultPassword,
        role: 'VENDOR',
        status: 'ACTIVE',
        vendor: {
          create: {
            businessName: 'Vendor One Electronics',
            description: 'Best electronics in town.',
            supportEmail: 'support@vendor1.local',
          }
        }
      },
      include: { vendor: true }
    });

    const vendorUser2 = await prisma.user.create({
      data: {
        email: 'vendor2@markethub.local',
        passwordHash: defaultPassword,
        role: 'VENDOR',
        status: 'ACTIVE',
        vendor: {
          create: {
            businessName: 'Vendor Two Gadgets',
            description: 'Gadgets and more.',
            supportEmail: 'support@vendor2.local',
          }
        }
      },
      include: { vendor: true }
    });

    // Create Customers
    console.log('Creating Customers...');
    await prisma.user.create({
      data: {
        email: 'customer1@markethub.local',
        passwordHash: defaultPassword,
        role: 'CUSTOMER',
        status: 'ACTIVE',
      }
    });

    await prisma.user.create({
      data: {
        email: 'customer2@markethub.local',
        passwordHash: defaultPassword,
        role: 'CUSTOMER',
        status: 'ACTIVE',
      }
    });

    // Create Categories
    console.log('Creating Categories...');
    const electronics = await prisma.category.create({
      data: {
        name: 'Electronics',
        slug: 'electronics',
      }
    });

    const laptops = await prisma.category.create({
      data: {
        name: 'Laptops',
        slug: 'laptops',
        parentId: electronics.id,
      }
    });

    // Create Products
    console.log('Creating Products...');
    await prisma.product.createMany({
      data: [
        {
          vendorId: vendorUser1.vendor!.id,
          categoryId: laptops.id,
          name: 'Pro Laptop 15',
          description: 'A very powerful 15 inch laptop.',
          price: 1500.00,
          inventoryCount: 10,
        },
        {
          vendorId: vendorUser1.vendor!.id,
          categoryId: laptops.id,
          name: 'Budget Laptop 14',
          description: 'An affordable 14 inch laptop.',
          price: 500.00,
          inventoryCount: 50,
        },
        {
          vendorId: vendorUser1.vendor!.id,
          categoryId: electronics.id,
          name: 'Wireless Mouse',
          description: 'Ergonomic wireless mouse.',
          price: 25.00,
          inventoryCount: 100,
        },
        {
          vendorId: vendorUser2.vendor!.id,
          categoryId: laptops.id,
          name: 'Gaming Laptop 17',
          description: 'High performance gaming laptop.',
          price: 2500.00,
          inventoryCount: 5,
        },
        {
          vendorId: vendorUser2.vendor!.id,
          categoryId: electronics.id,
          name: 'Mechanical Keyboard',
          description: 'RGB mechanical keyboard.',
          price: 120.00,
          inventoryCount: 20,
        },
      ]
    });

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
