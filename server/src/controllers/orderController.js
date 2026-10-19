import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty.');
  }
  if (!shippingAddress?.fullName || !shippingAddress?.phone || !shippingAddress?.line1 ||
      !shippingAddress?.city || !shippingAddress?.state || !shippingAddress?.pincode) {
    res.status(400);
    throw new Error('Complete shipping address is required.');
  }

  const session = await mongoose.startSession();

  try {
    let createdOrder;

    await session.withTransaction(async () => {
      const orderItems = [];
      let totalAmount = 0;

      // Re-fetch every product from the DB inside the transaction — never
      // trust price/name sent by the frontend, only the product ID and qty.
      for (const reqItem of items) {
        const product = await Product.findById(reqItem.id).session(session);

        if (!product || !product.isActive) {
          throw Object.assign(new Error(`Product no longer available: ${reqItem.id}`), { statusCode: 400 });
        }

        const qty = Number(reqItem.qty);
        if (!qty || qty < 1) {
          throw Object.assign(new Error(`Invalid quantity for ${product.name}.`), { statusCode: 400 });
        }

        if (product.stock < qty) {
          throw Object.assign(
            new Error(`Insufficient stock for ${product.name}. Only ${product.stock} left.`),
            { statusCode: 409 }
          );
        }

        // Atomic decrement, scoped to the transaction.
        product.stock -= qty;
        await product.save({ session });

        orderItems.push({
          product: product._id,
          name: product.name,
          price: product.price, // authoritative price from DB, not from the request
          qty,
        });

        totalAmount += product.price * qty;
      }

      const orderDocs = await Order.create(
        [
          {
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            totalAmount,
            paymentMethod: 'COD',
            status: 'pending',
          },
        ],
        { session }
      );

      createdOrder = orderDocs[0];
    });

    res.status(201).json({ success: true, order: createdOrder });
  } finally {
    session.endSession();
  }
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  // A customer can only view their own order; an admin can view any order.
  const isOwner = order.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order.');
  }

  res.json({ success: true, order });
});

export const getAllOrders = asyncHandler(async(req,res)=>{
  const {status,page=1,limit=20} = req.query;
  const filter = {};
  if(status) filter.status =status;

  const skip = (Number(page)-1)*Number(limit);

  const [orders,total] = await Promise.all([
    Order.find(filter).populate('user','name email').sort({createdAt:-1}).skip(skip).limit(Number(limit)),
    Order.countDocuments(filter),
  ]);

  res.json({success:true,orders,pagination:{total,page:Number(page),pages:Math.ceil(total/Number(limit))}});
});

export const updateOrderStatus = asyncHandler(async(req,res)=>{
  const {status} = req.body;
  const validStatuses = ['pending','confirmed','shipped','delivered','cancelled'];

  if(!validStatuses.includes(status)){
    res.status(400);
    throw new Error('Invalid order status.')
  }

  const order = await Order.findByIdAndUpdate(req.params.id,{status},{new:true});
  if(!order) {
    res.status(404);
    throw new Error('Order not Found.');
  }

  res.json({success:true,order})
})