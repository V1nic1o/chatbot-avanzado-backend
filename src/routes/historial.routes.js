// src/routes/historial.routes.js
const express = require('express');
const router = express.Router();
const { obtenerHistorial } = require('../controllers/historial.controller');

router.get('/', obtenerHistorial);

module.exports = router;
