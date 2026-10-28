const { cliente_supabase } = require('../config/supabase');
const perfilRepositorio = require('../repositories/perfilRepositorio');
const emprendimientoRepositorio = require('../repositories/emprendimientoRepositorio');

const autorizacionMiddleware = {
    // 1. Verifica token JWT de Supabase
    autenticar: async function(solicitud, respuesta, siguiente) {
        try {
            const authHeader = solicitud.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return respuesta.status(401).json({
                    mensaje: 'No autorizado: Token de acceso no proporcionado'
                });
            }

            const token = authHeader.split(' ')[1];
            const { data: { user }, error } = await cliente_supabase.auth.getUser(token);

            if (error || !user) {
                return respuesta.status(401).json({
                    mensaje: 'No autorizado: Sesión inválida o expirada'
                });
            }

            // Obtener perfil o fallback a user_metadata
            const perfil = await perfilRepositorio.obtenerPerfilPorId(user.id);
            const metadata = user.user_metadata || {};
            const rolFinal = perfil?.rol || metadata.rol || 'expositor';
            const nombreFinal = perfil?.nombre || metadata.nombre || 'Usuario';

            solicitud.usuario = {
                id: user.id,
                email: user.email,
                rol: rolFinal,
                nombre: nombreFinal
            };

            siguiente();
        } catch (error) {
            respuesta.status(500).json({ mensaje: error.message });
        }
    },

    // 2. Requiere rol 'administrador'
    verificarAdministrador: function(solicitud, respuesta, siguiente) {
        if (!solicitud.usuario || solicitud.usuario.rol !== 'administrador') {
            return respuesta.status(403).json({
                mensaje: 'Acceso denegado: Se requieren permisos de administrador'
            });
        }
        siguiente();
    },

    // 3. Requiere rol 'expositor' o 'administrador'
    verificarExpositor: function(solicitud, respuesta, siguiente) {
        if (!solicitud.usuario || (solicitud.usuario.rol !== 'expositor' && solicitud.usuario.rol !== 'administrador')) {
            return respuesta.status(403).json({
                mensaje: 'Acceso denegado: Rol no autorizado'
            });
        }
        siguiente();
    },

    // 4. Verifica que el expositor esté avalado (para agregar o gestionar productos)
    verificarExpositorAvalado: async function(solicitud, respuesta, siguiente) {
        try {
            // El administrador siempre tiene pase libre
            if (solicitud.usuario.rol === 'administrador') {
                return siguiente();
            }

            const emprendimientos = await emprendimientoRepositorio.obtenerPorUsuarioId(solicitud.usuario.id);
            const emprendimientoAvalado = emprendimientos.find(e => e.estado_aval === 'aprobado');

            if (!emprendimientoAvalado) {
                return respuesta.status(403).json({
                    mensaje: 'Acceso denegado: Tu emprendimiento aún no ha sido avalado por un administrador'
                });
            }

            solicitud.emprendimientoAvalado = emprendimientoAvalado;
            siguiente();
        } catch (error) {
            respuesta.status(500).json({ mensaje: error.message });
        }
    }
};

module.exports = autorizacionMiddleware;