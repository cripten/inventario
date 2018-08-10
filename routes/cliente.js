var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var Cliente = require("../models/cliente");
var flash = require("connect-flash");
var find_cliente = require("../middlewares/find_cliente");
//MATERIEPRIME =========================
// new materieprime form
router.get("/cliente/new",function(req,res,next){
  res.render("app/cliente/new.ejs",{ messages: req.flash("error") });
});
//all routes with this path use this middleware for refactor code
router.all("/cliente/:id*",find_cliente);
//-----------------------------------------------------
// edit materieprime form
router.get("/cliente/:id/edit",function(req,res,next){
  res.render("app/cliente/edit.ejs",{ messages: req.flash("error") });
});

router.route("/cliente/:id")
.get(function(req,res,next){

})
.put(validaciones,function(req,res,next){
  res.locals.cliente.codigo = req.body.codigo;
  res.locals.cliente.nombre = req.body.nombre;
  res.locals.cliente.nit = req.body.nit;
  res.locals.cliente.ciudad = req.body.ciudad;
  res.locals.cliente.direccion = req.body.direccion;
  res.locals.cliente.telefono = req.body.telefono;
  res.locals.cliente.horario = req.body.horario;
  res.locals.cliente.save(function(err){
    if(!err){
			res.redirect("/app/cliente");
		}
		else{
			console.log(err);
			res.redirect("/app/cliente/"+req.params.id);
		}
  });
})
.delete(function(req,res,next){
  // Inventario.findOneAndRemove({ _id:req.params.id},function(err){
  Cliente.remove({ _id :req.body.id},function(err){
    if(!err){
			res.redirect("/app/cliente");
		}
		else{
			console.log(err);
		}
  });
});

//MATERIEPRIME COLLECTION ================
router.route("/cliente")
.get(function(req,res,next){
  //verifica que la colleccion a mostrar cumpla los requisitos el usuario que la creo y y muestre los archivos de la bodega por la que se solicita
  //req.query.nombre_variable_a_mostrar esto enviado por get por el ?nombre_variable_a_mostrar=valor
  Cliente.find({})
  .sort({nombre:1})
  .exec(function(err,clientes){
    if(err){res.redirect("/"); return;}
    res.render("app/cliente/index.ejs", { clientes: clientes });
  });
})
.post(validaciones,function(req,res,next){
  //crea doble materia prima una para la principal y otra para auxiliar
  const data=
  {
  	codigo : req.body.codigo,
    nombre : req.body.nombre,
    nit : req.body.nit,
    ciudad : req.body.ciudad,
  	direccion : req.body.direccion,
    telefono : req.body.telefono,
    horario: req.body.horario
  }
	var cliente = new Cliente(data);
	cliente.save(function(err,result){
    if(!err){
      res.redirect("/app/cliente");
    }
    else{
      console.log(err);
    }
	});

});

module.exports = router;

function validaciones(req,res,next){
		//aqui se valida con express-validator
    req.checkBody('codigo','Invalid codigo').notEmpty();
		req.checkBody('nombre','Invalid nombre').notEmpty();
    req.checkBody('nit','Invalid nit').notEmpty();
    req.checkBody('ciudad','Invalid ciudad').notEmpty();
    req.checkBody('direccion','Invalid direccion').notEmpty();
    req.checkBody('telefono','Invalid telefono').notEmpty();
    req.checkBody('horario','Invalid horario').notEmpty();

		var errors = req.validationErrors(true);//almacena todos los errores
		if(errors){
			var messages = [];
			for(var type in errors){
				messages.push(errors[type].msg);
				console.log(errors[type].msg);
			}
			req.flash("error",messages);
      if(!req.params.id){
        res.redirect("/app/cliente/new");//devuelve la cadena de mensajes
      }
      else{
        res.redirect("/app/cliente/"+req.params.id+"/edit");//devuelve la cadena de mensajes
      }
		}
		else{
			return next();
		}
};
