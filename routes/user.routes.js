import { Router } from 'express';
import { 
  login,               
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
import { validarJWT } from '../middlewares/validarToken.js'; 

const router = Router();

// Ruta pública: inicio de sesión
router.post('/login', login);

// Ruta pública o protegida según tus requisitos de registro
router.post('/', validarCrearUsuario, validateResult, createUser);

// Rutas protegidas con validarJWT
router.get('/', validarJWT, getUsers);
router.get('/:id', validarJWT, validarUsuarioId, validateResult, getUserById);
router.put('/:id', validarJWT, validarUsuarioId, validarCrearUsuario, validateResult, updateUser);
router.delete('/:id', validarJWT, validarUsuarioId, validateResult, deleteUser);

export default router;
