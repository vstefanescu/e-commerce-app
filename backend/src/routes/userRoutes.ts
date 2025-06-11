import { Request, Response, Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { requireAdmin } from "../middlewares/requireAdmin";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get(
  "/profile",
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ message: "No user in token" });
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json({
        message: "Access granted!",
        user,
      });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.get(
  "/admin/users",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  }
);

router.patch(
  "/admin/users/:id/promote",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const userId = parseInt(req.params.id);
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: "admin" },
      });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to promote user" });
    }
  }
);

export default router;
