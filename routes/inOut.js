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
		res.render("app/inventarioprincipal/entrada/index.ejs", { messages: req.flash("error"), inOut:inOut });
  });
});
//all routes with this path use this middleware for refactor code
router.all("/inOut/:id*",find_inOut);
//-----------------------------------------------------
// edit materieprime form
router.get("/inOut/:id/edit",function(req,res,next){
  res.render("app/"+req.query.bodega+"/"+req.query.tipo+"/edit.ejs",{ messages: req.flash("error") });
});

router.route("/inOut/:id")
.get(function(req,res,next){
})
.put(validaciones,function(req,res,next){
  Edit_Stock(req,res,function(block){
    if(block){
      req.flash("error","La salida no se puede realizar por falta de materia prima");
      res.redirect("/app/inOut?tipo="+req.body.tipo+"&bodega="+req.body.bodega);
    }else{
      /*var now = Date.now();
      var date = dateFormat(now, "d/m/yyyy");
      var hora = dateFormat(now, "d/m/yyyy, h:MM:ss TT");*/

      //res.locals.inOut.fecha = date;
      //res.locals.inOut.hora = hora;
      res.locals.inOut.numFact = req.body.numFact;
      res.locals.inOut.marca = req.body.marca;
      res.locals.inOut.cantidad = req.body.cantidad;
      res.locals.inOut.presentacion = req.body.presentacion;
      res.locals.inOut.valorUni = req.body.valorUni;
      res.locals.inOut.valorG = req.body.valorUni/req.body.presentacion;
      //res.locals.inOut.inv = req.body.inv;
      res.locals.inOut.save(function(err){
        if(!err){
    			res.redirect("/app/inventario?bodega=principal");
    		}
    		else{
    			console.log(err);
    		}
      });
    }
  });
})
.delete(function(req,res,next){
  Devolucion_Stock(req, function(block){
    console.log(block);
    if(block){
      console.log("hola");
      req.flash("error","no se puede hacer la devolucion");
      res.redirect("/app/inOut?tipo="+req.body.tipo+"&bodega="+req.body.bodega);
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

		res.render("app/inventario"+req.query.bodega+"/"+req.query.tipo+"/index.ejs", { messages: req.flash("error"), inOut:inOut });
  });
});

router.post("/inOut",validaciones,function(req,res,next){
  SumRest_Stock(req, function(block,valorUni){
    if(block){
      req.flash("error","no se puede sacar del inventario actual");
      res.redirect("/app/inOut?tipo="+req.body.tipo+"&bodega="+req.body.bodega);
    }
    else{
      Regis_InOut(req,res,valorUni);
    }
  });
});
//routa para aprobar la entradas y llenar el inventario auxiliar con la entrada
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
        inventario.valorUni = inOut.valorUni;
        inventario.valorG = inOut.valorG;
        inventario.cantidadTotal = inventario.stock/inOut.inv.presentacion;
        inventario.save(function(err){
          res.redirect("/app/inOut?tipo=salida&bodega=auxiliar");
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

function Edit_Stock(req,res,callback){
  Inventario.findById(req.body.inv,function(err,inventario){
    if(err){ res.redirect("/"); return; }
    console.log(inventario);
    if(req.body.tipo == "entrada"){
      inventario.valorUni = (inventario.presentacion*req.body.valorUni)/req.body.presentacion;
      inventario.valorG = Number((req.body.valorUni/req.body.presentacion).toFixed(2));
      inventario.stock = (inventario.stock - (res.locals.inOut.cantidad * res.locals.inOut.presentacion)) + (req.body.cantidad * req.body.presentacion);
    }else{
      inventario.stock = (inventario.stock + (res.locals.inOut.cantidad * res.locals.inOut.presentacion)) - (req.body.cantidad * req.body.presentacion);
    }
    inventario.cantidadTotal = inventario.stock/inventario.presentacion;
    inventario.valorTotalG = Number((inventario.valorG * inventario.cantidadTotal * inventario.presentacion ).toFixed(2));
    if(inventario.stock < 0){
      return callback(true);
    }
    else{
      inventario.save(function(err){
          if(!err){
            return callback(false);
          }
          else{
            console.log(err);
          }
      });
    }
  });
}
//=============================METODOS====================================================
// Metodo  para hacer devoluciones(entradas y salidas) del stock  de una materia prima
function Devolucion_Stock(req,callback){
  Inventario.findById(req.body.inv,function(err,inventario){
    if(err){ res.redirect("/"); return; }
    if(req.body.tipo == "entrada"){
      if(inventario.stock >= (req.body.cantidad * req.body.presentacion) && req.body.dev == "devolucion"){
        inventario.stock = inventario.stock - (req.body.cantidad * req.body.presentacion);
      }
    }else{
      console.log(req.body.cantidad * req.body.presentacion);
      if(req.body.dev == "devolucion"){
        console.log("hola");
        inventario.stock = inventario.stock + (req.body.cantidad * req.body.presentacion);
      }
    }
    inventario.cantidadTotal = inventario.stock/inventario.presentacion;
    inventario.valorTotalG = Number((inventario.valorG * inventario.cantidadTotal * inventario.presentacion ).toFixed(2));
    inventario.save(function(err){
        if(!err){
          return callback(false);
        }
        else{
          console.log(err);
        }
    });
  });
};

function SumRest_Stock(req,callback){
  Inventario.findById(req.body.inv,function(err,inventario){
    if(err){ res.redirect("/"); return; }
    //si se quiere hacer una salida pero lo que se quiere sacar es mayor a lo que hay
    if((req.body.cantidad * req.body.presentacion) > inventario.stock && req.body.tipo == "salida"){
      return callback(true,inventario.valorUni);
    }
    if(req.body.tipo == "entrada"){
      inventario.valorUni = (inventario.presentacion*req.body.valorUni)/(req.body.presentacion);
      inventario.valorG = Number((req.body.valorUni/(req.body.presentacion)).toFixed(2));
      inventario.stock = inventario.stock + (req.body.cantidad * req.body.presentacion);
    }else{

      inventario.stock = inventario.stock - (req.body.cantidad * req.body.presentacion);
    }

    inventario.cantidadTotal = inventario.stock/inventario.presentacion;
    inventario.valorTotalG = Number((inventario.valorG * inventario.cantidadTotal * inventario.presentacion ).toFixed(2));

    inventario.save(function(err){
      if(!err){
        return callback(false,inventario.valorUni);
      }
      else{
        console.log(err);
      }
    });
  });
};

// Metodo  para guardar registros de entradas y salidas
function Regis_InOut(req, res, valorUni){
  var now = Date.now();
  var date = dateFormat(now, "d/m/yyyy");
  var hora = dateFormat(now, "d/m/yyyy, h:MM:ss TT");
  var valorG =  valorUni /req.body.presentacion;
  var data = {
    fecha: date,
    hora: hora,
    marca: req.body.marca,
    cantidad: req.body.cantidad,
    presentacion: req.body.presentacion,
    valorUni: valorUni,
    valorG:  Number(valorG.toFixed(2)),
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
  /*if(req.body.tipo == "salida"){
      Inventario.findById(req.body.inv,function(err,inventario){
        var valorUni = inventario.valorUni;
        var now = Date.now();
        var date = dateFormat(now, "d/m/yyyy");
        var hora = dateFormat(now, "d/m/yyyy, h:MM:ss TT");
        var valorG = valorUni/req.body.presentacion;
        var data = {
          fecha: date,
          hora: hora,
          marca: req.body.marca,
          cantidad: req.body.cantidad,
          presentacion: req.body.presentacion,
          valorUni: valorUni,
          valorG:  Number(valorG.toFixed(2)),
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
      });
  }
  else{
    var now = Date.now();
    var date = dateFormat(now, "d/m/yyyy");
    var hora = dateFormat(now, "d/m/yyyy, h:MM:ss TT");
    var valorG =  req.body.valorUni /req.body.presentacion;
    var data = {
      fecha: date,
      hora: hora,
      marca: req.body.marca,
      cantidad: req.body.cantidad,
      presentacion: req.body.presentacion,
      valorUni: req.body.valorUni,
      valorG:  Number(valorG.toFixed(2)),
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
  }*/

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
