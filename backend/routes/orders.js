const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// Create order. Prices are read from the database, never trusted from the browser.
router.post('/', protect, async (req, res) => {
  try {
    const { items, address } = req.body;
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ message: 'Cart is empty' });
    if (!address) return res.status(400).json({ message: 'Address required' });

    const orderItems = [];
    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.productId);
      const qty = Number(item.qty);
      if (!product || !(qty >= 1)) return res.status(400).json({ message: 'Invalid item in cart' });
      if (product.stock < qty) return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      product.stock -= qty;
      await product.save();
      orderItems.push({ product: product._id, name: product.name, price: product.price, qty });
      total += product.price * qty;
    }
    const order = await Order.create({ user: req.user._id, items: orderItems, total, address });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// My orders
router.get('/mine', protect, async (req, res) => {
  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
});

module.exports = router;
