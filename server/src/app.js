import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

const app = express();

app.use(helmet());
app.use(cors({origin:process.env.CLIENT_URI || 'http://localhost:5173'}));
app.use(express.json());

if(process.env.NODE_ENV !=='production'){
    app.use(morgan('dev'));
}

app.get('/api/health',(req,res)=>{
    res.json({success:true,message:'API is running.'});
});

app.use('/api/products',productRoutes);
app.use('/api/categories',categoryRoutes)

export default app;