import axios from 'axios';
import Swal from 'sweetalert2';
import {actualizarAvance} from '../funciones/avance';
const tareas = document.querySelector('.listado-pendientes');


if(tareas) {
	tareas.addEventListener("click", e => {
		if(e.target.classList.contains('fa-check-circle')){
			
			const idTarea = e.target.parentNode.parentNode.getAttribute('data-id');
			const url= `${location.origin}/tareas/${idTarea}`;
			axios.patch(url,{idTarea})
				.then(response => {
					if(response.status === 200){ // si la peticion fue exitosa
						if(e.target.classList.contains('completo')){
							e.target.classList.remove('completo');
							actualizarAvance();
						}else{
							e.target.classList.add('completo');
							actualizarAvance();
						}
					}
				}).catch(err => console.error(err));

		}else if(e.target.classList.contains('fa-trash')){
			//eliminar la tarea del cliente

				Swal.fire({
				  title: 'Está seguro?',
				  text: "Si elimina una tarea no se podrá recuperar.",
				  type: 'warning',
				  showCancelButton: true,
				  confirmButtonColor: '#3085d6',
				  cancelButtonColor: '#d33',
				  confirmButtonText: 'Eliminar',
				  cancelButtonText: 'Cancelar'
				}).then((result) => {
				if (result.value) {
					//location.origin muestra la url del servidor
					const idTarea = e.target.parentNode.parentNode.getAttribute('data-id');
					const url= `${location.origin}/tareas/${idTarea}`;

					axios.delete(url,{ params: idTarea})
						.then(response => {
							if(response.status === 200) {

								e.target.parentNode.parentNode.remove();
								actualizarAvance();
								const listaPendientes = document.querySelector('.listado-pendientes');
								Swal.fire(
							      'Eliminado!',
							      response.data,
							      'success'
							    );
								if(listaPendientes.childNodes[0].children.length === 0){
									const mensaje = document.createElement('p');
									mensaje.textContent='No hay tareas asociadas a este proyecto';
									listaPendientes.appendChild(mensaje);
								}
							}
						}).catch(() => {
							Swal.fire({
								type: 'error',
								title:'Error',
								text: 'No se pudo eliminar la tarea' 
							})
						});
					  
					}
			})
		}
	})
}

export default tareas;


	