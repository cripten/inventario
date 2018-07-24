var express = require("express");
var router = express.Router();
var Inventario = require("../models/inventario");
var InOut = require("../models/inOut");
var Producto = require("../models/producto");
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
  Produccion.find({"tipo": req.query.tipo})
  .populate("prod")
  .sort({hora: -1})
  .exec(function(err,produccion){
    if(err){ res.redirect("/app"); return; }
		res.render("app/inventarioauxiliar/produccion/index.ejs", { messages: req.flash("error"), produccion:produccion });
  });
});
router.post("/produccion",validaciones,function(req,res,next){
  SumRest_Stock(req,function(block){
    if(block == true){
      Regis_Out(req,res);
    }else{
      req.flash("error","no se puede realizar la accion debido a que no hay suficiente materia prima en el stock ");
      res.redirect("/app/produccion/new");//devuelve la cadena de mensajes
    }
  });

});
module.exports = router;

//=============================METODOS====================================================
// Metodo  para sumar(entradas) y restar(salidas) del stock  de una materia prima
function SumRest_Stock(req,callback){
  var done = 0;
  var pase = true;
  Ingrediente.find({"prod": req.body.prod})
  .populate("prod inv")
  .exec(function(err, ingredientes){//se busca los ingredientes a base del producto a realizar
    //se recorre los documentos de ingredientes
    ingredientes.forEach(function(ingrediente){
      // se busca el ingrediente en el inventario por el id para hacer operaciones con el stock
      Inventario.findOne({"_id": ingrediente.inv._id,"bodega":"auxiliar"},function(err,inventario){
        if(err){ res.redirect("/"); return; }
        // se calcula la cantidad necesaria de cada ingrediente para hacer el la cantidad del producto
        var totalProduccion = ingrediente.cantidadG * req.body.cantidad * req.body.pesoCrud;
        totalProduccion = Math.trunc(totalProduccion);
        console.log(totalProduccion);
        console.log(inventario.stock);
        // si la cantidad a producir es menor a lo que hay en el stock del ingrediente
        if(inventario.stock > totalProduccion && pase == true){
          //se resta del stock del ingrediente lo que se va a producir
          inventario.stock = inventario.stock - totalProduccion;//trunca el numero para que no lleve los decimales
          inventario.cantidadTotal = inventario.stock/inventario.presentacion;
          console.log(inventario.stock);
          console.log(inventario.cantidadTotal);
          // se guarda
          inventario.save(function(err){
            if(!err){}
            else{ console.log(err); }
          });
        }
        else{
          pase = false;
        }
        done++;
        if(done === ingredientes.length){
          return callback(pase);
        }
      });
    });

  });
};

// Metodo  para guardar registros de entradas y salidas
function Regis_Out(req, res){
  var now = Date.now();
  var date = dateFormat(now, "d/m/yyyy");
  var hora = dateFormat(now, "d/m/yyyy, h:MM:ss TT");

  var data = {
    fecha: date,
    hora: hora,
    fecha_ven: "vacio",
    cantidad: req.body.cantidad,
    peso: req.body.peso,
    pesoCrud: req.body.pesoCrud,
    lote: req.body.lote,
    empacado:0,
    averias:0,
    averiasPor:0,
    diferencia:0,
    diferenciaPor:0,
    estado: "pendiente",
    turno: 0,
    prod: req.body.prod,
    }
  var produccion = new Produccion(data);
  produccion.save(function(err){
    if(!err){ res.redirect("/app/produccion"); }
    else{ console.log(err); }
  });
}

function validaciones(req,res,next){
		//aqui se valida con express-validator
    req.checkBody('cantidad','Invalid cantidad').notEmpty();
		req.checkBody('peso','Invalid peso').notEmpty();
    req.checkBody('pesoCrud','Invalid peso crudo').notEmpty();
    req.checkBody('lote','Invalid lote').notEmpty();


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
