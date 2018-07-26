var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var despachoRegis_schema = new Schema({
  caja:{type: Number, required: true},
  bolsa:{type: Number, required: true},
  unidadCaja:{type: Number, required: true},
  unidadBolsa:{type: Number, required: true},
  total:{type: Number, required: true},
  desp: {type: Schema.Types.ObjectId, ref: "Despacho"},
  proc: {type: Schema.Types.ObjectId, ref: "Produccion"}
});

module.exports = mongoose.model("despachoRegis",despachoRegis_schema);
