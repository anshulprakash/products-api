const express = require('express');
const productService = require('./../services/products');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/product/:productName', (req, res) => { productService.getProduct(req, res) });
router.get('/products', (req, res) => { productService.getProducts(req, res) });


module.exports = router;
