const express = require('express');
const router = express.Router();
const Planta = require('../models/Planta');
const { upload } = require('../config/cloudinary.config');

// Obtener todas las plantas
router.get('/', async (req, res) => {
  try {
    const plantas = await Planta.findAll();
    res.json(plantas);
  } catch (err) {
    console.error('❌ Error en GET /plantas:', err);
    res.status(500).json({ error: 'Error al obtener las plantas', detalle: err.message });
  }
});

// Crear una nueva planta (con imagen)
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file && req.file.path) {
      data.imagen = req.file.path;
    }

    console.log('📦 DATOS RECIBIDOS:', data); // 🔍 VERIFICA AQUÍ
    const nueva = await Planta.create(data);
    res.status(201).json(nueva);
  } catch (err) {
    console.error('❌ Error al crear planta:', err);
    res.status(500).json({ error: 'Error al crear la planta', detalle: err.message });
  }
});


module.exports = router;
