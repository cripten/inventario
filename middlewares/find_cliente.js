var Cliente = require("../models/cliente");

module.exports = function(req,res,next){
  Cliente.findById(req.params.id,function(err,cliente){
    if(cliente != null){
      //permite que este disponible en todas las vistas
      res.locals.cliente = cliente;
      next();
    }
    else{
      console.log("problemas");
      res.redirect("/app/cliente");
    }
  });
}
