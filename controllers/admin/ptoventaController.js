let Ptoventa = require('../../models/ptoventaModel');

//Trae todo los Puntos de ventas
function getAll(req,res){
    res.render('admin/ptoventa/getAll', {
      layout: 'adminlayout'
    });
  }

//Render de Vista
  function newPtoventaRender(req,res){
    res.render('admin/ptoventa/newPtoventa', {
      layout: 'adminlayout'
    });
  }
  
//Post Punto de Venta -> Revisar Código de error.
  async function newPtoventaPost(req, res){

    const { codigo, nombre, direccion} = req.body;
        const errors = [];
        if (!codigo) {
          errors.push({text: 'No se cargó Imagen'});
        }
        if (!nombre) {
          errors.push({text: 'no se introdujo texto'});
        }
        if (!direccion) {
          errors.push({text: 'no se introdujo descripción'});
        }
        if (errors.length > 0) {
          res.render('admin/ptoventa/newPtoventa', {
            errors,
            codigo,
            nombre,
            direccion
          });
        } else {
          const newPtoVenta = new Ptoventa({codigo, nombre, direccion});
          await newPtoVenta.save();
          req.flash('success_msg', 'Punto de Venta Agregado');
          res.redirect('admin/ptoventa/all');
        }


  }
  
   module.exports = {
  getAll,
  newPtoventaRender,
  newPtoventaPost
  }