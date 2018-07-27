var MateriaPrima = require("../models/materiaprima");

module.exports = function(req,res,next){
  MateriaPrima.findById(req.params.id)
    .populate("provee")
    .exec(function(err,materiaprima){
      if(materiaprima != null){
        //permite que este disponible en todas las vistas
        res.locals.materiaprima = materiaprima;
        next();
      }
      else{
        console.log("problemas");
        res.redirect("/app/materiaprima");
      }
  });
}
