const express = require('express')
const app = require('./app');
const Port = process.env.Port || 5050
const connectDB = require('./db/db')
app.get('/api/1', (req, res)=>{
    res.send('product is running')
})

connectDB()

app.listen( Port, ()=>{
    console.log(`product-service is now lisening on port ${Port}`)
})