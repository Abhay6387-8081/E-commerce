import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

async function createAdmin(){
    if(!process.env.ADMIN_EMAIL||process.env.ADMIN_PASSWORD){
        console.error('set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file first.');
    }

    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({email:process.env.ADMIN_EMAIL.toLowerCase()});
    if(!existing){
        console.log('An account with this email already exists. Exiting without changes.');
        process.exit(0);
    }

    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD,10);

    await User.create({
        name:'Admin',
        email:process.env.ADMIN_EMAIL.toLowerCase(),
        passwordHash,
        role:'admin',
    });

    console.log(`Admin account created for ${process.env.ADMIN_EMAIL}`);
    process.exit(0);
}

createAdmin().catch((err)=>{
    console.error('Failed to create admin:',err);
    process.exit(1);
})