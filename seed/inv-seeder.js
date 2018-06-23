var Inventario = require("../models/inventario");
var mongoose = require("mongoose");
var configDB = require("../config/database");

mongoose.connect(configDB.url);
//crea productos en un arreglo
const inventarios = [
{
	mp : "ACEITE",
	cantidadTotal : 0,
	presentacion : 17200,
	valorUni : 0,
	valorG : 0,
	stock : 0,
	bodega : "auxiliar"
},
{
  mp : "AJONJOLI",
  cantidadTotal : 0,
  presentacion : 500,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "ALMIDON DE YUCA",
  cantidadTotal : 0,
  presentacion : 12000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "AREQUIPE ARTESANAL",
  cantidadTotal : 0,
  presentacion : 6000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "AREQUIPE INDUSTRIAL",
  cantidadTotal : 0,
  presentacion : 1000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "AZUCAR BLANCOL",
  cantidadTotal : 0,
  presentacion : 50000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "CAJAS",
  cantidadTotal : 0,
  presentacion : 1,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "CAPACILLO #2",
  cantidadTotal : 0,
  presentacion : 1000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "CAPACILLO #3",
  cantidadTotal : 0,
  presentacion : 1000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "CAPACILLO #4",
  cantidadTotal : 0,
  presentacion : 1000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "CAPACILLO #5",
  cantidadTotal : 0,
  presentacion : 1000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "CAPACILLO #6",
  cantidadTotal : 0,
  presentacion : 1000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "CHIPS DE CHOCOLATE",
  cantidadTotal : 0,
  presentacion : 12500,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "CINTA TRANSPARENTE 100 MTS",
  cantidadTotal : 0,
  presentacion : 1,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "CINTA TRANSPARENTE 200 MTS",
  cantidadTotal : 0,
  presentacion : 1,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "COCO DESHIDRATADO",
  cantidadTotal : 0,
  presentacion : 1000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "COLMAIZ",
  cantidadTotal : 0,
  presentacion : 1200,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "COLOR AMARILLO",
  cantidadTotal : 0,
  presentacion : 500,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "DIVISIONES GRANDES",
  cantidadTotal : 0,
  presentacion : 50,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "DIVISIONES LARGAS",
  cantidadTotal : 0,
  presentacion : 60,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "DIVISIONES PEQUEÑAS",
  cantidadTotal : 0,
  presentacion : 50,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "ESENCIA DE BANANO",
  cantidadTotal : 0,
  presentacion : 500,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "ESENCIA DE CHOCOLATE",
  cantidadTotal : 0,
  presentacion : 20000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "ESENCIA DE COCO",
  cantidadTotal : 0,
  presentacion : 20000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "ESENCIA DE AREQUIPE",
  cantidadTotal : 0,
  presentacion : 20000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "ESENCIA DE FRESA",
  cantidadTotal : 0,
  presentacion : 20000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "ESENCIA DE LIMON",
  cantidadTotal : 0,
  presentacion : 20000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "ESENCIA DE NARANJA",
  cantidadTotal : 0,
  presentacion : 500,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "ESENCIA DE QUESO",
  cantidadTotal : 0,
  presentacion : 20000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "ESENCIA DE VAINILLA",
  cantidadTotal : 0,
  presentacion : 20000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "FECULA DE MAIZ",
  cantidadTotal : 0,
  presentacion : 25000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "GLASSE DE FRESA",
  cantidadTotal : 0,
  presentacion : 1000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "GLASSE DE KIWI",
  cantidadTotal : 0,
  presentacion : 1000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "GRAGEAS",
  cantidadTotal : 0,
  presentacion : 500,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "GUAYABA INDUSTRIAL",
  cantidadTotal : 0,
  presentacion : 1000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "GUAYABA ARTESANAL",
  cantidadTotal : 0,
  presentacion : 6000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "HARINA DE TRIGO ARTESANAL",
  cantidadTotal : 0,
  presentacion : 50000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "HARINA DE TRIGO PARA PAN",
  cantidadTotal : 0,
  presentacion : 50000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "HARINA DE TRIGO PARA GALLETA/PONQUE",
  cantidadTotal : 0,
  presentacion : 50000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "HUEVOS",
  cantidadTotal : 0,
  presentacion : 50,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "LAMINA TRANSPARENTE 22 CM",
  cantidadTotal : 0,
  presentacion : 1000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "LAMINA TRANSPARENTE 26 CM",
  cantidadTotal : 0,
  presentacion : 1000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "LAMINA TRANSPARENTE 28 CM",
  cantidadTotal : 0,
  presentacion : 1000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "LAMINA TRANSPARENTE 30 CM",
  cantidadTotal : 0,
  presentacion : 1000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "LAMINA TRANSPARENTE 32 CM",
  cantidadTotal : 0,
  presentacion : 1000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "LAMINA TRANSPARENTE 34 CM",
  cantidadTotal : 0,
  presentacion : 1000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "LECHE EN POLVO",
  cantidadTotal : 0,
  presentacion : 25000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "LEVADURA",
  cantidadTotal : 0,
  presentacion : 500,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "MARGARINA INDUSTRIAL",
  cantidadTotal : 0,
  presentacion : 15000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "MARGARINA INDUSTRIAL EXCELENCIA",
  cantidadTotal : 0,
  presentacion : 15000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "MARGARINA ARTESANAL",
  cantidadTotal : 0,
  presentacion : 15000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "MARGARINA HOJALDRE",
  cantidadTotal : 0,
  presentacion : 15000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "MARGARINA HOJALDRE VITINA",
  cantidadTotal : 0,
  presentacion : 15000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "MEJORADOR",
  cantidadTotal : 0,
  presentacion : 500,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "POLVO PARA HORNEAR",
  cantidadTotal : 0,
  presentacion : 25000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "PROPINATO DE CALCIO",
  cantidadTotal : 0,
  presentacion : 12000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "PROTEINA AISLADA DE SOYA",
  cantidadTotal : 0,
  presentacion : 20000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "SAL",
  cantidadTotal : 0,
  presentacion : 50000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "SALVADO DE TRIGO",
  cantidadTotal : 0,
  presentacion : 450,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "STICKER GRANDE 62 X 30",
  cantidadTotal : 0,
  presentacion : 1,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "STICKER PEQUEÑO 29 X 30",
  cantidadTotal : 0,
  presentacion : 1,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "TINTURA DE CARAMELO",
  cantidadTotal : 0,
  presentacion : 20000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "FIBRA DE POLLO",
  cantidadTotal : 0,
  presentacion : 7000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "VIDEO JET 55 MM X 600 MTS",
  cantidadTotal : 0,
  presentacion : 1,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "VIDEO JET 55 MM X 1200 MTS",
  cantidadTotal : 0,
  presentacion : 1,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "VIDEO JET 55 MM X 700 MTS",
  cantidadTotal : 0,
  presentacion : 15000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "VIDEO JET 33 MM",
  cantidadTotal : 0,
  presentacion : 15000,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
},
{
  mp : "VINAGRE",
  cantidadTotal : 0,
  presentacion : 3800,
  valorUni : 0,
  valorG : 0,
  stock : 0,
  bodega : "auxiliar"
}
];
//recorre el arreglo producto por producto
var done = 0;
//for(var i = 0; i < inventarios.length; i++){
for(var i = 0; i < inventarios.length; i++){
	//save each product of the array in the model and database
	var newInventario = new Inventario(inventarios[i])
	newInventario.save(function(err,result){
		done++;
		if(done === inventarios.length){
			exit();
		}
	});
}
// se hizo esta funcion para desconectar el servidor debido a que el servidor trabaja de manera
//asyncrona entonces causaria un error  y no dejaria guardar  los productos
function exit(){
	mongoose.disconnect();
}
