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
  Elaborado.find({})
  .populate("proc")
  .exec(function(err,elaborados){
    if(err){ res.redirect("/app"); return; }
		res.render("app/empaque/elaborado/index.ejs", { messages: req.flash("error"), elaborados:elaborados });
  });
  /*Produccion.find({"tipo": req.query.tipo})
  .populate("prod")
  .sort({hora: -1})
  .exec(function(err,produccion){
    if(err){ res.redirect("/app"); return; }
		res.render("app/inventarioauxiliar/produccion/index.ejs", { messages: req.flash("error"), produccion:produccion });
  });*/
});
router.post("/elaborado",validaciones,function(req,res,next){
  Empacado_Form(req,function(block,){
    if(block == true){
      //Empacado_Regis(req, res);
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
    var elaborado = parseInt(req.body.empacado) + parseInt(req.body.averias);
    var Prediferencia = produccion.diferencia;

    produccion.turno = produccion.turno + 1;
    //produccion.empacado = req.body.empacado;
    //produccion.averias = req.body.averias;
    produccion.diferencia = produccion.diferencia == 0 ? parseInt(produccion.cantidad) - elaborado : parseInt(produccion.diferencia) - elaborado ;
    // produccion.diferencia = 0;
    // produccion.diferenciaPor = 0;
    // produccion.turno = 0;
    produccion.averiasPor = Prediferencia == 0 ? (req.body.averias / produccion.cantidad) : req.body.averias / Prediferencia;
    produccion.diferenciaPor = Prediferencia == 0 ? produccion.diferencia / produccion.cantidad : produccion.diferencia / Prediferencia;
    console.log("dif:"+produccion.diferencia);
    console.log("averiasPor:"+produccion.averiasPor);
    console.log("difPor:"+produccion.diferenciaPor);
    console.log("turno:"+produccion.turno);
    if(produccion.diferencia >= 0 && produccion.turno <= 3){
      var now = Date.now();
      var date = dateFormat(now, "d/m/yyyy");
      var hora = dateFormat(now, "d/m/yyyy, h:MM:ss TT");

      var data = {
        fecha: date,
        hora: hora,
        empacado: req.body.empacado,
        averias: req.body.averias,
        averiasPor: produccion.averiasPor,
        diferencia: produccion.diferencia,
        diferenciaPor: produccion.diferenciaPor,
        turno : produccion.turno,
        proc: req.body.proc
        }
      var elaborado = new Elaborado(data);
      elaborado.save(function(err){
        if(!err){ return callback(true); } //res.redirect("/app/produccion"); }
        else{ console.log(err); }
      });
    }
    else{
      return callback(false);
    }
  });
}


// Metodo  para guardar registros de entradas y salidas
function Empacado_Regis(req, res){
  /*Produccion.findById(req.body.procc)
  .populate("prod")
  .exec(function(err,produccion){
    if(err){ res.redirect("/app"); return; }
    var elaborado = parseInt(req.body.empacado) + parseInt(req.body.averias);
    var Prediferencia = produccion.diferencia;

    produccion.turno = produccion.turno + 1;
    produccion.empacado = req.body.empacado;
    produccion.averias = req.body.averias;
    produccion.diferencia = produccion.diferencia == 0 ? parseInt(produccion.cantidad) - elaborado : parseInt(produccion.diferencia) - elaborado ;
    // produccion.diferencia = 0;
    // produccion.diferenciaPor = 0;
    // produccion.turno = 0;
    produccion.averiasPor = Prediferencia == 0 ? (produccion.averias / produccion.cantidad) : produccion.averias / Prediferencia;
    produccion.diferenciaPor = Prediferencia == 0 ? produccion.diferencia / produccion.cantidad : produccion.diferencia / Prediferencia;
    console.log("dif:"+produccion.diferencia);
    console.log("averiasPor:"+produccion.averiasPor);
    console.log("difPor:"+produccion.diferenciaPor);
    console.log("turno:"+produccion.turno);
    if(produccion.diferencia >= 0 && produccion.turno <= 3){
      produccion.save(function(err){
        console.log("hola");
       //return callback(true);
      });
    }
    else{
      return callback(false);
    }
  });
  /*var now = Date.now();
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
  });*/
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
