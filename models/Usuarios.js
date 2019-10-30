const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcrypt-nodejs'); // libreria para hashear contraseñas 
let Usuarios = db.define('usuarios', {

	id:{
	 type: Sequelize.INTEGER,
	 primaryKey: true,
	 autoIncrement: true
	},
	email:{
		type: Sequelize.STRING(60),
		allowNull: false, // no se permite valor vacio para este campo
		validate:{ // este objeto validate valida el campo de email
			isEmail:{ // si no es un email valido el msg es el mensaje del error
				msg: 'El correo no es válido'
			},
			notEmpty:{ // validacion de que el email no este vacio
				msg: 'El email no puede estar vacío'
			}
		},
		unique:{ // es el indice de que eel valor email sea unico para toda la tabla
			args: true, // habilitar la validacion de indice unique
			msg: 'El email ya existe' // mensaje de error si el email ya existe	
		}
	},
	password:{
		type: Sequelize.STRING(60),
		allowNull: false,
		validate:{
			notEmpty:{ // validacion de que el password no este vacio
				msg: 'El password no puede estar vacío'
			}
		}
	},
	estado:{
		type: Sequelize.INTEGER(1),
		defaultValue: 0
	},
	token: Sequelize.STRING(60),
	expiracion: Sequelize.DATE,
},{
	hooks: {
		beforeCreate(usuario){
			//hashear la contraseña

			usuario.password= bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10)); 
			//bcrypt.genSaltSync(10) generar el salt de 10 vueltas
		}
	}
})

// crear una funcion personalizada para verificar la contraseña

// las funciones personalizadas en los modelos no aceptan funciones de flecha
Usuarios.prototype.verificarPassword = function(password){
	// funcion para verificar si la contraseña del login es correcta
	return bcrypt.compareSync(password,this.password); // comparar el password de entrada con el existente 
	// en la tabla
};

Usuarios.hasMany(Proyectos); // un usuario puede crear muchos proyectos


module.exports = Usuarios;