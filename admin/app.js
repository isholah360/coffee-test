const express = require('express');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5000"], 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));



console.log(process.env.JWT_SECRETE)

app.use('/', authRoutes);

app.get('/auth/test', (req, res) => {
    res.send("auth is running");
});

app.use(errorHandler);

module.exports = app;