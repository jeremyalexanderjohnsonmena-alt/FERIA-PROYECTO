const { cliente_supabase } = require('../config/supabase');

const emprendimientoRepositorio = {
    obtenerAprobados: async function() {
        const { data, error } = await cliente_supabase
            .from('emprendimientos')
            .select('*')
            .eq('estado_aval', 'aprobado');

        if (error) {
            throw new Error('Error al consultar emprendimientos: ' + error.message);
        }
        return data;
    },

    
    obtenerTodos: async function() {
        const { data, error } = await cliente_supabase
            .from('emprendimientos')
            .select('*')
            .order('creado_en', { ascending: false });

        if (error) {
            throw new Error('Error al consultar emprendimientos: ' + error.message);
        }
        return data;
    },

    obtenerPorId: async function(id) {
        const { data, error } = await cliente_supabase
            .from('emprendimientos')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return null;
        }
        return data;
    },

    obtenerPorUsuarioId: async function(usuario_id) {
        const { data, error } = await cliente_supabase
            .from('emprendimientos')
            .select('*')
            .eq('usuario_id', usuario_id);

        if (error) {
            throw new Error('Error al consultar emprendimientos del usuario: ' + error.message);
        }
        return data;
    },

    guardar: async function(datos) {
        const { data, error } = await cliente_supabase
            .from('emprendimientos')
            .insert([datos])
            .select()
            .single();

        if (error) {
            throw new Error('Error al registrar emprendimiento: ' + error.message);
        }
        return data;
    },

    actualizarEstadoAval: async function(id, estado_aval) {
        const { data, error } = await cliente_supabase
            .from('emprendimientos')
            .update({ 
                estado_aval: estado_aval,
                actualizado_en: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error('Error al actualizar el estado de aval: ' + error.message);
        }
        return data;
    },

    actualizar: async function(id, datos) {
        const { data, error } = await cliente_supabase
            .from('emprendimientos')
            .update({
                ...datos,
                actualizado_en: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error('Error al actualizar emprendimiento: ' + error.message);
        }
        return data;
    },

    eliminar: async function(id) {
        const { error } = await cliente_supabase
            .from('emprendimientos')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error('Error al eliminar emprendimiento: ' + error.message);
        }
        return true;
    },

    obtenerConteoPorCategoria: async function(categoria) {
        const { count, error } = await cliente_supabase
            .from('emprendimientos')
            .select('*', { count: 'exact', head: true })
            .eq('categoria', categoria);

        if (error) {
            throw new Error('Error al consultar cupos por categoría');
        }
        return count;
    }
};

module.exports = emprendimientoRepositorio;
