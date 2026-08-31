import { Router } from 'express';
import { 
  createUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from '../controllers/user.controller.js';
import { 
  validarCrearUsuario, 
  validarUsuarioId 
} from '../validators/user.validator.js';
import { validateResult } from '../middlewares/validateResult.middleware.js';

const router = Router();

router.post('/', validarCrearUsuario, validateResult, createUser);
router.get('/', getUsers);
router.get('/:id', validarUsuarioId, validateResult, getUserById);
router.put('/:id', validarUsuarioId, validarCrearUsuario, validateResult, updateUser);
router.delete('/:id', validarUsuarioId, validateResult, deleteUser);

export default router;