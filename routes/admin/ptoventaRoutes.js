const express = require('express');
const router = express.Router();

// controlador
const ptoVentaController = require('../../controllers/admin/ptoventaController');

// Helpers
//const { isAuthenticated } = require('../helpers/auth');

 
router.get('/ptoventa/getall', isAdmin, ptoVentaController.getAll);
router.get('/ptoventa/newptoventa', isAdmin, ptoVentaController.newPtoventaRender);

module.exports = router;


function isAdmin(req, res, next) {
    if (req.user.isAdmin()) {
      console.log(req.session )
        return next();
    }
    res.redirect(`/`);
}