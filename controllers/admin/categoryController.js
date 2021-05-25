let Category = require('../../models/category');

async function getAll(req,res){


    var category = await Category.find({});
    res.render('admin/category/getAll', {
      layout: 'adminlayout',
      category,
      user: req.user
    });
  
  
  }


  function newCategory(req,res){
    res.render('admin/category/newCategory', {
      layout: 'adminlayout',
      user: req.user
    });
  }
  
  async function newCategoryPost(req, res){

    const { imagePath, name, description} = req.body;
        const errors = [];
   
        if (!name) {
          errors.push({text: 'no se introdujo texto'});
        }
        if (!description) {
          errors.push({text: 'no se introdujo descripción'});
        }
      
        if (errors.length > 0) {
          res.render('admin/category/newCategory', {
            errors,
            imagePath,
            name,
            description,
          });
        } else {
          const newCategory = new Category({imagePath, name, description});
          await newCategory.save();
          req.flash('success_msg', 'Categoría Agregada');
          res.redirect('/admin/category/all');
        }
}

async function editCategoryRender(req, res){
  let categoryId = req.params.id;
  let category = await Category.findById(categoryId);
  res.render('admin/category/editCategory', {
    layout: 'adminlayout',
    category: category,
    user: req.user
  });
}

async function editCategory(req, res){
  const { imagePath, name, description} = req.body;
  await Category.findByIdAndUpdate(req.params.id, {imagePath, name, description},{new: true});
  req.flash('success_msg', 'Categoría Actualizado');
  res.redirect('/admin/category/getAll');


}

async function deleteCategory(req, res){
  await Category.deleteOne({ _id: req.params.id });
  req.flash('success_msg', 'Categoría eliminada correctamente');
  res.redirect('/admin/category/getAll')
}


 
  
   module.exports = {
  getAll,
  newCategory,
  newCategoryPost,
  editCategoryRender,
  editCategory,
  deleteCategory
  }