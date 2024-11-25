const express = require('express');
const { registerUser, loginUser } = require('../controller/authController');
const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

router.post('/log', (req, res)=>{
    const {username, email, password}= req.body
    res.json({username, email, password})
});


module.exports = router;
