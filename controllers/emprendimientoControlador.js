const emprendimientoServicio = require('../services/emprendimientoServicio');

const emprendimientoControlador = {
    
    listarAprobados: async function(solicitud, respuesta) {
        try {
            const emprendimientos = await emprendimientoServicio.listarAprobados();
            respuesta.status(200).json({
                estado: 'exitoso',
                datos: emprendimientos
            });
        } catch (error) {
            respuesta.status(500).json({ estado: 'error', mensaje: error.message });
        }
    },

    
    listarTodos: async function(solicitud, respuesta) {
        try {
            const emprendimientos = await emprendimientoServicio.listarTodos();
            respuesta.status(200).json({
                estado: 'exitoso',
                datos: emprendimientos
            });
        } catch (error) {
            respuesta.status(500).json({ estado: 'error', mensaje: error.message });
        }
    },

    obtenerPorId: async function(solicitud, respuesta) {
        try {
            const emprendimiento = await emprendimientoServicio.obtenerPorId(solicitud.params.id);
            respuesta.status(200).json({
                estado: 'exitoso',
                datos: emprendimiento
            });
        } catch (error) {
            respuesta.status(404).json({ estado: 'error', mensaje: error.message });
        }
    },

    misEmprendimientos: async function(solicitud, respuesta) {
        try {
            const mis = await emprendimientoServicio.obtenerMisEmprendimientos(solicitud.usuario.id);
            respuesta.status(200).json({
                estado: 'exitoso',
                datos: mis
            });
        } catch (error) {
            respuesta.status(500).json({ estado: 'error', mensaje: error.message });
        }
    },

    
    registrar: async function(solicitud, respuesta) {
        try {
            const { nombre_emprendimiento, descripcion, categoria } = solicitud.body;
            const nuevo = await emprendimientoServicio.registrar({
                usuario_id: solicitud.usuario.id,
                nombre_emprendimiento,
                descripcion,
                categoria,
                rol_usuario: solicitud.usuario.rol
            });

            const mensaje = solicitud.usuario.rol === 'administrador'
                ? 'Emprendimiento registrado y aprobado directamente.'
                : 'Emprendimiento registrado con éxito. Está en espera de ser avalado por un administrador.';

            respuesta.status(201).json({
                estado: 'exitoso',
                mensaje: mensaje,
                datos: nuevo
            });
        } catch (error) {
            respuesta.status(400).json({ estado: 'error', mensaje: error.message });
        }
    },

    
    avalar: async function(solicitud, respuesta) {
        try {
            const estado_aval = solicitud.body.estado_aval || solicitud.body.estado; // 'aprobado' | 'rechazado' | 'pendiente'
            const actualizado = await emprendimientoServicio.avalar(solicitud.params.id, estado_aval);
            respuesta.status(200).json({
                estado: 'exitoso',
                mensaje: `Emprendimiento actualizado al estado: ${estado_aval}`,
                datos: actualizado
            });
        } catch (error) {
            respuesta.status(400).json({ estado: 'error', mensaje: error.message });
        }
    },

   
    actualizar: async function(solicitud, respuesta) {
        try {
            const actualizado = await emprendimientoServicio.actualizar(
                solicitud.params.id,
                solicitud.body,
                solicitud.usuario
            );
            respuesta.status(200).json({
                estado: 'exitoso',
                mensaje: 'Emprendimiento actualizado correctamente',
                datos: actualizado
            });
        } catch (error) {
            respuesta.status(400).json({ estado: 'error', mensaje: error.message });
        }
    },

    
    eliminar: async function(solicitud, respuesta) {
        try {
            await emprendimientoServicio.eliminar(solicitud.params.id);
            respuesta.status(200).json({
                estado: 'exitoso',
                mensaje: 'Emprendimiento eliminado correctamente'
            });
        } catch (error) {
            respuesta.status(400).json({ estado: 'error', mensaje: error.message });
        }
    }
};

module.exports = emprendimientoControlador;
