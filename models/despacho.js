var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var despacho_schema = new Schema({
  caja:{type: Number, required: true},
  bolsa:{type: Number, required: true},
  unidadCaja:{type: Number, required: true},
  unidadbolsa:{type: Number, required: true},
  total:{type: Number, required: true},
  prodTer: {type: Schema.Types.ObjectId, ref: "ProductoTer"},
  proc: {type: Schema.Types.ObjectId, ref: "Produccion"},
});

module.exports = mongoose.model("despacho",despacho_schema);
