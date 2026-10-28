const { cliente_supabase } = require('../config/supabase');

const productoRepositorio = {
    obtenerPorEmprendimiento: async function(emprendimiento_id) {
        const { data, error } = await cliente_supabase
            .from('productos_servicios')
            .select('*')
            .eq('emprendimiento_id', emprendimiento_id)
            .order('creado_en', { ascending: false });

        if (error) {
            throw new Error('Error al consultar productos/servicios: ' + error.message);
        }
        return data;
    },

    obtenerPorId: async function(id) {
        const { data, error } = await cliente_supabase
            .from('productos_servicios')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            return null;
        }
        return data;
    },

    guardar: async function(datos) {
        const { data, error } = await cliente_supabase
            .from('productos_servicios')
            .insert([datos])
            .select()
            .single();

        if (error) {
            throw new Error('Error al registrar producto/servicio: ' + error.message);
        }
        return data;
    },

    actualizar: async function(id, datos) {
        const { data, error } = await cliente_supabase
            .from('productos_servicios')
            .update({
                ...datos,
                actualizado_en: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new Error('Error al actualizar producto/servicio: ' + error.message);
        }
        return data;
    },

    eliminar: async function(id) {
        const { error } = await cliente_supabase
            .from('productos_servicios')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error('Error al eliminar producto/servicio: ' + error.message);
        }
        return true;
    }
};

module.exports = productoRepositorio;
