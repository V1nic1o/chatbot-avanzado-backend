// src/controllers/chat.controller.js
const { obtenerRespuesta } = require('../services/chatService');
const { recomendarPlantas } = require('../services/recomendadorService');
const ConocimientoAprendido = require('../models/ConocimientoAprendido');
const HistorialRespuestas = require('../models/HistorialRespuestas');
const { Op } = require('sequelize');

let recomendacionEnProceso = false;
let filtrosRecomendacion = {};
let pasoActual = 0;
let aprendizajePendiente = null;
let historialConversacion = [];

const preguntas = [
  '¿Qué tamaño de planta prefieres? (pequeño, mediano o grande)?',
  '¿Qué tipo de luz hay en el lugar donde la pondrás? (mucha, poca, indirecta)?',
  '¿Prefieres que necesite riego frecuente, moderado o escaso?',
  '¿Qué nivel de cuidado prefieres? (fácil, medio, exigente)?',
  '¿Te interesa que purifique el aire? (sí o no)?'
];

const opcionesValidas = [
  ['pequeño', 'mediano', 'grande'],
  ['mucha', 'poca', 'indirecta'],
  ['frecuente', 'moderado', 'escaso'],
  ['fácil', 'medio', 'exigente'],
  ['sí', 'no']
];

async function procesarMensaje(req, res) {
  try {
    const { mensaje } = req.body;
    const mensajeLimpio = mensaje?.trim();

    if (!mensajeLimpio) {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío.' });
    }

    historialConversacion.push({ role: 'user', content: mensajeLimpio });

    // 🧠 Aprendizaje pendiente
    if (aprendizajePendiente) {
      await ConocimientoAprendido.create({
        pregunta: aprendizajePendiente,
        respuesta: mensajeLimpio
      });

      const respuesta = `¡Gracias! Aprendí algo nuevo 😊 Ya recordaré que "${aprendizajePendiente}" significa: "${mensajeLimpio}".`;
      const fuente = 'aprendizaje';

      console.log("🧠 Respondió:", fuente);

      aprendizajePendiente = null;

      historialConversacion.push({ role: 'assistant', content: respuesta });
      await HistorialRespuestas.create({ mensajeUsuario: mensajeLimpio, respuesta, fuente });
      return res.json({ respuesta, fuente });
    }

    // 🌿 Recomendador
    if (
      mensajeLimpio.toLowerCase().includes('recomiéndame') ||
      mensajeLimpio.toLowerCase().includes('plantas para mí') ||
      mensajeLimpio.toLowerCase().includes('ayúdame a elegir')
    ) {
      recomendacionEnProceso = true;
      filtrosRecomendacion = {};
      pasoActual = 0;

      const respuesta = preguntas[0];
      const fuente = 'recomendador';

      console.log("🌿 Respondió:", fuente);

      historialConversacion.push({ role: 'assistant', content: respuesta });
      await HistorialRespuestas.create({ mensajeUsuario: mensajeLimpio, respuesta, fuente });
      return res.json({ respuesta, fuente });
    }

    if (
      recomendacionEnProceso ||
      (pasoActual < opcionesValidas.length &&
        opcionesValidas[pasoActual].includes(mensajeLimpio.toLowerCase()))
    ) {
      recomendacionEnProceso = true;

      switch (pasoActual) {
        case 0: filtrosRecomendacion.tamaño = mensajeLimpio.toLowerCase(); break;
        case 1: filtrosRecomendacion.luz = mensajeLimpio.toLowerCase(); break;
        case 2: filtrosRecomendacion.riego = mensajeLimpio.toLowerCase(); break;
        case 3: filtrosRecomendacion.cuidado = mensajeLimpio.toLowerCase(); break;
        case 4: filtrosRecomendacion.purificaAire = mensajeLimpio.toLowerCase().includes('sí'); break;
      }

      pasoActual++;

      if (pasoActual < preguntas.length) {
        const respuesta = preguntas[pasoActual];
        const fuente = 'recomendador';

        console.log("🌿 Respondió:", fuente);

        historialConversacion.push({ role: 'assistant', content: respuesta });
        await HistorialRespuestas.create({ mensajeUsuario: mensajeLimpio, respuesta, fuente });
        return res.json({ respuesta, fuente });
      } else {
        const resultados = await recomendarPlantas(filtrosRecomendacion);
        recomendacionEnProceso = false;

        const fuente = 'recomendador';

        if (resultados.length > 0) {
          const respuesta = 'Según tus preferencias, te recomiendo estas plantas.';
          console.log("🌿 Respondió:", fuente);
          await HistorialRespuestas.create({ mensajeUsuario: mensajeLimpio, respuesta, fuente });
          return res.json({
            respuesta,
            fuente,
            recomendaciones: resultados.map(p => ({
              nombre: p.nombre,
              descripcion: p.descripcion,
              imagen: p.imagen
            }))
          });
        } else {
          const respuesta = 'Lo siento, no encontré plantas que coincidan con tus preferencias. ¿Quieres intentarlo con otros criterios?';
          console.log("🌿 Respondió:", fuente);
          await HistorialRespuestas.create({ mensajeUsuario: mensajeLimpio, respuesta, fuente });
          return res.json({ respuesta, fuente });
        }
      }
    }

    // 📚 Memoria local
    const conocimiento = await ConocimientoAprendido.findOne({
      where: {
        pregunta: {
          [Op.iLike]: `%${mensajeLimpio}%`
        }
      }
    });

    if (conocimiento) {
      const respuesta = conocimiento.respuesta;
      const fuente = 'memoria';

      console.log("📚 Respondió:", fuente);

      historialConversacion.push({ role: 'assistant', content: respuesta });
      await HistorialRespuestas.create({ mensajeUsuario: mensajeLimpio, respuesta, fuente });
      return res.json({ respuesta, fuente });
    }

    // 🤖 
    const resultado = await obtenerRespuesta(mensajeLimpio, historialConversacion);

    if (
      resultado.respuesta.toLowerCase().includes('no tengo una respuesta') ||
      resultado.respuesta.toLowerCase().includes('no encontré una respuesta')
    ) {
      aprendizajePendiente = mensajeLimpio;

      const respuesta = 'No tengo una respuesta para eso aún 🤔 ¿Podrías explicarme qué significa o a qué te refieres? Lo recordaré.';
      const fuente = 'aprendizaje';

      console.log("❓ Respondió:", fuente);

      historialConversacion.push({ role: 'assistant', content: respuesta });
      await HistorialRespuestas.create({ mensajeUsuario: mensajeLimpio, respuesta, fuente });
      return res.json({ respuesta, fuente });
    }

    const respuestaFinal = resultado.respuesta;
    const fuente = 'memoriaa';

    console.log("🤖 Respondió:", fuente);

    const yaExiste = await ConocimientoAprendido.findOne({
      where: {
        pregunta: {
          [Op.iLike]: `%${mensajeLimpio}%`
        }
      }
    });

    if (!yaExiste) {
      await ConocimientoAprendido.create({
        pregunta: mensajeLimpio,
        respuesta: respuestaFinal
      });
    }

    historialConversacion.push({ role: 'assistant', content: respuestaFinal });
    await HistorialRespuestas.create({ mensajeUsuario: mensajeLimpio, respuesta: respuestaFinal, fuente });
    return res.json({ respuesta: respuestaFinal, fuente });

  } catch (error) {
    console.error('❌ Error al procesar el mensaje:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
}

module.exports = {
  procesarMensaje
};
