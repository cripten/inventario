var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var materiaprima_schema = new Schema({
  nombre:{type: String, required: true},
  marca:{type: String, required: true},
  presentacion:{type: String, required: true},
  valorUni:{type: Number, required: true},
  valorG:{type: Number, required: true},
  provee: {type: Schema.Types.ObjectId, ref: "Proveedor"},
});

module.exports = mongoose.model("MateriaPrima",materiaprima_schema);
