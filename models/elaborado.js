var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var elaborado_schema = new Schema({
  fecha:{type: String, required: true},
  hora:{type: String, required: true},
  fecha_ven:{type: String, required: true},
  empacado:{type: Number, required: true},
  averias:{type: Number, required: true},
  averiasPor:{type: Number, required: true},
  diferencia:{type: Number, required: true},
  diferenciaPor:{type: Number, required: true},
  turno:{type: Number, required: true},
  ord: {type: Schema.Types.ObjectId, ref: "Orden"},
  proc: {type: Schema.Types.ObjectId, ref: "Produccion"},
  prod: {type: Schema.Types.ObjectId, ref: "Producto"}
});

module.exports = mongoose.model("Elaborado",elaborado_schema);
