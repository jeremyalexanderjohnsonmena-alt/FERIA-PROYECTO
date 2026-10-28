const productoServicio = require('../services/productoServicio');

const productoControlador = {
    // Público (Cliente)
    listarPorEmprendimiento: async function(solicitud, respuesta) {
        try {
            const productos = await productoServicio.listarPorEmprendimiento(solicitud.params.emprendimiento_id);
            respuesta.status(200).json({
                estado: 'exitoso',
                datos: productos
            });
        } catch (error) {
            respuesta.status(404).json({ estado: 'error', mensaje: error.message });
        }
    },

    // Expositor avalado / Admin
    crear: async function(solicitud, respuesta) {
        try {
            const nuevo = await productoServicio.crear(solicitud.body, solicitud.usuario);
            respuesta.status(201).json({
                estado: 'exitoso',
                mensaje: 'Producto/servicio agregado con éxito a tu catálogo',
                datos: nuevo
            });
        } catch (error) {
            respuesta.status(403).json({ estado: 'error', mensaje: error.message });
        }
    },

    // Expositor avalado / Admin
    actualizar: async function(solicitud, respuesta) {
        try {
            const actualizado = await productoServicio.actualizar(solicitud.params.id, solicitud.body, solicitud.usuario);
            respuesta.status(200).json({
                estado: 'exitoso',
                mensaje: 'Producto/servicio actualizado correctamente',
                datos: actualizado
            });
        } catch (error) {
            respuesta.status(403).json({ estado: 'error', mensaje: error.message });
        }
    },

    // Expositor avalado / Admin
    eliminar: async function(solicitud, respuesta) {
        try {
            await productoServicio.eliminar(solicitud.params.id, solicitud.usuario);
            respuesta.status(200).json({
                estado: 'exitoso',
                mensaje: 'Producto/servicio eliminado correctamente'
            });
        } catch (error) {
            respuesta.status(403).json({ estado: 'error', mensaje: error.message });
        }
    }
};

module.exports = productoControlador;
