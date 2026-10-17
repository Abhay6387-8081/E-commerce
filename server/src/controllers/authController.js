import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name,email, and password are required.");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters.");
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    phone,
    role: "customer",
  });

  generateToken(res, user._id);

  res.status(201).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const login = asyncHandler(async (req, res) => {
    const {email,password} = req.body;

    if(!email||!password){
        res.status(400);
        throw new Error('Email and password are required.')
    }

    const user = await User.findOne({email:email.toLowerCase()});
    if(!user){
        res.status(401);
        throw new Error('Invalid email or password.')
    }

    const valid = await bcrypt.compare(password,user.passwordHash);
    if(!valid){
        res.status(401);
        throw new Error('Invalid email or password.')
    }
    generateToken(res,user._id);

    res.json({
        success:true,
        user:{id:user._id,name:user.name,email:user.email,role:user.role},
    })
});

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie('token',{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite:process.env.NODE_ENV==='production'?'none':'lax',
    });
    res.json({success:true,message:'Logged out.'})
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});
