import express from 'express';
import { verifyToken, isAdmin } from '../middlewares/authMiddleware.js';
import {
  createOrder,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

router.post('/', verifyToken, createOrder);

router.get('/', verifyToken, isAdmin, getOrders);
router.put('/:id', verifyToken, isAdmin, updateOrderStatus);

export default router;
