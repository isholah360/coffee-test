const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const { createOrder } = require('./controller/orderController');
const connectDB = require('./db/db')



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5000"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.post("/test/post", (req, res)=>{
    const { userId, productId, quantity, totalAmount } = req.body;
    res.send({userId, productId, quantity, totalAmount})
})

app.get("/test", (req, res)=>{
    
    res.send("test order")
})
app.use( "/", createOrder)
connectDB()
module.exports = app;


