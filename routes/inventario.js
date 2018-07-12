var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var Inventario = require("../models/inventario");
var flash = require("connect-flash");
var find_inventario = require("../middlewares/find_inventario");
//MATERIEPRIME =========================
// new materieprime form
//Routa para calcular el costo real de lo que se produjo
router.post("/inventario/real",function(req,res,next){
  console.log(req.query.id);
  /*Inventario.findById(,function(err,inventario){
    if(err){res.redirect("/"); return;}
    inventario.
  });*/
  //res.render("app/inventarioauxiliar/index.ejs",{ messages: req.flash("error") });
});
// new materieprime form
router.get("/inventario/new",function(req,res,next){
  res.render("app/inventarioprincipal/new.ejs",{ messages: req.flash("error") });
});
//all routes with this path use this middleware for refactor code
router.all("/inventario/:id*",find_inventario);
//-----------------------------------------------------
// edit materieprime form
router.get("/inventario/:id/edit",function(req,res,next){
  res.render("app/inventarioprincipal/edit.ejs",{ messages: req.flash("error") });
});

router.route("/inventario/:id")
.get(function(req,res,next){

})
.put(validaciones,function(req,res,next){
  res.locals.inventario.mp = req.body.mp;
  res.locals.inventario.presentacion = req.body.presentacion;
  res.locals.inventario.cantidadTotal =   res.locals.inventario.stock / req.body.presentacion;
  res.locals.inventario.save(function(err){
    if(!err){
			res.redirect("/app/inventario?bodega="+res.locals.inventario.bodega);
		}
		else{
			console.log(err);
			res.redirect("/app/inventario/"+req.params.id);
		}
  });
})
.delete(function(req,res,next){
  // Inventario.findOneAndRemove({ _id:req.params.id},function(err){
  Inventario.remove({ mp :req.body.mp},function(err){
    if(!err){
			res.redirect("/app/inventario?bodega=principal");
		}
		else{
			console.log(err);
			//res.redirect("/app/inventario/"+req.params.id);
		}
  });
});

//MATERIEPRIME COLLECTION ================
router.route("/inventario")
.get(function(req,res,next){
  //verifica que la colleccion a mostrar cumpla los requisitos el usuario que la creo y y muestre los archivos de la bodega por la que se solicita
  //req.query.nombre_variable_a_mostrar esto enviado por get por el ?nombre_variable_a_mostrar=valor
  Inventario.find({bodega:req.query.bodega})
  .sort({mp:1})
  .exec(function(err,inventarios){
    if(err){res.redirect("/"); return;}
    var cont = 1;
    var valorTotal = 0;
    inventarios.forEach(function(inventario){
      cont++;
      valorTotal = valorTotal + inventario.valorTotalG;
      if(cont > inventarios.length){
        res.render("app/inventario"+req.query.bodega+"/index.ejs", { inventarios: inventarios, valorTotal: valorTotal });
      }

    });
  });
})
.post(validaciones,function(req,res,next){
  //crea doble materia prima una para la principal y otra para auxiliar
  const data= [
  {
  	mp : req.body.mp,
  	cantidadTotal : 0,
  	presentacion : req.body.presentacion,
  	valorUni : 0,
  	valorG : 0,
  	stock : 0,
    valorTotalG : 0,
    stockReal: 0,
    diferencia: 0,
    valorDif: 0,
  	bodega : "principal",
  },
  {
    mp : req.body.mp,
    cantidadTotal : 0,
    presentacion : req.body.presentacion,
    valorUni : 0,
    valorG : 0,
    stock : 0,
    valorTotalG : 0,
    stockReal: 0,
    diferencia: 0,
    valorDif: 0,
    bodega : "auxiliar",
  }
];
//recorre el arreglo producto por producto
var done = 0;
//for(var i = 0; i < inventarios.length; i++){
for(var i = 0; i < data.length; i++){
	//save each product of the array in the model and database
	var inventario = new Inventario(data[i])
	inventario.save(function(err,result){
    if(!err){
      done++;
      if(done === data.length){
        res.redirect("/app/inventario?bodega=principal");
      //  exit(res);
      }
    }
    else{
      console.log(err);
    }
	});
}

});

module.exports = router;

// se hizo esta funcion para desconectar el servidor debido a que el servidor trabaja de manera
//asyncrona entonces causaria un error  y no dejaria guardar  los productos
function exit(){
	mongoose.disconnect();
  res.redirect("/app/inventario");
}

function validaciones(req,res,next){
		//aqui se valida con express-validator
		req.checkBody('mp','Invalid materia prima').notEmpty();
		req.checkBody('presentacion','Invalid presentacion').notEmpty();


		var errors = req.validationErrors(true);//almacena todos los errores
		if(errors){
			var messages = [];
			for(var type in errors){
				messages.push(errors[type].msg);
				console.log(errors[type].msg);
			}
			req.flash("error",messages);
      if(!req.params.id){
        res.redirect("/app/inventario/new");//devuelve la cadena de mensajes
      }
      else{
        res.redirect("/app/inventario/"+req.params.id+"/edit");//devuelve la cadena de mensajes
      }
		}
		else{
			return next();
		}
};
