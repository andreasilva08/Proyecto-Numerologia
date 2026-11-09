import { body } from 'express-validator';

/**
 * Validador para el cálculo de Año Personal.
 * Asegura que se reciban día (1-31) y mes (1-12) válidos numéricamente,
 * con verificación cruzada del calendario para evitar días inexistentes en el mes.
 */
export const validarCalculoAnioPersonal = [
  body('dia')
    .exists({ checkFalsy: true })
    .withMessage('El campo dia es obligatorio.')
    .bail()
    .isInt({ min: 1, max: 31 })
    .withMessage('El dia debe ser un número entero entre 1 y 31.')
    .toInt(),

  body('mes')
    .exists({ checkFalsy: true })
    .withMessage('El campo mes es obligatorio.')
    .bail()
    .isInt({ min: 1, max: 12 })
    .withMessage('El mes debe ser un número entero entre 1 y 12.')
    .toInt(),

  body('anio')
    .optional()
    .isInt({ min: 1000, max: 3000 })
    .withMessage('El anio opcional debe ser un número entero válido de 4 dígitos.')
    .toInt(),

  // Validación de coherencia del calendario (ejemplo: 31 de Febrero o 31 de Abril)
  body().custom(({ dia, mes }) => {
    if (dia && mes) {
      const diasMaximosPorMes = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      if (dia > diasMaximosPorMes[mes - 1]) {
        throw new Error(`El mes ${mes} no tiene ${dia} días.`);
      }
    }
    return true;
  })
];

export default {
  validarCalculoAnioPersonal
};
