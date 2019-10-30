const express = require('express');
const routes = require('./routes/'); // importa una funcion
const http = require("http");
const bodyParser = require("body-parser"); // en las nuevas versiones de express el body-parser
// viene preinstalado
const session = require('express-session'); // permitir la navegacion del sistema sin que la session 
//se venza
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const path =require("path"); //utilizar la funcion del path para la carpeta views
const db = require('./config/db');
const helpers = require('./helpers');
const passport = require('./config/passport');
require('dotenv').config({ path: 'variables.env'});
const puerto = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');
//conectar a la base de datos 
/*db.authenticate() // -> se conecta la bd
	.then(() => { // si se conecta a la bd
		console.log("Conexion realizada")
	}).catch(err => console.error(err));*/
db.sync() // -> los modelos deben estar importados, sync crea la estructura de esos modelos en tablas 
//en la base de datos
	.then(() => { // si se conecta a la bd
		console.log("Modelos creados")
	}).catch(err => console.error(err));
	const app = express();
//habiltar carpetas o archivos estatticos en express
app.use(express.static('public')); // aqui le indico a express donde esta la carpeta public para que 
// pueda leer los archivos css, js 

//habilitar pug en express
app.set('view engine','pug'); 
//view engine son palabras reservadas de express para poder habilitar un motor de plantillas. Pug en este caso


// habilitar body-parser
app.use(bodyParser.urlencoded({ extended:true}));
//habilitar express validator

//app.use(expressValidator());
//agregar la carpeta de las vistas a pug
app.set('views', path.resolve(__dirname,'views')); // aqui se habilita la carpeta views para que pug acceda a ella.
// el primer parametro es el nombre de la carpeta y el segundo su direccion


//agregar flash messages

app.use(flash());

app.use(cookieParser());
//habilitar las sessiones
// sessiones nos permiten navegar en el sistema sin volverse a autenticar
app.use(session({
	secret: 'supersecrete', // esta opcion lo que hace es firmar el cookie
	// estas opciones son basicamente para que la session siga viva aunque el cliente no este usando
	//el sistema
	resave: false,
	saveUninitialized: false

}));
// estos dos middlwares deben estar iniciados despues de la session, porque passport usa la session
// para que el usuario navege por el sistema sin necesidad de estarse logueando
app.use(passport.initialize()); // iniciar una instancia de passport
app.use(passport.session());
//utilizar res.locals para pasar variables o funciones que sean usadas en toda la aplicacio

app.use((req,res, next) => { // la funcion utiliza toma los parametros de req, res para enviar a cada endpoint
	// la funcion vardump del helpers
	//req.user ahi se almacena la informacion del usuario logueado
	res.locals.vardump = helpers.vardump; // aqui ya node comunica esta funcion a todos los endpoints
	res.locals.mensajes= req.flash();
	res.locals.usuario = {...req.user} || null; // si el usuario es diferente de undefined 
	// hacer una copia del objeto req.user y asginarlo a la variable local usuario o asignarle un
	//valor null
	next(); // al terminar de correr el comando anterior sigue ejecutando los demas middlewares
})

app.use('/',routes()); // app.use('/',routes()); basicamente es que primero el servidor se carga en la raiz del proyecto 
// luego lee las rutas 
const server = http.createServer(app); // crear servidor usando la libreria http

server.listen(puerto,host,() => { // pasar el puerto como parametro y luego el callback
 	console.log(`Servidor escuchando en el puerto ${puerto}`);
});

//render es para devoler valores a un controlador o archivo
//send para retornar resultados de vista o de una peticion http

//app.use quiere decir que cualquier verbo http que corra el request / va ejecutar el middleware app.use
// el app.use funciona como $_['REQUEST'] de php, corre en cualquier verbo http

/*Tambien se puede crear un servidor usando la variable app que trae la funcion express

	app.listen(puerto,() => { // pasar el puerto como parametro y luego el callback
 	console.log(`Servidor escuchando en el puerto ${puerto}`);
}); 
 usuario y contraseña de mysql

 user : root
 contraseña; Nvm231191
*/


/*

	comentario importante


	//"watch": "webpack --w --mode development" escuchar cada cambio en el archivo de entrada y no mostrar los
	// warning porque esta en modo desarrollo
	//el paquete concurrently permite correr multiples comando de npm al mismo tiempo

	//"start" : "concurrently \"npm run dev\" \"npm run watch\" " de esta manera puedo correr diferentes comando 
	// de npm al mismo tiempo

*/