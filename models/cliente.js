var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var cliente_schema = new Schema({
  codigo:{type: String, required: true},
  nombre:{type: String, required: true},
  nit:{type: String, required: true},
  email:{type: String, required: true},
  ciudad:{type: String, required: true},
  direccion:{type: String, required: true},
  telefono:{type: String, required: true},
  horario:{type: String, required: true}
});

module.exports = mongoose.model("Cliente",cliente_schema);
