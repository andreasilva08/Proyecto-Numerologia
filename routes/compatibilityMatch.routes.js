import { Router } from 'express';
import { 
  createNumerologyProfile, 
  getNumerologyProfiles, 
  getNumerologyProfileById, 
  updateNumerologyProfile, 
  deleteNumerologyProfile 
} from '../controllers/numerologyProfile.controller.js';
import { 
  validarCrearPerfilNumerologico, 
  validarPerfilId 
} from '../validators/numerologyProfile.validator.js';
import { validateResult } from '../middlewares/validateResult.middleware.js';
import { validarJWT } from '../middlewares/validarToken.js';

const router = Router();

router.post('/', validarJWT, validarCrearPerfilNumerologico, validateResult, createNumerologyProfile);
router.get('/', validarJWT, getNumerologyProfiles);
router.get('/:id', validarJWT, validarPerfilId, validateResult, getNumerologyProfileById);
router.put('/:id', validarJWT, validarPerfilId, validarCrearPerfilNumerologico, validateResult, updateNumerologyProfile);
router.delete('/:id', validarJWT, validarPerfilId, validateResult, deleteNumerologyProfile);

export default router;
