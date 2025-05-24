// src/controllers/estadisticas.controller.js
const { Op, fn, col, literal } = require('sequelize');
const ConocimientoAprendido = require('../models/ConocimientoAprendido');
const HistorialRespuestas = require('../models/HistorialRespuestas');

// Agrupar por mensajes reales del usuario
exports.getIntencionesMasUsadas = async (req, res) => {
  try {
    const resultados = await HistorialRespuestas.findAll({
      attributes: [
        ['mensajeUsuario', 'mensajeUsuario'],
        [fn('COUNT', col('mensajeUsuario')), 'cantidad']
      ],
      group: ['mensajeUsuario'],
      order: [[literal('cantidad'), 'DESC']]
    });
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener mensajes más usados', error });
  }
};

// Fuentes de respuesta
exports.getFuentesDeRespuesta = async (req, res) => {
  try {
    const resultados = await HistorialRespuestas.findAll({
      attributes: ['fuente', [fn('COUNT', col('fuente')), 'cantidad']],
      group: ['fuente']
    });
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener fuentes', error });
  }
};

// Frases aprendidas por fecha
exports.getFrasesAprendidas = async (req, res) => {
  try {
    const resultados = await ConocimientoAprendido.findAll({
      attributes: [
        [fn('DATE', col('fecha')), 'fecha'],
        [fn('COUNT', '*'), 'cantidad']
      ],
      group: [fn('DATE', col('fecha'))],
      order: [[fn('DATE', col('fecha')), 'ASC']]
    });
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener aprendizaje', error });
  }
};
