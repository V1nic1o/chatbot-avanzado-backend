// src/services/wikiService.js
const axios = require('axios');

async function buscarEnWikipedia(mensajeUsuario) {
  try {
    // Usar la API de búsqueda inteligente
    const searchRes = await axios.get('https://es.wikipedia.org/w/api.php', {
      params: {
        action: 'opensearch',
        search: mensajeUsuario,
        format: 'json',
        origin: '*'
      }
    });

    const [_, titulos, __, urls] = searchRes.data;

    if (!titulos.length) return null;

    const tituloExacto = titulos[0];

    const resumenRes = await axios.get(
      `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(tituloExacto)}`
    );

    const data = resumenRes.data;
    return data.extract || null;
  } catch (error) {
    console.error('❌ Error al consultar Wikipedia:', error.message);
    return null;
  }
}

module.exports = {
  buscarEnWikipedia
};
