import { Router } from 'express';
import { 
  createReading, 
  getReadings, 
  getReadingById, 
  updateReading, 
  deleteReading 
} from '../controllers/reading.controller.js';
import { 
  validarCrearLectura, 
  validarLecturaId 
} from '../validators/reading.validator.js';
import { validateResult } from '../middlewares/validateResult.middleware.js';
import { validarJWT } from '../middlewares/validarToken.js';

const router = Router();

router.post('/', validarJWT, validarCrearLectura, validateResult, createReading);
router.get('/', validarJWT, getReadings);
router.get('/:id', validarJWT, validarLecturaId, validateResult, getReadingById);
router.put('/:id', validarJWT, validarLecturaId, validarCrearLectura, validateResult, updateReading);
router.delete('/:id', validarJWT, validarLecturaId, validateResult, deleteReading);

export default router;
