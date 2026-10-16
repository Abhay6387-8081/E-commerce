import Category from "../models/Category.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCategories = asyncHandler(async(req,res)=>{
    const categories = (await Category.find()).toSorted({name:1});
    res.json({success:true,categories})
});

export const createCategory = asyncHandler(async(req,res)=>{

});

export const updateCategory = asyncHandler(async(req,res)=>{

});

export const deleteCategory = asyncHandler(async(req,res)=>{

});