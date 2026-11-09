import { Router } from 'express';
import { 
  login,                  
  createUser, 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from '../Controllers/user.controller.js';
import { 
  validarCrearUsuario, 
  validarActualizarUsuario, // <--- 1. Importar la validación flexible para PUT
  validarUsuarioId 
} from '../validators/user.validator.js';
import { validateResult } from '../middlewares/validateResult.middleware.js';
import { validarJWT } from '../middlewares/validarToken.js'; 

const router = Router();

// Ruta pública: inicio de sesión
router.post('/login', login);

// Ruta pública para registro de usuario
router.post('/', validarCrearUsuario, validateResult, createUser);

// Rutas protegidas con validarJWT
router.get('/', validarJWT, getUsers);
router.get('/:id', validarJWT, validarUsuarioId, validateResult, getUserById);

// 2. Usar validarActualizarUsuario en lugar de validarCrearUsuario para el PUT
router.put('/:id', validarJWT, validarUsuarioId, validarActualizarUsuario, validateResult, updateUser);

router.delete('/:id', validarJWT, validarUsuarioId, validateResult, deleteUser);

export default router;