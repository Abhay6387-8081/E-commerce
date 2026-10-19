import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import {asyncHandler} from '../utils/asyncHandler.js';

export const getDashboardSummary = asyncHandler(async(req,res)=>{
    const [totalOrders,totalProducts,totalCustomers,recentOrders,salesAgg] = await Promise.all([
        Order.countDocuments(),
        Product.countDocuments(),
        User.countDocuments({role:'customer'}),
        Order.find().sort({createdAt:-1}).limit(5).populate('user','name email'),
        Order.aggregate([
            {$match:{status:{$ne:'cancelled'}}},
            {$group:{_id:null,totalSales:{$sum:'$totalAmount'}}},
        ])
    ])

    const lowStockCount = await Product.countDocuments({stock:{$lte:5},isActive:true});

    res.json({
        success:true,
        summary:{
            totalOrders,
            totalProducts,
            totalCustomers,
            totalSales:salesAgg[0]?.totalSales||0,
            lowStockCount,
        },
        recentOrders,
    })
})