const Sequelize = require('sequelize');
//utilizar variables de entorno para produdccion y desarrollo
require('dotenv').config({ path: 'variables.env'}); // pasar la ruta del archivo que tiene las variables de
//entorno

const sequelize = new Sequelize(process.env.BD_NOMBRE,process.env.BD_USER,process.env.BD_PASS, { // si la bd no existe el sequelize la crea
	host: process.env.BD_HOST,
	dialect: 'mysql',
	port: process.env.BD_PORT,	
	//operatorsAliases: false,
    define: {
    	timestamps: false
    },
	pool : {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000 
	} 
});
// configuracion de sequelize para conexion de bases de datos

module.exports = sequelize; // exportar la configuracion para poder conectarse