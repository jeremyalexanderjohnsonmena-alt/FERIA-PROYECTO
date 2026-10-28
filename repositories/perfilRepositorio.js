const { cliente_supabase } = require('../config/supabase');

const perfilRepositorio = {
    crearPerfil: async function({ id, nombre, email, rol }) {
        const { data, error } = await cliente_supabase
            .from('perfiles')
            .insert([{ id, nombre, email, rol: rol || 'expositor' }])
            .select()
            .single();

        if (error) {
            throw new Error('Error al registrar perfil: ' + error.message);
        }
        return data;
    },

    obtenerPerfilPorId: async function(id_usuario) {
        const { data, error } = await cliente_supabase
            .from('perfiles')
            .select('*')
            .eq('id', id_usuario)
            .single();

        if (error) {
            return null;
        }
        return data;
    }
};

module.exports = perfilRepositorio;