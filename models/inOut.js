var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var inOut_schema = new Schema({
  fecha:{type: String, required: true},
  hora: {type: String},
  codigo: {type: String},
  numFact: {type:String, required:true},
  marca:{type: String, required: true},
  cantidad: {type: Number, required: true},
  presentacion: {type: Number, required: true},
  valorUni:{type: Number, required: true},
  valorG:{type: Number, required: true},
  tipo: {type: String, required: true},//entrada o salida
  estado: {type: String},
  inv: {type: Schema.Types.ObjectId, ref: "Inventario"},//ref al id de la collecion inventario

});

module.exports = mongoose.model("InOut",inOut_schema);
