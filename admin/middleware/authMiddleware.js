const dotenv = require('dotenv')
dotenv.config()
const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token; 
         console.log(process.env.JWT_SECRET)
        
        if (!token) {
            return res.status(401).json({ message: 'No authentication token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
     
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;