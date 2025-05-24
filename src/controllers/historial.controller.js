// src/controllers/historial.controller.js
const HistorialRespuestas = require('../models/HistorialRespuestas');

exports.obtenerHistorial = async (req, res) => {
  try {
    const historial = await HistorialRespuestas.findAll();
    res.json(historial);
  } catch (error) {
    console.error('❌ Error al obtener historial:', error.message);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
};
