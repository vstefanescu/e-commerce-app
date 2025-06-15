import { Router, Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ message: "Niciun fișier primit." });
    return;
  }

  const baseUrl = process.env.BASE_URL?.replace(/\/$/, "");
  const filename = req.file.filename;
  const imageUrl = `${baseUrl}/uploads/${filename}`;

  console.log("✅ Upload complet:", imageUrl);
  res.status(200).json({ imageUrl });
});

export default router;