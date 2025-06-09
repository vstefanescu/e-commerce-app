import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};


export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, description, price, imageUrl } = req.body;

    if (!title || !description || !price || !imageUrl) {
      res.status(400).json({ error: 'Missing fields' });
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
    res.status(500).json({ error: 'Failed to create product' });
  }
};

