const express = require('express');
const router = express.Router();
const controlador = require('../controllers/expositorControlador');
const middleware = require('../middlewares/autorizacionMiddleware');

router.post('/registrar', controlador.registrar);
//router.get('/listar-todos', middleware.verificarAdministrador, controlador.obtenerTodos);

module.exports = router;