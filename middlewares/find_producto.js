var Producto = require("../models/producto");

module.exports = function(req,res,next){
  Producto.findById(req.params.id,function(err,producto){
    if(producto != null){
      //permite que este disponible en todas las vistas
      res.locals.producto= producto;
      next();
    }
    else{
      console.log("problemas");
      res.redirect("/app/producto");
    }
  });
}
