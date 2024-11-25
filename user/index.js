const express = require('express')
const app = require('./app');
const connectDB = require('./db/db')
const Port = process.env.Port || 5020
const cors = require('cors')

app.get('/api/auth', (req, res)=>{
    res.send('auth is running')
})

connectDB()

app.listen(Port, ()=>{
    console.log(`user-service is now lisening on port ${Port}`)
})