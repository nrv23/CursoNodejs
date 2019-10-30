import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){
	btnEliminar.addEventListener('click',e => {
	const idProyecto = e.target.getAttribute('data-id');
	console.log(idProyecto)
	Swal.fire({
	  title: 'Está seguro?',
	  text: "Si elimina un proyecto no se podrá recuperar.",
	  type: 'warning',
	  showCancelButton: true,
	  confirmButtonColor: '#3085d6',
	  cancelButtonColor: '#d33',
	  confirmButtonText: 'Eliminar',
	  cancelButtonText: 'Cancelar'
	}).then((result) => {
		if (result.value) {
			//location.origin muestra la url del servidor
			const url =`${location.origin}/proyectos/${idProyecto}`;
			axios.delete(url,{ params: idProyecto})
				.then(response => {
					if(response.status === 200) {
						Swal.fire(
					      'Eliminado!',
					      response.data,
					      'success'
					    );
					    setTimeout(() => {
							window.location.href='/'; // redireccionar al index;
						},3000)
					}
				}).catch(() => {
					Swal.fire({
						type: 'error',
						title:'Error',
						text: 'No se pudo eliminar el proyecto' 
					})
				});
			  
			}
		})	
	})
}
export default btnEliminar; // para que el boton sea visible en html