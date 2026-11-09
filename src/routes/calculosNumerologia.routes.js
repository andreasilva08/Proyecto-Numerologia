import { Router } from 'express';
import { calcularExpresion } from '../controllers/expresion.controller.js';
import { calcularAnioPersonalController } from '../controllers/anioPersonal.controller.js';
import { calcularAlma, calcularPersonalidad } from '../controllers/almaPersonalidad.controller.js';
import { validarCalculoExpresion } from '../validators/expresion.validator.js';
import { validarCalculoAnioPersonal } from '../validators/anioPersonal.validator.js';
import { validarCalculoAlmaPersonalidad } from '../validators/almaPersonalidad.validator.js';
import {
  calcularPinaculosController,
  analizarMatrizKarmicaController,
  calcularHerenciaController,
  calcularCompatibilidadController
} from '../controllers/numerologiaAvanzada.controller.js';
import {
  validarPinaculos,
  validarMatrizKarmica,
  validarHerencia,
  validarCompatibilidad
} from '../validators/numerologiaAvanzada.validator.js';
import { validateResult } from '../../middlewares/validateResult.middleware.js';
import { validarJWT } from '../../middlewares/validarToken.js';

const router = Router();

/**
 * @route   POST /api/v1/numerologia/expresion
 * @desc    Calcula el número de expresión pitagórica a partir de un nombre completo
 * @access  Privado (Requiere JWT)
 */
router.post(
  '/expresion',
  validarJWT,
  validarCalculoExpresion,
  validateResult,
  calcularExpresion
);

/**
 * @route   POST /api/v1/numerologia/anio-personal
 * @desc    Calcula el año personal (ciclo energético) para el año actual 2026
 * @access  Privado (Requiere JWT)
 */
router.post(
  '/anio-personal',
  validarJWT,
  validarCalculoAnioPersonal,
  validateResult,
  calcularAnioPersonalController
);

/**
 * @route   POST /api/v1/numerologia/alma
 * @desc    Calcula el Número del Alma (suma pitagórica de vocales del nombre completo)
 * @access  Privado (Requiere JWT)
 */
router.post(
  '/alma',
  validarJWT,
  validarCalculoAlmaPersonalidad,
  validateResult,
  calcularAlma
);

/**
 * @route   POST /api/v1/numerologia/personalidad
 * @desc    Calcula el Número de Personalidad (suma pitagórica de consonantes del nombre completo)
 * @access  Privado (Requiere JWT)
 */
router.post(
  '/personalidad',
  validarJWT,
  validarCalculoAlmaPersonalidad,
  validateResult,
  calcularPersonalidad
);

router.post('/pinaculos', validarJWT, validarPinaculos, validateResult, calcularPinaculosController);
router.post('/matriz-karmica', validarJWT, validarMatrizKarmica, validateResult, analizarMatrizKarmicaController);
router.post('/herencia', validarJWT, validarHerencia, validateResult, calcularHerenciaController);
router.post('/compatibilidad', validarJWT, validarCompatibilidad, validateResult, calcularCompatibilidadController);

export default router;
