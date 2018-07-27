var Proveedor = require("../models/proveedor");

module.exports = function(req,res,next){
  Proveedor.findById(req.params.id,function(err,proveedor){
    if(proveedor != null){
      //permite que este disponible en todas las vistas
      res.locals.proveedor= proveedor;
      next();
    }
    else{
      console.log("problemas");
      res.redirect("/app/proveedor");
    }
  });
}
