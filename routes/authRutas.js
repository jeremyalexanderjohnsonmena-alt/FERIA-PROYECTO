const express = require('express');
const router = express.Router();
const authControlador = require('../controllers/authControlador');

router.post('/registro', authControlador.registrar);
router.post('/login', authControlador.iniciarSesion);

module.exports = router;
