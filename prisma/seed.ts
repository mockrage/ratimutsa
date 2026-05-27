import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data to avoid unique constraint errors
  await prisma.auditLog.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.orderRequest.deleteMany();
  await prisma.adminNotification.deleteMany();
  await prisma.inventoryReservation.deleteMany();
  await prisma.preOrder.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.harvestCalendar.deleteMany();
  await prisma.user.deleteMany();

  console.log('Database cleared.');

  // Create admin users with different roles
  // IMPORTANT: Change this password immediately after first login in production!
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);
  console.log(`Using admin seed password: ${adminPassword === 'admin123' ? 'admin123 (DEFAULT - change after login!)' : '(custom)'}`);
  
  const regularAdmin = await prisma.user.upsert({
    where: { email: 'admin@farmland.com' },
    update: { 
      password: hashedPassword,
      role: 'ADMIN',
      adminRole: 'REGULAR_ADMIN'
    },
    create: {
      email: 'admin@farmland.com',
      password: hashedPassword,
      name: 'Regular Admin',
      role: 'ADMIN',
      adminRole: 'REGULAR_ADMIN',
    },
  });

  const seniorAdmin = await prisma.user.upsert({
    where: { email: 'senior@farmland.com' },
    update: { 
      password: hashedPassword,
      role: 'ADMIN',
      adminRole: 'SENIOR_ADMIN'
    },
    create: {
      email: 'senior@farmland.com',
      password: hashedPassword,
      name: 'Senior Admin',
      role: 'ADMIN',
      adminRole: 'SENIOR_ADMIN',
    },
  });

  console.log('Created admin users:', regularAdmin.email, seniorAdmin.email);

  // Create categories
  const categories = [
    { name: 'Vegetables', slug: 'vegetables', description: 'Fresh farm vegetables' },
    { name: 'Poultry', slug: 'poultry', description: 'Farm-raised poultry and eggs' },
    { name: 'Livestock', slug: 'livestock', description: 'Farm-raised livestock' },
    { name: 'Seafood', slug: 'seafood', description: 'Fresh fish and seafood' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('Created categories');

  // Create sample products with variants
  const vegetablesCategory = await prisma.category.findUnique({ where: { slug: 'vegetables' } });
  const poultryCategory = await prisma.category.findUnique({ where: { slug: 'poultry' } });
  const livestockCategory = await prisma.category.findUnique({ where: { slug: 'livestock' } });
  const seafoodCategory = await prisma.category.findUnique({ where: { slug: 'seafood' } });

  // Broilers (Poultry)
  if (poultryCategory) {
    const broilers = await prisma.product.upsert({
      where: { slug: 'broilers' },
      update: {},
      create: {
        name: 'Broilers',
        slug: 'broilers',
        description: 'Premium farm-raised broiler chickens, tender and flavorful',
        price: 8.99,
        quantity: 100,
        unit: 'kg',
        imageUrl: '/images/Broilers.jfif',
        categoryId: poultryCategory.id,
        isSeasonal: false,
        isAvailable: true,
        workflowState: 'PUBLISHED',
        lowStockThreshold: 10,
      },
    });

    await prisma.productVariant.createMany({
      data: [
        {
          productId: broilers.id,
          name: 'Whole Broiler (1.5kg)',
          sku: 'BRL-WHL-1.5',
          b2cPrice: 13.50,
          b2bPrice: 11.50,
          inventory: 50,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 10,
          unit: 'piece',
        },
        {
          productId: broilers.id,
          name: 'Whole Broiler (2kg)',
          sku: 'BRL-WHL-2.0',
          b2cPrice: 18.00,
          b2bPrice: 15.00,
          inventory: 50,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 10,
          unit: 'piece',
        },
      ],
    });
  }

  // Eggs (Poultry)
  if (poultryCategory) {
    const eggs = await prisma.product.upsert({
      where: { slug: 'eggs' },
      update: {},
      create: {
        name: 'Eggs',
        slug: 'eggs',
        description: 'Farm fresh free-range eggs from happy chickens',
        price: 5.99,
        quantity: 200,
        unit: 'tray',
        imageUrl: '/images/Eggs.jfif',
        categoryId: poultryCategory.id,
        isSeasonal: false,
        isAvailable: true,
        workflowState: 'PUBLISHED',
        lowStockThreshold: 20,
      },
    });

    await prisma.productVariant.createMany({
      data: [
        {
          productId: eggs.id,
          name: 'Small Eggs (30 pack)',
          sku: 'EGG-SML-30',
          b2cPrice: 5.99,
          b2bPrice: 4.99,
          inventory: 100,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 5,
          unit: 'tray',
        },
        {
          productId: eggs.id,
          name: 'Large Eggs (30 pack)',
          sku: 'EGG-LRG-30',
          b2cPrice: 7.99,
          b2bPrice: 6.99,
          inventory: 100,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 5,
          unit: 'tray',
        },
      ],
    });

    // Layer Eggs
    await prisma.product.upsert({
      where: { slug: 'layer-eggs' },
      update: {},
      create: {
        name: 'Organic Layer Eggs',
        slug: 'layer-eggs',
        description: 'Premium organic eggs from heritage layers',
        price: 7.50,
        quantity: 150,
        unit: 'tray',
        imageUrl: '/images/eggs1.jfif',
        categoryId: poultryCategory.id,
        isSeasonal: false,
        isAvailable: true,
        workflowState: 'PUBLISHED',
        lowStockThreshold: 15,
      },
    });

    // Bulk Egg Trays
    await prisma.product.upsert({
      where: { slug: 'egg-trays' },
      update: {},
      create: {
        name: 'Bulk Egg Trays',
        slug: 'egg-trays',
        description: 'Bulk trays of farm fresh eggs for commercial use',
        price: 55.00,
        quantity: 50,
        unit: 'box',
        imageUrl: '/images/egg-crates.jfif',
        categoryId: poultryCategory.id,
        isSeasonal: false,
        isAvailable: true,
        workflowState: 'PUBLISHED',
        lowStockThreshold: 5,
      },
    });
  }

  // Tomatoes (Vegetables)
  if (vegetablesCategory) {
    const tomatoes = await prisma.product.upsert({
      where: { slug: 'tomatoes' },
      update: {},
      create: {
        name: 'Tomatoes',
        slug: 'tomatoes',
        description: 'Vine-ripened organic tomatoes, perfect for salads and cooking',
        price: 3.99,
        quantity: 150,
        unit: 'kg',
        imageUrl: '/images/tomato.png',
        categoryId: vegetablesCategory.id,
        isSeasonal: false,
        isAvailable: true,
        workflowState: 'PUBLISHED',
        lowStockThreshold: 20,
      },
    });

    await prisma.productVariant.createMany({
      data: [
        {
          productId: tomatoes.id,
          name: 'Cherry Tomatoes (500g)',
          sku: 'TOM-CHR-0.5',
          b2cPrice: 2.99,
          b2bPrice: 2.49,
          inventory: 75,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 10,
          unit: 'pack',
        },
        {
          productId: tomatoes.id,
          name: 'Regular Tomatoes (1kg)',
          sku: 'TOM-REG-1.0',
          b2cPrice: 3.99,
          b2bPrice: 3.49,
          inventory: 75,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 10,
          unit: 'kg',
        },
      ],
    });
  }

  // Cabbage (Vegetables)
  if (vegetablesCategory) {
    const cabbage = await prisma.product.upsert({
      where: { slug: 'cabbage' },
      update: {},
      create: {
        name: 'Cabbage',
        slug: 'cabbage',
        description: 'Fresh crisp cabbage, perfect for salads and stir-fries',
        price: 2.49,
        quantity: 120,
        unit: 'kg',
        imageUrl: '/images/vegetables.jpg',
        categoryId: vegetablesCategory.id,
        isSeasonal: false,
        isAvailable: true,
        workflowState: 'PUBLISHED',
        lowStockThreshold: 15,
      },
    });

    await prisma.productVariant.createMany({
      data: [
        {
          productId: cabbage.id,
          name: 'Green Cabbage (1 head)',
          sku: 'CAB-GRN-1HD',
          b2cPrice: 2.49,
          b2bPrice: 1.99,
          inventory: 60,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 20,
          unit: 'head',
        },
        {
          productId: cabbage.id,
          name: 'Red Cabbage (1 head)',
          sku: 'CAB-RED-1HD',
          b2cPrice: 2.99,
          b2bPrice: 2.49,
          inventory: 60,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 20,
          unit: 'head',
        },
      ],
    });
  }

  // Pigs (Livestock)
  if (livestockCategory) {
    const pigs = await prisma.product.upsert({
      where: { slug: 'pigs' },
      update: {},
      create: {
        name: 'Pigs',
        slug: 'pigs',
        description: 'Premium farm-raised pigs, high-quality meat',
        price: 150.00,
        quantity: 20,
        unit: 'animal',
        imageUrl: '/images/pork.jfif',
        categoryId: livestockCategory.id,
        isSeasonal: false,
        isAvailable: true,
        workflowState: 'PUBLISHED',
        lowStockThreshold: 5,
      },
    });

    await prisma.productVariant.createMany({
      data: [
        {
          productId: pigs.id,
          name: 'Weaner Pig (20-30kg)',
          sku: 'PIG-WNR-25',
          b2cPrice: 150.00,
          b2bPrice: 130.00,
          inventory: 10,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 5,
          unit: 'animal',
        },
        {
          productId: pigs.id,
          name: 'Finisher Pig (80-100kg)',
          sku: 'PIG-FIN-90',
          b2cPrice: 450.00,
          b2bPrice: 400.00,
          inventory: 10,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 3,
          unit: 'animal',
        },
      ],
    });

    // Pork Cuts
    const pork = await prisma.product.upsert({
      where: { slug: 'pork' },
      update: {},
      create: {
        name: 'Pork',
        slug: 'pork',
        description: 'Premium pork cuts from farm-raised pigs',
        price: 12.99,
        quantity: 80,
        unit: 'kg',
        imageUrl: '/images/pork1.jpeg',
        categoryId: livestockCategory.id,
        isSeasonal: false,
        isAvailable: true,
        workflowState: 'PUBLISHED',
        lowStockThreshold: 10,
      },
    });

    await prisma.productVariant.createMany({
      data: [
        {
          productId: pork.id,
          name: 'Pork Chops (1kg)',
          sku: 'PRK-CHP-1.0',
          b2cPrice: 14.99,
          b2bPrice: 12.99,
          inventory: 40,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 10,
          unit: 'kg',
        },
        {
          productId: pork.id,
          name: 'Pork Ribs (1kg)',
          sku: 'PRK-RIB-1.0',
          b2cPrice: 13.99,
          b2bPrice: 11.99,
          inventory: 40,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 10,
          unit: 'kg',
        },
      ],
    });
  }

  // Beef (Livestock)
  if (livestockCategory) {
    const beef = await prisma.product.upsert({
      where: { slug: 'beef' },
      update: {},
      create: {
        name: 'Beef',
        slug: 'beef',
        description: 'Premium grass-fed beef cuts',
        price: 15.99,
        quantity: 100,
        unit: 'kg',
        imageUrl: '/images/beef.jpeg',
        categoryId: livestockCategory.id,
        isSeasonal: false,
        isAvailable: true,
        workflowState: 'PUBLISHED',
        lowStockThreshold: 15,
      },
    });

    await prisma.productVariant.createMany({
      data: [
        {
          productId: beef.id,
          name: 'Beef Steak (1kg)',
          sku: 'BEF-STK-1.0',
          b2cPrice: 18.99,
          b2bPrice: 16.99,
          inventory: 50,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 10,
          unit: 'kg',
        },
        {
          productId: beef.id,
          name: 'Ground Beef (1kg)',
          sku: 'BEF-GRD-1.0',
          b2cPrice: 13.99,
          b2bPrice: 11.99,
          inventory: 50,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 10,
          unit: 'kg',
        },
      ],
    });
  }

  // Chicken (Poultry)
  if (poultryCategory) {
    const chicken = await prisma.product.upsert({
      where: { slug: 'chicken' },
      update: {},
      create: {
        name: 'Chicken',
        slug: 'chicken',
        description: 'Fresh chicken cuts from free-range birds',
        price: 9.99,
        quantity: 120,
        unit: 'kg',
        imageUrl: '/images/chicken1.jpeg',
        categoryId: poultryCategory.id,
        isSeasonal: false,
        isAvailable: true,
        workflowState: 'PUBLISHED',
        lowStockThreshold: 15,
      },
    });

    await prisma.productVariant.createMany({
      data: [
        {
          productId: chicken.id,
          name: 'Chicken Breast (1kg)',
          sku: 'CHK-BRS-1.0',
          b2cPrice: 11.99,
          b2bPrice: 9.99,
          inventory: 60,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 10,
          unit: 'kg',
        },
        {
          productId: chicken.id,
          name: 'Chicken Thighs (1kg)',
          sku: 'CHK-THG-1.0',
          b2cPrice: 9.99,
          b2bPrice: 8.49,
          inventory: 60,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 10,
          unit: 'kg',
        },
      ],
    });

    // Chicken Cuts
    await prisma.product.upsert({
      where: { slug: 'chicken-cuts' },
      update: {},
      create: {
        name: 'Chicken Cuts',
        slug: 'chicken-cuts',
        description: 'Assorted premium chicken cuts',
        price: 8.99,
        quantity: 90,
        unit: 'kg',
        imageUrl: '/images/chickencuts.jpeg',
        categoryId: poultryCategory.id,
        isSeasonal: false,
        isAvailable: true,
        workflowState: 'PUBLISHED',
        lowStockThreshold: 12,
      },
    });
  }

  // Fish (Seafood)
  if (seafoodCategory) {
    const fish = await prisma.product.upsert({
      where: { slug: 'fish' },
      update: {},
      create: {
        name: 'Fresh Fish',
        slug: 'fish',
        description: 'Fresh fish from local sources',
        price: 14.99,
        quantity: 60,
        unit: 'kg',
        imageUrl: '/images/fish.jpeg',
        categoryId: seafoodCategory.id,
        isSeasonal: false,
        isAvailable: true,
        workflowState: 'PUBLISHED',
        lowStockThreshold: 10,
      },
    });

    await prisma.productVariant.createMany({
      data: [
        {
          productId: fish.id,
          name: 'Whole Fish (1kg)',
          sku: 'FSH-WHL-1.0',
          b2cPrice: 14.99,
          b2bPrice: 12.99,
          inventory: 30,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 5,
          unit: 'kg',
        },
        {
          productId: fish.id,
          name: 'Fish Fillets (1kg)',
          sku: 'FSH-FIL-1.0',
          b2cPrice: 17.99,
          b2bPrice: 15.99,
          inventory: 30,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 5,
          unit: 'kg',
        },
      ],
    });
  }

  // Peppers (Vegetables)
  if (vegetablesCategory) {
    const peppers = await prisma.product.upsert({
      where: { slug: 'peppers' },
      update: {},
      create: {
        name: 'Peppers',
        slug: 'peppers',
        description: 'Fresh colorful peppers, perfect for cooking',
        price: 4.99,
        quantity: 80,
        unit: 'kg',
        imageUrl: '/images/pepper.jpeg',
        categoryId: vegetablesCategory.id,
        isSeasonal: false,
        isAvailable: true,
        workflowState: 'PUBLISHED',
        lowStockThreshold: 15,
      },
    });

    await prisma.productVariant.createMany({
      data: [
        {
          productId: peppers.id,
          name: 'Green Peppers (500g)',
          sku: 'PEP-GRN-0.5',
          b2cPrice: 2.99,
          b2bPrice: 2.49,
          inventory: 40,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 10,
          unit: 'pack',
        },
        {
          productId: peppers.id,
          name: 'Red Peppers (500g)',
          sku: 'PEP-RED-0.5',
          b2cPrice: 3.49,
          b2bPrice: 2.99,
          inventory: 40,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 10,
          unit: 'pack',
        },
      ],
    });
  }

  // Cucumbers (Vegetables)
  if (vegetablesCategory) {
    const cucumbers = await prisma.product.upsert({
      where: { slug: 'cucumbers' },
      update: {},
      create: {
        name: 'Cucumbers',
        slug: 'cucumbers',
        description: 'Fresh crisp cucumbers, perfect for salads',
        price: 2.99,
        quantity: 100,
        unit: 'kg',
        imageUrl: '/images/cucumber.jpeg',
        categoryId: vegetablesCategory.id,
        isSeasonal: false,
        isAvailable: true,
        workflowState: 'PUBLISHED',
        lowStockThreshold: 20,
      },
    });

    await prisma.productVariant.createMany({
      data: [
        {
          productId: cucumbers.id,
          name: 'Regular Cucumbers (1kg)',
          sku: 'CUC-REG-1.0',
          b2cPrice: 2.99,
          b2bPrice: 2.49,
          inventory: 50,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 10,
          unit: 'kg',
        },
        {
          productId: cucumbers.id,
          name: 'Mini Cucumbers (500g)',
          sku: 'CUC-MIN-0.5',
          b2cPrice: 1.99,
          b2bPrice: 1.69,
          inventory: 50,
          minOrderQtyB2C: 1,
          minOrderQtyB2B: 10,
          unit: 'pack',
        },
      ],
    });
  }

  console.log('Created sample products with variants');

  // Create sample announcement
  await prisma.announcement.create({
    data: {
      title: 'Fresh Harvest Available!',
      message: 'New batch of organic vegetables just arrived. Order now while stocks last!',
      type: 'BOTH',
      isActive: true,
    },
  });

  console.log('Created sample announcement');

  // Create sample testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Sarah Johnson',
        content: 'The freshest produce I have ever bought! The tomatoes taste like they came straight from the garden.',
        rating: 5,
        location: 'Springfield',
        isActive: true,
      },
      {
        name: 'Michael Chen',
        content: 'Great quality products and excellent customer service. I order from them every week!',
        rating: 5,
        location: 'Riverside',
        isActive: true,
      },
    ],
  });

  console.log('Created sample testimonials');

  // Create harvest calendar entries
  await prisma.harvestCalendar.createMany({
    data: [
      {
        productName: 'Tomatoes',
        startMonth: 6,
        endMonth: 9,
        description: 'Summer harvest season',
      },
      {
        productName: 'Apples',
        startMonth: 9,
        endMonth: 11,
        description: 'Fall harvest season',
      },
      {
        productName: 'Carrots',
        startMonth: 3,
        endMonth: 11,
        description: 'Spring through fall',
      },
    ],
  });

  console.log('Created harvest calendar entries');

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
