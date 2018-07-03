var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var Producto = require("../models/producto");
var flash = require("connect-flash");
var find_producto = require("../middlewares/find_producto");
//MATERIEPRIME =========================
// new materieprime form
router.get("/producto/new",function(req,res,next){
  res.render("app/producto/new.ejs",{ messages: req.flash("error") });
});
//all routes with this path use this middleware for refactor code
router.all("/producto/:id*",find_producto);
//-----------------------------------------------------
// edit materieprime form
router.get("/producto/:id/edit",function(req,res,next){
  res.render("app/producto/edit.ejs",{ messages: req.flash("error") });
});

router.route("/producto/:id")
.get(function(req,res,next){

})
.put(validaciones,function(req,res,next){
  res.locals.producto.nombre = req.body.nombre;
  res.locals.producto.save(function(err){
    if(!err){
			res.redirect("/app/producto");
		}
		else{
			console.log(err);
			res.redirect("/app/producto/"+req.params.id);
		}
  });
})
.delete(function(req,res,next){
  // Inventario.findOneAndRemove({ _id:req.params.id},function(err){
  Producto.remove({ nombre :req.body.nombre},function(err){
    if(!err){
			res.redirect("/app/producto");
		}
		else{
			console.log(err);
			//res.redirect("/app/inventario/"+req.params.id);
		}
  });
});

//MATERIEPRIME COLLECTION ================
router.route("/producto")
.get(function(req,res,next){
  //verifica que la colleccion a mostrar cumpla los requisitos el usuario que la creo y y muestre los archivos de la bodega por la que se solicita
  //req.query.nombre_variable_a_mostrar esto enviado por get por el ?nombre_variable_a_mostrar=valor
  Producto.find({},function(err,productos){
    if(err){res.redirect("/"); return;}
    res.render("app/producto/index.ejs", { productos: productos });
  });
})
.post(validaciones,function(req,res,next){
  //crea doble materia prima una para la principal y otra para auxiliar
  var data =
  {
  	nombre : req.body.nombre,
  	totalG : 0,
  	total : 0
  }
  producto = new Producto(data);
	producto.save(function(err,result){
    if(!err){
      res.redirect("/app/producto");
    }
    else{
      console.log(err);
    }
	});
});

module.exports = router;



function validaciones(req,res,next){
		//aqui se valida con express-validator
		req.checkBody('nombre','Invalid nombre').notEmpty();

		var errors = req.validationErrors(true);//almacena todos los errores
		if(errors){
			var messages = [];
			for(var type in errors){
				messages.push(errors[type].msg);
				console.log(errors[type].msg);
			}
			req.flash("error",messages);
      if(!req.params.id){
        res.redirect("/app/producto/new");//devuelve la cadena de mensajes
      }
      else{
        res.redirect("/app/producto/"+req.params.id+"/edit");//devuelve la cadena de mensajes
      }
		}
		else{
			return next();
		}
};
