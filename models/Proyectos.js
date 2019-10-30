const Sequelize = require('sequelize');
const slug = require('slug');
const db = require('../config/db'); // cargar configuracion de la conexion a la base de datos

//crear el modelo para el modulo proyectos
const Proyectos = db.define('proyectos', { // el primer parametro del db.define va ser el nombre de la tabla
	// en la bd
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	nombre:{
		type: Sequelize.STRING(100),	
	},
	url: {
		type: Sequelize.STRING(100)
	}
},{
	hooks: { // se ejecutan en determinado momento
		beforeCreate(proyecto){ // esta funcion se va ejecutar antes de crear el nuevo proyecto en la bd

			const url = slug(proyecto.nombre).toLowerCase();
			proyecto.url = `${url}-${Date.now()}`;
		}
	}
})

// exportar el modelo para usarlo en el controlador

module.exports= Proyectos;