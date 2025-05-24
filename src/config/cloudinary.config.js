// src/config/cloudinary.config.js

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configura Cloudinary con tus credenciales (puedes poner estas credenciales en variables de entorno .env)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración de almacenamiento con Multer para subir directamente a Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'productos', // Carpeta en Cloudinary donde se almacenarán las imágenes
    allowedFormats: ['jpg', 'jpeg', 'png'], // Formatos de imagen permitidos
  },
});

// Inicializa Multer con el almacenamiento en Cloudinary
const upload = require('multer')({ storage });

module.exports = { cloudinary, upload };