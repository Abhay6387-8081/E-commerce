import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

const categories = [
  { name: 'Atta & Flour', slug: 'atta-flour' },
  { name: 'Rice', slug: 'rice' },
  { name: 'Dal & Pulses', slug: 'dal-pulses' },
  { name: 'Edible Oils', slug: 'edible-oils' },
  { name: 'Spices & Masalas', slug: 'spices' },
  { name: 'Sugar & Salt', slug: 'sugar-salt' },
  { name: 'Biscuits & Cookies', slug: 'biscuits' },
  { name: 'Snacks & Namkeen', slug: 'snacks' },
  { name: 'Tea & Coffee', slug: 'tea-coffee' },
  { name: 'Beverages', slug: 'beverages' },
  { name: 'Personal Care', slug: 'personal-care' },
  { name: 'Cleaning Supplies', slug: 'cleaning' },
];

// Temporary placeholder image generator — placehold.co, free, no API key, no signup.
// Replace with real sourced images later by editing only imageUrl values below
// (or in MongoDB directly) — no other code changes needed.
function placeholderImg(text) {
  const encoded = encodeURIComponent(text);
  return `https://placehold.co/500x500/F97316/fff?text=${encoded}&font=roboto`;
}

const products = [
  { name: 'Premium Atta', category: 'atta-flour', price: 285, mrp: 320, unit: '5 kg', stock: 40, imageUrl: placeholderImg('Atta 5kg'), isFeatured: true, isBestSeller: true, rating: 4.3, reviewCount: 128 },
  { name: 'Whole Wheat Flour', category: 'atta-flour', price: 240, mrp: 260, unit: '5 kg', stock: 30, imageUrl: placeholderImg('Wheat Flour') },
  { name: 'Maida', category: 'atta-flour', price: 60, mrp: 68, unit: '1 kg', stock: 50, imageUrl: placeholderImg('Maida') },
  { name: 'Basmati Rice', category: 'rice', price: 410, mrp: 450, unit: '5 kg', stock: 25, imageUrl: placeholderImg('Basmati Rice'), isFeatured: true, rating: 4.5, reviewCount: 89 },
  { name: 'Sona Masoori Rice', category: 'rice', price: 320, mrp: 350, unit: '5 kg', stock: 35, imageUrl: placeholderImg('Sona Masoori') },
  { name: 'Toor Dal', category: 'dal-pulses', price: 150, mrp: 165, unit: '1 kg', stock: 60, imageUrl: placeholderImg('Toor Dal'), isBestSeller: true, rating: 4.2, reviewCount: 54 },
  { name: 'Moong Dal', category: 'dal-pulses', price: 130, mrp: 145, unit: '1 kg', stock: 45, imageUrl: placeholderImg('Moong Dal') },
  { name: 'Chana Dal', category: 'dal-pulses', price: 95, mrp: 105, unit: '1 kg', stock: 55, imageUrl: placeholderImg('Chana Dal') },
  { name: 'Sunflower Oil', category: 'edible-oils', price: 145, mrp: 160, unit: '1 L', stock: 35, imageUrl: placeholderImg('Sunflower Oil'), isFeatured: true, isBestSeller: true, rating: 4.4, reviewCount: 201 },
  { name: 'Mustard Oil', category: 'edible-oils', price: 155, mrp: 170, unit: '1 L', stock: 28, imageUrl: placeholderImg('Mustard Oil') },
  { name: 'Turmeric Powder', category: 'spices', price: 45, mrp: 55, unit: '200 g', stock: 80, imageUrl: placeholderImg('Turmeric'), rating: 4.1, reviewCount: 33 },
  { name: 'Red Chilli Powder', category: 'spices', price: 50, mrp: 60, unit: '200 g', stock: 65, imageUrl: placeholderImg('Chilli Powder') },
  { name: 'Garam Masala', category: 'spices', price: 85, mrp: 95, unit: '100 g', stock: 40, imageUrl: placeholderImg('Garam Masala') },
  { name: 'Sugar', category: 'sugar-salt', price: 44, mrp: 48, unit: '1 kg', stock: 100, imageUrl: placeholderImg('Sugar'), rating: 4.0, reviewCount: 21 },
  { name: 'Iodised Salt', category: 'sugar-salt', price: 22, mrp: 25, unit: '1 kg', stock: 110, imageUrl: placeholderImg('Salt') },
  { name: 'Glucose Biscuits', category: 'biscuits', price: 30, mrp: 35, unit: '200 g', stock: 90, imageUrl: placeholderImg('Glucose Biscuits'), isBestSeller: true, rating: 4.3, reviewCount: 76 },
  { name: 'Cream Biscuits', category: 'biscuits', price: 40, mrp: 45, unit: '150 g', stock: 70, imageUrl: placeholderImg('Cream Biscuits') },
  { name: 'Aloo Bhujia', category: 'snacks', price: 55, mrp: 60, unit: '200 g', stock: 70, imageUrl: placeholderImg('Aloo Bhujia'), isFeatured: true, isBestSeller: true, rating: 4.4, reviewCount: 145 },
  { name: 'Mixture Namkeen', category: 'snacks', price: 60, mrp: 65, unit: '200 g', stock: 60, imageUrl: placeholderImg('Mixture Namkeen') },
  { name: 'Assam Tea', category: 'tea-coffee', price: 120, mrp: 135, unit: '500 g', stock: 50, imageUrl: placeholderImg('Assam Tea'), rating: 4.2, reviewCount: 62 },
  { name: 'Instant Coffee', category: 'tea-coffee', price: 180, mrp: 200, unit: '100 g', stock: 40, imageUrl: placeholderImg('Coffee') },
  { name: 'Mixed Fruit Juice', category: 'beverages', price: 95, mrp: 110, unit: '1 L', stock: 45, imageUrl: placeholderImg('Fruit Juice'), rating: 4.0, reviewCount: 19 },
  { name: 'Herbal Soap', category: 'personal-care', price: 35, mrp: 40, unit: '100 g', stock: 120, imageUrl: placeholderImg('Herbal Soap'), rating: 4.1, reviewCount: 28 },
  { name: 'Shampoo', category: 'personal-care', price: 140, mrp: 160, unit: '340 ml', stock: 50, imageUrl: placeholderImg('Shampoo') },
  { name: 'Floor Cleaner', category: 'cleaning', price: 110, mrp: 125, unit: '1 L', stock: 55, imageUrl: placeholderImg('Floor Cleaner'), rating: 4.3, reviewCount: 40 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB for seeding.');

  await Category.deleteMany({});
  await Product.deleteMany({});

  const createdCategories = await Category.insertMany(categories);
  const categoryMap = {};
  createdCategories.forEach((c) => { categoryMap[c.slug] = c._id; });

  const productsWithCategoryIds = products.map((p) => ({
    ...p,
    category: categoryMap[p.category],
    brand: 'Generic',
  }));

  await Product.insertMany(productsWithCategoryIds);

  console.log(`Seeded ${createdCategories.length} categories and ${productsWithCategoryIds.length} products.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});