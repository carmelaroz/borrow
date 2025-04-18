const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const rentalRoutes = require('./routes/rentalRoutes');
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
require('dotenv').config();

const app = express();

// Connect to DB
connectDB();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
}));
app.use(express.json());

// Routes
app.use('/api/rentals', rentalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));