var Orden = require("../models/orden");

module.exports = function(req,res,next){
  Orden.findById(req.params.id)
    .populate("client")
    .exec(function(err,orden){
      if(orden != null){
        //permite que este disponible en todas las vistas
        res.locals.orden = orden;
        next();
      }
      else{
        console.log("problemas");
        res.redirect("/app/orden");
      }
  });
}
