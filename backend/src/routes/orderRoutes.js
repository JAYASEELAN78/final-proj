import express from 'express';
const router = express.Router();
import { createOrder, getOrders, updateOrder } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/', protect, createOrder);
router.get('/', protect, getOrders);
router.put('/:id', protect, updateOrder);

export default router;