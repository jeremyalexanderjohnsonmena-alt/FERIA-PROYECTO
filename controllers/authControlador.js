const authServicio = require('../services/authServicio');

const authControlador = {
    registrar: async function(solicitud, respuesta) {
        try {
            const resultado = await authServicio.registrar(solicitud.body);
            respuesta.status(201).json({
                estado: 'exitoso',
                mensaje: 'Usuario registrado correctamente',
                datos: resultado
            });
        } catch (error) {
            respuesta.status(400).json({
                estado: 'error',
                mensaje: error.message
            });
        }
    },

    iniciarSesion: async function(solicitud, respuesta) {
        try {
            const resultado = await authServicio.iniciarSesion(solicitud.body);
            respuesta.status(200).json({
                estado: 'exitoso',
                mensaje: 'Inicio de sesión exitoso',
                datos: resultado
            });
        } catch (error) {
            respuesta.status(401).json({
                estado: 'error',
                mensaje: error.message
            });
        }
    }
};

module.exports = authControlador;
