const express = require('express');
const router = express.Router();
const controlador = require('../controllers/emprendimientoControlador');
const auth = require('../middlewares/autorizacionMiddleware');

router.get('/', controlador.listarAprobados);
router.get('/:id', controlador.obtenerPorId);

router.get('/usuario/mis-emprendimientos', auth.autenticar, controlador.misEmprendimientos);
router.post('/registrar', auth.autenticar, auth.verificarExpositor, controlador.registrar);

router.get('/admin/todos', auth.autenticar, auth.verificarAdministrador, controlador.listarTodos);
router.patch('/:id/avalar', auth.autenticar, auth.verificarAdministrador, controlador.avalar);
router.delete('/:id', auth.autenticar, auth.verificarAdministrador, controlador.eliminar);

router.put('/:id', auth.autenticar, controlador.actualizar);

module.exports = router;
