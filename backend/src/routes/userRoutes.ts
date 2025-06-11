import { Router } from 'express';
import { authenticateToken } from '../middlewares/authenticateToken';
import { requireAdmin } from '../middlewares/requireAdmin';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/profile', authenticateToken, (req, res) => {
  console.log('Decoded user:', req.user);
  res.json({
    message: 'Access granted!',
    user: req.user
  });
});

router.get('/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

router.patch('/admin/users/:id/promote', authenticateToken, requireAdmin, async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: 'admin' }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to promote user' });
  }
});


export default router;
