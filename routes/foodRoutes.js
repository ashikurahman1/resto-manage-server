import express from 'express';
import { getFoods, createFood } from '../controllers/foodController.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getFoods);

router.post('/', verifyToken, isAdmin, createFood);

export default router;
