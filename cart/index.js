const express = require('express')
const app = require('./app');
const connectDB = require('./db/db')
const Port = process.env.Port || 5030
const cors = require('cors')

app.get('/', (req, res)=>{
    res.send('auth is running')
})


connectDB()

app.listen(Port, ()=>{
    console.log(`cart-service is now lisening on port ${Port}`)
})