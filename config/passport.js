const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// primero se hace referencia al modelo ddonde se va autenticar

const Usuarios = require('../models/Usuarios');

//local strategy- login con credenciales propias del usuario

passport.use(new LocalStrategy( // localStrategy es una de las muchas estrategias de passport para la autenticacion
	// localstrategy utiliza credenciales del usuario(user, password)
	// passport por default espera un usuario y contraseña pero en este caso el usuario es el email
	// èn passsport puedo reescribir los valores que espera para el login, eso dependiendo de como se 
	//llamen en la tabla

	{ // con este objeto reescribo los parametros que espera passport para el login
		usernameField: 'email',
		passwordField: 'password'
	}, // luego sehace la funcion que va a hacer ele select para ver si el usuario existe

	// el objeto anterior es el que recibe los valores de email y password

	async (email, password, done) => { // done viene siendo algo como next

		try{
			const usuario = await Usuarios.findOne({
				where:{
					email
				}
			})

			//console.log(usuario)
			//validar el si el password es correcto
			if(!usuario.verificarPassword(password)){
				return done(null,false,{ // done recibe 3 parametros (error, usuario y opciones)
					message: 'Usuario o contraseña incorrectos'
					// el mensaje se debe devolver con la palabra message 
				})
			}
			if(!usuario.estado){
				return done(null,false,{ // done recibe 3 parametros (error, usuario y opciones)
					message: 'Tu cuenta no ha sido confirmada'
					// el mensaje se debe devolver con la palabra message 
				})
			}
			// si los datos son correctos retornar el usuario;
			return done(null, usuario);

		}catch(err){
			// si el usuario no existe
			return done(null,false,{ // done recibe 3 parametros (error, usuario y opciones)
				message: 'El usuario no existe'
				// el mensaje se debe devolver con la palabra message 
			})
		}
	}

))

//Metodos de passport para serializar y deserializar los usuarios, esta es una configuracion que
// usa passport para leer la informacion en los objetos usuarios
//Leer los modelos de tablas de la bd
passport.serializeUser((usuario, callback) => {
	callback(null, usuario); // primer parametro es el error y el otro el objeto
});

passport.deserializeUser((usuario, callback) => {
	callback(null, usuario); // primer parametro es el error y el otro el objeto
});

module.exports = passport;