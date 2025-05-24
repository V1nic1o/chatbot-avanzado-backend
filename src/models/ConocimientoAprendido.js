// src/models/ConocimientoAprendido.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ConocimientoAprendido = sequelize.define('ConocimientoAprendido', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  pregunta: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  respuesta: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fuente: {
    type: DataTypes.STRING, // Ejemplo: 'openai', 'wiki', 'manual'
    allowNull: false,
    defaultValue: 'openai'
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = ConocimientoAprendido;
