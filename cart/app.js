const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require("dotenv");
const { errorHandler } = require('../utils/middlewares/errorMiddleware');
const connectDB = require('./db/db');
const  cartRoutes = require('./routes/cartRoutes')

const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5000"], 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

dotenv.config();

app.use("/", cartRoutes)

app.get('/test', (req, res) => {
    res.send("cart is running");
});

connectDB()
app.use(errorHandler);

module.exports = app;