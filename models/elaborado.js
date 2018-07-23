var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var elaborado_schema = new Schema({
  empacado:{type: Number, required: true},
  averias:{type: Number, required: true},
  averiasPor:{type: Number, required: true},
  diferencia:{type: Number, required: true},
  diferenciaPor:{type: Number, required: true},
  turno:{type: Number, required: true},
  proc: {type: Schema.Types.ObjectId, ref: "Produccion"},
  prod: {type: Schema.Types.ObjectId, ref: "Producto"}
});

module.exports = mongoose.model("Elaborado",elaborado_schema);
