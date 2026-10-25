import { asyncHandler } from "../utils/asyncHandler.js";

export const uploadImage = asyncHandler(async(req,res)=>{
    if(!req.file){
        res.status(400);
            throw new Error('No Image file uploaded.');
        
    }

    const imageUrl = `/images/products/${req.file.filename}`;
    res.json({success:true,imageUrl})
})