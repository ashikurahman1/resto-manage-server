import express from 'express';
import {
  getFoods,
  createFood,
  updateFood,
  deleteFood,
} from '../controllers/foodController.js';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getFoods);

router.post('/', verifyToken, isAdmin, createFood);

router.put('/:id', verifyToken, isAdmin, updateFood);
router.delete('/:id', verifyToken, isAdmin, deleteFood);

export default router;
