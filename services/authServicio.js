const { cliente_supabase } = require('../config/supabase');
const perfilRepositorio = require('../repositories/perfilRepositorio');

const authServicio = {
    registrar: async function({ email, password, nombre, rol }) {
        if (!email || !password || !nombre) {
            throw new Error('Todos los campos son obligatorios: email, password, nombre');
        }

        const rolFinal = rol === 'administrador' ? 'administrador' : 'expositor';

        const { data: authData, error: authError } = await cliente_supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    nombre: nombre,
                    rol: rolFinal
                }
            }
        });

        if (authError) {
            throw new Error('Error al registrar usuario: ' + authError.message);
        }

        if (!authData.user) {
            throw new Error('No se pudo crear el usuario en el sistema de autenticación');
        }

        await perfilRepositorio.crearPerfil({
            id: authData.user.id,
            nombre: nombre,
            email: authData.user.email,
            rol: rolFinal
        });

        return {
            usuario: {
                id: authData.user.id,
                email: authData.user.email,
                nombre: nombre,
                rol: rolFinal
            },
            sesion: authData.session
        };
    },

    iniciarSesion: async function({ email, password }) {
        if (!email || !password) {
            throw new Error('Email y contraseña requeridos');
        }

        const { data, error } = await cliente_supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            throw new Error('Credenciales inválidas: ' + error.message);
        }

        const perfil = await perfilRepositorio.obtenerPerfilPorId(data.user.id);
        const metadata = data.user.user_metadata || {};

        return {
            token: data.session.access_token,
            expira_en: data.session.expires_in,
            usuario: {
                id: data.user.id,
                email: data.user.email,
                nombre: perfil?.nombre || metadata.nombre || 'Usuario',
                rol: perfil?.rol || metadata.rol || 'expositor'
            }
        };
    }
};

module.exports = authServicio;
