const express = require('express');
const router = express.Router();
const controlador = require('../controllers/expositorControlador');
const middleware = require('../controllers/expositorMiddleware');

router.post('/registrar', controlador.registrar);
router.post('/listar-todos', middleware.verificarAdministrador, controlador.obtenerTodos);

module.exports = router;