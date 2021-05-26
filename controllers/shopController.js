const Cart = require('../models/cart');
const Product = require('../models/product');
const Order = require('../models/order');
const Category = require('../models/category');
const User = require('../models/user');
const paginateHelper = require('express-handlebars-paginate');
 



async function home(req, res) {
  let successMsg = req.flash('success')[0];
  let categories = await Category.find({});
  let products = await Product.find({} ).sort({title:1});
  var pageLimit = 16;
  let originalLength = products.length
  var currentPage = Number.isNaN(parseInt(req.query.page))? 1 : parseInt(req.query.page)
 
  
 products = products.filter((elem, index) => index>= (currentPage -1)*pageLimit && index <(currentPage)*pageLimit  )
  


  res.render('shop/index', {
    title: 'Shada Srl',
    products: products,
    successMsg: successMsg,
    noMessages: !successMsg,
    pagination: { page: currentPage, limit:pageLimit,totalRows: originalLength, queryParams: req.query }, products, categories,  user: req.user,
    helpers: {
   paginateHelper: paginateHelper.createPagination,
 
       }

  
     
  });
}

 
async function singleProduct(req, res) {
  let productId = req.params.id;
  let product = await Product.findById(productId);
  let categories = await Category.find({});
  res.render('shop/singleProduct', {
    product: product,
    categories: categories,
    user: req.user
  });
}

async function addCart(req, res) {
  const productId = req.params.id;
  try {
    
    let user_cart;
    if (req.user) {
      user_cart = await Cart.findOne({ user: req.user._id });
    }
    let cart;
    if (
      (req.user && !user_cart && req.session.cart) ||
      (!req.user && req.session.cart)
    ) {
      cart = await new Cart(req.session.cart);
    } else if (!req.user || !user_cart) {
      cart = new Cart({});
    } else {
      cart = user_cart;
    }

    const product = await Product.findById(productId);
    const itemIndex = cart.items.findIndex((p) => p.productId == productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].req.body.cantidad;
      cart.items[itemIndex].price = cart.items[itemIndex].qty * product.price;
      cart.totalQty +=req.body.cantidad;
      cart.totalCost += product.price;
    } else {
      cart.items.push({
        productId: productId,
        qty: req.body.cantidad,
        price: product.price,
        title: product.title,
        productCode: product.productCode,
        imagePath: product.imagePath,
        code: product.code
      });
      cart.totalQty++;
      cart.totalCost += product.price;
    }

    if (req.user) {
      cart.user = req.user._id;
      await cart.save();
    }
    req.session.cart = cart;
    req.flash("success", "Agregado al carrito");
    res.redirect(req.headers.referer);
  } catch (err) {
    req.flash("success",  "Agregado al carrito");
    res.redirect("/");
  }
}


async function shoppingCart(req, res) {
 
  
    let cart_user;
    if (req.user) {
      cart_user = await Cart.findOne({ user: req.user._id });
    }
  

    if (req.user && cart_user) {
      req.session.cart = cart_user;
      return res.render("shop/shopping-cart", {
        cart: cart_user,
        pageName: "Shopping Cart",
        products: await productsFromCart(cart_user),
      });
    }
    
    if (!req.session.cart) {
      return res.render("shop/shopping-cart", {
        cart: null,
        pageName: "Shopping Cart",
        products: null,
      });}



}


async function checkout(req, res) {
  const errorMsg = req.flash("error")[0];
 
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
 
  let cart = await Cart.findById(req.session.cart._id);

  if (req.user.role === "seller"){
     customer = req.user.role
  } else {
    customer = ""
  }
 
  const errMsg = req.flash("error")[0];
  res.render("shop/checkout", {
    cart: cart,
    customer: customer,
    errorMsg,
    pageName: "Checkout",
    user: req.user
  });
}


