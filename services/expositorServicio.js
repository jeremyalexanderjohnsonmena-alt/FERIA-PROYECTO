const repositorio = require('../repositories/expositorRepositorio');

const expositorServicio = {
    procesarInscripcion: async function(datos_formulario) {
        if (!datos_formulario.nombre_emprendimiento) {
            throw new Error('Debes asignar un nombre a tu emprendimiento.');
        }

        const cantidad_actual = await repositorio.obtenerConteoPorCategoria(datos_formulario.categoria);

        if (cantidad_actual >= 5) {
            throw new Error('Ya no hay cupos disponibles para la categoría: ' + datos_formulario.categoria);
        }

        return await repositorio.guardar(datos_formulario);
    }
};

module.exports = {
    expositorServicio: expositorServicio
};