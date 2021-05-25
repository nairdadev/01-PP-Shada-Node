const express = require('express');
const router = express.Router();
const homeAdminController = require('../../controllers/admin/homeAdminController');
 

router.get('/admin', isAdmin, homeAdminController.home);


function isAdmin(req, res, next) {
    if (req.user.isAdmin()) {
      
        return next();
      
    }
    res.redirect(`/`);
}

module.exports = router;


