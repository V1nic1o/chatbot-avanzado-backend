// src/controllers/slide.controller.js
const Slide = require('../models/Slide');

exports.obtenerSlides = async (req, res) => {
  try {
    const slides = await Slide.findAll({ order: [['id', 'DESC']] });
    res.json(slides);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los slides' });
  }
};

exports.crearSlide = async (req, res) => {
  try {
    const data = {};

    if (req.file && req.file.path) {
      data.imagen = req.file.path;
    } else {
      return res.status(400).json({ error: 'La imagen es obligatoria.' });
    }

    const nuevo = await Slide.create(data);
    res.status(201).json(nuevo);
  } catch (err) {
    console.error('Error al crear slide:', err);
    res.status(400).json({ error: 'Error al crear slide' });
  }
};

exports.eliminarSlide = async (req, res) => {
  try {
    const { id } = req.params;
    await Slide.destroy({ where: { id } });
    res.json({ mensaje: 'Slide eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar slide' });
  }
};
