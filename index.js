// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var server = require("http").Server(app);
app.set('port', (process.env.PORT || 5000));//define el puerto una vez subido a heroku
var io = require('socket.io')(server);

var mongoose = require('mongoose');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var bodyParser   = require('body-parser');
var formData = require("express-form-data");//permite leer archivos en nuestra aplicación
var methodOverride = require("method-override");//sirve para utilizar otros metodos http que no implemeta el navegador como lo son put, delete ect
var session      = require('express-session');
var validator = require("express-validator");
var path = require("path");
//var validatorHelper = require("express-validation-helper");

//all routes
var indexRoute = require("./routes/index");
var inventarioRoute = require("./routes/inventario");
var inOutRoute = require("./routes/inOut");
var produccionRoute = require("./routes/produccion");
var productoRoute = require("./routes/producto");
var ingredienteRoute = require("./routes/ingrediente");
var productoTerRoute = require("./routes/productoTer");
var elaboradoRoute = require("./routes/elaborado");

var configDB = require('./config/database.js');
// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
//mongoose.connect("mongodb://admin:admin@ds133360.mlab.com:33360/barberia");
// require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser()); // get information from html forms
app.use(validator());// debe ir siempre debajo del cuerpo que es el que se va a anlizar
//app.use(validatorHelper());
app.use(methodOverride("_method"));//_method es el nombre con que identificara los campos o input para poder ser enviados y renocidos en el proyecto para los metodos put y delete
app.use(formData.parse({keepExtensions:true,}));

app.set('view engine', 'ejs'); // set up ejs for templating


app.use("/public", express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(function(req,res,next){
	//login es el nombre de la variable
	// esto nos permitira utilizar esta variable en
	// todas nuestras vistas dado el caso de que se este autenticado
	res.locals.session = req.session; // ahora la session se podra manejar en las vistas
	next();
})
// routes ======================================================================
app.use('/', indexRoute);
app.use("/app", inventarioRoute);
app.use("/app", inOutRoute);
app.use("/app", produccionRoute);
app.use("/app", productoRoute);
app.use("/app", ingredienteRoute);
app.use("/app", productoTerRoute);
app.use("/app", elaboradoRoute);



// launch ======================================================================
// server.listen(app.get('port'),"10.0.0.102");
// server.listen(app.get('port'),"192.168.0.130");
server.listen(app.get('port'));
