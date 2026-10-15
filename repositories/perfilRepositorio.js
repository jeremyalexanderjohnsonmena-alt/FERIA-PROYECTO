const { cliente_supabase } = require('../config/supabase');

const perfilRepositorio = {
    obtenerPerfilPorId: async function(id_usuario) {
        const { data, error } = await cliente_supabase
            .from('perfiles')
            .select('rol')
            .eq('id_usuario', id_usuario)
            .single();

        if (error) {
            throw new Error('No se encontró el perfil del usuario');
        }
        return data;
    }
};

module.exports = perfilRepositorio;