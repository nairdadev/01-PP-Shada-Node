const express = require('express');
const router = express.Router();
const clientesAdminController = require('../../controllers/admin/clientesController');

 
router.get('/admin/clientes/all',isAdmin, clientesAdminController.getAll);
router.post('/admin/clientes/nuevo',isAdmin, clientesAdminController.signupPost);
 
function isAdmin(req, res, next) {
    if (req.user.isAdmin()) {
      console.log(req.session )
        return next();
    }
    res.redirect(`/`);
}

module.exports = router;
