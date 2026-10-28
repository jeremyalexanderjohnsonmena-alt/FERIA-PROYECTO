// Panel de Expositor
let miEmprendimientoActual = null;

document.addEventListener('DOMContentLoaded', () => {
    const usuario = authStorage.getUsuario();
    if (!usuario) {
        window.location.href = '/login.html';
        return;
    }

    renderNavbar();
    cargarMiEmprendimiento();
});

async function cargarMiEmprendimiento() {
    const seccion = document.getElementById('seccion-emprendimiento');
    const btnInscribir = document.getElementById('btn-inscribir');
    const seccionProductos = document.getElementById('seccion-productos');
    const mensaje = document.getElementById('mensaje-estado');

    mensaje.innerHTML = '<p style="color:var(--text-muted);">Consultando datos de tu emprendimiento...</p>';
    seccion.innerHTML = '';

    try {
        const respuesta = await api.misEmprendimientos();
        const lista = respuesta.datos || [];
        mensaje.innerHTML = '';

        if (lista.length === 0) {
            miEmprendimientoActual = null;
            btnInscribir.style.display = 'inline-flex';
            seccionProductos.style.display = 'none';

            seccion.innerHTML = `
                <div class="card" style="padding: 2.5rem; text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 0.5rem;">🚀</div>
                    <h2 style="margin-bottom: 0.5rem; color: var(--dark);">Aún no has registrado tu emprendimiento</h2>
                    <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 1.5rem;">
                        Inscribe tu marca para participar en la feria. Una vez enviada, el comité organizador revisará tu solicitud para avalarla.
                    </p>
                    <div>
                        <button class="btn btn-primary" onclick="abrirModalEmprendimiento()">Inscribir mi Emprendimiento ahora</button>
                    </div>
                </div>
            `;
            return;
        }

        // Ya tiene emprendimiento
        miEmprendimientoActual = lista[0];
        btnInscribir.style.display = 'none';

        const estado = miEmprendimientoActual.estado_aval || 'pendiente';
        let badgeEstado = '';
        if (estado === 'aprobado') {
            badgeEstado = '<span class="badge badge-aprobado">✅ Aprobado / Avalado</span>';
        } else if (estado === 'rechazado') {
            badgeEstado = '<span class="badge badge-rechazado">❌ Rechazado</span>';
        } else {
            badgeEstado = '<span class="badge badge-pendiente">⏳ Pendiente de Aval</span>';
        }

        seccion.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div>
                        <span class="badge badge-category" style="margin-right: 0.5rem;">${miEmprendimientoActual.categoria}</span>
                        ${badgeEstado}
                    </div>
                    <button class="btn btn-outline btn-sm" onclick="editarMiEmprendimiento()">Editar Datos</button>
                </div>
                <div class="card-body">
                    <h2 class="card-title" style="font-size: 1.5rem;">${miEmprendimientoActual.nombre_emprendimiento}</h2>
                    <p class="card-text">${miEmprendimientoActual.descripcion || 'Sin descripción'}</p>
                </div>
            </div>
        `;

        // Regla de negocio: sólo si está aprobado puede gestionar catálogo de productos
        if (estado === 'aprobado') {
            seccionProductos.style.display = 'block';
            cargarProductosDelEmprendimiento(miEmprendimientoActual.id);
        } else {
            seccionProductos.style.display = 'block';
            seccionProductos.innerHTML = `
                <div class="alert alert-info">
                    <strong>Catálogo de productos bloqueado:</strong> Tu emprendimiento se encuentra actualmente con estado <em>"${estado}"</em>. 
                    El catálogo se habilitará automáticamente tan pronto como un administrador avale tu inscripción.
                </div>
            `;
        }

    } catch (error) {
        mensaje.innerHTML = `<div class="alert alert-error">${error.message}</div>`;
    }
}

// Emprendimiento CRUD (Modal)
function abrirModalEmprendimiento() {
    document.getElementById('modal-emp-titulo').innerText = 'Inscribir Emprendimiento';
    document.getElementById('emp-id').value = '';
    document.getElementById('emp-nombre').value = '';
    document.getElementById('emp-categoria').value = '';
    document.getElementById('emp-descripcion').value = '';
    document.getElementById('modal-emp').classList.add('active');
}

function editarMiEmprendimiento() {
    if (!miEmprendimientoActual) return;
    document.getElementById('modal-emp-titulo').innerText = 'Editar Emprendimiento';
    document.getElementById('emp-id').value = miEmprendimientoActual.id;
    document.getElementById('emp-nombre').value = miEmprendimientoActual.nombre_emprendimiento;
    document.getElementById('emp-categoria').value = miEmprendimientoActual.categoria;
    document.getElementById('emp-descripcion').value = miEmprendimientoActual.descripcion;
    document.getElementById('modal-emp').classList.add('active');
}

function cerrarModalEmp() {
    document.getElementById('modal-emp').classList.remove('active');
}

async function guardarEmprendimiento(e) {
    e.preventDefault();
    const id = document.getElementById('emp-id').value;
    const nombre_emprendimiento = document.getElementById('emp-nombre').value;
    const categoria = document.getElementById('emp-categoria').value;
    const descripcion = document.getElementById('emp-descripcion').value;

    try {
        if (id) {
            await api.actualizarEmprendimiento(id, { nombre_emprendimiento, categoria, descripcion });
            alert('¡Emprendimiento actualizado!');
        } else {
            await api.registrarEmprendimiento({ nombre_emprendimiento, categoria, descripcion });
            alert('¡Emprendimiento inscrito con éxito! Está en revisión para ser avalado.');
        }
        cerrarModalEmp();
        cargarMiEmprendimiento();
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// Productos CRUD
async function cargarProductosDelEmprendimiento(empId) {
    const contenedor = document.getElementById('contenedor-mis-productos');
    contenedor.innerHTML = '<p style="color:var(--text-muted); grid-column: 1/-1;">Cargando tus productos...</p>';

    try {
        const res = await api.listarProductosPorEmprendimiento(empId);
        const productos = res.datos || [];
        contenedor.innerHTML = '';

        if (productos.length === 0) {
            contenedor.innerHTML = '<p style="color:var(--text-muted); grid-column: 1/-1;">Aún no tienes productos en tu catálogo. ¡Haz clic en "+ Agregar Producto" para publicar el primero!</p>';
            return;
        }

        productos.forEach(p => {
            const img = (p.imagenes && p.imagenes.length > 0 && p.imagenes[0])
                ? p.imagenes[0]
                : 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60';
            
            const item = document.createElement('div');
            item.className = 'product-card';
            item.innerHTML = `
                <img src="${img}" alt="${p.nombre}" class="product-img" onerror="this.src='https://via.placeholder.com/300x170?text=Sin+Imagen'">
                <div class="product-info">
                    <span class="badge" style="background:#f1f5f9; color:var(--text-muted); align-self:flex-start; margin-bottom:0.4rem;">${p.tipo || 'producto'}</span>
                    <h4 style="font-size:1.1rem; margin-bottom: 0.3rem;">${p.nombre}</h4>
                    <p style="font-size:0.85rem; color:var(--text-muted); flex:1;">${p.descripcion || ''}</p>
                    <div class="product-price">$${Number(p.precio).toLocaleString()}</div>
                    <div style="display:flex; gap:0.5rem; margin-top:1rem;">
                        <button class="btn btn-outline btn-sm" style="flex:1;" onclick='editarProducto(${JSON.stringify(p)})'>Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarProducto('${p.id}')">Borrar</button>
                    </div>
                </div>
            `;
            contenedor.appendChild(item);
        });

    } catch (error) {
        contenedor.innerHTML = `<p style="color:red; grid-column: 1/-1;">Error: ${error.message}</p>`;
    }
}

function abrirModalProducto() {
    document.getElementById('modal-prod-titulo').innerText = 'Agregar Producto / Servicio';
    document.getElementById('prod-id').value = '';
    document.getElementById('prod-nombre').value = '';
    document.getElementById('prod-precio').value = '';
    document.getElementById('prod-tipo').value = 'producto';
    document.getElementById('prod-imagen').value = '';
    document.getElementById('prod-descripcion').value = '';
    document.getElementById('modal-prod').classList.add('active');
}

function editarProducto(p) {
    document.getElementById('modal-prod-titulo').innerText = 'Editar Producto / Servicio';
    document.getElementById('prod-id').value = p.id;
    document.getElementById('prod-nombre').value = p.nombre;
    document.getElementById('prod-precio').value = p.precio;
    document.getElementById('prod-tipo').value = p.tipo || 'producto';
    document.getElementById('prod-imagen').value = (p.imagenes && p.imagenes[0]) ? p.imagenes[0] : '';
    document.getElementById('prod-descripcion').value = p.descripcion || '';
    document.getElementById('modal-prod').classList.add('active');
}

function cerrarModalProd() {
    document.getElementById('modal-prod').classList.remove('active');
}

async function guardarProducto(e) {
    e.preventDefault();
    if (!miEmprendimientoActual) return;

    const id = document.getElementById('prod-id').value;
    const nombre = document.getElementById('prod-nombre').value;
    const precio = parseFloat(document.getElementById('prod-precio').value);
    const tipo = document.getElementById('prod-tipo').value;
    const imgUrl = document.getElementById('prod-imagen').value.trim();
    const descripcion = document.getElementById('prod-descripcion').value;

    const imagenes = imgUrl ? [imgUrl] : [];

    try {
        if (id) {
            await api.actualizarProducto(id, { nombre, precio, tipo, imagenes, descripcion });
            alert('¡Producto actualizado con éxito!');
        } else {
            await api.crearProducto({
                emprendimiento_id: miEmprendimientoActual.id,
                nombre,
                precio,
                tipo,
                imagenes,
                descripcion
            });
            alert('¡Producto agregado al catálogo!');
        }
        cerrarModalProd();
        cargarProductosDelEmprendimiento(miEmprendimientoActual.id);
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function eliminarProducto(id) {
    if (!confirm('¿Seguro que deseas eliminar este producto de tu catálogo?')) return;
    try {
        await api.eliminarProducto(id);
        cargarProductosDelEmprendimiento(miEmprendimientoActual.id);
    } catch (err) {
        alert('Error al eliminar: ' + err.message);
    }
}
