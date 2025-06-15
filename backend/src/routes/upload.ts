import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config(); // 🟢 Asigură-te că ai acces la .env

const router = Router();

// Creează folderul uploads dacă nu există
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurare multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, unique);
  },
});

const upload = multer({ storage });

// Ruta POST /api/upload
router.post("/upload", upload.single("file"), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ message: "Niciun fișier primit." });
    return;
  }

  const baseUrl = process.env.BASE_URL?.replace(/\/$/, ""); // 🔒 elimină slash-ul final dacă există
  const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

  console.log("✅ Upload complet:", imageUrl);
  res.status(200).json({ imageUrl });
});

export default router;