var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var inventario_schema = new Schema({
  mp:{type: String, required: true},
  cantidadTotal: {type: Number},
  presentacion:{type: Number, required: true},
  valorUni:{type: Number, required: true},
  valorG:{type: Number, required: true},
  stock: {type: Number},
  valorTotalG: {type: Number},
  stockReal: {type: Number},
  diferencia: {type: Number},
  valorDif: {type: Number},
  rango:{type: Number},
  bodega: {type: String, required: true}

});
inventario_schema.methods.entradaPrin = function(cantidad,presentacion){
  return this.stock + (cantidad * presentacion);
}
inventario_schema.methods.salidaPrin = function(cantidad,presentacion){
  return this.stock - (cantidad * presentacion);
}

module.exports = mongoose.model("Inventario",inventario_schema);
