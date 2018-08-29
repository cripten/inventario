var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var ProductoTer = require("../models/productoTer");
var Despacho = require("../models/despacho");
var flash = require("connect-flash");
var find_despacho = require("../middlewares/find_despacho");
var numeral = require('numeral');
//MATERIEPRIME =========================
// new materieprime form
router.get("/despacho/new",function(req,res,next){
  ProductoTer.find({},function(err,productos){
    if(err){res.redirect("/"); return;}
    res.render("app/despacho/new.ejs",{ messages: req.flash("error"), productos: productos });
  });
});
//all routes with this path use this middleware for refactor code
router.all("/despacho/:id*",find_despacho);
//-----------------------------------------------------
// edit materieprime form
router.get("/despacho/:id/edit",function(req,res,next){
  res.render("app/despacho/edit.ejs",{ messages: req.flash("error") });
});

router.route("/despacho/:id")
.get(function(req,res,next){

})
.put(function(req,res,next){
  res.locals.despacho.caja = req.body.caja;
  res.locals.despacho.bolsa = req.body.bolsa;
  res.locals.despacho.unidadCaja = req.body.unidadCaja;
  res.locals.despacho.unidadBolsa = req.body.unidadCaja;
  res.locals.despacho.save(function(err){
    if(!err){
			res.redirect("/app/despacho");
		}
		else{
			console.log(err);
			res.redirect("/app/despacho/"+req.params.id);
		}
  });
})
.delete(function(req,res,next){
  Despacho.remove({ _id :req.params.id},function(err){
    if(!err){
			res.redirect("/app/despacho");
		}
		else{
			console.log(err);
		}
  });
});

//MATERIEPRIME COLLECTION ================
router.route("/despacho")
.get(function(req,res,next){
  //verifica que la colleccion a mostrar cumpla los requisitos el usuario que la creo y y muestre los archivos de la bodega por la que se solicita
  //req.query.nombre_variable_a_mostrar esto enviado por get por el ?nombre_variable_a_mostrar=valor
  Despacho.find({})
  .populate("prodTer")
  .sort({'prodTer.nombre':1})
  .exec(function(err,despachos){
    if(err){res.redirect("/"); return;}
    var cont = 1;
    var totalGeneral = 0;
    if(despachos.length > 0){
      despachos.forEach(function(despacho){
        cont++;
        totalGeneral = totalGeneral + despacho.total;
        if(cont > despachos.length){
          var string = numeral(totalGeneral).format('0,0.0000');
          res.render("app/despacho/index.ejs", { despachos: despachos, totalGeneral: string});
        }
      });
    }
    else{
      res.render("app/despacho/index.ejs", { despachos: {}, totalGeneral: {} });
    }
  });
})
.post(function(req,res,next){
  //crea doble materia prima una para la principal y otra para auxiliar
  const data=
  {
  	caja : 0,
  	bolsa : 0,
    unidadCaja: 0,
  	unidadBolsa : 0,
    total: 0,
  	prodTer : req.body.prodTer,
  }
  console.log(data);
	var despacho = new Despacho(data)
	despacho.save(function(err){
    if(!err){
      res.redirect("/app/despacho");
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
