var express = require("express");
var router = express.Router();
var Inventario = require("../models/inventario");
var InOut = require("../models/inOut");
var Ingrediente = require("../models/ingrediente");
var Produccion = require("../models/produccion");
var flash = require("connect-flash");
var find_inOut = require("../middlewares/find_inOut");
var dateFormat = require("dateformat");
var mongoose = require('mongoose');
//InOut =========================
// Nueva entrada o salida
router.get("/produccion/new",function(req,res,next){
  Producto.find({})
  .sort({nombre:1})
  .exec(function(err,productos){
    if(err){ console.log(err); return; }
    res.render("app/inventarioauxiliar/produccion/new.ejs",{ messages: req.flash("error"), productos:productos });
  });
});

router.route("/produccion/:id")
.delete(function(req,res,next){
  SumRest_Stock(req, function(block){
    console.log(block);
    if(block){
      console.log("hola");
      req.flash("error","no se puede hacer la devolucion");
      res.redirect("/app/inOut?tipo="+req.body.tipo);
    }
    else{
      InOut.findOneAndRemove({ _id:req.params.id},function(err){
        if(!err){
    			res.redirect("/app/inventario?bodega="+req.body.bodega);
    		}
    		else{
    			console.log(err);
    			res.redirect("/app/inventario?bodega="+req.body.bodega);
    		}
      });
    }
  });
});

//ENTRADAS Y SALIDAS COLLECTION ================
router.get("/produccion",function(req,res,next){
  InOut.find({"tipo": req.query.tipo})
  .populate("inv")
  .sort({estado: -1})
  .exec(function(err,inOut){
    console.log(inOut);
    if(err){ res.redirect("/app"); return; }

		res.render("app/"+req.query.bodega+"/"+req.query.tipo+"/index.ejs", { messages: req.flash("error"), inOut:inOut });
  });
});
router.post("/produccion",function(req,res,next){
  SumRest_Stock(req,function(block){
    if(block){
      Regis_Out(req,res);
    }else{

    }
  });

});
module.exports = router;

//=============================METODOS====================================================
// Metodo  para sumar(entradas) y restar(salidas) del stock  de una materia prima
function SumRest_Stock(req,callback){
  Ingrediente.find({"prod": req.body.prod})
  .populate("prod inv")
  .exec(function(err, ingredientes){
    console.log(ingredientes);
    ingredientes.forEach(function(ingrediente){
      console.log("segunda")
      console.log(ingrediente);
      console.log(ingrediente.inv._id);
      Inventario.findOne({"_id": ingrediente.inv._id},function(err,inventario){
        console.log("tercero")
        console.log(inventario);
        console.log(inventario.mp);
        //callback(true);
      });
    });

  });
  /*Inventario.findById(req.body.inv,function(err,inventario){
    if(err){ res.redirect("/"); return; }
    if((req.body.cantidad * req.body.presentacion) > inventario.stock && req.body.dev == "devolucion"){
      console.log("epa");
      return callback(true);
    }
    if((req.body.cantidad * req.body.presentacion) > inventario.stock && req.body.tipo == "salida"){
      return callback(true);
      //res.redirect("/app/inOut?tipo=salida");
    }
    else{
      if(req.body.tipo == "entrada"){
        //pasa por aca si se va a editar la entrada
        if(req.body.dev == "devolucion"){
          inventario.stock = inventario.stock - (req.body.cantidad * req.body.presentacion);
        }
        else{
          inventario.valorUni = (inventario.presentacion*req.body.valorUni)/req.body.presentacion;
          inventario.valorG = req.body.valorUni/req.body.presentacion;
          inventario.stock = inventario.stock + (req.body.cantidad * req.body.presentacion);
        }

      }
      else{
        inventario.stock = inventario.stock - (req.body.cantidad * req.body.presentacion);
      }

      inventario.cantidadTotal = inventario.stock/inventario.presentacion;

      inventario.save(function(err){
        if(!err){
          return callback(false);
        }
        else{
          console.log(err);
          //res.redirect("/app/entrada/"+req.params.id);
        }
      });
    }
  });*/
};

// Metodo  para guardar registros de entradas y salidas
function Regis_InOut(req, res){
  var now = Date.now();
  var date = dateFormat(now, "d/m/yyyy");
  var hora = dateFormat(now, "d/m/yyyy, h:MM:ss TT");

  var data = {
    fecha: date,
    hora: hora,
    cantidad: req.body.cantidad,
    valorUni: req.body.valorUni,
    valorG: req.body.valorUni/req.body.presentacion,
    estado: "pendiente",
    prod: req.body.inv
    }
  var produccion = new Produccion(data);
  produccion.save(function(err){
    if(!err){
      res.redirect("/app/inOut?tipo="+req.body.tipo+"&bodega="+req.body.bodega);
    }
    else{
      console.log(err);
    }
  });
}

function validaciones(req,res,next){
		//aqui se valida con express-validator
    req.checkBody('cantidad','Invalid cantidad').notEmpty();
		req.checkBody('peso','Invalid peso').notEmpty();
    req.checkBody('peso crudo','Invalid peso crudo').notEmpty();


		var errors = req.validationErrors(true);//almacena todos los errores
		if(errors){
			var messages = [];
			for(var type in errors){
				messages.push(errors[type].msg);
				console.log(errors[type].msg);
			}
			req.flash("error",messages);
			res.redirect("/app/produccion/new");//devuelve la cadena de mensajes
		}
		else{
			return next();
		}
};
