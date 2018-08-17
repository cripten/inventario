var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var orden_schema = new Schema({
  fecha:{type: String},
  hora: {type: String},
  codigo:{type: String, required: true},
  peso: {type: Number, required: true},
  pesoCrud:{type: Number, required: true},
  cantidad:{type: Number, required: true},
  ord_comp:{type: String, required: true},
  fecha_prod:{type: String, required: true},
  fecha_ent:{type: String, required: true},
  estado:{type: String, required: true},
  client:{type: Schema.Types.ObjectId, ref:"Cliente"},
  prod: {type: Schema.Types.ObjectId, ref: "Producto"}//ref al id de la collecion inventario
});

module.exports = mongoose.model("Orden",orden_schema);
