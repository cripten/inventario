var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var productoTer_schema = new Schema({
  nombre:{type: String, required: true},
  stock:{type: String, required: true},
  averiasPor:{type: Number, required: true},
  diferenciaPor:{type: Number, required: true},
  cont:{type:Number}
});

module.exports = mongoose.model("ProductoTer",productoTer_schema);
