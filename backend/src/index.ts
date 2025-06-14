import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import productRoutes from "./routes/productRoutes";
import authroutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(","),
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authroutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);     // ex: GET /api/admin/users, DELETE /api/admin/users/:id
app.use("/api/products", productRoutes);

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
