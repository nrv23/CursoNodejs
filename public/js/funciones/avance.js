
import Swal from 'sweetalert2';
export const actualizarAvance = () => {
	
	//selecionar las tareas existentes

	const tareas = document.querySelectorAll('li.tarea'); // asegurarme que aunque la clase tarea este
	// en otros elementos del html, solo seleccione los elementos con clase tarea que sean elemento de lista
	if(tareas.length){ // si existe al menos una tarea

		//seleccionar tareas completadas
		const tareasCompletas = document.querySelectorAll('i.completo'); // cuando el boton de cambiar estado 
		// se selecciono y el icono se puso de color verde indicando que la tarea se ha completado

		//calcular el avance

		const avance = Math.round((tareasCompletas.length / tareas.length) * 100);

		//mostrar el avance	

		const barraPorcentaje = document.querySelector('#porcentaje');
		barraPorcentaje.style.width = avance+'%';

		if(avance === 100){
			Swal.fire({
			  position: 'center',
			  type: 'success',
			  title: 'Has completado el proyecto!',
			  showConfirmButton: false,
			  timer: 1500
			})	
		}
	}
}