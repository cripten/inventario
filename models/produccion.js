var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var produccion_schema = new Schema({
  fecha:{type: String, required: true},
  hora: {type: String},
  cantidad: {type: Number, required: true},
  peso: {type: Number, required: true},
  pesoCrud:{type: Number, required: true},
  lote:{type: Number},
  empacado:{type: Number, required: true},
  averias:{type: Number, required: true},
  averiasPor:{type: Number, required: true},
  diferencia:{type: Number, required: true},
  diferenciaPor:{type: Number, required: true},
  estado: {type: String},
  faltante:{type: Number, required: true},
  prod: {type: Schema.Types.ObjectId, ref: "Producto"},//ref al id de la collecion inventario

});

module.exports = mongoose.model("Produccion",produccion_schema);
