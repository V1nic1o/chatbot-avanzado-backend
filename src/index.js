require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

const chatRoutes = require('./routes/chat.routes');
const plantaRoutes = require('./routes/planta.routes');
const slideRoutes = require('./routes/slide.routes');
const historialRoutes = require('./routes/historial.routes');
const estadisticasRoutes = require('./routes/estadisticas.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());


app.use('/api/chat', chatRoutes);
app.use('/api/plantas', plantaRoutes);
app.use('/api/slides', slideRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/estadisticas', estadisticasRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor de Chatbot Avanzado funcionando ✅');
});

const ConocimientoAprendido = require('./models/ConocimientoAprendido');
const Planta = require('./models/Planta');
const Slide = require('./models/Slide');


// Conexión a la base de datos y arranque del servidor
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a PostgreSQL exitosa');
    return sequelize.sync({ alter: true }) // OJO: solo en desarrollo // Sincroniza los modelos (vacío por ahora)
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar a la base de datos:', error);
  });
