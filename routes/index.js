'use strict';

const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');


router.post('/checkout', isLoggedIn, shopController.checkoutPost);
router.get('/', shopController.home);
router.get('/product/:id', shopController.singleProduct);
router.post('/add-to-cart/:id', shopController.addCart);
router.get('/shopping-cart', shopController.shoppingCart);
router.get('/checkout', isLoggedIn, shopController.checkout);
router.get('/remove/:id', shopController.removeProduct);
router.get('/category/:id/', shopController.singleCategory);
router.get('/search', shopController.search);


 
module.exports = router;

function isLoggedIn(req, res, next) {
  console.log(req)
  if (req.isAuthenticated()) {
      return next();
  }
  req.session.oldUrl = req.url; // 
  res.redirect('/user/signin');
}