async function checkoutPost(req, res) {
 
  if (!req.session.cart) {
    return res.redirect("/shopping-cart");
  }
  const cart = await Cart.findById(req.session.cart._id);
 
        if(req.body.sigma){

          let user = await User.findOne({sigma: req.body.sigma});
       

          const order = new Order({
            user: user,
            sigma: req.body.sigma,
            cart: {
              totalQty: cart.totalQty,
              totalCost: cart.totalCost,
              items: cart.items,
            },
         });
    
         await order.save()  
        }else{
          const order = new Order({
            user: req.user,
            sigma: req.body.sigma,
            cart: {
              totalQty: cart.totalQty,
              totalCost: cart.totalCost,
              items: cart.items,
            },
         });
    
         await order.save()  

 

        const sgMail = require('@sendgrid/mail');
sgMail.setApiKey("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");
const msg = {
  to: 'hernanpampa@gmail.com',
  cc:'adrian.cano.g@gmail.com',
  from: 'adrian.cano.g@gmail.com', // Use the email address or domain you verified above
  subject: 'Nueva orden',
  html: `
   <div class="row">
  <div class="col-lg-12">
      <div class="wrapper wrapper-content animated fadeInRight">
          <div class="ibox-content p-xl">
                  <div class="row">
                      <div class="col-sm-6">
                          <h5>De:</h5>
                          <address>
                              <strong>${order.user.name}</strong><br>
                              
                              ${order.user.email}<br>
                              <abbr title="Phone">P:</abbr> ${order.user.tel}
                          </address>
                      </div>

 
                  </div>

                  <div class="table-responsive m-t">
                      <table class="table invoice-table">
                          <thead>
                          <tr>
                              <th>Item</th>
                              <th>Cantidad</th>
                            
                          </tr>
                          </thead>
                          <tbody>
                          <tr>
                             
                              
                          </tr>
                         

                          </tbody>
                      </table>
                  </div><!-- /table-responsive -->

                 
              </div>
      </div>
  </div>
</div>`,
};
//ES6
sgMail
  .send(msg)
  .then(() => {}, error => {
    console.error(error);

    if (error.response) {
      console.error(error.response.body)
    }
  });
//ES8
(async () => {
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body)
    }
  }
})();
    }
 
     
 
      
       await Cart.deleteOne({_id: req.session.cart._id});
    
        req.flash("success", "Pedido enviado correctamente");
        req.session.cart = null;
        res.redirect("/");
    
 
}

async function removeProduct(req, res) {
 const productId = req.params.id;
  let cart;
  try {
    if (req.user) {
      cart = await Cart.findOne({ user: req.user._id });
    } else if (req.session.cart) {
      cart = await new Cart(req.session.cart);
    }

 
    let itemIndex = cart.items.findIndex((p) => p.productId == productId);
    if (itemIndex > -1) {
 
      const product = await Product.findById(productId);
   
      cart.items[itemIndex].qty--;
      cart.items[itemIndex].price -= product.price;
     
      cart.totalCost -= product.price;
       
      if (cart.items[itemIndex].qty >= 0) {
        await cart.items.remove({ _id: cart.items[itemIndex]._id });
         cart.totalQty--;
      }
      req.session.cart = cart;
   
      if (req.user) {
        await cart.save();
      }
 
 
    }
    res.redirect(req.headers.referer);
  } catch (err) {
   
    res.redirect("/");
}
}

function cantidadProducto(req, res) {
  let productId = req.params.id;
  let cantidad = req.body.cantidad;
  let cart = new Cart(req.session.cart ? req.session.cart : {});
  let cant
  cart.cant(productId, cantidad);
  req.session.cart = cart;

  res.redirect('/shopping-cart');
}




async function singleCategory(req, res, next) {
 
  var id = req.params.id;
 //let productsCategory = await Product.find({category: id});
 let productsCategory = await Product.find({category: id}).populate(["category"]).sort({title:1});
 
  var pageLimit = 16;
  let originalLength = productsCategory.length
  var currentPage = Number.isNaN(parseInt(req.query.page))? 1 : parseInt(req.query.page)
 let categories = await Category.find({});
 
  productsCategory = productsCategory.filter((elem, index) => index>= (currentPage -1)*pageLimit && index <(currentPage)*pageLimit  )
  
   res.render('shop/singleCategory', {
          pagination: { page: currentPage, limit:pageLimit,totalRows: originalLength, queryParams: req.query }, productsCategory, categories,user: req.user,
     helpers: {
    paginateHelper: paginateHelper.createPagination 
        }
        })
 }


async function search (req, res){
 
  
  let resultado;
  let query = req.query.title;
      if(req.query.title){
           resultado = await Product.find(
               {title: {$regex : `.*${req.query.title}.*`, $options : 'i'}},//text
             {
               score: {$meta: 'textScore'}
             }//score
           ).sort({
              title:1
           });//find
 

      }//if
  
  
  var pageLimit = 16;
  let originalLength = resultado.length
  var currentPage = Number.isNaN(parseInt(req.query.page))? 1 : parseInt(req.query.page)
 let categories = await Category.find({});
 
  resultado = resultado.filter((elem, index) => index>= (currentPage -1)*pageLimit && index <(currentPage)*pageLimit  )
  
  
  
  res.render('shop/searchResult', {
        pagination: { page: currentPage, limit:pageLimit,totalRows: originalLength, queryParams: req.query }, resultado, categories, query, user: req.user,
     helpers: {
    paginateHelper: paginateHelper.createPagination 
        }
  });
}//function



async function productsFromCart(cart) {
  let products = [];  
  for (const item of cart.items) {
    let foundProduct = (
      await Product.findById(item.productId).populate("category")
    ).toObject();
    foundProduct["qty"] = item.qty;
    foundProduct["totalPrice"] = item.price;
    products.push(foundProduct);
  }
  return products;
}



module.exports = {
  home,
  singleProduct,
  addCart,
  shoppingCart,
  checkout,
  checkoutPost,
  removeProduct,
  singleCategory,
  search,
  cantidadProducto
 
}