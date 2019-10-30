const Proyectos = require('../models/Proyectos');
// con exports puedo hacer multiples exports que se importan como un objeto, en react sera export const variable
// module.exports es para exportar una sola cosa en nodejs, en react seria exports default
//creo un controlador y luego ese controlador los llamo en funciones de las rutas  
const Tareas = require('../models/Tareas');

exports.proyectosHome = async (req, res ) => {
	//console.log(res.locals.usuario);
	const {id} = res.locals.usuario;
	let proyectos = await Proyectos.findAll({where:{ usuarioId:id}});
	
	res.render('index', {
		nombrePagina: 'Proyectos',
		proyectos
	})
		//.render es para renderizar html del servidor al cliente, render tiene dos parametros, el primero la vista y 
		// otro son los valores que va devolver a esa vista
		//.send es para devolver datos json, numeros o cadenas como respuesta de la peticion del cliente
}

// el render va renderizar las vistas html de la carpeta views gracias al motor de plantillas pug.
// cuando se accede a la direccion / del proyecto se renderiza el index y asi con cada vista

exports.formularioProyecto = async (req, res ) => {
	const {id} = res.locals.usuario;
	let proyectos = await Proyectos.findAll({where:{ usuarioId:id}});
	

	res.render('nuevoProyecto', {
		nombrePagina: 'Nuevo Proyecto',
		proyectos
	})
}
exports.nuevoProyecto = async (req, res) => {
	const {nombre} = req.body;
	let errores = [];
	const {id} = res.locals.usuario;
	let proyectos = await Proyectos.findAll({where:{ usuarioId:id}});

	if(!nombre){ // si esta vacio o no existe
		errores.push({
			'texto': 'Agrega un nombre al proyecto'
		})
	}

	if(errores.length > 0) {
		res.render('nuevoProyecto', {
			nombrePagina: 'Nuevo Proyecto',
			errores,
			proyectos
		})
	}else {

		const {id} = res.locals.usuario;
		//insertar en la base de datos
		await Proyectos.create({nombre, usuarioId: id});
		res.redirect('/');
	}
} 

exports.proyectoPorURL = async (req, res, next) => {
	
	const {url}= req.params;
	const {id} = res.locals.usuario;
	const proyectosPromise =  Proyectos.findAll({where:{ usuarioId:id}});
	const proyectoPromise =  Proyectos.findOne({
		where:{
			url,
			usuarioId: id
		}/*,
		include: [ // incluir la informacion del modelo relacionado a las tareas
			{model: Proyectos}
		]*/
	})
	const [proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise]); // resolver ambas peticiones
	const tareas = await Tareas.findAll({ where:{ proyectoId: proyecto.id}});

	if(!proyecto) return next(); // si no hay ningun proyecto ejecute los demas middlewares

	//extraer las tareas de cada proyecto

	res.render('tareas',{
		nombrePagina: 'Tareas del Proyecto',
		proyecto,
		proyectos,
		tareas
	})

}

exports.formularioEditar = async (req, res, next) => {

	const {id} = req.params;
	const usuarioId = res.locals.usuario.id;
	const proyectosPromise =  Proyectos.findAll({where:{ usuarioId:id}});
	const proyectoPromise = Proyectos.findOne({
		where:{
			id,
			usuarioId
		}
	})

	const [proyectos,proyecto] = await Promise.all([proyectosPromise,proyectoPromise]); // resolver ambas peticiones

	// el promise all usa un arreglo porque son varias promesas, luego se aplica el destructuring para
	// obtener el valor de respuesta de cada promesa
	if(!proyecto) return next();

	res.render('nuevoProyecto',{
		nombrePagina: 'Editar Proyecto',
		proyecto,
		proyectos	
	});
}


exports.editarProyecto = async (req, res) => {
	const {nombre} = req.body;
	let errores = [];
	const usuarioId = res.locals.usuario.id;
	const proyectos =  await Proyectos.findAll({where:{ usuarioId}});

	if(!nombre){ // si esta vacio o no existe
		errores.push({
			'texto': 'Agrega un nombre al proyecto'
		})
	}

	if(errores.length > 0) {
		res.render('nuevoProyecto', {
			nombrePagina: 'Nuevo Proyecto',
			errores,
			proyectos
		})
	}else {
		//insertar en la base de datos
		await Proyectos.update(
			{nombre},
			{where :{
				id: req.params.id
			}}
		);
		res.redirect('/');
	}
} 

exports.eliminarProyecto = async (req, res, next) => {
	const {id}=req.params;

	const resultado = await Proyectos.destroy({ where:{ id }});

	if(!resultado){
		return next(); // si no hay nada pasar al siguiente middleware
	}
	res.status(200).send('Proyecto eliminado');
}

// en todas las vistas se deben listar los proyectos porque los proyectos se renderizan en el 
//master page que siempre se va cargar