import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";

const router = Router();

// Obține toate produsele
router.get("/", getAllProducts);

// Obține un produs după ID
router.get("/:id", getProductById);

// Creează un produs nou
router.post("/", createProduct);

// Actualizează un produs
router.put("/:id", updateProduct);

// Șterge un produs
router.delete("/:id", deleteProduct);

export default router;
