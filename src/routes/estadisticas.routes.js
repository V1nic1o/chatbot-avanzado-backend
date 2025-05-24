// src/routes/estadisticas.routes.js
const express = require('express');
const router = express.Router();
const estadisticasController = require('../controllers/estadisticas.controller');

// GET /api/estadisticas/intenciones
router.get('/intenciones', estadisticasController.getIntencionesMasUsadas);

// GET /api/estadisticas/fuentes
router.get('/fuentes', estadisticasController.getFuentesDeRespuesta);

// GET /api/estadisticas/aprendidas
router.get('/aprendidas', estadisticasController.getFrasesAprendidas);

module.exports = router;
