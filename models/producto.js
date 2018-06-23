var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var producto_schema = new Schema({
  nombre:{type: String, required: true},
  totalG:{type: String, required: true},
  total:{type: String, required: true},
});

module.exports = mongoose.model("Producto",producto_schema);
