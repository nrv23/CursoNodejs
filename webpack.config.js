const path = require('path');
const webpack = require('webpack');


module.exports = {
	entry: './public/js/app.js', // punto de entrada, webpack siempre corre la app creando una carpeta public
	output:{
		filename: 'bundle.js', // este archivo se genera y se corre la aplicacio
		path: path.join(__dirname, "./public/dist") // aqui se va crear el archivo bundle.js
	},
	module: {
		rules: [
			{
				test: /\.m?js$/, // Todos los archivos con extension js
				use :{
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']	
					}
				}
			}	
		]
	}
}