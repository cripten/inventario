var ProductoTer = require("../models/productoTer");

module.exports = function(req,res,next){
  ProductoTer.findById(req.params.id,function(err,productoTer){
    if(productoTer != null){
      //permite que este disponible en todas las vistas
      res.locals.productoTer = productoTer;
      next();
    }
    else{
      console.log("problemas");
      res.redirect("/app/productoTer");
    }
  });
}
