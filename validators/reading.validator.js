import { body, param } from 'express-validator';

export const validarCrearLectura = [
  body('matriz_id')
    .if(body('perfilId').not().exists())
    .notEmpty().withMessage('El ID de la matriz (matriz_id) es obligatorio'),
  body('perfilId')
    .if(body('matriz_id').not().exists())
    .notEmpty().withMessage('El ID del perfil numerológico o matriz es obligatorio'),
  body('prompt_usado_id')
    .optional()
    .notEmpty().withMessage('El prompt_usado_id no puede estar vacío'),
  body('tipoLectura')
    .optional()
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