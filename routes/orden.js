var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var Cliente = require("../models/cliente");
var Producto = require("../models/producto");
var Orden = require("../models/orden");
var flash = require("connect-flash");
var find_orden = require("../middlewares/find_orden");
var dateFormat = require("dateformat");
//MATERIEPRIME =========================
// new materieprime form
router.get("/orden/new",function(req,res,next){
  Cliente.find({})
  .sort({mp:1})
  .exec(function(err,clientes){
    if(err){ console.log(err); return; }
    Producto.find({})
    .sort({mp:1})
    .exec(function(err,productos){
      if(err){ console.log(err); return; }
      res.render("app/orden/new.ejs",{ clientes: clientes, productos: productos, messages: req.flash("error") });
    });
  });
});
//all routes with this path use this middleware for refactor code
router.all("/orden/:id*",find_orden);
//-----------------------------------------------------
// edit materieprime form
router.get("/orden/:id/edit",function(req,res,next){
  res.render("app/orden/edit.ejs",{ messages: req.flash("error") });
});

router.route("/orden/:id")
.get(function(req,res,next){

})
.put(validaciones,function(req,res,next){
  res.locals.orden.codigo = req.body.codigo;
  res.locals.orden.peso = req.body.peso;
  res.locals.orden.pesoCrud = req.body.pesoCrud;
  res.locals.orden.cantidad = req.body.cantidad;
  res.locals.orden.ord_comp = req.body.ord_comp;
  res.locals.orden.fecha_prod = req.body.direccion;
  res.locals.orden.fecha_ent = req.body.telefono;
  res.locals.orden.save(function(err){
    if(!err){
			res.redirect("/app/orden");
		}
		else{
			console.log(err);
			res.redirect("/app/orden/"+req.params.id);
		}
  });
})
.delete(function(req,res,next){
  // Inventario.findOneAndRemove({ _id:req.params.id},function(err){
  Orden.remove({ _id :req.body.id},function(err){
    if(!err){
			res.redirect("/app/orden");
		}
		else{
			console.log(err);
		}
  });
});

//MATERIEPRIME COLLECTION ================
router.route("/orden")
.get(function(req,res,next){
  //verifica que la colleccion a mostrar cumpla los requisitos el usuario que la creo y y muestre los archivos de la bodega por la que se solicita
  //req.query.nombre_variable_a_mostrar esto enviado por get por el ?nombre_variable_a_mostrar=valor
  Orden.find({})
  .populate("client")
  .sort({hora:1,estado:1})
  .exec(function(err,ordenes){
    if(err){res.redirect("/"); return;}
    res.render("app/orden/index.ejs", { ordenes: ordenes });
  });
})
.post(validaciones,function(req,res,next){
  //crea doble materia prima una para la principal y otra para auxiliar
  var now = Date.now();
  var date = dateFormat(now, "d/m/yyyy");
  var hora = dateFormat(now, "d/m/yyyy, h:MM:ss TT");
  const data=
  {
  	fecha : date,
    hora : hora,
    codigo : req.body.codigo,
    peso : req.body.peso,
    pesoCrud : req.body.pesoCrud,
  	cantidad : req.body.cantidad,
    ord_comp : req.body.ord_comp,
    fecha_prod: req.body.fecha_prod,
    fecha_ent: req.body.fecha_ent,
    estado: "pendiente",
    client: req.body.client,
    prod: req.body.prod
  }
	var orden = new Orden(data);
	orden.save(function(err,result){
    if(!err){
      res.redirect("/app/orden");
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
		req.checkBody('peso','Invalid peso').notEmpty();
    req.checkBody('pesoCrud','Invalid peso crudo').notEmpty();
    req.checkBody('cantidad','Invalid cantidad').notEmpty();
    req.checkBody('ord_comp','Invalid Orden de compra').notEmpty();

		var errors = req.validationErrors(true);//almacena todos los errores
		if(errors){
			var messages = [];
			for(var type in errors){
				messages.push(errors[type].msg);
				console.log(errors[type].msg);
			}
			req.flash("error",messages);
      if(!req.params.id){
        res.redirect("/app/orden/new");//devuelve la cadena de mensajes
      }
      else{
        res.redirect("/app/orden/"+req.params.id+"/edit");//devuelve la cadena de mensajes
      }
		}
		else{
			return next();
		}
};
