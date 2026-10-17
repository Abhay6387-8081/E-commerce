import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async(req,res,next)=>{
    const token = req.cookies?.token;

    if(!token){
        res.status(401);
        throw new Error('Not authorized. Please log in.');
    }

    let decoded;
    try{
        decoded = jwt.verify(token,process.env.JWT_SECRET);
    }catch{
        res.status(401);
        throw new Error('Session expired or invalid.Please log in again.')
    }

    const user = await User.findById(decoded.userId).select('-passwordHash');
    if(!user){
        res.status(401);
        throw new Error('User no longer exists.');
    }

    req.user = user;
    next();
})