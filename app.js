import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Restaurant Management Server is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);

export default app;
