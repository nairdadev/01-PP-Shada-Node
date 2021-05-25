//DEPENDENCIAS
let Product = require('../../models/product');
let Category = require('../../models/category');
const fs = require('fs');
 

//IMPORTAR
let excel = require("read-excel-file");
const Handlebars = require("handlebars");
const paginateHelper = require('express-handlebars-paginate');


//TRAE TODOS LOS PRODUCTOS
async function getAll(req, res) {
  let successMsg = req.flash('success')[0];
  let categories = await Category.find({});
  let products = await Product.find({index: 1});


  var pageLimit = 8;
  let originalLength = products.length
  var currentPage = Number.isNaN(parseInt(req.query.page))? 1 : parseInt(req.query.page)
 
  
 products = products.filter((elem, index) => index>= (currentPage -1)*pageLimit && index <(currentPage)*pageLimit  )
  


 
  res.render('admin/products/getAll', {
    user: req.user,
    layout: 'adminlayout',
    products: products,
    successMsg: successMsg,
    noMessages: !successMsg,
    pagination: { page: currentPage, limit:pageLimit,totalRows: originalLength, queryParams: req.query }, products, categories,  user: req.user,
    helpers: {
   paginateHelper: paginateHelper.createPagination,
 
       }
  });
}

//RENDER FORM PRODUCTOS
async function newProduct(req, res) {
  let categories = await Category.find({});
  res.render('admin/products/newProduct', {
    user: req.user,
    layout: 'adminlayout',
    categories: categories
  });
}


//POST FORM PRODUCTOS
async function newProductPost(req, res) {
  const {
    title,
    description,
    quantity,
    available,
    price,
    index,
    category
  } = req.body;
  const errors = [];
  if (!title) {
    errors.push({
      text: 'no se introdujo texto'
    });
  }
  if (!description) {
    errors.push({
      text: 'no se introdujo descripción'
    });
  }
  if (!quantity) {
    errors.push({
      text: 'no se introdujo cantidad'
    });
  }
  if (!available) {
    errors.push({
      text: 'no se introdujo cantidad'
    });
  }
  if (!price) {
    errors.push({
      text: 'no se introdujo precio'
    });
  }
  if (!index) {
    errors.push({
      text: 'no se introdujo portada'
    });
  }
  //IMAGEN
  let imagePath = req.file.originalname
  if (errors.length > 0) {
    res.render('admin/products/newProduct', {
      errors,
      title,
      description,
      quantity,
      available,
      price,
      index
    });
  } else {
    const newProducto = new Product({
      title,
      description,
      quantity,
      available,
      price,
      index,
      imagePath,
      category
    });

    await newProducto.save();
    req.flash('success_msg', 'Producto Agregado');
    res.redirect('/admin/products/all');
  }


}


//ELIMINAR PRODUCTO
async function productDelete(req, res){
  await Product.deleteOne({ _id: req.params.id });
  req.flash('success_msg', 'Producto eliminado correctamente');
  res.redirect('/admin/products/all')
}

