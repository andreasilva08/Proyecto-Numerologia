import { body, param } from 'express-validator';

export const validarCrearPerfilNumerologico = [
  body('usuarioId')
    .exists().withMessage('El ID de usuario es obligatorio')
    .isMongoId().withMessage('Debe proporcionar un ID de usuario válido de MongoDB'),
  body('nombreCompleto')
    .exists().withMessage('El nombre completo es obligatorio')
    .notEmpty().withMessage('El nombre completo no puede estar vacío')
    .trim(),
  body('fechaNacimiento')
    .exists().withMessage('La fecha de nacimiento es obligatoria')
    .isISO8601().withMessage('La fecha debe tener un formato válido (YYYY-MM-DD)'),
];

export const validarPerfilId = [
  param('id')
    .isMongoId().withMessage('El ID del perfil no es válido'),
];