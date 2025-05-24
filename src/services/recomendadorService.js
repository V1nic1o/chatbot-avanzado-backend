// src/services/recomendadorService.js
const { Op } = require('sequelize');
const Planta = require('../models/Planta');

async function recomendarPlantas(filtros) {
  try {
    const condiciones = {};

    // 🔧 Campo corregido: tamano (sin tilde)
    if (filtros.tamaño) condiciones.tamano = filtros.tamaño.toLowerCase();
    if (filtros.luz) condiciones.luz = filtros.luz.toLowerCase();
    if (filtros.riego) condiciones.riego = filtros.riego.toLowerCase();
    if (filtros.cuidado) condiciones.cuidado = filtros.cuidado.toLowerCase();

    if (typeof filtros.purificaAire !== 'undefined') {
      const valor =
        filtros.purificaAire === true ||
        filtros.purificaAire === 'sí' ||
        filtros.purificaAire === 'si';
      condiciones.purificaAire = valor;
    }

    const plantas = await Planta.findAll({ where: condiciones });

    return plantas;
  } catch (error) {
    console.error('❌ Error en recomendador de plantas:', error);
    return [];
  }
}

module.exports = {
  recomendarPlantas
};
