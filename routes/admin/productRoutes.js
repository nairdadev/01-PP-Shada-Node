const express = require('express');
const router = express.Router();
const productsAdminController = require('../../controllers/admin/productController');
var multer  = require('multer')

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
});




var upload = multer({storage: storage}).single('imagePath');
var multipleUpload = multer({storage: storage});


router.put('/admin/products/update/:id',isAdmin, productsAdminController.producEdit);
router.get('/admin/products/update/:id',isAdmin, productsAdminController.productEditRender);
router.post('/admin/products/uploadPost',isAdmin,productsAdminController.importarPost);
router.post('/admin/products/newPost',isAdmin, upload,  productsAdminController.newProductPost);
router.get('/admin/products/all',isAdmin, productsAdminController.getAll);
router.get('/admin/products/new',isAdmin, productsAdminController.newProduct);
router.get('/admin/products/import',isAdmin, productsAdminController.importar);
router.get('/admin/products/viewer',isAdmin, productsAdminController.viewerImages);
router.get('/admin/products/upload',isAdmin, productsAdminController.uploadImages);

router.delete('/admin/products/delete/:id', isAdmin, productsAdminController.productDelete);
 

 
router.post('/admin/products/viewer', isAdmin, multipleUpload.array('multi-files', 10), function(req, res) {
	var file = req.files;
 
	res.redirect('/admin/products/viewer')
  });




function isAdmin(req, res, next) {
    if (req.user.isAdmin()) {
      console.log(req.session )
        return next();
    }
    res.redirect(`/`);
}

module.exports = router;
