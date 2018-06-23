var Inventario = require("../models/inventario");

module.exports = function(req,res,next){
  Inventario.findById(req.params.id,function(err,inventario){
    if(inventario != null){
      //permite que este disponible en todas las vistas
      res.locals.inventario = inventario;
      next();
    }
    else{
      console.log("problemas");
      res.redirect("/app/inventario");
    }
  });
}
