const express = require("express");
const router = express.Router();
const ordenAdminController = require("../../controllers/admin/ordenesController");
const User = require("../../models/user");

router.post(
  "/admin/orden/finalizarpedido/:id",
  isAdmin,
  ordenAdminController.finalizarPedido
);
 
router.get("/admin/orden", isAdmin, ordenAdminController.getAll);
router.get("/admin/orden/:id", isAdmin, ordenAdminController.getOneOrder);
router.get(
  "/admin/ordenpedido/:id",
  isAdmin,
  ordenAdminController.getOrdenPedido
);
router.post("/admin/orden/altaorden/:id", ordenAdminController.altOrden),
router.post("/admin/orden/update/:id", ordenAdminController.updateOrden);
router.post("/orden/descargar/:id", ordenAdminController.download);

function isAdmin(req, res, next) {
  if (req.user.isAdmin()) {
    console.log(req.session);
    return next();
  }
  res.redirect(`/`);
}
module.exports = router;
