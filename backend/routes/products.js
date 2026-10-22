const router = require('express').Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/products?search=shoe&category=Fashion
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };
    if (req.query.category) filter.category = req.query.category;
    res.json(await Product.find(filter).sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch {
    res.status(400).json({ message: 'Invalid product id' });
  }
});

// Admin only: create / update / delete
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    res.status(201).json(await Product.create(req.body));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
