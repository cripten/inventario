var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var Proveedor = require("../models/proveedor");
var MateriaPrima = require("../models/materiaprima");
var flash = require("connect-flash");
var find_proveedor = require("../middlewares/find_proveedor");
//MATERIEPRIME =========================
// new materieprime form
router.get("/proveedor/new",function(req,res,next){
  res.render("app/proveedor/new.ejs",{ messages: req.flash("error") });
});
//Consultar historial de producto
router.post("/proveedor/productos",function(req,res,next){
  MateriaPrima.find({"provee":req.body.provee})
  .populate("provee")
  .exec(function(err,materiaprimas){
    if(err){ res.redirect("/app"); return; }
		res.render("app/proveedor/materiaprima/index.ejs", { messages: req.flash("error"), materiaprimas:materiaprimas });
  });
});
//all routes with this path use this middleware for refactor code
router.all("/proveedor/:id*",find_proveedor);
//-----------------------------------------------------
// edit materieprime form
router.get("/proveedor/:id/edit",function(req,res,next){
  res.render("app/proveedor/edit.ejs",{ messages: req.flash("error") });
});

router.route("/proveedor/:id")
.get(function(req,res,next){

})
.put(validaciones,function(req,res,next){
  res.locals.proveedor.nombre = req.body.nombre;
  res.locals.proveedor.save(function(err){
    if(!err){
			res.redirect("/app/proveedor");
		}
		else{
			console.log(err);
			res.redirect("/app/proveedor/"+req.params.id);
		}
  });
})
.delete(function(req,res,next){
  Proveedor.remove({ _id :req.params.id},function(err){
    if(!err){
			res.redirect("/app/proveedor");
		}
		else{
			console.log(err);
		}
  });
});

//MATERIEPRIME COLLECTION ================
router.route("/proveedor")
.get(function(req,res,next){
  //verifica que la colleccion a mostrar cumpla los requisitos el usuario que la creo y y muestre los archivos de la bodega por la que se solicita
  //req.query.nombre_variable_a_mostrar esto enviado por get por el ?nombre_variable_a_mostrar=valor
  Proveedor.find({})
  .sort({nombre:1})
  .exec(function(err,proveedores){
    if(err){res.redirect("/"); return;}
    res.render("app/proveedor/index.ejs", { proveedores: proveedores });
  });
})
.post(validaciones,function(req,res,next){
  //crea doble materia prima una para la principal y otra para auxiliar
  const data=
  {
  	nombre : req.body.nombre
  }
	var proveedor = new Proveedor(data)
	proveedor.save(function(err){
    if(!err){
      res.redirect("/app/proveedor");
    }
    else{
      console.log(err);
    }
	});

});

module.exports = router;

function validaciones(req,res,next){
		//aqui se valida con express-validator
		req.checkBody('nombre','Invalid proveedor').notEmpty();

		var errors = req.validationErrors(true);//almacena todos los errores
		if(errors){
			var messages = [];
			for(var type in errors){
				messages.push(errors[type].msg);
				console.log(errors[type].msg);
			}
			req.flash("error",messages);
      if(!req.params.id){
        res.redirect("/app/proveedor/new");//devuelve la cadena de mensajes
      }
      else{
        res.redirect("/app/proveedor/"+req.params.id+"/edit");//devuelve la cadena de mensajes
      }
		}
		else{
			return next();
		}
};
