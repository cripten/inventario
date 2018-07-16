var Producto = require("../models/producto");
var mongoose = require("mongoose");
var configDB = require("../config/database");

mongoose.connect(configDB.url);
//crea productos en un arreglo
const productos = [
{
	nombre:"GALLETA CHIPS CON LECHE Y PROTEINA",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA CHIPS PEQUEÑA",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA CHIPS GRANDE",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA CHOCOLATE PEQUEÑA",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA CHOCOLATE CON LECHE",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA CHOCOLATE GRANDE",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA LIMON PEQUEÑA",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA LIMON CON LECHE",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA LIMON GRANDE",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA FRESA GRANDE",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA FRESA PEQUEÑA",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA FRESA CON LECHE",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA DULCE PEQUEÑA",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA DULCE GRANDE",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA CUCA PEQUEÑA",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA CUCA GRANDE",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA CASERA CON LECHE",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA COCO PEQUEÑA",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA COCO GRANDE",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA GRAGEA PEQUEÑA",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA PARMESANA CON LECHE",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA PARMESANA PEQUEÑA",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"GALLETA PARMESANA GRANDE",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"PONQUE MANTECADA",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"PONQUE VAINILLA",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"PONQUE AREQUIPE",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"PONQUE CHOCOLATE",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"PAN DULCE",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"PAN ALIÑADO",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"PAN COCO",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"PAN CHIPS CON LECHE",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"PAN BOCADILLO",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"PAN FRUTA CRISTALIZADO",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"PAN TAJADO",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"PALITO DE QUESO",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"PALITO DE QUESO CON LECHE",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"CROISSANT",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
{
	nombre:"CROISSANT ARMENIA",
  totalG: 0,
  total: 0,
  estado: "nuevo",
  destino: "industrial"
},
];
//recorre el arreglo producto por producto
var done = 0;
//for(var i = 0; i < inventarios.length; i++){
for(var i = 0; i < productos.length; i++){
	//save each product of the array in the model and database
	var newProducto = new Producto(productos[i]);
	newProducto.save(function(err,result){
		done++;
		if(done === productos.length){
			exit();
		}
	});
}
// se hizo esta funcion para desconectar el servidor debido a que el servidor trabaja de manera
//asyncrona entonces causaria un error  y no dejaria guardar  los productos
function exit(){
	mongoose.disconnect();
}
