// src/routes/chat.routes.js
const express = require('express');
const router = express.Router();
const { procesarMensaje } = require('../controllers/chat.controller');

// Ruta principal para enviar mensajes al chatbot
router.post('/', procesarMensaje);

module.exports = router;
