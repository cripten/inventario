var InOut = require("../models/inOut");

module.exports = function(req,res,next){
  InOut.findById(req.params.id)
    .populate("inv")
    .exec(function(err,inOut){
      if(inOut != null){
        //permite que este disponible en todas las vistas
        res.locals.inOut = inOut;
        next();
      }
      else{
        console.log("problemas");
        res.redirect("/app/inventario");
      }
  });
}
