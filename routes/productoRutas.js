const express = require('express');
const router = express.Router();
const controlador = require('../controllers/productoControlador');
const auth = require('../middlewares/autorizacionMiddleware');

// 1. Público (Cliente: sin inicio de sesión)
router.get('/emprendimiento/:emprendimiento_id', controlador.listarPorEmprendimiento);

// 2. Expositor avalado / Administrador (requiere inicio de sesión y aval)
router.post('/', auth.autenticar, auth.verificarExpositorAvalado, controlador.crear);
router.put('/:id', auth.autenticar, auth.verificarExpositorAvalado, controlador.actualizar);
router.delete('/:id', auth.autenticar, auth.verificarExpositorAvalado, controlador.eliminar);

module.exports = router;
