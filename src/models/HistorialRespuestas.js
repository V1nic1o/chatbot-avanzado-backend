// src/models/HistorialRespuestas.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const HistorialRespuestas = sequelize.define('HistorialRespuestas', {
  mensajeUsuario: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  respuesta: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fuente: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fechaHora: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'HistorialRespuestas',
  timestamps: false
});

module.exports = HistorialRespuestas;
