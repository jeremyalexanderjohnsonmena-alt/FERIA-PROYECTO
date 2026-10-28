const express = require('express');
const path = require('path');
const app = express();

require('dotenv').config();

const rutas_auth = require('./routes/authRutas');
const rutas_emprendimientos = require('./routes/emprendimientoRutas');
const rutas_productos = require('./routes/productoRutas');

app.use(express.json());

// Servir archivos estáticos del frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Registro de Rutas API
app.use('/feria/auth', rutas_auth);
app.use('/feria/emprendimientos', rutas_emprendimientos);
app.use('/feria/productos', rutas_productos);

// Ruta de comprobación de salud
app.get('/health', (req, res) => {
    res.json({ estado: 'ok', mensaje: 'API de la Feria funcionando correctamente' });
});

// Fallback para SPA o navegación hacia el frontend
app.use((req, res, next) => {
    // Si la ruta no empieza por /feria ni es un archivo estático ya servido, sirve index.html
    if (req.method === 'GET' && !req.path.startsWith('/feria')) {
        return res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
    next();
});

const puerto = process.env.PUERTO_SERVIDOR || 3000;

app.listen(puerto, function () {
    console.log('--- Servidor de la Feria Iniciado ---');
    console.log('Escuchando en: http://localhost:' + puerto);
});
