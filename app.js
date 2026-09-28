// app.js
// Daniel Mauricio Vesga Tibaduiza
// Andrea Carolina Silva Macias

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar las 5 rutas
import userRoutes from './routes/user.routes.js';
import numerologyProfileRoutes from './routes/numerology.routes.js';
import readingRoutes from './routes/reading.routes.js';
import compatibilityMatchRoutes from './routes/compatibilityMatch.routes.js';
import auditLogRoutes from './routes/auditLog.routes.js';

dotenv.config();

const app = express();

// Para resolver la ruta absoluta de la carpeta public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Habilitar CORS para permitir peticiones desde el frontend
app.use(cors());

// 2. Middleware para procesar JSON
app.use(express.json());

// 3. Servir los archivos estáticos de la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Registrar las 5 rutas de la API
app.use('/api/users', userRoutes);
app.use('/api/numerology-profiles', numerologyProfileRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/compatibility-matches', compatibilityMatchRoutes);
app.use('/api/audit-logs', auditLogRoutes);

// ==========================================
// NUEVO: MANEJADOR GLOBAL DE ERRORES (Bloquea el Ataque #06)
// Evita que Express exponga stack traces en HTML y rutas locales del servidor.
// ==========================================
app.use((err, req, res, next) => {
  // Si hay un error de sintaxis JSON al enviar la petición
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      status: 'error',
      message: 'El formato del JSON enviado es inválido o está malformado.'
    });
  }

  // Manejador general de errores del servidor en formato JSON estandarizado
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Ocurrió un error interno en el servidor' 
      : err.message
  });
});

// Exportar la instancia de app
export default app;