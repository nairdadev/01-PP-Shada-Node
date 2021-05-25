'use strict';

const express = require('express');
const router = express.Router();

const Product = require('../models/product');
const Order = require('../models/order');
const Cart = require('../models/cart');
const userController = require('../controllers/userController');
 

const passport = require('passport');

 

router.put('/edituser/:id', userController.userEdit);
router.get('/profile', isLoggedIn, userController.profile);
router.get('/logout', isLoggedIn, userController.logout);
router.get('/signup', userController.signup);
router.get('/orden/:id', userController.getOneOrder);
 
           
 



router.post('/signup', passport.authenticate('local.signup', {
  failureRedirect: '/user/signup',
  failureFlash: true
}), (req, res, next) => {
  if (req.session.oldUrl) {
    let oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    res.redirect('/');
  }
});


/*router.use('/', notLoggedIn, (req, res, next) => {  
  next();
});
*/
 

 
router.get('/signin', (req, res, next) => {
  let messages = req.flash('error');
  res.render('user/signin', {
     messages: messages, hasErrors: messages.length > 0});
});

 
router.post('/signin', passport.authenticate('local.signin', {
  failureRedirect: '/user/signin',
  failureFlash: true
}), (req, res, next) => {
  if (req.session.oldUrl) {
    let oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  } else {
    if(req.user.role == "admin"){
      res.redirect('/admin');
    }else{
      res.redirect('/');
    }  
  }
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      console.log(req.session )
        return next();
    }
    res.redirect(`/`);
}

 
 
function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
      return next();
  }
 
}