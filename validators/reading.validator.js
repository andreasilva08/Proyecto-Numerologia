import { body, param } from 'express-validator';

export const validarCrearLectura = [
  body('perfilId')
    .exists().withMessage('El ID del perfil numerológico es obligatorio')
    .isMongoId().withMessage('Debe proporcionar un ID de perfil válido'),
  body('tipoLectura')
    .exists().withMessage('El tipo de lectura es obligatorio')
    .notEmpty().withMessage('El tipo de lectura no puede estar vacío')
    .isString().withMessage('El tipo de lectura debe ser un texto')
    .trim(),
  body('interpretacion')
    .optional()
    .isString().withMessage('La interpretación debe ser un texto'),
];

export const validarLecturaId = [
  param('id')
    .isMongoId().withMessage('El ID de la lectura no es válido'),
];