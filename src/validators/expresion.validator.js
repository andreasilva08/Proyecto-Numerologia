import { body } from 'express-validator';

/**
 * Validador para el cálculo de número de expresión.
 * Asegura que nombreCompleto sea obligatorio, string alfanumérico con soporte
 * para acentos y espacios, con longitud máxima de 100 caracteres.
 */
export const validarCalculoExpresion = [
  body('nombreCompleto')
    .exists({ checkFalsy: true })
    .withMessage('El campo nombreCompleto es obligatorio.')
    .bail()
    .isString()
    .withMessage('El campo nombreCompleto debe ser una cadena de texto.')
    .bail()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('El campo nombreCompleto debe tener entre 1 y 100 caracteres.')
    .bail()
    .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]+$/)
    .withMessage('El nombreCompleto solo puede contener caracteres alfanuméricos y espacios.')
];

export default {
  validarCalculoExpresion
};
