let Ordenes = require("../../models/order");
const Product = require("../../models/product");
const Cart = require("../../models/cart");
const User = require("../../models/user");
const dateFormat = require("handlebars-dateformat");
var csv = require("../../config/util");

async function getAll(req, res) {
  const ordersOpen = await Ordenes.find({ Delivered: false }).populate("user");
  
  const ordersClosed = await Ordenes.find({ Delivered: true }).populate("user");

  res.render("admin/ordenes/getAll", {
    user: req.user,
    orders: ordersOpen,
    ordersclosed: ordersClosed,
    layout: "adminlayout",
    helpers: {
      dateFormat: dateFormat,
    },
  });
}

async function getOneOrder(req, res) {
  let orden = await Ordenes.findById(req.params.id);

  let cart;
  orders.forEach((order) => {
    cart = new Cart(order.cart);
    order.items = cart.generateArray();
  });

  let usuario = await User.findById(orden.user);

   

  res.render("admin/ordenes/getOne", {
    user: usuario,
    orden: orden,
    cart: cart,

    layout: "adminlayout",
    helpers: {
      dateFormat: dateFormat,
    },
  });
}

async function getOrdenPedido(req, res) {

  var orders = await Ordenes.findById(req.params.id).populate("user");

  var s = orders.sigma;
  
  var us = await User.find({ sigma: s });
   

  let length = orders.cart.items.length;
 
  res.render("admin/ordenes/getOrdenPedido", {
    orders: orders,
    length: length,
    us: us,
    layout: "adminlayout",
    helpers: {
      dateFormat: dateFormat,
    },
  });
}

async function finalizarPedidoRender(req, res) {
  await Ordenes.find({ _id: req.params.id }, (err, orders) => {
    if (err) {
      return res.write("Error!");
    }
    let cart;
    orders.forEach((order) => {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });

    res.render("admin/ordenes/finalizarOrden", {
      user: req.user,
      orders: orders,
      cart: cart,
      layout: "adminlayout",

      helpers: {
        dateFormat: dateFormat,
      },
    });
  });
}

async function finalizarPedido(req, res) {
  const Delivered = true;
  const dateModificacion = Date.now();
  await Ordenes.findByIdAndUpdate(
    req.params.id,
    { Delivered, dateModificacion },
    { new: true }
  );
  req.flash("success_msg", "Pedido Actualizado");
  res.redirect("/admin/orden");
}

async function altOrden(req, res) {
  let order = await Ordenes.findById(req.params.id);

  let body = req.body.productos || [];

 console.log("asdasd", body)

  const reducer = (prev, item, index, array) => {
    prev[item.id] = {
      ...order.cart.items[item.id],
      code: parseInt(item.code),
      qty: parseInt(item.qty),
    };
    //prev[item.id].item = { ...prev[item.id].item, code: parseInt(item.code)};

    return prev;
  };
  order.cart.items = body.reduce(reducer, {}); //order.cart[req.body.id]

  const save = await Ordenes.findByIdAndUpdate({ _id: req.params.id }, order, {
    upsert: true,
  });

  res.redirect("/admin/ordenpedido/" + req.params.id);
}

async function download(req, res) {
  let orders = await Ordenes.findOne({ _id: req.params.id }).populate("user");

 
  let items = orders.cart.items;
 
  let data = [];
  for (let i = 0; i < items.length; i++) {
    datos = {
      Cliente: orders.user.sigma || "1",
      Fecha: orders.createdAt,
      Vendedor: "1",
      Sucursal: "1",
      "Codigo producto": items[i].code,
      Cantidad: items[i].qty,
      Precio: 0,
    };
    data.push(datos);
  }
  const fields = [
    {
      label: "Cliente",
      value: "Cliente",
    },
    {
      label: "Fecha",
      value: "Fecha",
    },
    {
      label: "Vendedor",
      value: "Vendedor",
    },
    {
      label: "Sucursal",
      value: "Sucursal",
    },
    {
      label: "Codigo producto",
      value: "Codigo producto",
    },
    {
      label: "Cantidad",
      value: "Cantidad",
    },
    {
      label: "Precio",
      value: "Precio",
    },
  ];
  return csv.downloadResource(res, "orden.csv", fields, data);
}

async function updateOrden(req, res) {

  let order = await Ordenes.findById(req.params.id);
  order.cart.items = [];
  order.cart.totalQty = 12;

  let prod = req.body.productos;
  



  for (let i = 0; i < prod.length; i++) {
    let prods = await Product.findOne({ code: prod[i].code });
 
    if(!prods){

  
      error = `   <div class="alert alert-danger"> No se encuentra/n en catalogo los códigos: ${prod[i].code} </div>` 
      req.session['success'] = error;
 
    }else{ 
     
    let hola = {
      title: prods.title, 
      qty: prod[i].qty,
      code: prods.code,
      productId: prods._id,
    };
 
    order.cart.items.push(hola);
    await Ordenes.findByIdAndUpdate({ _id: req.params.id }, order, {
      upsert: true,
    });
    req.session['success'] = '';
  }
 
}

res.redirect("/admin/ordenpedido/" + req.params.id);
 

}

module.exports = {
  getAll,
  getOneOrder,
  getOrdenPedido,
  finalizarPedido,
  finalizarPedidoRender,
  altOrden,
  download,
  updateOrden,
};
