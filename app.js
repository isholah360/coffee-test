
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv')
const app = express();

// Global CORS configuration
dotenv.config();
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie']
}));


const createCorsProxy = (target, pathRewrite = {}) => createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    secure: false,
    onProxyReq: (proxyReq, req) => {
        if (req.cookies && req.cookies.token) { 
            proxyReq.setHeader('Cookie', `token=${req.cookies.token}`);
            console.log('Forwarding token cookie:', req.cookies.token);
        }
    },
    onProxyRes: (proxyRes, req, res) => {
        const cookies = proxyRes.headers['set-cookie'];
        if (cookies) {
            proxyRes.headers['set-cookie'] = cookies.map(cookie =>
                cookie.replace(/Domain=[^;]+;/, 'Domain=localhost;')
                     .replace(/Path=[^;]+;/, 'Path=/;')
            );
        }
    }
});


app.use('/api/auth', createCorsProxy('http://localhost:5010', {
    '^/api/auth': '/api/auth' // admin service
}));


app.use('/api/users/auth', createCorsProxy('http://localhost:5020', {
    '/api/users/auth': '/api/users/auth' // user service
}));

app.use('/api/coffee', createCorsProxy('http://localhost:5030', {
    '^/api/coffee': '/api/coffee' // cart service
}));

app.use('/api/v4', createCorsProxy('http://localhost:5040', {
    '^/api/v4': '/api/v4'  // order service
}));

app.use('/api/product', createCorsProxy('http://localhost:5050', {
    '^/api/product': '/api/product'  // product service
}));
app.use('/api/v6', createCorsProxy('http://localhost:5060', {
    '^/api/v6': '/api/v6' //payment
}));

app.get("/test", (req, res)=>{
    res.send("5000 is ok")
})
app.options('*', cors());

module.exports = app;