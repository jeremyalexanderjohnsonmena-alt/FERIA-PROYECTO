// Lógica de la página pública (index.html)
let emprendimientos = [];

document.addEventListener('DOMContentLoaded', () => {
    renderNavbar();
    cargarEmprendimientos();

    document.getElementById('buscador').addEventListener('input', filtrarEmprendimientos);
    document.getElementById('filtro-categoria').addEventListener('change', filtrarEmprendimientos);
});

async function cargarEmprendimientos() {
    const contenedor = document.getElementById('contenedor-emprendimientos');
    const estado = document.getElementById('contenedor-estado');
    estado.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Cargando emprendimientos...</p>';
    contenedor.innerHTML = '';

    try {
        const respuesta = await api.listarAprobados();
        emprendimientos = respuesta.datos || [];
        estado.innerHTML = '';

        if (emprendimientos.length === 0) {
            estado.innerHTML = '<div class="alert alert-info" style="text-align:center;">Aún no hay emprendimientos aprobados en la feria. ¡Vuelve pronto!</div>';
            return;
        }

        renderizarEmprendimientos(emprendimientos);
    } catch (error) {
        estado.innerHTML = `<div class="alert alert-error">Error al cargar la feria: ${error.message}</div>`;
    }
}

function renderizarEmprendimientos(lista) {
    const contenedor = document.getElementById('contenedor-emprendimientos');
    contenedor.innerHTML = '';

    if (lista.length === 0) {
        contenedor.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:var(--text-muted);">No se encontraron emprendimientos con esos criterios.</p>';
        return;
    }

    lista.forEach(emp => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'card';
        tarjeta.innerHTML = `
            <div class="card-header">
                <span class="badge badge-category">${emp.categoria || 'General'}</span>
            </div>
            <div class="card-body">
                <h3 class="card-title">${emp.nombre_emprendimiento || 'Emprendimiento'}</h3>
                <p class="card-text">${emp.descripcion || 'Sin descripción disponible.'}</p>
            </div>
            <div class="card-footer">
                <span style="font-size:0.85rem; color:var(--text-muted);">✨ Expositor Avalado</span>
                <button class="btn btn-primary btn-sm" onclick="verDetalleEmprendimiento('${emp.id}')">Ver Catálogo</button>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}

function filtrarEmprendimientos() {
    const busqueda = document.getElementById('buscador').value.toLowerCase().trim();
    const categoria = document.getElementById('filtro-categoria').value;

    const filtrados = emprendimientos.filter(item => {
        const coincideNombre = item.nombre_emprendimiento?.toLowerCase().includes(busqueda) || false;
        const coincideDesc = item.descripcion?.toLowerCase().includes(busqueda) || false;
        const coincideCat = !categoria || item.categoria === categoria;

        return (coincideNombre || coincideDesc) && coincideCat;
    });

    renderizarEmprendimientos(filtrados);
}

// Modal de detalle y productos (Solo Lectura)
async function verDetalleEmprendimiento(id) {
    const modal = document.getElementById('modal-detalle');
    const contenido = document.getElementById('modal-contenido');
    
    contenido.innerHTML = '<p style="text-align:center; padding: 2rem;">Cargando catálogo del emprendimiento...</p>';
    modal.classList.add('active');

    try {
        const [empRes, prodRes] = await Promise.all([
            api.obtenerEmprendimiento(id),
            api.listarProductosPorEmprendimiento(id)
        ]);

        const emp = empRes.datos;
        const productos = prodRes.datos || [];

        let productosHtml = '';
        if (productos.length === 0) {
            productosHtml = '<p style="color:var(--text-muted); margin-top:1rem;">Este emprendimiento aún no tiene productos registrados en exhibición.</p>';
        } else {
            productosHtml = `
                <div class="grid-cards" style="margin-top: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));">
                    ${productos.map(p => {
                        const img = (p.imagenes && p.imagenes.length > 0 && p.imagenes[0]) 
                            ? p.imagenes[0] 
                            : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60';
                        return `
                            <div class="product-card">
                                <img src="${img}" alt="${p.nombre}" class="product-img" onerror="this.src='https://via.placeholder.com/300x170?text=Sin+Imagen'">
                                <div class="product-info">
                                    <h4 style="font-size:1rem; margin-bottom:0.25rem;">${p.nombre}</h4>
                                    <p style="font-size:0.85rem; color:var(--text-muted); flex:1;">${p.descripcion || ''}</p>
                                    <div class="product-price">$${Number(p.precio).toLocaleString()}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }

        contenido.innerHTML = `
            <div>
                <span class="badge badge-category">${emp.categoria || 'General'}</span>
                <h2 style="font-size: 1.75rem; margin: 0.5rem 0; color:var(--dark);">${emp.nombre_emprendimiento}</h2>
                <p style="color:var(--text-main); font-size:1rem; margin-bottom: 1.5rem;">${emp.descripcion || ''}</p>
                <hr style="border:none; border-top:1px solid var(--border);">
                <h3 style="margin-top: 1.5rem; color:var(--dark);">Catálogo de Productos y Servicios</h3>
                ${productosHtml}
            </div>
        `;
    } catch (error) {
        contenido.innerHTML = `<div class="alert alert-error">No se pudo cargar el emprendimiento: ${error.message}</div>`;
    }
}

function cerrarModal() {
    document.getElementById('modal-detalle').classList.remove('active');
}

// Cerrar modal al hacer clic afuera
window.addEventListener('click', (e) => {
    const modal = document.getElementById('modal-detalle');
    if (e.target === modal) {
        cerrarModal();
    }
});
