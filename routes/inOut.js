var express = require("express");
var router = express.Router();
var Inventario = require("../models/inventario");
var InOut= require("../models/inOut");
var flash = require("connect-flash");
var find_inOut = require("../middlewares/find_inOut");
var dateFormat = require("dateformat");
var mongoose = require('mongoose');
//InOut =========================
// Nueva entrada o salida
router.get("/inOut/new",function(req,res,next){
  Inventario.find({bodega:"principal"})
  .sort({mp:1})
  .exec(function(err,inventarios){
    if(err){ console.log(err); return; }
    res.render("app/inventarioprincipal/"+req.query.tipo+"/new.ejs",{ messages: req.flash("error"), inventarios:inventarios });
  });
});
//Consultar historial de producto
router.get("/historial/:inv",function(req,res,next){
  InOut.find({"inv":req.params.inv,tipo:"entrada"})
  .populate("inv")
  .exec(function(err,inOut){
    console.log(inOut);
    if(err){ res.redirect("/app"); return; }
		res.render("app/inventarioprincipal/entrada/index.ejs", {inOut:inOut });
  });
});

//all routes with this path use this middleware for refactor code
router.all("/inOut/:id*",find_inOut);
//-----------------------------------------------------
// edit materieprime form
router.get("/inOut/:id/edit",function(req,res,next){
  Inventario.find({})
  .sort({mp:1})
  .exec(function(err,inventarios){
    if(err){ console.log(err); return; }
    res.render("app/"+req.query.tipo+"/edit.ejs",{ messages: req.flash("error"), inventarios:inventarios });
  });
});

router.route("/inOut/:id")
.get(function(req,res,next){
})
.put(validaciones,function(req,res,next){
  SumRest_Stock(req,res,next);

  var now = Date.now();
  var date = dateFormat(now, "d/m/yyyy");
  var hora = dateFormat(now, "d/m/yyyy, h:MM:ss TT");

  res.locals.inOut.fecha = date;
  res.locals.inOut.hora = hora;
  res.locals.inOut.numFact = req.body.numFact;
  res.locals.inOut.marca = req.body.nombre;
  res.locals.inOut.cantidad = req.body.cantidad;
  res.locals.inOut.precio = req.body.precio;
  res.locals.inOut.valorUni = req.body.valorUni;
  res.locals.inOut.valorG = req.body.valorUni/req.body.presentacion;
  res.locals.inOut.inv = req.body.inv;
  res.locals.inOut.save(function(err){
    if(!err){
			res.redirect("/app/inventario");
		}
		else{
			console.log(err);
		}
  });
})
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
router.get("/inOut",function(req,res,next){
  InOut.find({"tipo": req.query.tipo})
  .populate("inv")
  .sort({estado: -1})
  .exec(function(err,inOut){
    console.log(inOut);
    if(err){ res.redirect("/app"); return; }

		res.render("app/"+req.query.bodega+"/"+req.query.tipo+"/index.ejs", { messages: req.flash("error"), inOut:inOut });
  });
});

router.post("/inOut",validaciones,function(req,res,next){
  SumRest_Stock(req, function(block){
    if(block){
      req.flash("error","no se puede sacar del inventario actual");
      res.redirect("/app/inOut?tipo="+req.body.tipo+"&bodega="+req.body.bodega);
    }
    else{
      Regis_InOut(req,res);
    }
  });
});

router.post("/InOutAux",function(req,res,next){
  InOut.findOne({"_id": req.body.allow})
  .populate("inv")
  .exec(function(err,inOut){
    if(err){ res.redirect("/app"); return; }
    inOut.estado = "Aprobado";
    inOut.save(function(err){
      Inventario.findOne({"mp":inOut.inv.mp,"bodega":"auxiliar"},function(err,inventario){

        if(err){ res.redirect("/app"); return; }
        inventario.stock = inventario.stock + (parseInt(inOut.cantidad) * parseInt(inOut.presentacion));
        inventario.cantidadTotal = inventario.stock/inOut.inv.presentacion;
        inventario.save(function(err){
          res.redirect("/app/inOut?tipo=salida&bodega=inventarioauxiliar");
        });
      });
    });
  });

  //lo que se llevaba para los checked
  /*var done = 0;
  InOut.find({"_id": req.body.allow})
  .populate("inv")
  .exec(function(err,inOuts){
    if(err){ res.redirect("/app"); return; }
    inOuts.forEach(function(entrada){
      Inventario.findOne({"mp":entrada.inv.mp,"bodega":"auxiliar"},function(err,inventario){
        if(err){ res.redirect("/app"); return; }
        inventario.stock = inventario.stock + (parseInt(entrada.cantidad) * parseInt(entrada.presentacion));
        inventario.cantidadTotal = inventario.stock/entrada.presentacion;
        inventario.save(function(err){
          done++;
          if(done === inOuts.length){
            res.redirect("/app/inventario?bodega=auxiliar");
          }
        });
      });
      entrada.estado = "Aprobado";
      entrada.save(function(err){
      });
    });
  });*/
});
module.exports = router;

function SumStock_Aux(){

}
//=============================METODOS====================================================
// Metodo  para sumar(entradas) y restar(salidas) del stock  de una materia prima
function SumRest_Stock(req,callback){
  Inventario.findById(req.body.inv,function(err,inventario){
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
  });
};

// Metodo  para guardar registros de entradas y salidas
function Regis_InOut(req, res){
  var now = Date.now();
  var date = dateFormat(now, "d/m/yyyy");
  var hora = dateFormat(now, "d/m/yyyy, h:MM:ss TT");

  var data = {
    fecha: date,
    hora: hora,
    marca: req.body.marca,
    cantidad: req.body.cantidad,
    presentacion: req.body.presentacion,
    valorUni: req.body.valorUni,
    valorG: req.body.valorUni/req.body.presentacion,
    numFact: req.body.numFact,
    tipo: req.body.tipo,
    estado: req.body.tipo == "entrada" ? "permitido" : "pendiente",
    inv: req.body.inv
    }
  var inOut = new InOut(data);
  inOut.save(function(err){
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
    req.checkBody('marca','Invalid marca').notEmpty();
		req.checkBody('cantidad','Invalid cantidad').notEmpty();
    req.checkBody('presentacion','Invalid presentacion').notEmpty();
    req.checkBody('valorUni','Invalid valor unitario').notEmpty();
    req.checkBody('numFact','Invalid numero de factura').notEmpty();


		var errors = req.validationErrors(true);//almacena todos los errores
		if(errors){
			var messages = [];
			for(var type in errors){
				messages.push(errors[type].msg);
				console.log(errors[type].msg);
			}
			req.flash("error",messages);
			res.redirect("/app/inOut/new?tipo="+req.body.tipo);//devuelve la cadena de mensajes
		}
		else{
			return next();
		}
};
