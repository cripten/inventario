var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var proveedor_schema = new Schema({
  nombre:{type: String, required: true},
});

module.exports = mongoose.model("Proveedor",proveedor_schema);
