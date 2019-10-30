// ESTE ARCHIVO SE CREA PARA DESARROLLAR FUNCIONES QUE SE VAN A
// REUTILIZAR EN TODA LA APLICACION

exports.vardump = (obj) => JSON.stringify(obj, null, 2);

//JSON.stringify toma tres parametros que pueden ser opcionales.

/*
	1- el objeto a formatear,
	2- valor a que va ser el reemplazo del objeto 
	3- espacio entre elementos del objeto
*/ 