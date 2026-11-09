import { body } from 'express-validator';

/**
 * Validador compartido para los cálculos de Número del Alma y Número de Personalidad.
 * El campo `nombreCompleto` es obligatorio, debe ser texto alfanumérico
 * (soporta caracteres con acento, ñ, ü, espacios), con longitud máxima de 100 caracteres.
 */
export const validarCalculoAlmaPersonalidad = [
  body('nombreCompleto')
    .exists({ checkFalsy: true })
    .withMessage('El campo nombreCompleto es obligatorio.')
    .bail()
    .isString()
    .withMessage('El campo nombreCompleto debe ser una cadena de texto.')
    .bail()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El campo nombreCompleto debe tener entre 2 y 100 caracteres.')
    .bail()
    .matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ\s]+$/)
    .withMessage('El nombreCompleto solo puede contener letras, espacios y caracteres acentuados.')
];

export default {
  validarCalculoAlmaPersonalidad
};
