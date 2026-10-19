import express from 'express';
import {protect} from '../middleware/authMiddleware.js';
import {adminOnly} from '../middleware/adminMiddleware.js';
import { getDashboardSummary } from '../controllers/adminDashboardController.js';
import { getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { getCustomers } from '../controllers/userController.js';

const router = express.Router();

router.use(protect,adminOnly);

router.get('/dashboard',getDashboardSummary);
router.get('/orders',getAllOrders);
router.put('/orders/:id/status',updateOrderStatus);
router.get('/customers',getCustomers);

export default router;