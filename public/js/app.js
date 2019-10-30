import proyectos from './modulos/proyectos';
import tareas from './modulos/Tareas';
import {actualizarAvance} from './funciones/avance';
// este es el punto de entrada de webpack, asi que todos los archivos js deben estar importados 
// apra poder leerse

document.addEventListener("DOMContentLoaded",() => {
	actualizarAvance();	
})