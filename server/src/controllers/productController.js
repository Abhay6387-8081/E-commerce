import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProducts = asyncHandler(async (req, res) => {
  const { category, search, maxPrice, sort,isFeatured,isBestSeller, page = 1, limit = 20 } = req.query;

  const filter = { isActive: true };
  
  if(isFeatured==='true') filter.isFeatured = true;
  if(isBestSeller==='true') filter.isBestSeller = true;

  if (category) {
    const Category = (await import("../models/Category.js")).default;
    const cat = await Category.findOne({ slug: category });
    console.log('Recevied slug:',JSON.stringify(category));
    console.log('Catgeory colloetion:',Category.collection.name);
    console.log('Databse name:',Category.db.name);

    console.log('DEBUG - category slug recevied:',category);
    console.log('DEBUG - matched catgeory doc:',cat);
    if (cat) filter.category = cat._id;
  }
  console.log('DEBUG - final filter',filter)
  if (search) filter.$text = { $search: search };
  if (maxPrice) filter.price = { $lte: Number(maxPrice) };

  let sortOption = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  else if (sort === "price_desc") sortOption = { price: -1 };
  else if (sort === "popular") sortOption = { reviewCount: -1 };

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit)),
  ]);

  res.json({
    success: true,
    products,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "category",
    "name slug",
  );
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }
  res.status(200).json({success:true,product})
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ success: true, product });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ success: true, message: "Product deleted." });
});
