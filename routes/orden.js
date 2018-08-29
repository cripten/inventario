var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var Cliente = require("../models/cliente");
var Producto = require("../models/producto");
var Orden = require("../models/orden");
var Ingrediente = require("../models/ingrediente");
var TotalIngr = require("../models/totalIngr");
var Inventario = require("../models/inventario");
var flash = require("connect-flash");
var find_orden = require("../middlewares/find_orden");
var dateFormat = require("dateformat");
var numeral = require('numeral');
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
//ENTRADAS Y SALIDAS COLLECTION ================
router.get("/parcial",function(req,res,next){
  TotalIngr.find({ord:req.query.ordid})
  .populate("prod inv ord")
  .exec(function(err,totalIngr){
    if(err){ res.redirect("/app"); return; }
		res.render("app/orden/ordenparcial/index.ejs", { messages: req.flash("error"), totalIngr:totalIngr });
  });
});
router.get("/mp",function(req,res,next){
  var done = 0;
  var valorTotal = 0;
  Inventario.find({bodega:"pedido", estado:"activo"})
  .exec(function(err,inventarios){
    if(err){console.log(err);}//res.redirect("/"); return;}
    inventarios.forEach(function(inventario){
      inventario.cantidadTotal = 0,
      inventario.valorUni = 0,
      inventario.valorG = 0,
      inventario.stock = 0,
      inventario.valorTotalG = 0 ,
      inventario.estado = "inactivo";
      console.log(inventario);
      valorTotal = valorTotal + inventario.valorTotalG;
      done++;
      inventario.save(function(err){
      });
    });
    if(done === inventarios.length){
      console.log(done);
      var string = numeral(valorTotal).format('0,0.0000');
      return res.redirect("/app/ordenMp");
    }
  });
});
//ENTRADAS Y SALIDAS COLLECTION ================
router.get("/ordenMp",function(req,res,next){
  var now = Date.now();
  var date = dateFormat(now, "d/m/yyyy");
  var datos = [];
  //sirve para quitar los duplicados de fecha  y luego poder ser usado para seleccionar la fecha de la materia prima a mostrar
  Orden.find({},function(err,orden){
      for(var i = 0; i < orden.length; i++){
        if(!datos.includes(orden[i].fecha_prod)){
          datos.push(orden[i].fecha_prod);
          console.log(orden[i].fecha_prod);
        }
      }
  });
  Inventario.find({bodega:"pedido", estado:"activo", fecha_prod:date})
  .sort({mp:1})
  .exec(function(err,inventarios){
    console.log(inventarios);
    if(err){console.log(err);}//res.redirect("/"); return;}
    if(inventarios.length > 0){
      var cont = 1;
      var valorTotal = 0;
      inventarios.forEach(function(inventario){
        cont++;
        valorTotal = valorTotal + inventario.valorTotalG;
        if(cont > inventarios.length){
          var string = numeral(valorTotal).format('0,0.0000');
          return res.render("app/orden/ordenMp/index.ejs", { inventarios: inventarios, valorTotal: string, fechas: datos });
          //next();
        }

      });
    }else{
      res.render("app/orden/ordenMp/index.ejs", { inventarios: {}, valorTotal:0, fechas:{} });
    }
  });

});
//Ruta para consultar una orden de materia prima por fecha ================
router.get("/proyeccionMp",function(req,res,next){
  var datos = [];
  Orden.find({},function(err,orden){
      for(var i = 0; i < orden.length; i++){
        if(!datos.includes(orden[i].fecha_prod)){
          datos.push(orden[i].fecha_prod);
          console.log(orden[i].fecha_prod);
        }
      }
  });
  Inventario.find({bodega:"pedido", estado:"activo", fecha_prod:req.query.fecha_prod})
  .sort({mp:1})
  .exec(function(err,inventarios){
    console.log(inventarios);
    if(err){console.log(err);}//res.redirect("/"); return;}
    var cont = 1;
    var valorTotal = 0;
    inventarios.forEach(function(inventario){
      cont++;
      valorTotal = valorTotal + inventario.valorTotalG;
      if(cont > inventarios.length){
        var string = numeral(valorTotal).format('0,0.0000');
        return res.render("app/orden/ordenMp/index.ejs", { inventarios: inventarios, valorTotal: string, fechas: datos });
          //next();
      }
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
  .populate("client prod")
  .sort({hora:1,estado:1})
  .exec(function(err,ordenes){
    if(err){res.redirect("/"); return;}
    res.render("app/orden/index.ejs", { ordenes: ordenes });
  });
})
.post(validaciones,function(req,res,next){
  Regis_Orden(req,function(orden){
    Regis_totalIngr(req,res,orden);
      //Regis_totalIngr(req,res,orden,function(orden){
        //Regis_ordMp(req2,res,orden);
      //});
  });
});

module.exports = router;

// Metodo  para guardar registros de ordenes
function Regis_Orden(req,callback){
  var now = Date.now();
  var date = dateFormat(now, "d/m/yyyy");
  var hora = dateFormat(now, "d/m/yyyy, h:MM:ss TT");
  var prod = req.body.fecha_prod.replace(/-/g, '\/');
  var ent = req.body.fecha_ent.replace(/-/g, '\/');
  const data=
  {
  	fecha : date,
    hora : hora,
    codigo : req.body.codigo,
    peso : req.body.peso,
    pesoCrud : req.body.pesoCrud,
  	cantidad : req.body.cantidad,
    ord_comp : req.body.ord_comp,
    fecha_prod: dateFormat(prod, "d/m/yyyy"),
    fecha_ent: dateFormat(ent, "d/m/yyyy"),
    estado: "pendiente",
    client: req.body.client,
    prod: req.body.prod
  }
	var orden = new Orden(data);
	orden.save(function(err,result){
    if(!err){
      return callback(orden._id);
    }
    else{
      console.log(err);
    }
	});

}
// Metodo  para guardar registros del total de cada ingrediente para la orden
function Regis_totalIngr(req,res,orden){
  //crea doble materia prima una para la principal y otra para auxiliar
  var done = 0;
  Ingrediente.find({"prod": req.body.prod})
  .populate("prod inv")
  .exec(function(err, ingredientes){//se busca los ingredientes a base del producto a realizar
    //se recorre los documentos de ingredientes
    ingredientes.forEach(function(ingrediente){
      // se calcula la cantidad necesaria de cada ingrediente para hacer el la cantidad del producto
      var totalProduccion = ingrediente.cantidadG * req.body.cantidad * req.body.pesoCrud;
      var totalSolicitado =  Math.trunc(totalProduccion * 1.10);
      totalProduccion = Math.trunc(totalProduccion);
      console.log(totalProduccion);
      const data=
      {
        totalProd: totalProduccion,
        totalSolid: totalSolicitado,
        ord: orden,
        prod: req.body.prod,
        inv: ingrediente.inv

      }
      var totalIngr = new TotalIngr(data);
      totalIngr.save(function(err){
        done++;
        if(done === ingredientes.length){
          Regis_ordMp(req,res,orden);
          //return callback(orden);
        }
      });
    });
  });
}

// Metodo  para guardar registros del total de cada ingrediente para la orden de materia prima
function Regis_ordMp(req,res,orden){
  var prod = req.body.fecha_prod.replace(/-/g, '\/');
  var done = 0;
  TotalIngr.find({"ord": orden})
  .populate("prod inv")
  .exec(function(err,totalIngr){//se busca los ingredientes a base del producto a realizar
    //se recorre los documentos de ingredientes
    console.log(totalIngr);
    totalIngr.forEach(function(ingrediente){
      // se calcula la cantidad necesaria de cada ingrediente para hacer el la cantidad del producto
      Inventario.findOne({"mp": ingrediente.inv.mp, "bodega": "principal"},function(err,principal){
        Inventario.findOne({"mp": ingrediente.inv.mp, "bodega": "pedido", "fecha_prod": dateFormat(prod, "d/m/yyyy")},function(err,pedido){
          console.log(pedido);
          if(pedido !== null){
            pedido.cantidadTotal = pedido.cantidadTotal + (ingrediente.totalSolid/pedido.presentacion),
          	pedido.valorUni = principal.valorUni,
          	pedido.valorG = principal.valorG,
          	pedido.stock = pedido.stock + ingrediente.totalSolid,
            pedido.valorTotalG = pedido.stock * pedido.valorG ,
            pedido.estado = "activo";
            pedido.save(function(err,result){
              done++;
              if(done === totalIngr.length){
                res.redirect("/app/ordenMp");
              }
            });
          }else{
            //crea doble materia prima una para la principal y otra para auxiliar
            const data = {
              mp : ingrediente.inv.mp,
              cantidadTotal : ingrediente.totalProd/ingrediente.inv.presentacion,
              presentacion : principal.presentacion,
              valorUni : principal.valorUni,
              valorG : principal.valorG,
              stock :  ingrediente.totalSolid,
              valorTotalG : ingrediente.totalSolid * principal.valorG,
              stockReal: 0,
              diferencia: 0,
              valorDif: 0,
              rango: 0,
              bodega : "pedido",
              estado: "activo",
              fecha_prod: dateFormat(prod, "d/m/yyyy"),
              }

              var newpedido = new Inventario(data)
              newpedido.save(function(err,result){
                done++;
                if(done === totalIngr.length){
                  res.redirect("/app/ordenMp");
                }
              });
          }
        });
      });
    });
  });
}


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
