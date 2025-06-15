import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import productRoutes from "./routes/productRoutes";
import authroutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import uploadRoute from "./routes/upload"; // 👈 Ruta nouă de upload

dotenv.config();
const app = express();

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(","),
    credentials: true,
  })
);

// Parse JSON
app.use(express.json());

// Rute API
app.use("/api/auth", authroutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api", uploadRoute); // 👈 Adaugă ruta de upload

// Servește imaginile din folderul uploads/
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Test
app.get("/api/hello", (_req, res) => {
  res.json({ message: "Hello from backend!" });
});

// Pornire server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});