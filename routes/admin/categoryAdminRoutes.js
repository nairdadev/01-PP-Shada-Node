const express = require('express');
const router = express.Router();
const categoryAdminController = require('../../controllers/admin/categoryController');



router.put('/admin/category/update/:id', isAdmin, categoryAdminController.editCategory);
router.get('/admin/category/update/:id', isAdmin,categoryAdminController.editCategoryRender);
router.post('/admin/category/newCategoryPost', isAdmin, categoryAdminController.newCategoryPost);
router.get('/admin/category/all', isAdmin, categoryAdminController.getAll);
router.get('/admin/category/new', isAdmin, categoryAdminController.newCategory);
router.delete('/admin/category/delete/:id', isAdmin, categoryAdminController.deleteCategory);


 
function isAdmin(req, res, next) {
    if (req.user.isAdmin()) {
      console.log(req.session )
        return next();
    }
    res.redirect(`/`);
}

module.exports = router;
