const Cart = require('../../models/cart');
const Product = require('../../models/product');
const Order = require('../../models/order');
const User = require('../../models/user');


async function home(req,res){

 
  let contTotalOrders = await Order.countDocuments();
  let contOpenOrders = await Order.countDocuments({estadoPedido: 'Pendiente'});
  let contCloseOrders = await Order.countDocuments({estadoPedido: 'Finalizada'});
  let ContTotalProducts = await Product.countDocuments();
  let ContTotalUsers = await User.countDocuments();

 


   res.render('admin/home', {
     layout: 'adminlayout',
     user: req.user,
     contTotalOrders,
     contOpenOrders,
     contCloseOrders,
     ContTotalProducts,
     ContTotalUsers

   });
 
 
}
  module.exports = {
 home
 }