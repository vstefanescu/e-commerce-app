import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getAllProducts = async (req: Request, res: Response) => {
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
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

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
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const { title, description, price, imageUrl } = req.body;

    if (!title || !description || !price || !imageUrl) {
      res.status(400).json({ error: 'Missing fields' });
      return
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

    res.json(updateProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const productId = parseInt(id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

export { getProductById };


