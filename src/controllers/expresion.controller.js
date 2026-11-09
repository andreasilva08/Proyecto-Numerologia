import { calcularNumeroExpresion } from '../services/expresion.service.js';

/**
 * Controlador para calcular el Número de Expresión (Nombre a Número).
 * Implementa manejo riguroso de errores y validaciones defensivas.
 */
export const calcularExpresion = async (req, res) => {
  try {
    const { nombreCompleto } = req.body;

    // Validación defensiva ante entradas nulas, vacías o malformadas
    if (!nombreCompleto || typeof nombreCompleto !== 'string' || nombreCompleto.trim().length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'El campo nombreCompleto es obligatorio y no puede estar vacío.'
      });
    }

    // Ejecución del cálculo pitagórico a través de la capa de servicio
    const resultado = calcularNumeroExpresion(nombreCompleto);

    return res.status(200).json({
      status: 'success',
      message: 'Cálculo del número de expresión realizado exitosamente.',
      data: resultado
    });

  } catch (error) {
    console.error('[Error en calcularExpresion]:', error.message);

    // Si el error corresponde a validación de datos o imposibilidad de procesamiento
    if (
      error.message.includes('válido') || 
      error.message.includes('vacío') || 
      error.message.includes('letras')
    ) {
      return res.status(422).json({
        status: 'error',
        message: error.message
      });
    }

    // Respuesta limpia y controlada en formato 400 Bad Request
    return res.status(400).json({
      status: 'error',
      message: 'No fue posible procesar el cálculo con los datos proporcionados.',
      detalles: error.message
    });
  }
};

export default {
  calcularExpresion
};
