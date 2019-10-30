// este archivo gestiona los envios de los correos elecronicos

const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice'); // dar estilos a la plantilla de envio de correos
const htmlToText = require('html-to-text'); // convertir en texto el html para enviar los correos
const util= require('util'); // preinstalada de la version de nodejs de la 8 en adelante
const emailConfig = require('../config/emailConfig');

let transport = nodemailer.createTransport({ // datos de autenticacion del servidor de correos
	host: emailConfig.host,
	port: emailConfig.port,
	auth:{ //
		user : emailConfig.user,
		pass: emailConfig.pass
	}
})

const generarHTML = (archivo, opciones = {}) => { // plantilla para los correos, esta funcion devuelve una plantilla pug para
	// envio de correoscon formato html
	const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);	
	//pug.renderFile toma un archivo pug y lo renderiza como una vista html, el segundo parametro toma
	// los datos que se van renderizar de manera dinamica en la plantilla
	//__dirname obtiene la ubicacion actual
	return juice(html); // le agrega los estilos a la plantilla
}

exports.enviarCorreo = async (obj) => {

	const html = generarHTML(obj.archivo, obj); // opciones.archivo sabe cual archivo se va usar
	const text = htmlToText.fromString(html); // convertir a texto plano el html
	
	const mailOptions={
	    from: 'Uptask <no-replay@uptask.com>', // sender address
	    to: obj.usuario.email, // list of receivers
	    subject: obj.subject, // Subject line
	    text,
	    html
	}

	//transport.sendMail(mailOptions); esta funcion no sopòrta promesas, entonces
	//con util promisify se cpnvierte una funcion que no soporta promesas, en una que si soporte promesas
	// para poder leer los resultados

	const sendMailToPromise= util.promisify(transport.sendMail, transport);
	// promisify espera dos argumentos, primero la funcion que ejecuto y el argumento que tiene esa funcion
	// en este caso transport como argumento y sendmail como funcion

	return sendMailToPromise.call(transport, mailOptions); // aqui llamo la funcion convertida a promesa, le paso
	// el argumento y las opciones 
}

