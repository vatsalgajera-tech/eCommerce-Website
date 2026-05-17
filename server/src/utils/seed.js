require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

// High-quality placeholder images per category (from picsum / unsplash source)
const CATEGORY_IMAGES = {
  sarees:       [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600' }, { url: 'https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=600' }],
  kurti:        [{ url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600' }, { url: 'https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=600' }],
  kurta:        [{ url: 'https://images.unsplash.com/photo-1594938298603-c8148c4b984b?w=600' }, { url: 'https://images.unsplash.com/photo-1585914924626-15adac1e6402?w=600' }],
  gowns:        [{ url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600' }, { url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600' }],
  dupatta:      [{ url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600' }, { url: 'https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=600' }],
  'top-bottom-set': [{ url: 'https://images.unsplash.com/photo-1532453288672-3a17f2e6ad51?w=600' }, { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600' }],
  jumpsuits:    [{ url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600' }, { url: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600' }],
  lenghas:      [{ url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=600' }, { url: 'https://images.unsplash.com/photo-1583391733981-8498408ee4b6?w=600' }],
  dress:        [{ url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600' }, { url: 'https://images.unsplash.com/photo-1585914924626-15adac1e6402?w=600' }],
  'tops-tunics':[{ url: 'https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=600' }, { url: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=600' }],
};

const PRODUCTS = [
  { name: 'Royal Banarasi Silk Saree', sku: 'SV-SAR-1001', category: 'sarees', price: 5999, discountPrice: 4199, fabric: 'Banarasi Silk', colors: [{ name: 'Maroon', hex: '#7B1C2E' }, { name: 'Gold', hex: '#C6973F' }], sizes: ['Free Size'], occasion: ['Wedding', 'Festive'], description: 'Exquisite Banarasi silk saree with intricate zari work. A timeless piece for weddings and celebrations.', isFeatured: true, isBestSeller: true, stockQty: 25, tags: ['silk', 'wedding', 'banarasi'], ratings: { average: 4.8, count: 124 } },
  { name: 'Floral Print Anarkali Kurti', sku: 'SV-KUR-1002', category: 'kurti', price: 1299, discountPrice: 899, fabric: 'Rayon', colors: [{ name: 'Blue', hex: '#1E3A8A' }, { name: 'Pink', hex: '#F2A7C3' }], sizes: ['S', 'M', 'L', 'XL', 'XXL'], occasion: ['Casual', 'Daily Wear'], description: 'Light and breezy Anarkali kurti with beautiful floral prints. Perfect for everyday elegance.', isNewArrival: true, stockQty: 80, tags: ['kurti', 'floral', 'anarkali'], ratings: { average: 4.3, count: 89 } },
  { name: 'Chikankari Cotton Kurta', sku: 'SV-KRT-1003', category: 'kurta', price: 1899, discountPrice: 1399, fabric: 'Cotton', colors: [{ name: 'White', hex: '#FFFFFF' }, { name: 'Cream', hex: '#FDF6EC' }], sizes: ['S', 'M', 'L', 'XL'], occasion: ['Casual', 'Office'], description: 'Elegant hand-embroidered chikankari kurta in pure cotton. Lightweight and breathable.', isFeatured: true, stockQty: 45, tags: ['chikankari', 'cotton', 'hand-embroidered'], ratings: { average: 4.6, count: 67 } },
  { name: 'Designer Party Gown', sku: 'SV-GOW-1004', category: 'gowns', price: 7999, discountPrice: 5599, fabric: 'Georgette', colors: [{ name: 'Navy', hex: '#1E3A8A' }, { name: 'Wine', hex: '#7B1C2E' }], sizes: ['S', 'M', 'L', 'XL'], occasion: ['Party', 'Wedding'], description: 'Stunning designer gown with sequin embellishments. Make every entrance grand.', isFeatured: true, isNewArrival: true, stockQty: 15, tags: ['gown', 'party', 'designer'], ratings: { average: 4.7, count: 43 } },
  { name: 'Bandhani Georgette Dupatta', sku: 'SV-DUP-1005', category: 'dupatta', price: 699, discountPrice: 499, fabric: 'Georgette', colors: [{ name: 'Red', hex: '#DC2626' }, { name: 'Yellow', hex: '#F59E0B' }], sizes: ['Free Size'], occasion: ['Festive', 'Daily Wear'], description: 'Vibrant Bandhani dupatta in soft georgette. Pairs beautifully with any ethnic outfit.', isNewArrival: true, stockQty: 120, tags: ['bandhani', 'dupatta', 'festive'], ratings: { average: 4.2, count: 156 } },
  { name: 'Rayon Palazzo Kurti Set', sku: 'SV-TBS-1006', category: 'top-bottom-set', price: 2499, discountPrice: 1799, fabric: 'Rayon', colors: [{ name: 'Teal', hex: '#0D9488' }, { name: 'Orange', hex: '#EA580C' }], sizes: ['S', 'M', 'L', 'XL', 'XXL'], occasion: ['Casual', 'Festival'], description: 'Trendy palazzo kurti set with matching bottom. Comfort meets style in this coordinated set.', isBestSeller: true, stockQty: 60, tags: ['palazzo', 'set', 'casual'], ratings: { average: 4.5, count: 98 } },
  { name: 'Satin Floral Jumpsuit', sku: 'SV-JMP-1007', category: 'jumpsuits', price: 2999, discountPrice: 2099, fabric: 'Satin', colors: [{ name: 'Black', hex: '#000000' }, { name: 'Maroon', hex: '#7B1C2E' }], sizes: ['XS', 'S', 'M', 'L', 'XL'], occasion: ['Party', 'Office'], description: 'Chic satin jumpsuit with floral print. Modern fusion fashion for the contemporary Indian woman.', isNewArrival: true, stockQty: 30, tags: ['jumpsuit', 'satin', 'modern'], ratings: { average: 4.4, count: 52 } },
  { name: 'Bridal Silk Lehenga Set', sku: 'SV-LEN-1008', category: 'lenghas', price: 24999, discountPrice: 19999, fabric: 'Silk', colors: [{ name: 'Red', hex: '#DC2626' }, { name: 'Gold', hex: '#C6973F' }], sizes: ['S', 'M', 'L', 'XL'], occasion: ['Wedding', 'Festive'], description: 'Magnificent bridal lehenga with heavy embroidery. Complete with blouse and dupatta.', isFeatured: true, stockQty: 8, tags: ['lehenga', 'bridal', 'wedding'], ratings: { average: 4.9, count: 31 } },
  { name: 'Embroidered Cotton Dress', sku: 'SV-DRS-1009', category: 'dress', price: 1599, discountPrice: 1199, fabric: 'Cotton', colors: [{ name: 'Peach', hex: '#FBBF90' }, { name: 'Mint', hex: '#6EE7B7' }], sizes: ['S', 'M', 'L', 'XL'], occasion: ['Casual', 'Daily Wear'], description: 'Comfortable cotton dress with delicate embroidery. Ideal for everyday wear.', isBestSeller: true, stockQty: 70, tags: ['dress', 'cotton', 'embroidered'], ratings: { average: 4.4, count: 112 } },
  { name: 'Georgette Floral Top & Skirt', sku: 'SV-TOP-1010', category: 'tops-tunics', price: 1899, discountPrice: 1299, fabric: 'Georgette', colors: [{ name: 'Lavender', hex: '#A78BFA' }, { name: 'Pink', hex: '#F2A7C3' }], sizes: ['S', 'M', 'L', 'XL'], occasion: ['Casual', 'Party'], description: 'Flowing georgette top with matching skirt. Effortlessly elegant for any occasion.', isNewArrival: true, isBestSeller: true, stockQty: 55, tags: ['georgette', 'floral', 'top'], ratings: { average: 4.5, count: 78 } },
];

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shreevastra');
  console.log('✅ Connected to MongoDB');
};

const seed = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    await User.deleteMany({ role: 'admin' });
    console.log('🗑️  Cleared existing products & admin');

    const admin = await User.create({
      name: 'Shree Vastra Admin',
      email: process.env.ADMIN_EMAIL || 'shreevastrastore@gmail.com',
      password: process.env.ADMIN_PASSWORD || 'vgajera2005',
      role: 'admin',
      isVerified: true,
    });
    console.log(`👤 Admin created: ${admin.email}`);

    const productsWithMeta = PRODUCTS.map(p => ({
      ...p,
      slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      images: CATEGORY_IMAGES[p.category] || [],
      seoTitle: `${p.name} | Shree Vastra`,
      seoDescription: p.description.slice(0, 155),
      careInstructions: 'Dry clean recommended. Store in a muslin cloth. Avoid direct sunlight.',
      discountPercent: p.discountPrice ? Math.round(((p.price - p.discountPrice) / p.price) * 100) : 0,
    }));

    await Product.insertMany(productsWithMeta);
    console.log(`✅ ${productsWithMeta.length} products seeded with images`);
    console.log('\n🌸 Shree Vastra database seeded successfully!');
    console.log(`\n🔑 Admin Login:\n   Email: ${admin.email}\n   Password: ${process.env.ADMIN_PASSWORD || 'vgajera2005'}\n`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seed();
