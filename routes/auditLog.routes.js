import { Router } from 'express';
import { 
  createAuditLog, 
  getAuditLogs, 
  getAuditLogById, 
  updateAuditLog, 
  deleteAuditLog 
} from '../controllers/auditLog.controller.js';
import { 
  validarCrearRegistroAuditoria, 
  validarAuditoriaId 
} from '../validators/auditLog.validator.js';
import { validateResult } from '../middlewares/validateResult.middleware.js';

const router = Router();

router.post('/', validarCrearRegistroAuditoria, validateResult, createAuditLog);
router.get('/', getAuditLogs);
router.get('/:id', validarAuditoriaId, validateResult, getAuditLogById);
router.put('/:id', validarAuditoriaId, validarCrearRegistroAuditoria, validateResult, updateAuditLog);
router.delete('/:id', validarAuditoriaId, validateResult, deleteAuditLog);

export default router;