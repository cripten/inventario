var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var totalIngr_schema = new Schema({
  totalProd: {type: Number, required: true},
  ord: {type: Schema.Types.ObjectId, ref: "Orden"},
  prod: {type: Schema.Types.ObjectId, ref: "Producto"},//ref al id de la collecion inventario
  inv: {type: Schema.Types.ObjectId, ref: "Inventario"}//ref al id de la collecion inventario
});

module.exports = mongoose.model("TotalIngr",totalIngr_schema);
