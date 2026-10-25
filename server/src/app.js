import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import authRoutes from './routes/authRoutes.js'
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js'

const app = express();

app.use(helmet());
app.use(cors({origin:process.env.CLIENT_URL || 'http://localhost:5173',credentials:true}));
app.use(express.json());
app.use(cookieParser())

if(process.env.NODE_ENV !=='production'){
    app.use(morgan('dev'));
}

app.get('/api/health',(req,res)=>{
    res.json({success:true,message:'API is running.'});
});

app.use('/api/auth',authRoutes)
app.use('/api/products',productRoutes);
app.use('/api/categories',categoryRoutes);
app.use('/api/orders',orderRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/upload',uploadRoutes);

app.use(notFound);
app.use(errorHandler)

export default app;