const express = require('express')
const Port = process.env.Port || 5040
const app = require('./app')

app.get('/1/test', (req, res)=>{
    res.send('order is running')
    console.log("orders")
})

app.listen(Port, ()=>{
    console.log(`order-service is now lisening on port ${Port}`)
})