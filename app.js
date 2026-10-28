const express = require('express');
const path = require('path');
const app = express();

require('dotenv').config();

const rutas_auth = require('./routes/authRutas');
const rutas_emprendimientos = require('./routes/emprendimientoRutas');
const rutas_productos = require('./routes/productoRutas');

app.use(express.json());


app.use(express.static(path.join(__dirname, 'public')));

// Registro de Rutas API
app.use('/feria/auth', rutas_auth);
app.use('/feria/emprendimientos', rutas_emprendimientos);
app.use('/feria/productos', rutas_productos);


app.get('/health', (req, res) => {
    res.json({ estado: 'ok', mensaje: 'API de la Feria funcionando correctamente' });
});


app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/feria')) {
        return res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
    next();
});

const puerto = process.env.PUERTO_SERVIDOR || 3000;


if (process.env.NODE_ENV !== 'production') {
    app.listen(puerto, function () {
        console.log('--- Servidor de la Feria Iniciado ---');
        console.log('Escuchando en: http://localhost:' + puerto);
    });
}


module.exports = app;
