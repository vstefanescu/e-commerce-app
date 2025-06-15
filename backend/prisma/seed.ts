import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { RequestInfo, RequestInit } from "node-fetch";

const fetch = async (url: RequestInfo, init?: RequestInit) => {
  const mod = await import("node-fetch");
  return mod.default(url, init);
};

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  const response = await fetch("https://fakestoreapi.com/products");
  const products = (await response.json()) as any[];

  const data = products.map((p: any) => ({
    title: p.title,
    description: p.description,
    price: Number(p.price),
    imageUrl: p.image,
  }));

  await prisma.product.createMany({ data });
  console.log("✅ Seeded with products from fakestoreapi!");

  const hashedPassword = await bcrypt.hash("admin", 10);

  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log(
    "✅ Admin user created with email: admin@gmail.com / password: admin"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
