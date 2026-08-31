// app.js
// Daniel Mauricio Vesga Tibaduiza
// Andrea Carolina Silva Macias

import express from 'express';
import dotenv from 'dotenv';

// Importar las 5 rutas
import userRoutes from './routes/user.routes.js';
import numerologyProfileRoutes from './routes/numerology.routes.js';
import readingRoutes from './routes/reading.routes.js';
import compatibilityMatchRoutes from './routes/compatibilityMatch.routes.js';
import auditLogRoutes from './routes/auditLog.routes.js';

dotenv.config();

const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('API de Numerología funcionando');
});

// Registrar las 5 rutas
app.use('/api/users', userRoutes);
app.use('/api/numerology-profiles', numerologyProfileRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/compatibility-matches', compatibilityMatchRoutes);
app.use('/api/audit-logs', auditLogRoutes);

// Exportar la instancia de app
export default app;
