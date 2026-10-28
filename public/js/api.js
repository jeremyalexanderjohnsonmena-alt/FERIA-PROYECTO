// Módulo para interactuar con la API REST de la Feria
const API_BASE = '/feria';

const authStorage = {
    getToken() {
        return localStorage.getItem('feria_token');
    },
    setToken(token) {
        localStorage.setItem('feria_token', token);
    },
    getUsuario() {
        const u = localStorage.getItem('feria_usuario');
        return u ? JSON.parse(u) : null;
    },
    setUsuario(usuario) {
        localStorage.setItem('feria_usuario', JSON.stringify(usuario));
    },
    cerrarSesion() {
        localStorage.removeItem('feria_token');
        localStorage.removeItem('feria_usuario');
        window.location.href = '/login.html';
    }
};

async function peticion(ruta, opciones = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...(opciones.headers || {})
    };

    const token = authStorage.getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const respuesta = await fetch(API_BASE + ruta, {
            ...opciones,
            headers
        });

        const datos = await respuesta.json().catch(() => ({}));

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || 'Error en la petición');
        }

        return datos;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

const api = {
    // 1. Auth
    registro: (payload) => peticion('/auth/registro', { method: 'POST', body: JSON.stringify(payload) }),
    login: (payload) => peticion('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),

    // 2. Emprendimientos
    listarAprobados: () => peticion('/emprendimientos'),
    obtenerEmprendimiento: (id) => peticion(`/emprendimientos/${id}`),
    misEmprendimientos: () => peticion('/emprendimientos/usuario/mis-emprendimientos'),
    registrarEmprendimiento: (payload) => peticion('/emprendimientos/registrar', { method: 'POST', body: JSON.stringify(payload) }),
    actualizarEmprendimiento: (id, payload) => peticion(`/emprendimientos/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    
    // Admin
    listarTodosEmprendimientos: () => peticion('/emprendimientos/admin/todos'),
    avalarEmprendimiento: (id, estado) => peticion(`/emprendimientos/${id}/avalar`, { method: 'PATCH', body: JSON.stringify({ estado_aval: estado, estado }) }),
    eliminarEmprendimiento: (id) => peticion(`/emprendimientos/${id}`, { method: 'DELETE' }),

    // 3. Productos
    listarProductosPorEmprendimiento: (emprendimientoId) => peticion(`/productos/emprendimiento/${emprendimientoId}`),
    crearProducto: (payload) => peticion('/productos', { method: 'POST', body: JSON.stringify(payload) }),
    actualizarProducto: (id, payload) => peticion(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    eliminarProducto: (id) => peticion(`/productos/${id}`, { method: 'DELETE' })
};

// Renderizar Navbar Dinámico según sesión
function renderNavbar() {
    const navLinks = document.getElementById('nav-links');
    if (!navLinks) return;

    const usuario = authStorage.getUsuario();
    if (usuario) {
        const linkPanel = usuario.rol === 'administrador' ? '/panel-admin.html' : '/panel-expositor.html';
        const labelPanel = usuario.rol === 'administrador' ? 'Panel Admin' : 'Mi Emprendimiento';

        navLinks.innerHTML = `
            <li><a href="/index.html">Catálogo Feria</a></li>
            <li><a href="${linkPanel}" style="font-weight: 700; color: var(--primary);">${labelPanel}</a></li>
            <li><span style="font-size:0.85rem; color:var(--text-muted);">${usuario.nombre || usuario.email} (${usuario.rol})</span></li>
            <li><button onclick="authStorage.cerrarSesion()" class="btn btn-outline btn-sm">Cerrar Sesión</button></li>
        `;
    } else {
        navLinks.innerHTML = `
            <li><a href="/index.html">Catálogo Feria</a></li>
            <li><a href="/login.html" class="btn btn-primary btn-sm">Ingresar / Registro</a></li>
        `;
    }
}
