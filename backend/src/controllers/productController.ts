import { Request, Response } from "express";
import prisma from "../config/prisma";

// GET TOATE PRODUSELE
export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { page, limit, search = "", minPrice, maxPrice } = req.query;

    if (!page && !limit && !search && !minPrice && !maxPrice) {
      const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.json(products);
      return;
    }

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 6;
    const skip = (pageNumber - 1) * limitNumber;

    const filters: any = {};

    if (search) {
      filters.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.gte = parseFloat(minPrice as string);
      if (maxPrice) filters.price.lte = parseFloat(maxPrice as string);
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filters,
        skip,
        take: limitNumber,
      }),
      prisma.product.count({ where: filters }),
    ]);

    res.json({ products, total });
  } catch (error) {
    console.error("Eroare la getAllProducts:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// GET PRODUS DUPĂ ID
export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// POST CREEAZĂ PRODUS
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, price, imageUrl } = req.body;

    if (!title || !description || !price || !imageUrl) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        imageUrl,
      },
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

// PUT UPDATE PRODUS
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const { title, description, price, imageUrl } = req.body;

    if (!title || !description || !price || !imageUrl) {
      res.status(400).json({ error: "Missing fields" });
      return;
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        title,
        description,
        price: parseFloat(price),
        imageUrl,
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

// DELETE PRODUS
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
