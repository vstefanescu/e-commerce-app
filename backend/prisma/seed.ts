import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  // Ia datele reale din API
  const response = await fetch('https://fakestoreapi.com/products');
  const products = await response.json() as any[];

  // Adaptare: produsele au { title, description, price, image }
  const data = products.map((p: any) => ({
    title: p.title,
    description: p.description,
    price: Number(p.price),
    imageUrl: p.image,
  }));

  await prisma.product.createMany({ data });
  console.log('Seeded with real products from fakestoreapi!');
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
