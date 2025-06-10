import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/productRoutes';
import authroutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'https://e-commerce-frontend-jade-two.vercel.app',
  credentials: true
}));

app.use(express.json());
app.use('/api/auth', authroutes);
app.use('/api', userRoutes);

app.use('/api/products', productRoutes);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
