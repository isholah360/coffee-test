const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const jwt = require('jsonwebtoken');
const { createPro } = require('../controller/createPro');
const authMiddleware = require('../../admin/middleware/authMiddleware');
const product = require('../models/product');
// const protect = require('../../admin/middleware/protect');


router.get('/all', productController.getProducts);


router.post("/create-product", authMiddleware,  productController.createProduct);



router.put("/product/:id", authMiddleware,  productController.editProduct);


router.delete("/product/:id", authMiddleware, productController.deleteProduct);


router.delete("/product/vendor/:id", authMiddleware,  productController.deleteProduct);



module.exports = router;
