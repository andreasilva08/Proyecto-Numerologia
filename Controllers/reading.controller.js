import Reading from '../models/Reading.model.js';
import { generarLectura } from '../services/lectura.service.js';

/**
 * Genera una lectura numerológica utilizando IA o recupera una previa en caché.
 * Optimizado para ahorro de costos y tokens mediante verificación previa en MongoDB.
 */
export const createReading = async (req, res) => {
  try {
    // Extracción flexible para soportar tanto los nuevos identificadores como posibles alias
    const usuario_id = req.usuario?._id || req.body.usuario_id || req.body.userId;
    const matriz_id = req.body.matriz_id || req.body.matrizId || req.body.perfilId;
    const prompt_usado_id = req.body.prompt_usado_id || req.body.promptUsadoId || req.body.readingType || 'prompt_estandar_v1';
    const { matriz, plantillaPrompt } = req.body;

    // Validación de campos obligatorios para el registro
    if (!usuario_id) {
      return res.status(400).json({
        status: 'error',
        message: 'El identificador del usuario (usuario_id) es obligatorio.'
      });
    }

    if (!matriz_id) {
      return res.status(400).json({
        status: 'error',
        message: 'El identificador de la matriz (matriz_id) es obligatorio.'
      });
    }

    if (!prompt_usado_id) {
      return res.status(400).json({
        status: 'error',
        message: 'El identificador del prompt (prompt_usado_id) es obligatorio.'
      });
    }

    // =========================================================================
    // 1. OPTIMIZACIÓN: VERIFICAR EN MONGO SI YA EXISTE UNA LECTURA PREVIA
    // Evita invocar la API de Google Gemini si ya existe el resultado generado.
    // =========================================================================
    const lecturaExistente = await Reading.findOne({
      matriz_id,
      prompt_usado_id
    });

    if (lecturaExistente) {
      return res.status(200).json({
        status: 'success',
        cached: true,
        message: 'Lectura existente recuperada de la base de datos (0 tokens consumidos).',
        data: lecturaExistente
      });
    }

    // =========================================================================
    // 2. GENERACIÓN MEDIANTE EL SERVICIO EXTERNO DE GEMINI IA
    // =========================================================================
    let resultadoIA;
    try {
      resultadoIA = await generarLectura({
        matriz: matriz || req.body,
        plantillaPrompt
      });
    } catch (geminiError) {
      console.error('[Gemini Service Error]:', geminiError.message);
      // Usar el código HTTP clasificado por el servicio (429 / 503), o 503 por defecto
      const httpStatus = geminiError.http || 503;
      return res.status(httpStatus).json({
        status: 'error',
        tipo: geminiError.tipo || 'GEMINI_ERROR',
        message: geminiError.message || 'El servicio externo de generación de lecturas no está disponible temporalmente.'
      });
    }

    // =========================================================================
    // 3. PERSISTENCIA EN MONGOOSE Y RESPUESTA AL CLIENTE CON CÓDIGO 201
    // =========================================================================
    const nuevaLectura = new Reading({
      usuario_id,
      matriz_id,
      prompt_usado_id,
      contenido: resultadoIA.datos,
      tokens_usados: resultadoIA.tokens_usados,
      modelo: resultadoIA.modelo
    });

    await nuevaLectura.save();

    return res.status(201).json({
      status: 'success',
      cached: false,
      message: 'Lectura generada con éxito con IA y guardada en base de datos.',
      data: nuevaLectura
    });

  } catch (error) {
    console.error('[createReading Error]:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor al procesar la lectura.',
      error: error.message
    });
  }
};

/**
 * Obtener todas las lecturas registradas
 */
export const getReadings = async (req, res) => {
  try {
    const readings = await Reading.find()
      .populate('usuario_id', 'firstName lastName email role')
      .sort({ createdAt: -1 });

    return res.json({
      status: 'success',
      total: readings.length,
      data: readings
    });
  } catch (error) { 
    return res.status(500).json({ 
      status: 'error', 
      message: error.message 
    }); 
  }
};

/**
 * Obtener una lectura por su ID
 */
export const getReadingById = async (req, res) => {
  try {
    const reading = await Reading.findById(req.params.id)
      .populate('usuario_id', 'firstName lastName email role');

    if (!reading) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Lectura no encontrada.' 
      });
    }

    return res.json({
      status: 'success',
      data: reading
    });
  } catch (error) { 
    return res.status(500).json({ 
      status: 'error', 
      message: error.message 
    }); 
  }
};

/**
 * Actualizar una lectura existente
 */
export const updateReading = async (req, res) => {
  try {
    const reading = await Reading.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reading) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Lectura no encontrada.' 
      });
    }

    return res.json({
      status: 'success',
      message: 'Lectura actualizada correctamente.',
      data: reading
    });
  } catch (error) { 
    return res.status(400).json({ 
      status: 'error', 
      message: error.message 
    }); 
  }
};

/**
 * Eliminar una lectura por su ID
 */
export const deleteReading = async (req, res) => {
  try {
    const reading = await Reading.findByIdAndDelete(req.params.id);
    if (!reading) {
      return res.status(404).json({ 
        status: 'error', 
        message: 'Lectura no encontrada.' 
      });
    }

    return res.json({ 
      status: 'success', 
      message: 'Lectura eliminada exitosamente.' 
    });
  } catch (error) { 
    return res.status(500).json({ 
      status: 'error', 
      message: error.message 
    }); 
  }
};