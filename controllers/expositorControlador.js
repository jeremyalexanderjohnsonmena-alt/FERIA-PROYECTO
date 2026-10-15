const servicio = require('../services/expositorServicio');

const expositorControlador = {
    registrar: async function(solicitud, respuesta) {
        try {
            const datos = solicitud.body;
            const resultado = await servicio.expositorServicio.procesarInscripcion(datos);

            respuesta.status(201).json({
                estado: 'exitoso',
                mensaje: '¡Te has registrado correctamente!'
            });
        } catch (error) {
            respuesta.status(400).json({
                estado: 'error',
                mensaje: error.message
            });
        }
    }
};

module.exports = expositorControlador;