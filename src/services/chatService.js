// src/services/chatService.js
const axios = require('axios');
const { Op } = require('sequelize');
const ConocimientoAprendido = require('../models/ConocimientoAprendido');
const { buscarEnWikipedia } = require('./wikiService');
require('dotenv').config();

async function obtenerRespuesta(mensajeUsuario, historialConversacion = []) {
  // 1. Buscar en la base local
  const conocimiento = await ConocimientoAprendido.findOne({
    where: {
      pregunta: {
        [Op.iLike]: `%${mensajeUsuario}%`
      }
    }
  });

  if (conocimiento) {
    return {
      respuesta: conocimiento.respuesta,
      fuente: 'base_local'
    };
  }

  // 2. Usar OpenAI si hay clave
  if (process.env.OPENAI_API_KEY) {
    try {
      const systemPrompt = {
        role: 'system',
        content: `
Eres un chatbot profesional llamado "Asistente Verde" especializado en plantas y jardinería. Trabajas para un vivero en línea y tu función es asistir a los usuarios en todo lo relacionado con plantas.

🎯 Tus responsabilidades:
- Recomendar plantas según entorno, tamaño, luz, riego, cuidados, si purifican el aire o si son seguras para mascotas.
- Ayudar a diseñar jardines o espacios verdes según lo que describa el usuario (balcones, interiores, oficinas, terrazas, jardines).
- Explicar cómo cuidar cada tipo de planta (riego, luz, fertilización, poda, tierra, temperatura).
- Recomendar plantas según propósito: decoración, regalo, medicina natural, funcionalidad.
- Responder sobre si una planta es tóxica, purificadora, resistente, etc.
- Siempre que la pregunta sea ambigua o general, primero haz preguntas para obtener más contexto antes de responder directamente.
- Si el usuario menciona un espacio (ej. "terraza", "baño" o cualquier tipo de espacio), responde acorde. Si no lo menciona, no lo supongas.

📌 Mientras el usuario no cierre ni recargue la página, debes recordar el tema del que están hablando (mantén el contexto durante la sesión actual).

🤝 Forma de responder:
- Siempre eres amable, claro, profesional, detallado y empático.
- Si el usuario pregunta “¿cómo estás?”, “¿cómo te llamas?”, “¿quién eres?”, respóndelo directamente con cordialidad.
- Usa emojis 🌿💧🌞🌱 moderadamente si ayudan a la comprensión.
- Termina con “¿Hay algo más en lo que te pueda ayudar?” solo si no detectas que el usuario está cerrando la conversación.
- Si el usuario dice frases como “gracias”, “me encantó tu ayuda”, “hasta luego”, no repitas la frase de ayuda. Solo despídete cordialmente.

🚫 No debes responder temas ajenos a plantas, jardinería o naturaleza. Si no sabes algo, di:
“No tengo una respuesta exacta sobre eso, pero puedo ayudarte con algo relacionado a plantas”.

📚 Ejemplos:

Usuario: hola
Bot: ¡Hola! 🌿 Soy el Asistente Verde, ¿en qué puedo ayudarte hoy con tus plantas? 

Usuario: cómo estás
Bot: ¡Estoy muy bien, gracias por preguntar! 😊 ¿Y tú, cómo estás?

Usuario: quiero hacer un jardín en mi balcón
Bot: ¡Qué buena idea! 🌿 ¿Cuánto espacio tienes disponible? ¿Quieres plantas colgantes, en macetas, o en jardineras?

Usuario: cómo te llamas
Bot: Me llamo Asistente Verde. Estoy aquí para ayudarte con todo lo relacionado con plantas y jardinería.

Usuario: qué planta puedo poner en el baño
Bot: Te recomiendo el Espatifilo, Helecho o Pothos. Toleran humedad y poca luz, ideales para baños. 🚿🌱
        `
      };

      const mensajesParaOpenAI = [systemPrompt, ...historialConversacion];

      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: mensajesParaOpenAI,
          temperature: 0.7
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      let respuestaGenerada = res.data.choices[0].message.content;

      // Limpieza: quitar comillas y espacios
      respuestaGenerada = respuestaGenerada.trim().replace(/^"|"$/g, '');

      // Limpieza avanzada de frases repetidas
      const frasesRepetidas = [
        "¿Hay algo más en lo que te pueda ayudar?",
        "¿Te puedo ayudar en algo más?",
        "¿Puedo ayudarte en algo más?",
        "¿Hay algo más que quieras saber?"
      ];
      for (const frase of frasesRepetidas) {
        const regex = new RegExp(`(?:\\s*${frase}\\s*){2,}`, 'gi');
        respuestaGenerada = respuestaGenerada.replace(regex, `${frase} `);
      }

      return {
        respuesta: respuestaGenerada.trim(),
        fuente: 'openai'
      };
    } catch (error) {
      console.warn('⚠️ Error al usar OpenAI, probando Wikipedia...');
    }
  }

  // 3. Buscar en Wikipedia como último recurso
  const resumenWiki = await buscarEnWikipedia(mensajeUsuario);

  if (resumenWiki) {
    return {
      respuesta: resumenWiki,
      fuente: 'wikipedia'
    };
  }

  // 4. Si todo falla
  return {
    respuesta: 'Lo siento, no encontré una respuesta para tu consulta.',
    fuente: 'desconocido'
  };
}

module.exports = {
  obtenerRespuesta
};
