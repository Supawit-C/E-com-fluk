const express = require('express');
const cors = require('cors'); // Added CORS
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Main Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Basic health check route
app.get('/', (req, res) => {
    res.send('E-commerce Backend is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
