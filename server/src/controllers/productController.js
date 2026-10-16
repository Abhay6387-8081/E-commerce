import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProducts  = asyncHandler(async(req,res)=>{
    const {category,search,maxPrice,sort,page=1,limit=20} = req.query;

    const filter = {isActive:true};
    if(category){
        const Category = (await import('../models/Category.js')).default;
        const cat = await Category.findOne({slug:category});
        if(cat) filter.Category=cat._id;
    }
    if(search) filter.$text= {$search:search};
    if(maxPrice) filter.price = {$lte:Number(maxPrice)};

    let sortOption = {createdAt:-1};
    if(sort==='price_asc') sortOption={price:1};
    else if(sort==='price_desc') sortOption={price:-1};
    else if(sort==='popular') sortOption={reviewCount:-1};

    const skip=(Number(page)-1)*Number(limit);

    const [products,total] = await Promise.all([
        Product.find(filter).populate('category','name slug').sort(sortOption).skip(skip).limit(Number(limit))
    ]);

    res.json({
        success:true,
        products,
        pagination:{
            total,
            page:Number(page),
            pages:Math.ceil(total/Number(limit))
        }
    })
});

export const getProductById = asyncHandler(async(req,res)=>{

});

export const createProduct = asyncHandler(async(req,res)=>{

});

export const updateProduct = asyncHandler(async(req,res)=>{

});

export const deleteProduct = asyncHandler(async(req,res)=>{

});
