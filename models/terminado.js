var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var terminado_schema = new Schema({
  nombre:{type: String, required: true},
  stock:{type: String, required: true},
  empacado:{type: Number, required: true},
  averias:{type: Number, required: true},
  diferencia:{type: Number, required: true},
  total:{type: String, required: true},
});

module.exports = mongoose.model("Terminado",terminado_schema);
