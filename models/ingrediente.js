var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ingrediente_schema = new Schema({
  cantidad: {type: Number, required: true},
  cantidadG: {type: Number, required: true},
  prod: {type: Schema.Types.ObjectId, ref: "Producto"},//ref al id de la collecion inventario
  inv: {type: Schema.Types.ObjectId, ref: "Inventario"},//ref al id de la collecion inventario
});

module.exports = mongoose.model("Ingrediente",ingrediente_schema);
