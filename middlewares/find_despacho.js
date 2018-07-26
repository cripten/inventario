var Despacho = require("../models/despacho");

module.exports = function(req,res,next){
  Despacho.findById(req.params.id,function(err,despacho){
    if(despacho != null){
      //permite que este disponible en todas las vistas
      res.locals.despacho = despacho;
      next();
    }
    else{
      console.log("problemas");
      res.redirect("/app/despacho");
    }
  });
}
