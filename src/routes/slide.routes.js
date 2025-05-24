// src/routes/slide.routes.js
const express = require('express');
const router = express.Router();
const slideController = require('../controllers/slide.controller');
const { upload } = require('../config/cloudinary.config');

router.get('/', slideController.obtenerSlides);
router.post('/', upload.single('imagen'), slideController.crearSlide);
router.delete('/:id', slideController.eliminarSlide);

module.exports = router;
