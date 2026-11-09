import { calcularAnioPersonal } from '../services/anioPersonal.service.js';

/**
 * Controlador para calcular el Año Personal (Ciclo Energético Anual).
 * Por defecto calcula sobre el año actual 2026, sumando día + mes + año y reduciendo a dígito o maestro.
 */
export const calcularAnioPersonalController = async (req, res) => {
  try {
    const { dia, mes, anio } = req.body;

    // Validación defensiva complementaria ante parámetros inexistentes o tipos inesperados
    if (dia === undefined || dia === null || mes === undefined || mes === null) {
      return res.status(400).json({
        status: 'error',
        message: 'Los parámetros dia y mes son obligatorios para el cálculo.'
      });
    }

    const diaNum = Number(dia);
    const mesNum = Number(mes);

    if (isNaN(diaNum) || isNaN(mesNum)) {
      return res.status(400).json({
        status: 'error',
        message: 'Los parámetros dia y mes deben ser valores numéricos válidos.'
      });
    }

    if (diaNum < 1 || diaNum > 31 || mesNum < 1 || mesNum > 12) {
      return res.status(422).json({
        status: 'error',
        message: 'El día debe estar entre 1 y 31, y el mes entre 1 y 12.'
      });
    }

    // Cálculo mediante la capa de servicio (año base 2026 o el enviado opcionalmente)
    const resultado = calcularAnioPersonal({
      dia: diaNum,
      mes: mesNum,
      anio: anio !== undefined ? Number(anio) : 2026
    });

    return res.status(200).json({
      status: 'success',
      message: 'Cálculo del año personal realizado exitosamente.',
      data: resultado
    });

  } catch (error) {
    console.error('[Error en calcularAnioPersonalController]:', error.message);

    // Si ocurre un error de fecha no válida (como día inexistente en el mes)
    if (error.message.includes('mes') || error.message.includes('día')) {
      return res.status(422).json({
        status: 'error',
        message: error.message
      });
    }

    return res.status(400).json({
      status: 'error',
      message: 'No fue posible procesar el cálculo del año personal con los datos suministrados.',
      detalles: error.message
    });
  }
};

export default {
  calcularAnioPersonalController
};
