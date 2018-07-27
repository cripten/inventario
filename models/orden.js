var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var orden_schema = new Schema({
  codigo:{type: String, required: true},
  nombre:{type: String, required: true},
  total:{type: Number, required: true},
  fecha_ent:{type: String, required: true},
});

module.exports = mongoose.model("Orden",orden_schema);
