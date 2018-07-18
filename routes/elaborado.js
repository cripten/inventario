var express = require("express");
var router = express.Router();

//Modelos
var Inventario = require("../models/inventario");
var InOut = require("../models/inOut");
var Producto = require("../models/producto");
var Ingrediente = require("../models/ingrediente");
var Produccion = require("../models/produccion");
var Elaborado = require("../models/elaborado");
var ProductoTer = require("../models/productoTer");

var flash = require("connect-flash");
var find_inOut = require("../middlewares/find_inOut");
var dateFormat = require("dateformat");
var mongoose = require('mongoose');
//ELABORADO=========================
// Nuevo elaborado
router.get("/elaborado/new",function(req,res,next){
  Produccion.find({})
  .populate("prod")
  .sort({nombre:1})
  .exec(function(err,producciones){
    if(err){ console.log(err); return; }
    res.render("app/empaque/elaborado/new.ejs",{ messages: req.flash("error"), producciones:producciones });
  });
});
//entradas aprobadas para el producto terminado
router.get("/elaborado/entrada",function(req,res,next){
  Produccion.find({})
  .populate("prod")
  .sort({estado:-1})
  .exec(function(err,producciones){
    if(err){ console.log(err); return; }
    res.render("app/empaque/entrada.ejs",{ messages: req.flash("error"), producciones:producciones });
  });
});
//ruta para aprobar entradas de produccion y llenar el inventario de producto terminado
router.post("/elaborado/allow",function(req,res,next){
  Produccion.findById(req.body.allow)
  .populate("prod")
  .sort({nombre:1})
  .exec(function(err,produccion){
    produccion.estado = "aprobado";
    productoTer = produccion.prod.nombre+" X "+produccion.peso;
    console.log(productoTer);
    /*produccion.save(function(err){
      productoTer = produccion.prod.nombre+" X "+produccion.peso;
      ProductoTer.findOne({"nombre":productoTer},function(err,producto){
        if(err){ res.redirect("/app"); return; }
        producto.stock = producto.stock + parseInt(produccion.empacado);
        producto.averiasPor = produccion.averiasPor;
        producto.diferenciaPor = produccion.diferenciaPor;
        producto.save(function(err){
          res.redirect("/app/productoTer");
        });
      });
    });
    produ
    if(err){ console.log(err); return; }
    res.render("app/empaque/entrada.ejs",{ messages: req.flash("error"), producciones:producciones });*/
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
router.get("/elaborado",function(req,res,next){
  Produccion.find({"tipo": req.query.tipo})
  .populate("prod")
  .sort({hora: -1})
  .exec(function(err,produccion){
    if(err){ res.redirect("/app"); return; }
		res.render("app/inventarioauxiliar/produccion/index.ejs", { messages: req.flash("error"), produccion:produccion });
  });
});
router.post("/elaborado",validaciones,function(req,res,next){
  Empacado_Form(req,function(block){
    if(block == true){
      Regis_Elbo(req, res){
    }else{
      req.flash("error","no se puede realizar la accion");
      res.redirect("/app/elaborado/new");//devuelve la cadena de mensajes
    }
  });
});
module.exports = router;
//=============================METODOS====================================================
// Metodo  para sumar(entradas) y restar(salidas) del stock  de una materia prima
function Empacado_Form(req,callback){
  Produccion.findById(req.body.procc)
  .populate("prod")
  .exec(function(err,produccion){
    if(err){ res.redirect("/app"); return; }
    produccion.empacado = req.body.empacado;
    produccion.averias = req.body.averias;
    produccion.diferencia = parseInt(produccion.faltante) + (parseInt(produccion.cantidad) - (parseInt(req.body.empacado) + parseInt(req.body.averias)));
    if(produccion.faltante < 0 produccion.faltante > produccion.cantidad){
      produccion.averiasPor = produccion.averias / produccion.cantidad;
      produccion.save(function(err){
        return callback(true);
      });
    }
    else{
      return callback(false);
    }
  });
};

// Metodo  para guardar registros de entradas y salidas
function Regis_Elbo(req, res){
  var now = Date.now();
  var date = dateFormat(now, "d/m/yyyy");
  var hora = dateFormat(now, "d/m/yyyy, h:MM:ss TT");

  var data = {
    fecha: date,
    hora: hora,
    empacado: req.body.empacado,
    averias: req.body.averias,
    averiasPor:,
    diferencia:,
    diferenciaPor:,
    turno:,
    proc:
    }
  var produccion = new Produccion(data);
  produccion.save(function(err){
    if(!err){ res.redirect("/app/produccion"); }
    else{ console.log(err); }
  });
}

function validaciones(req,res,next){
		//aqui se valida con express-validator
    req.checkBody('empacado','Invalid cantidad').notEmpty();
		req.checkBody('averias','Invalid peso').notEmpty();

		var errors = req.validationErrors(true);//almacena todos los errores
		if(errors){
			var messages = [];
			for(var type in errors){
				messages.push(errors[type].msg);
				console.log(errors[type].msg);
			}
			req.flash("error",messages);
			res.redirect("/app/elaborado/new");//devuelve la cadena de mensajes
		}
		else{
			return next();
		}
};
