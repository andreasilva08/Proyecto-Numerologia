import { body, param } from 'express-validator';

export const validarCrearUsuario = [
  body('firstName')
    .exists().withMessage('El primer nombre es obligatorio')
    .notEmpty().withMessage('El primer nombre no puede estar vacío')
    .isString().withMessage('El primer nombre debe ser un texto')
    .trim(),
  body('lastName')
    .exists().withMessage('El apellido es obligatorio')
    .notEmpty().withMessage('El apellido no puede estar vacío')
    .isString().withMessage('El apellido debe ser un texto')
    .trim(),
  body('email')
    .exists().withMessage('El correo electrónico es obligatorio')
    .isEmail().withMessage('Debe ingresar un correo electrónico válido')
    .normalizeEmail(),
  body('password')
    .exists().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('birthDate')
    .exists().withMessage('La fecha de nacimiento es obligatoria')
    .isISO8601().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),
];

export const validarUsuarioId = [
  param('id')
    .isMongoId().withMessage('El ID de usuario no es válido'),
];