var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var Proveedor = require("../models/proveedor");
var MateriaPrima = require("../models/materiaprima");
var flash = require("connect-flash");
var find_materiaprima = require("../middlewares/find_materiaprima");
//MATERIEPRIME =========================
// new materieprime form
router.get("/materiaprima/new",function(req,res,next){
  Proveedor.find({},function(err,proveedores){
    res.render("app/proveedor/materiaprima/new.ejs",{ messages: req.flash("error"), proveedores: proveedores });
  })
});
//all routes with this path use this middleware for refactor code
router.all("/materiaprima/:id*",find_materiaprima);
//-----------------------------------------------------
// edit materieprime form
router.get("/materiaprima/:id/edit",function(req,res,next){
  Proveedor.find({},function(err,proveedores){
    res.render("app/proveedor/materiaprima/edit.ejs",{ messages: req.flash("error"), proveedores: proveedores });
  });
});

router.route("/materiaprima/:id")
.get(function(req,res,next){

})
.put(validaciones,function(req,res,next){
  res.locals.materiaprima.nombre = req.body.nombre;
  res.locals.materiaprima.marca = req.body.marca;
  res.locals.materiaprima.presentacion = req.body.presentacion;
  res.locals.materiaprima.valorU = req.body.valorU;
  res.locals.materiaprima.valorG = req.body.valorG;
  res.locals.materiaprima.provee = req.body.provee;
  res.locals.materiaprima.save(function(err){
    if(!err){
			res.redirect("/app/materiaprima");
		}
		else{
			console.log(err);
			res.redirect("/app/materiaprima/"+req.params.id);
		}
  });
})
.delete(function(req,res,next){
  MateriaPrima.remove({ _id :req.params.id},function(err){
    if(!err){
			res.redirect("/app/materiaprima");
		}
		else{
			console.log(err);
		}
  });
});

//MATERIEPRIME COLLECTION ================
router.route("/materiaprima")
.get(function(req,res,next){
  //verifica que la colleccion a mostrar cumpla los requisitos el usuario que la creo y y muestre los archivos de la bodega por la que se solicita
  //req.query.nombre_variable_a_mostrar esto enviado por get por el ?nombre_variable_a_mostrar=valor
  MateriaPrima.find({})
  .sort({nombre:1})
  .exec(function(err,materiaprimas){
    if(err){res.redirect("/"); return;}
    res.render("app/proveedor/materiaprima/index.ejs", { materiaprimas: materiaprimas });
  });
})
.post(validaciones,function(req,res,next){
  //crea doble materia prima una para la principal y otra para auxiliar
  const data=
  {
  	nombre : req.body.nombre,
    marca: req.body.marca,
    presentacion: req.body.presentacion,
    valorUni: req.body.valorUni,
    valorG: req.body.valorUni/req.body.presentacion,
    provee: req.body.provee
  }
	var materiaprima = new MateriaPrima(data);
  console.log(materiaprima);
	materiaprima.save(function(err){
    if(!err){
      res.redirect("/app/proveedor/materiaprima");
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
    req.checkBody('marca','Invalid marca').notEmpty();
    req.checkBody('presentacion','Invalid presentacion').notEmpty();
    req.checkBody('valorUni','Invalid valor unitario').notEmpty();

		var errors = req.validationErrors(true);//almacena todos los errores
		if(errors){
			var messages = [];
			for(var type in errors){
				messages.push(errors[type].msg);
				console.log(errors[type].msg);
			}
			req.flash("error",messages);
      if(!req.params.id){
        res.redirect("/app/proveedor/materiaprima/new");//devuelve la cadena de mensajes
      }
      else{
        res.redirect("/app/proveedor/materiaprima/"+req.params.id+"/edit");//devuelve la cadena de mensajes
      }
		}
		else{
			return next();
		}
};
