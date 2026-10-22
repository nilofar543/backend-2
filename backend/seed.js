// Run once: npm run seed  -> adds sample products and an admin user
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  { name: 'Wireless Headphones', description: 'Bluetooth, 20h battery', price: 1999, category: 'Electronics', stock: 25, image: 'https://picsum.photos/seed/headphones/400/300' },
  { name: 'Running Shoes', description: 'Light and comfortable', price: 2499, category: 'Fashion', stock: 40, image: 'https://picsum.photos/seed/shoes/400/300' },
  { name: 'Smart Watch', description: 'Heart rate and step tracking', price: 3499, category: 'Electronics', stock: 15, image: 'https://picsum.photos/seed/watch/400/300' },
  { name: 'Backpack', description: 'Water-resistant, 25L', price: 1299, category: 'Fashion', stock: 30, image: 'https://picsum.photos/seed/backpack/400/300' },
  { name: 'Coffee Mug', description: 'Ceramic, 350ml', price: 299, category: 'Home', stock: 100, image: 'https://picsum.photos/seed/mug/400/300' },
  { name: 'Desk Lamp', description: 'LED, adjustable brightness', price: 899, category: 'Home', stock: 20, image: 'https://picsum.photos/seed/lamp/400/300' }
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany();
  await Product.insertMany(products);
  if (!(await User.findOne({ email: 'admin@shop.com' }))) {
    await User.create({ name: 'Admin', email: 'admin@shop.com', password: await bcrypt.hash('admin123', 10), isAdmin: true });
  }
  console.log('Seeded products + admin (admin@shop.com / admin123)');
  process.exit();
})();
