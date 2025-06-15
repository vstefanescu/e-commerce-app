import { Router } from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { requireAdmin } from "../middlewares/requireAdmin";
import {
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
  getAdminStats,
} from "../controllers/adminController";

const router = Router();

router.get("/users", authenticateToken, requireAdmin, getAllUsers);
router.get("/users/:id", authenticateToken, requireAdmin, getUserById);
router.delete("/users/:id", authenticateToken, requireAdmin, deleteUser);
router.patch("/users/:id", authenticateToken, requireAdmin, updateUser);
router.get("/stats", authenticateToken, requireAdmin, getAdminStats);

export default router;