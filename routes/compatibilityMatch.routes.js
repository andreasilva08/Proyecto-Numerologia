import { Router } from 'express';
import { 
  createCompatibilityMatch, 
  getCompatibilityMatches, 
  getCompatibilityMatchById, 
  updateCompatibilityMatch, 
  deleteCompatibilityMatch 
} from '../controllers/compatibilityMatch.controller.js';
import { 
  validarCrearCompatibilidad, 
  validarCompatibilidadId 
} from '../validators/compatibilityMatch.validator.js';
import { validateResult } from '../middlewares/validateResult.middleware.js';

const router = Router();

router.post('/', validarCrearCompatibilidad, validateResult, createCompatibilityMatch);
router.get('/', getCompatibilityMatches);
router.get('/:id', validarCompatibilidadId, validateResult, getCompatibilityMatchById);
router.put('/:id', validarCompatibilidadId, validarCrearCompatibilidad, validateResult, updateCompatibilityMatch);
router.delete('/:id', validarCompatibilidadId, validateResult, deleteCompatibilityMatch);

export default router;