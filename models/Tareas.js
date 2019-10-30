const Sequelize = require("sequelize");
const db = require('../config/db'); 
const Proyectos = require('./Proyectos');

const Tareas = db.define('tareas',{
	id:{
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	tarea: Sequelize.STRING(100),//se le puede pasar un tamaño maximo
	estado: Sequelize.INTEGER(1),
});

// relacionar tablas en sequelize

//Tareas.belongsTo(Proyectos); Una tarea pertenece a un proyecto
Tareas.belongsTo(Proyectos);
//Poryectos.hasMany(Tareas) un proyecto tiene muchas tareas

module.exports = Tareas; 

//cada vez que algo cambien en los modelos, se deben borrar las tablas de la base de datos y luego correr 
// el server para ver los cambios