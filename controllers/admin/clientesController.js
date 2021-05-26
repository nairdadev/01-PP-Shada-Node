
let User = require('../../models/user');
const dateFormat = require('handlebars-dateformat');
const bcrypt = require('bcrypt')

async function getAll(req, res){

  
    var clientes = await User.find({});
    res.render('admin/clientes/clientesAll', {
      layout: 'adminlayout',
      clientes,
   
    });
}

 


async function signupPost(req, res) {
  let a = req.body;
   let newUser = new User();
  let user = new User({
    sigma: req.body.sigma,
    user: req.user,
    email: req.body.email,
    name: req.body.name,
    addres: req.body.addres,
    tel: req.body.tel,
     role: req.body.role,
    password: newUser.encryptPassword(req.body.password)//await  bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(5))

  });
  
 
   await user.save()   
    res.redirect('/admin/clientes/all');
 
}

module.exports = {
    getAll,
    signupPost
    }