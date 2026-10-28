const emprendimientoRepositorio = require('../repositories/emprendimientoRepositorio');

const emprendimientoServicio = {
    listarAprobados: async function() {
        return await emprendimientoRepositorio.obtenerAprobados();
    },

    listarTodos: async function() {
        return await emprendimientoRepositorio.obtenerTodos();
    },

    obtenerPorId: async function(id) {
        const emprendimiento = await emprendimientoRepositorio.obtenerPorId(id);
        if (!emprendimiento) {
            throw new Error('Emprendimiento no encontrado');
        }
        return emprendimiento;
    },

    obtenerMisEmprendimientos: async function(usuario_id) {
        return await emprendimientoRepositorio.obtenerPorUsuarioId(usuario_id);
    },

    registrar: async function({ usuario_id, nombre_emprendimiento, descripcion, categoria, rol_usuario }) {
        if (!nombre_emprendimiento || !categoria) {
            throw new Error('El nombre del emprendimiento y la categoría son obligatorios.');
        }

        const cantidad_actual = await emprendimientoRepositorio.obtenerConteoPorCategoria(categoria);
        if (cantidad_actual >= 5) {
            throw new Error('Ya no hay cupos disponibles para la categoría: ' + categoria);
        }

        const estado_aval = rol_usuario === 'administrador' ? 'aprobado' : 'pendiente';

        return await emprendimientoRepositorio.guardar({
            usuario_id,
            nombre_emprendimiento,
            descripcion,
            categoria,
            estado_aval
        });
    },

    avalar: async function(id, estado_aval) {
        const estadosPermitidos = ['aprobado', 'rechazado', 'pendiente'];
        if (!estadosPermitidos.includes(estado_aval)) {
            throw new Error('Estado inválido. Opciones permitidas: ' + estadosPermitidos.join(', '));
        }

        const emprendimiento = await emprendimientoRepositorio.obtenerPorId(id);
        if (!emprendimiento) {
            throw new Error('Emprendimiento no encontrado');
        }

        return await emprendimientoRepositorio.actualizarEstadoAval(id, estado_aval);
    },

    actualizar: async function(id, datos, usuario) {
        const emprendimiento = await emprendimientoRepositorio.obtenerPorId(id);
        if (!emprendimiento) {
            throw new Error('Emprendimiento no encontrado');
        }

        if (usuario.rol !== 'administrador' && emprendimiento.usuario_id !== usuario.id) {
            throw new Error('No tienes permisos para modificar este emprendimiento');
        }

        delete datos.estado_aval;
        delete datos.usuario_id;

        return await emprendimientoRepositorio.actualizar(id, datos);
    },

    eliminar: async function(id) {
        const emprendimiento = await emprendimientoRepositorio.obtenerPorId(id);
        if (!emprendimiento) {
            throw new Error('Emprendimiento no encontrado');
        }
        return await emprendimientoRepositorio.eliminar(id);
    }
};

module.exports = emprendimientoServicio;
