import { ai, MODELO } from '../config/gemini.js';

/**
 * Esquema JSON estricto para salida estructurada (Structured Outputs) de Gemini.
 * Garantiza que la respuesta sea un objeto JSON válido con los campos requeridos
 * sin explicaciones adicionales en texto plano, ahorrando tokens de salida.
 */
export const schemaLectura = {
  type: 'object',
  properties: {
    resumen: {
      type: 'string',
      description: 'Resumen sintético y global de la lectura numerológica'
    },
    interpretacion_numero_vida: {
      type: 'string',
      description: 'Interpretación profunda y detallada del número de vida o sendero natal del consultante'
    },
    fortalezas: {
      type: 'array',
      items: {
        type: 'string'
      },
      description: 'Lista de fortalezas, virtudes y talentos principales identificados en la matriz'
    },
    areas_de_trabajo: {
      type: 'array',
      items: {
        type: 'string'
      },
      description: 'Lista de áreas de oportunidad, lecciones kármicas y aspectos de evolución a trabajar'
    },
    numero_destacado: {
      type: 'integer',
      description: 'El número más significativo, resonante o dominante calculado en la matriz'
    }
  },
  required: [
    'resumen',
    'interpretacion_numero_vida',
    'fortalezas',
    'areas_de_trabajo',
    'numero_destacado'
  ]
};

/**
 * Configuración del formato de respuesta estructurado para Gemini
 */
export const responseFormatLectura = {
  type: 'text',
  mime_type: 'application/json',
  schema: schemaLectura
};

/**
 * Genera una lectura numerológica personalizada utilizando la API de Google Gemini (@google/genai).
 * 
 * @param {Object} params
 * @param {Object|string} params.matriz - Datos numéricos calculados de la matriz numerológica
 * @param {string} [params.plantillaPrompt] - Plantilla o instrucciones personalizadas para guiar la lectura
 * @returns {Promise<{ datos: Object, tokens_usados: number, modelo: string }>}
 */
export const generarLectura = async ({ matriz, plantillaPrompt }) => {
  // 1. Armar el prompt combinando los datos numéricos de la matriz
  const datosMatrizFormateados = typeof matriz === 'object'
    ? JSON.stringify(matriz, null, 2)
    : String(matriz || '');

  let promptFinal = '';
  if (plantillaPrompt && typeof plantillaPrompt === 'string') {
    if (plantillaPrompt.includes('{matriz}') || plantillaPrompt.includes('{{matriz}}')) {
      promptFinal = plantillaPrompt
        .replace(/\{\{matriz\}\}/g, datosMatrizFormateados)
        .replace(/\{matriz\}/g, datosMatrizFormateados);
    } else {
      promptFinal = `${plantillaPrompt}\n\nDatos de la Matriz Numerológica:\n${datosMatrizFormateados}`;
    }
  } else {
    promptFinal = `Actúa como un maestro numerólogo experto. Analiza la siguiente matriz numerológica y genera una interpretación precisa y reveladora:\n\n${datosMatrizFormateados}`;
  }

  // 2. Invocar a Gemini con manejo explícito de errores de cuota, red y autenticación
  let interaction;
  try {
    interaction = await ai.interactions.create({
      model: MODELO,
      input: promptFinal,
      response_format: responseFormatLectura
    });
  } catch (geminiError) {
    // Extraer el código de estado HTTP del error si lo expone el SDK
    const statusCode = geminiError?.status || geminiError?.statusCode || geminiError?.code;
    const errorMsg   = geminiError?.message || String(geminiError);

    console.error('[Gemini API Error]', { statusCode, message: errorMsg });

    if (statusCode === 429 || /quota|rate.?limit|resource.?exhausted/i.test(errorMsg)) {
      const err = new Error('Límite de cuota de Gemini alcanzado. Por favor espera unos minutos e intenta de nuevo.');
      err.tipo  = 'QUOTA_EXCEEDED';
      err.http  = 429;
      throw err;
    }

    if (statusCode === 401 || statusCode === 403 || /api.?key|unauthorized|permission/i.test(errorMsg)) {
      const err = new Error('Clave de API de Gemini inválida o sin permisos. Verifica la variable GEMINI_API_KEY.');
      err.tipo  = 'AUTH_ERROR';
      err.http  = 503;
      throw err;
    }

    if (/fetch|network|ECONNREFUSED|ENOTFOUND|timeout/i.test(errorMsg)) {
      const err = new Error('No fue posible conectarse a los servidores de Google Gemini. Verifica tu conexión a internet.');
      err.tipo  = 'NETWORK_ERROR';
      err.http  = 503;
      throw err;
    }

    // Error genérico desconocido del SDK de Gemini
    const err = new Error(`El servicio de Gemini respondió con un error inesperado: ${errorMsg}`);
    err.tipo  = 'GEMINI_UNKNOWN';
    err.http  = 503;
    throw err;
  }

  // 3. Parsear la respuesta de texto dentro de su propio try/catch
  let datosLimpios;
  try {
    if (!interaction.output_text) {
      throw new Error('El modelo no generó texto en la propiedad output_text.');
    }
    datosLimpios = JSON.parse(interaction.output_text);
  } catch (parseError) {
    throw new Error(`Fallo al parsear la respuesta estructurada de Gemini como JSON: ${parseError.message}`);
  }

  // 4. Extraer estadísticas de tokens consumidos
  const tokensUsados = interaction.usage?.total_tokens ||
    ((interaction.usage?.total_input_tokens || 0) + (interaction.usage?.total_output_tokens || 0)) || 0;

  // 5. Devolver los datos limpios junto con los tokens usados y el modelo utilizado
  return {
    datos: datosLimpios,
    tokens_usados: tokensUsados,
    modelo: MODELO
  };
};

export default {
  generarLectura,
  schemaLectura,
  responseFormatLectura
};
