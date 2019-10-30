//este va ser el archivo que va cargar las rutas de cada modulo del proyecto
const express= require('express');
// crear las rutas con el router de express
const router = express.Router();
const proyectosController = require("../controllers/proyectosController");
const tareasController = require("../controllers/tareasController");
const cuentasController = require("../controllers/cuentasController");
const authController = require("../controllers/authController");
const {body} = require('express-validator'); 

module.exports =  () => {

	//crear las rutas

	router.get('/',authController.usuarioAutenticado,proyectosController.proyectosHome); 
	router.get('/nuevo-proyecto',authController.usuarioAutenticado,proyectosController.formularioProyecto); 
	// voy a utilizar la funcion body de express validator para sanear los datos de entrada tipo post
	router.post('/nuevo-Proyecto',
		authController.usuarioAutenticado,
		body('nombre').not().isEmpty().trim().escape() // en la funcion body le paso el nombre del campo y valido
		// sino esta vacio, le elimino los espacios en blanco y escapo la cadena de caracteres especiales
		,proyectosController.nuevoProyecto); 
	
		//Listar Proyecto

	router.get('/proyectos/:url', authController.usuarioAutenticado,proyectosController.proyectoPorURL); 
	// este endpoint se va usar para listar cualquiera de los proyectos
	router.get('/proyecto/editar/:id', authController.usuarioAutenticado,proyectosController.formularioEditar);
	router.post('/nuevo-Proyecto/:id',authController.usuarioAutenticado,proyectosController.editarProyecto);
	router.delete('/proyectos/:id', authController.usuarioAutenticado,proyectosController.eliminarProyecto);
	
	//tareas
	router.post('/proyectos/:url',authController.usuarioAutenticado,tareasController.agregarTarea);
	router.patch('/tareas/:id',authController.usuarioAutenticado,tareasController.cambiarEstado);
	router.delete('/tareas/:id', authController.usuarioAutenticado,tareasController.eliminarTarea);

	//crear nueva cuenta

	router.get('/cuenta/crear', cuentasController.formCrearCuenta)
	router.post('/cuenta/crear', cuentasController.crearCuenta)
	//iniciar sesion
	router.get('/iniciar-sesion', cuentasController.formIniciarSesion)
	router.post('/login', authController.autenticarUsuario)
	
	//cerrar sesion

	router.get('/cerrar-sesion', authController.cerrarSesion);

	//reestablecer contraseña

	router.get('/reestablecer-password', cuentasController.formReestablecerContrasena);
	router.post('/reestablecer-password', authController.enviarToken);
	router.get('/reestablecer/:token',authController.resetPasswordForm);
	router.post('/reestablecer/:token',authController.actualizarPassword);
	
	//confirmar cuenta

	router.get('/confirmar/:email', cuentasController.confirmarCuenta);
	//retornar las rutas
	return router;
}


// diferencia entre patch y put.

//patch solo actualiza una columna de todo el registro.
//put actualiza todo el registro



// martes 6:45 pm ir a la parada de sabanilla

//Nvmr231191 contraseña de la aplicacion del banco