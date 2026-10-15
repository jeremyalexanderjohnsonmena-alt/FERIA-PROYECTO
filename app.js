const express = require('express');
const app = express();
const rutas_expositores = require('./routes/expositorRutas');

require('dotenv').config();

app.use(express.json());
app.use('/feria', rutas_expositores);

const puerto = process.env.PUERTO_SERVIDOR || 3000;

app.listen(puerto, function () {
    console.log('--- Servidor de la Feria Iniciado ---');
    console.log('Escuchando en: http://localhost:' + puerto);
});