const Product = require('../models/product');
const Order = require('../models/order');
const Cart = require('../models/cart');

const Category = require('../models/category');

const User = require('../models/user');
const dateFormat = require('handlebars-dateformat');
const bcrypt = require('bcrypt')


async function signupPost(req, res) {
  let a = req.body;
 
  let user = new User({
    sigma: req.body.sigma,
    user: req.user,
    email: req.body.email,
    name: req.body.name,
    addres: req.body.addres,
    tel: req.body.tel,
     role: req.body.role,
    password: await bcrypt.hash(req.body.password, 5)

  });
  
 
   await user.save()   
    res.redirect('/admin/clientes/all');
 
}

async function profile(req, res) {
  let categories = await Category.find({});
  const orders = await Order.find({
    user: req.user,
    'estadoPedido': 'Finalizada'
  })

 
  let cart;
  orders.forEach((order) => {
    cart = new Cart(order.cart);
    order.items = cart.generateArray();


  });


  const ordersPendientes = await Order.find({
    user: req.user,
    estadoPedido: {
      $gte: 'Pendiente'
    }
  })
  let cartPendiente;
  ordersPendientes.forEach((orderPendiente) => {
    cartPendiente = new Cart(orderPendiente.cart);
    orderPendiente.items = cartPendiente.generateArray();
  });
  let user = req.user;



  res.render('user/profile', {
    
    orders: orders,
    ordersPendientes: ordersPendientes,
    user: user,
    categories: categories,
    helpers: {

      dateFormat: dateFormat
    }
  });

}

function logout(req, res) {
  req.logout();
  //req.session = null;
  req.session.destroy();
  req.cart = {};
  res.redirect('/');
}

function signup(req, res) {
  let messages = req.flash('error');
  res.render('user/signup', {
    layout: 'adminlayout',
    
    messages: messages,
    hasErrors: messages.length > 0
  });
}


async function getOneOrder(req, res) {
  let categories = await Category.find({});
  await Order.find({
    _id: req.params.id
  }, (err, orders) => {
    if (err) {
      return res.write('Error!');
    }
    let cart;
    orders.forEach((order) => {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });

 
    res.render('user/getOne', {
      orders: orders,
      cart: cart,
      categories: categories,
      helpers: {

        dateFormat: dateFormat
      }

    });
  });
}

async function userEdit(req, res) {
  const {
    email,
    name,
    surname,
    addres,
    city,
    cp,
    tel
  } = req.body;
  await User.findByIdAndUpdate(req.params.id, {
    email,
    name,
    surname,
    addres,
    city,
    cp,
    tel
  });
  req.flash('success_msg', 'usuario actualizado');
  res.redirect('/user/profile');
}




module.exports = {
  profile,
  logout,
  signup,
  getOneOrder,
  userEdit,
  signupPost

}