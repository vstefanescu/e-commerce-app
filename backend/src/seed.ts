import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      title: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation.',
      price: 99.99,
      imageUrl: 'https://example.com/headphones.jpg',
    },
    {
      title: 'Gaming Mouse',
      description: 'Ergonomic gaming mouse with customizable buttons.',
      price: 59.99,
      imageUrl: 'https://example.com/mouse.jpg',
    },
    {
      title: 'Mechanical Keyboard',
      description: 'RGB-backlit mechanical keyboard with blue switches.',
      price: 89.99,
      imageUrl: 'https://example.com/keyboard.jpg',
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('🌱 Seeded database with demo products');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
