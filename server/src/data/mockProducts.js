function placeholderImg(text) {
  return `https://placehold.co/500x500/F97316/fff?text=${encodeURIComponent(text)}&font=roboto`;
}

const mockCategories = [
  { id: 'atta-flour', name: 'Atta & Flour', slug: 'atta-flour' },
  { id: 'rice', name: 'Rice', slug: 'rice' },
  { id: 'dal-pulses', name: 'Dal & Pulses', slug: 'dal-pulses' },
  { id: 'edible-oils', name: 'Edible Oils', slug: 'edible-oils' },
  { id: 'spices', name: 'Spices & Masalas', slug: 'spices' },
  { id: 'sugar-salt', name: 'Sugar & Salt', slug: 'sugar-salt' },
  { id: 'biscuits', name: 'Biscuits & Cookies', slug: 'biscuits' },
  { id: 'snacks', name: 'Snacks & Namkeen', slug: 'snacks' },
  { id: 'tea-coffee', name: 'Tea & Coffee', slug: 'tea-coffee' },
  { id: 'beverages', name: 'Beverages', slug: 'beverages' },
  { id: 'personal-care', name: 'Personal Care', slug: 'personal-care' },
  { id: 'cleaning', name: 'Cleaning Supplies', slug: 'cleaning' },
];

const mockProducts = [
  { id: 'p1', name: 'Premium Atta', brand: 'Generic', category: 'atta-flour', price: 285, mrp: 320, unit: '5 kg', stock: 40, imageUrl: placeholderImg('Atta 5kg'), isFeatured: true, isBestSeller: true, rating: 4.3, reviewCount: 128 },
  { id: 'p2', name: 'Basmati Rice', brand: 'Generic', category: 'rice', price: 410, mrp: 450, unit: '5 kg', stock: 25, imageUrl: placeholderImg('Basmati Rice'), isFeatured: true, isBestSeller: false, rating: 4.5, reviewCount: 89 },
  { id: 'p3', name: 'Toor Dal', brand: 'Generic', category: 'dal-pulses', price: 150, mrp: 165, unit: '1 kg', stock: 60, imageUrl: placeholderImg('Toor Dal'), isFeatured: false, isBestSeller: true, rating: 4.2, reviewCount: 54 },
  { id: 'p4', name: 'Sunflower Oil', brand: 'Generic', category: 'edible-oils', price: 145, mrp: 160, unit: '1 L', stock: 35, imageUrl: placeholderImg('Sunflower Oil'), isFeatured: true, isBestSeller: true, rating: 4.4, reviewCount: 201 },
  { id: 'p5', name: 'Turmeric Powder', brand: 'Generic', category: 'spices', price: 45, mrp: 55, unit: '200 g', stock: 80, imageUrl: placeholderImg('Turmeric'), isFeatured: false, isBestSeller: false, rating: 4.1, reviewCount: 33 },
  { id: 'p6', name: 'Sugar', brand: 'Generic', category: 'sugar-salt', price: 44, mrp: 48, unit: '1 kg', stock: 100, imageUrl: placeholderImg('Sugar'), isFeatured: false, isBestSeller: false, rating: 4.0, reviewCount: 21 },
  { id: 'p7', name: 'Glucose Biscuits', brand: 'Generic', category: 'biscuits', price: 30, mrp: 35, unit: '200 g', stock: 90, imageUrl: placeholderImg('Glucose Biscuits'), isFeatured: false, isBestSeller: true, rating: 4.3, reviewCount: 76 },
  { id: 'p8', name: 'Aloo Bhujia', brand: 'Generic', category: 'snacks', price: 55, mrp: 60, unit: '200 g', stock: 70, imageUrl: placeholderImg('Aloo Bhujia'), isFeatured: true, isBestSeller: true, rating: 4.4, reviewCount: 145 },
  { id: 'p9', name: 'Assam Tea', brand: 'Generic', category: 'tea-coffee', price: 120, mrp: 135, unit: '500 g', stock: 50, imageUrl: placeholderImg('Assam Tea'), isFeatured: false, isBestSeller: false, rating: 4.2, reviewCount: 62 },
  { id: 'p10', name: 'Mixed Fruit Juice', brand: 'Generic', category: 'beverages', price: 95, mrp: 110, unit: '1 L', stock: 45, imageUrl: placeholderImg('Fruit Juice'), isFeatured: false, isBestSeller: false, rating: 4.0, reviewCount: 19 },
  { id: 'p11', name: 'Herbal Soap', brand: 'Generic', category: 'personal-care', price: 35, mrp: 40, unit: '100 g', stock: 120, imageUrl: placeholderImg('Herbal Soap'), isFeatured: false, isBestSeller: false, rating: 4.1, reviewCount: 28 },
  { id: 'p12', name: 'Floor Cleaner', brand: 'Generic', category: 'cleaning', price: 110, mrp: 125, unit: '1 L', stock: 55, imageUrl: placeholderImg('Floor Cleaner'), isFeatured: false, isBestSeller: false, rating: 4.3, reviewCount: 40 },
];

export { mockCategories, mockProducts };