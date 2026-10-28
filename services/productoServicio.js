const productoRepositorio = require('../repositories/productoRepositorio');
const emprendimientoRepositorio = require('../repositories/emprendimientoRepositorio');

const productoServicio = {
    listarPorEmprendimiento: async function(emprendimiento_id) {
        const emprendimiento = await emprendimientoRepositorio.obtenerPorId(emprendimiento_id);
        if (!emprendimiento) {
            throw new Error('Emprendimiento no encontrado');
        }
        return await productoRepositorio.obtenerPorEmprendimiento(emprendimiento_id);
    },

    crear: async function(datos, usuario) {
        const { emprendimiento_id, nombre, descripcion, precio, imagenes, tipo } = datos;

        if (!emprendimiento_id || !nombre) {
            throw new Error('El emprendimiento y el nombre del producto/servicio son obligatorios');
        }

        const emprendimiento = await emprendimientoRepositorio.obtenerPorId(emprendimiento_id);
        if (!emprendimiento) {
            throw new Error('El emprendimiento especificado no existe');
        }

        if (usuario.rol !== 'administrador') {
            if (emprendimiento.usuario_id !== usuario.id) {
                throw new Error('No puedes agregar productos a un emprendimiento que no te pertenece');
            }
            if (emprendimiento.estado_aval !== 'aprobado') {
                throw new Error('Tu emprendimiento aún no ha sido avalado por un administrador');
            }
        }

        return await productoRepositorio.guardar({
            emprendimiento_id,
            nombre,
            descripcion: descripcion || '',
            precio: precio || 0,
            imagenes: Array.isArray(imagenes) ? imagenes : (imagenes ? [imagenes] : []),
            tipo: tipo || 'producto'
        });
    },

    actualizar: async function(id, datos, usuario) {
        const producto = await productoRepositorio.obtenerPorId(id);
        if (!producto) {
            throw new Error('Producto o servicio no encontrado');
        }

        if (usuario.rol !== 'administrador') {
            const emprendimiento = await emprendimientoRepositorio.obtenerPorId(producto.emprendimiento_id);
            if (!emprendimiento || emprendimiento.usuario_id !== usuario.id) {
                throw new Error('No tienes permisos para modificar este producto');
            }
            if (emprendimiento.estado_aval !== 'aprobado') {
                throw new Error('Tu emprendimiento debe estar avalado para modificar productos');
            }
        }

        return await productoRepositorio.actualizar(id, datos);
    },

    eliminar: async function(id, usuario) {
        const producto = await productoRepositorio.obtenerPorId(id);
        if (!producto) {
            throw new Error('Producto o servicio no encontrado');
        }

        if (usuario.rol !== 'administrador') {
            const emprendimiento = await emprendimientoRepositorio.obtenerPorId(producto.emprendimiento_id);
            if (!emprendimiento || emprendimiento.usuario_id !== usuario.id) {
                throw new Error('No tienes permisos para eliminar este producto');
            }
        }

        return await productoRepositorio.eliminar(id);
    }
};

module.exports = productoServicio;
