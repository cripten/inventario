var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var materiaprima_schema = new Schema({
  nombre:{type: String, required: true},
  presentacion:{type: String, required: true},
  valorU:{type: Number, required: true},
  valorG:{type: Number, required: true},
  inv: {type: Schema.Types.ObjectId, ref: "Proveedor"},
});

module.exports = mongoose.model("Materiaprima",materiaprima_schema);
