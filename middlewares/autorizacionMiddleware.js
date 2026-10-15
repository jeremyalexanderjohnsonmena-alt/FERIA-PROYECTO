const perfilRepositorio = require('../repositories/perfilRepositorio');

const autorizacionMiddleware = {
    verificarAdministrador: async function(solicitud, respuesta, siguiente) {
        try {
            const id_usuario = solicitud.user.id;
            const perfil = await perfilRepositorio.obtenerPerfilPorId(id_usuario);

            if (perfil.rol !== 'administrador') {
                return respuesta.status(403).json({
                    mensaje: 'Acceso denegado: Se requieren permisos de administrador'
                });
            }

            siguiente();
        } catch (error) {
            respuesta.status(500).json({ mensaje: error.message });
        }
    }
};

module.exports = autorizacionMiddleware;