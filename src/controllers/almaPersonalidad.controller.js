import { calcularNumeroAlma, calcularNumeroPersonalidad } from '../services/almaPersonalidad.service.js';

// ──────────────────────────────────────────────────────────────────────────────
// CONTROLADOR: NÚMERO DEL ALMA (VOCALES)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Controlador para calcular el Número del Alma basado en las vocales del nombre.
 * Implementa validación defensiva completa y manejo de errores robusto.
 *
 * @route   POST /api/v1/numerologia/alma
 * @access  Privado (requiere JWT válido)
 */
export const calcularAlma = async (req, res) => {
  try {
    const { nombreCompleto } = req.body;

    // Validación defensiva ante entradas nulas, vacías o de tipo incorrecto
    if (!nombreCompleto || typeof nombreCompleto !== 'string' || nombreCompleto.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'El campo nombreCompleto es obligatorio y no puede estar vacío.'
      });
    }

    // Ejecución del cálculo mediante la capa de servicio
    const resultado = calcularNumeroAlma(nombreCompleto);

    return res.status(200).json({
      status: 'success',
      message: 'Número del Alma calculado exitosamente desde las vocales del nombre.',
      data: resultado
    });

  } catch (error) {
    console.error('[Error en calcularAlma]:', error.message);

    // Errores de validación semántica originados en la capa de servicio
    if (
      error.message.includes('válido') ||
      error.message.includes('vacío') ||
      error.message.includes('vocales')
    ) {
      return res.status(422).json({
        status: 'error',
        message: error.message
      });
    }

    // Respuesta controlada sin stack trace expuesto
    return res.status(400).json({
      status: 'error',
      message: 'No fue posible calcular el Número del Alma con los datos proporcionados.',
      detalles: error.message
    });
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// CONTROLADOR: NÚMERO DE PERSONALIDAD (CONSONANTES)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Controlador para calcular el Número de Personalidad basado en las consonantes del nombre.
 * Implementa validación defensiva completa y manejo de errores robusto.
 *
 * @route   POST /api/v1/numerologia/personalidad
 * @access  Privado (requiere JWT válido)
 */
export const calcularPersonalidad = async (req, res) => {
  try {
    const { nombreCompleto } = req.body;

    // Validación defensiva ante entradas nulas, vacías o de tipo incorrecto
    if (!nombreCompleto || typeof nombreCompleto !== 'string' || nombreCompleto.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'El campo nombreCompleto es obligatorio y no puede estar vacío.'
      });
    }

    // Ejecución del cálculo mediante la capa de servicio
    const resultado = calcularNumeroPersonalidad(nombreCompleto);

    return res.status(200).json({
      status: 'success',
      message: 'Número de Personalidad calculado exitosamente desde las consonantes del nombre.',
      data: resultado
    });

  } catch (error) {
    console.error('[Error en calcularPersonalidad]:', error.message);

    // Errores de validación semántica originados en la capa de servicio
    if (
      error.message.includes('válido') ||
      error.message.includes('vacío') ||
      error.message.includes('consonantes')
    ) {
      return res.status(422).json({
        status: 'error',
        message: error.message
      });
    }

    // Respuesta controlada sin stack trace expuesto
    return res.status(400).json({
      status: 'error',
      message: 'No fue posible calcular el Número de Personalidad con los datos proporcionados.',
      detalles: error.message
    });
  }
};

export default {
  calcularAlma,
  calcularPersonalidad
};
