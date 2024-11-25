const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middleware/authMiddleware');
// const router = require('./routes');

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5000"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Routes setup
app.use('/', productRoutes);

app.get("/test", (req, res)=>{
    res.send("hi product api")
})

app.get('/api/product/test-auth', authMiddleware, (req, res) => {
    res.json({
        cookies: req.cookies,
        headers: req.headers,
        hasCookie: !!req.cookies.token
    });
});



module.exports = app;
