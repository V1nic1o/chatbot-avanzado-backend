const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Planta = sequelize.define('Planta', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  tamano: {
    type: DataTypes.STRING, // pequeño, mediano, grande
    allowNull: false
  },
  luz: {
    type: DataTypes.STRING, // mucha, poca, indirecta
    allowNull: false
  },
  riego: {
    type: DataTypes.STRING, // frecuente, moderado, escaso
    allowNull: false
  },
  cuidado: {
    type: DataTypes.STRING, // fácil, medio, exigente
    allowNull: false
  },
  purificaAire: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  imagen: {
  type: DataTypes.STRING,
  allowNull: true
}

});

module.exports = Planta;
