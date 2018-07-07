var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var elaborado_schema = new Schema({
  nombre:{type: String, required: true},
  stock:{type: String, required: true},
  empacado:{type: Number, required: true},
  averias:{type: Number, required: true},
  averiasPor:{type: Number, required: true},
  diferencia:{type: Number, required: true},
  diferenciaPor:{type: Number, required: true},
  proc: {type: Schema.Types.ObjectId, ref: "Produccion"},
  prodTer: {type: Schema.Types.ObjectId, ref: "ProductoTer"},//ref al id de la collecion inventario
});

module.exports = mongoose.model("Elaborado",elaborado_schema);
