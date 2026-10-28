const express = require('express');
const router = express.Router();
const controlador = require('../controllers/emprendimientoControlador');
const auth = require('../middlewares/autorizacionMiddleware');

// 1. Rutas Públicas (Cliente: sin inicio de sesión)
router.get('/', controlador.listarAprobados);
router.get('/:id', controlador.obtenerPorId);

// 2. Rutas del Expositor (requiere inicio de sesión)
router.get('/usuario/mis-emprendimientos', auth.autenticar, controlador.misEmprendimientos);
router.post('/registrar', auth.autenticar, auth.verificarExpositor, controlador.registrar);

// 3. Rutas de Administrador (requiere inicio de sesión y rol admin)
router.get('/admin/todos', auth.autenticar, auth.verificarAdministrador, controlador.listarTodos);
router.patch('/:id/avalar', auth.autenticar, auth.verificarAdministrador, controlador.avalar);
router.delete('/:id', auth.autenticar, auth.verificarAdministrador, controlador.eliminar);

// 4. Actualizar (Admin o dueño del emprendimiento)
router.put('/:id', auth.autenticar, controlador.actualizar);

module.exports = router;
