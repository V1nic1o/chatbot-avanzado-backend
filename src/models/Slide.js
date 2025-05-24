// src/models/Slide.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Slide = sequelize.define('Slide', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Slide;
