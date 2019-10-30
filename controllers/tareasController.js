const Tareas = require('../models//Tareas');
const Proyectos = require('../models//Proyectos');

exports.agregarTarea = async (req, res, next) => {

	const {url} = req.params;
	const {tarea} = req.body;
	const estado =0; // por defecto la tarea esta en 0 porqu esta incompleta
	const proyecto = await Proyectos.findOne({ where: {url}});
	const proyectoId = proyecto.id;

	const respuesta = await Tareas.create({tarea, estado, proyectoId});

	if(!respuesta){
		return next(); // si no hay resultado entonces que pase al siguiente middleware
	}

	return res.redirect(`/proyectos/${url}`);
}


exports.cambiarEstado = async (req, res,next) => {

	const {id}= req.params;
	let estado=0;
	const tarea = await Tareas.findOne({ //{attributes:['estado']} PARA SELECCIONAR CUALES CAMPOS QUIERE TRAERSE
		where :{id}
	});
	if(tarea.estado === 0){
		estado=1
	}else{
		estado=0;
	}
	
	tarea.estado = estado;
	const resultado = await tarea.save(); // guardar en la bd
	
	if(!resultado){
		return next();
	}

	res.status(200).send('Actualizado');
} 



exports.eliminarTarea = async (req, res, next) => {
	const {id}=req.params;

	const resultado = await Tareas.destroy({ where:{ id }});

	if(!resultado){
		return next(); // si no hay nada pasar al siguiente middleware
	}
	res.status(200).send('Tarea eliminada');
}