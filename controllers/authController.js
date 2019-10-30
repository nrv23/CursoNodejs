const passport = require('passport'); // usar la instancia de password instalada
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto'); // utilidad para generar tokens
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt-nodejs');
const Op = Sequelize.Op;
const Mail = require('../handlers/SendMail');

exports.autenticarUsuario = passport.authenticate('local',{
	successRedirect: '/',
	failureRedirect: '/iniciar-sesion',
	failureFlash: true, // esta opcion me permite obtener globalmente los errores generados 
	// en el login hacia flash connect para poder renderizarlos del controlador a la vista
	badRequestMessage: 'Todos los campos son requeridos' // esta opcion me permite reescribir
	// el mensaje de error en el caso de que la contraseña y el email se envien vacios
})


exports.usuarioAutenticado= (req, res, next) => { // verificar si el usuario esta logueado
	//si el usuario esta autenticado seguir con elsiguiente middleware
	 // retorna true o false
	if(req.isAuthenticated()){ // funcion de passport para saber si hay una session abierta
		return next(); // ir al siguiente middleware
	}
	//sino redirigir al login
	return res.redirect('/iniciar-sesion');	
}

exports.cerrarSesion = (req, res) => {
	// las sessiones estan guardadas en el objeto request por lo tanto
	//para destruir la session se debe llamar el objeto request con la propiedad session
	// configurada con el paquete express-session
	req.session.destroy(() => {
		res.redirect('/iniciar-sesion');
	})	
}

exports.enviarToken = async (req, res) => {
	//generar un token si el usuario existe
	const {email} = req.body;
	let errores=[];

	const usuario = await Usuarios.findOne({where: {email}});

	if(!usuario){
		//crear el flash message
		req.flash('error', 'La cuenta no existe');

		return res.render('reestablecerContrasena',{
			nombrePagina: 'Reestablece tu contraseña',
			mensajes: req.flash()
		})
	}

	//el usuario existe, generar un token de seguridad y una fecha de expiracion

	usuario.token = crypto.randomBytes(30).toString('hex');
	//randomBytes(50) genera una cadena de caracteres dependiendo del numero que le pase por parametro
	usuario.expiracion = Date.now() + 3600000; // generar el token por una hora de duracion
	

	await usuario.save();
	// como la variable usuario guardar el resultado de la consulta a la bd, esa consulta devuelve un objeto
	// entonces como objeto le puedo pasar propiedades directamente sin reescribir ese objeto
	// en este caso token y expiracion, y como ese objeto es del modelo usuarios, puedo usar .save() 
	// para actualizar el modelo
	//req.headers.host me devuelve la direccion del dominio donde esta el proyecto
	const url =`http://${req.headers.host}/reestablecer/${usuario.token}`;

	//res.redirect(`${url}`);

	await Mail.enviarCorreo({ // funcion dinamica para enviar correos
		usuario,
		subject: 'Password Reset',
		url,
		archivo: 'reestablecer-password' // usar para diferentes plantillas
	});

	req.flash('correcto', 'Se ha enviado un correo para reestablecer tu contraseña. Revisa tu bandeja de entrada');

	res.render('reestablecerContrasena',{
		nombrePagina: 'Reestablece tu contraseña',
		mensajes: req.flash()
	});
}

exports.resetPasswordForm = async (req, res) => {
	
	const {token } = req.params;

	//comparar si el token es valido

	const usuario = await Usuarios.findOne({ where: {
		token
	}})

	if(!usuario){
		req.flash('error', 'Acción no válida');
		return res.redirect('/reestablecer-password');
	}

	res.render('resetPassword',{
		nombrePagina: 'Reestablecer Contraseña'
	})

}

exports.actualizarPassword = async (req, res) => {

	const {password, confirmar_password }= req.body;
	//No hay necesidad de enviar un action en el form porque el method que usa el form
	// va enviar los datos a la url actual
	//verfica el token valido y la fecha de expiracion
	const {token} = req.params;

	const usuario = await Usuarios.findOne({where :{
		token
		,
		expiracion:{ //Op tiene una lista de comparadores
			[Op.gte]: Date.now()
		}
	}})
	//si el token no es valido
	if(!usuario){
		req.flash('error', 'Acción no válida');
		return res.redirect('/reestablecer-password');
	}

	if(!(password === confirmar_password)){
		req.flash('error', 'Las contraseñas no sonb iguales');
		return res.redirect('/reestablecer-password');
	}

	usuario.password= bcrypt.hashSync(password, bcrypt.genSaltSync(10));
	usuario.token=null;
	usuario.expiracion=null;

	await usuario.save(); 

	req.flash('correcto', 'Tu password se ha modificado correctamente');
	res.redirect('/iniciar-sesion');
}

// el metodo autenticate toma como primer parametro la estrategia. Passport tiene mas de 
// 500 estrategias de autenticacion.En este caso se usa la local porque se va a loguear por
//usuario y contraseña, successRedirect redirecciona a un endpoint si el login es correcto,
//failureRedirect redirecciona al login si el login falla