require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());          // allows the frontend (different port) to call this API
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'E-commerce API running' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`)));
