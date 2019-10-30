const Usuarios = require('../models/Usuarios');
const Mail = require('../handlers/SendMail');

exports.formCrearCuenta = async (req, res) => {
	
	res.render('crearCuenta',{
		nombrePagina: 'Nueva Cuenta en Uptask'
	});	
}

exports.formIniciarSesion = async (req, res) => {
	
	const {error} = res.locals.mensajes; //error es un array con los errores
	res.render('iniciarSesion',{
		nombrePagina: 'Inciar Sesión en Ùptask',
		errores: error
	});	
}

exports.crearCuenta =  async (req, res, next) => {
	const {email, password} = req.body;
	let errores=[];
	if(email === '' || password === ''){
		errores.push('No se permiten campos vacíos');
	}

	try{

		await Usuarios.create({email, password});


		// crear una url de crear cuenta
		const urlConfirm =`http://${req.headers.host}/confirmar/${email}`;

		//crear el objeto para el email
		const usuario={
			email
		}

		await Mail.enviarCorreo({ // funcion dinamica para enviar correos
			usuario,
			subject: 'Confirma tu cuenta en Uptask',
			urlConfirm,
			archivo: 'confirmar-cuenta' // usar para diferentes plantillas
		});

		req.flash('correcto', 'Ahora estás registrado(a). Hemos enviado un correo de confirmación de cuenta');
		res.redirect('/iniciar-sesion');
	
	}catch(err){
	
				// crear el flash message
			req.flash('error', err.errors.map(error => error.message)); // crear un nuevo elemento con solamente
			//el mensaje del error, al final da como resultado un array de mensajes de error
			//enviar los errores a la vista de crear cuenta
			res.render('crearCuenta',{
				nombrePagina: 'Nueva Cuenta en Uptask',
				mensajes: req.flash(), // errors es el array que trae los errores
				email, 
				password
			});
		
	}
	
}

exports.formReestablecerContrasena = (req, res) => {

	res.render('reestablecerContrasena',{
		nombrePagina: 'Reestablece tu contraseña'
	})

}


exports.confirmarCuenta= async (req, res) => {
	const {email} = req.params;

	let usuario = await Usuarios.findOne({ where :{
		email
	}});

	if(!usuario){
		req.flash('error', 'La cuenta no existe');
		res.redirect('/cuenta/crear');
	}else{

		usuario.estado=1;
		await usuario.save(); // actualizar el estado del usuario
			if(usuario){
				req.flash('correcto', 'Tu cuenta ha sido confirmada, ahora puedes iniciar sesión');
				res.redirect('/iniciar-sesion');	
			} //
	}
}


//comandos importantes para manejo de heroku

//heroku create --remote production // crear un app en heroku
// git push production master // clonar la rama de git a la aplicacion de heroku
// herkou logs --tail// ver los logs de heroku