// IMPORTAR EXCEL DE PRODUCTOS - SE PUEDE MEJORAR
function importar(req, res) {

  const cb = `function cb (e){
    const schema = {
      'categoria': {
        prop: 'categoria',
        type: String
      },
      'subcategoria': {
        prop: 'subcategoria',
        type: String,
      },
        'codigo': {
        prop: 'codigo',
        type: String,
      },
        'descripcion': {
        prop: 'descripcion',
        type: String,
      },
        'observaciones': {
        prop: 'observaciones',
        type: String,
      },
        'precio': {
        prop: 'precio',
        type: String,
      },
        'imagen': {
        prop: 'imagen',
        type: String,
      },
      'index': {
        prop: 'index',
        type: String,
      },
      'available': {
        prop: 'available',
        type: String,
      },
 };
  
  readXlsxFile(document.getElementById("subirFile").files[0], { schema }).then(({rows:jsonArray}) => {
    var template = \`                                                 
    <table class="table" name="tabla">
                                              <thead class="thead-light">
                                                <tr>
                                                  <th scope="col">categoria</th>
                                                  <th scope="col">subcategoria</th>
                                                  <th scope="col">codigo</th>
                                                  <th scope="col">descripcion</th>
                                                  <th scope="col">observaciones</th>
                                                  <th scope="col">precio</th>
                                                  <th scope="col">imagen</th>
                                                  <th scope="col">index</th>
                                                  <th scope="col">available</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                 {{#each jsonArray}}
                                                <tr>
                                                  
                                                  <th>{{{this.categoria}}}</th>
                                                  <th>{{{this.subcategoria}}}</th>
                                                  <th>{{{this.codigo}}}</th>
                                                  <th>{{{this.descripcion}}}</th>
                                                  <th>{{{this.observaciones}}}</th>
                                                  <th>{{{this.precio}}}</th>
                                                  <th>{{{this.imagen}}}</th>
                                                  <th>{{{this.index}}}</th>
                                                  <th>{{{this.available}}}</th>
                                                      
                                                </tr>
                                                
                                                {{/each}}
                                                
    <input type="hidden" name="formDinamico" value="{{ jsonArray.length }}" >

                                                
                                              </tbody>
                                            </table>
                                            <p>Se importarán un total de {{ jsonArray.length }} productos</p>
                                         


\`;
    
    var c = Handlebars.compile(template);
    var content = c({jsonArray});
 
    var source = $('#pagos-importados').append(content);
    document.getElementById("datos").value = JSON.stringify(jsonArray)
 }); 
}`;

  res.render("admin/products/import", {
    user: req.user,
    cb,
    layout: 'adminlayout'
  });

}

// POST IMPORT PRODUCTOS
async function importarPost(req, res) {

  var datos = JSON.parse(req.body.datos);
   let promises = datos.map(async producto => {
    const newProduct = new Product({
      category: producto.categoria,
      imagePath: producto.imagen,
      title: producto.descripcion,
      code: producto.codigo,
      price: producto.precio,
      index: producto.index,
      available: producto.available
    });

    return (await newProduct.save())._id;
  });

  res.redirect("/admin/products/all");

}

//UPLOAD IMAGES
async function uploadImages(req, res) {


  res.render("admin/products/uploadImages", {
    user: req.user,
    layout: 'adminlayout'
  });
}



//UPLOAD VIEWER IMAGENES
 


//VIEWER IMAGES
async function viewerImages(req, res) {
 // var product = await Product.find({});

  

fs.readdir('public/uploads', function (err, archivos) {
if (err) {
onError(err);
return;
}
 
 

  
  
  var pageLimit = 9;
  let originalLength = archivos.length
  var currentPage = Number.isNaN(parseInt(req.query.page))? 1 : parseInt(req.query.page)
 
  
 archivos = archivos.filter((elem, index) => index>= (currentPage -1)*pageLimit && index <(currentPage)*pageLimit  )
  
  
  
  res.render("admin/products/viewerimages", {
    user: req.user,
    //product: product,
    layout: 'adminlayout',
    archivos,
  pagination: { page: currentPage, limit:pageLimit,totalRows: originalLength, queryParams: req.query },
    helpers: {
   paginateHelper: paginateHelper.createPagination,
 
       }

  
   });  
  });
}

async function productEditRender(req, res){
  let productId = req.params.id;
  let product = await Product.findById(productId).populate(["category"]);
  let categories = await Category.find({});
  res.render("admin/products/editProduct", {
    user: req.user,
    product: product,
    categories: categories,
    layout: 'adminlayout'
  });

}

async function producEdit(req, res){
  const {
    title,
    available,
    price,
    index,
    category,
    quantity
  } = req.body;
  await Product.findByIdAndUpdate(req.params.id, {title, available, index, price, category, quantity},{new: true});
  req.flash('success_msg', 'Producto Actualizado');
  res.redirect('/admin/products/all');
}

module.exports = {
  getAll,
  newProduct,
  newProductPost,
  importar,
  viewerImages,
  uploadImages,
  importarPost,
  productDelete,
  productEditRender,
  producEdit
}