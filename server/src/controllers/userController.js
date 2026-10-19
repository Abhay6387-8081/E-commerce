import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCustomers = asyncHandler(async(req,res)=>{
    const customers = await User.find({role:'customer'}).select('-passwordHash').sort({createdAt:-1});
    res.json({success:true,customers});
})