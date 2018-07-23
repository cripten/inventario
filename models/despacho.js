var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var elaborado_schema = new Schema({
  fecha_ven:{type: Date, required: true},
  caja:{type: Number, required: true},
  bolsa:{type: Number, required: true},
  unidadCaja:{type: Number, required: true},
  unidadbolsa:{type: Number, required: true},
  total:{type: Number, required: true},
  totalGeneral:{type: Number, required: true},
  prodTer: {type: Schema.Types.ObjectId, ref: "ProductoTer"},
});

module.exports = mongoose.model("Elaborado",elaborado_schema);
