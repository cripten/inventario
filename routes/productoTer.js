var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var Produccion = require("../models/produccion");
var ProductoTer = require("../models/productoTer");
var flash = require("connect-flash");
var find_productoTer = require("../middlewares/find_productoTer");
//MATERIEPRIME =========================
// new materieprime form
router.get("/productoTer/new",function(req,res,next){
  res.render("app/empaque/new.ejs",{ messages: req.flash("error") });
});
//all routes with this path use this middleware for refactor code
router.all("/productoTer/:id*",find_productoTer);
//-----------------------------------------------------
// edit materieprime form
router.get("/productoTer/:id/edit",function(req,res,next){
  res.render("app/empaque/edit.ejs",{ messages: req.flash("error") });
});

router.route("/productoTer/:id")
.get(function(req,res,next){

})
.put(validaciones,function(req,res,next){
  res.locals.productoTer.nombre = req.body.nombre;
  res.locals.productoTer.save(function(err){
    if(!err){
			res.redirect("/app/productoTer");
		}
		else{
			console.log(err);
			res.redirect("/app/productoTer/"+req.params.id);
		}
  });
})
.delete(function(req,res,next){
  // Inventario.findOneAndRemove({ _id:req.params.id},function(err){
  ProductoTer.remove({ nombre :req.body.nombre},function(err){
    if(!err){
			res.redirect("/app/productoTer");
		}
		else{
			console.log(err);
		}
  });
});

//MATERIEPRIME COLLECTION ================
router.route("/productoTer")
.get(function(req,res,next){
  //verifica que la colleccion a mostrar cumpla los requisitos el usuario que la creo y y muestre los archivos de la bodega por la que se solicita
  //req.query.nombre_variable_a_mostrar esto enviado por get por el ?nombre_variable_a_mostrar=valor
  ProductoTer.find()
  .sort({mp:1})
  .exec(function(err,productos){
    if(err){res.redirect("/"); return;}
    res.render("app/empaque/index.ejs", { productos: productos });
  });
})
.post(validaciones,function(req,res,next){
  //crea doble materia prima una para la principal y otra para auxiliar
  const data=
  {
  	nombre : req.body.nombre,
  	stock : 0,
  	averiasPor : 0,
  	diferenciaPor : 0,
  }
	var productoTer = new ProductoTer(data)
	productoTer.save(function(err,result){
    if(!err){
      res.redirect("/app/productoTer");
    }
    else{
      console.log(err);
    }
	});

});

module.exports = router;

function validaciones(req,res,next){
		//aqui se valida con express-validator
		req.checkBody('nombre','Invalid materia prima').notEmpty();

		var errors = req.validationErrors(true);//almacena todos los errores
		if(errors){
			var messages = [];
			for(var type in errors){
				messages.push(errors[type].msg);
				console.log(errors[type].msg);
			}
			req.flash("error",messages);
      if(!req.params.id){
        res.redirect("/app/productoTer/new");//devuelve la cadena de mensajes
      }
      else{
        res.redirect("/app/productoTer/"+req.params.id+"/edit");//devuelve la cadena de mensajes
      }
		}
		else{
			return next();
		}
};
