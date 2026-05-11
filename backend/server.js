require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(helmet()); // Secure HTTP headers
app.use(cors()); // Enable CORS for all routes

// Rate limiting for auth and checkout to prevent brute force
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Main Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/checkout', authLimiter, checkoutRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../')));

// Basic health check route
app.get('/', (req, res) => {
    res.send('E-commerce Backend is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err.message);
    const statusCode = err.statusCode || 500;
    // Don't leak stack traces in production
    res.status(statusCode).json({ error: err.message || 'Internal Server Error' });
});
