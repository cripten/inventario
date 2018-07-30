var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ordenPedido_schema = new Schema({
  fecha:{type: String},
  hora: {type: String},
  codigo:{type: String, required: true},
  nombre:{type: String, required: true},
  total:{type: Number, required: true},
  fecha_ent:{type: String, required: true},
  estado:{type: String, required: true},
  ord:{type: Schema.Types.ObjectId, ref:"cliente"}
});

module.exports = mongoose.model("OrdenPedido",ordenPedido_schema);
