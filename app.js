//Daniel Mauricio Vesga Tibaduiza
//Andrea Carolina Silva Macias

import express from 'express'; // Importar el módulo express
import dotenv from 'dotenv'; // Importar el módulo dotenv para manejar variables de entorno
import conectarDB from './database/db.js'; // Importar la función conectarDB desde el archivo db.js

// Importar las 5 rutas
import userRoutes from './routes/user.routes.js';
import numerologyProfileRoutes from './routes/numerologyProfile.routes.js';
import readingRoutes from './routes/reading.routes.js';
import compatibilityMatchRoutes from './routes/compatibilityMatch.routes.js';
import auditLogRoutes from './routes/auditLog.routes.js';

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

const app = express(); // Crear una instancia de la aplicación Express
const PORT = process.env.PORT || 3200; // Definir el puerto en el que se ejecutará el servidor

conectarDB(); // Llamar a la función conectarDB para establecer la conexión con la base de datos MongoDB

// Middleware para poder recibir JSON en los POST y PUT
app.use(express.json());

app.get('/', (req, res) => { // Definir una ruta GET en la raíz del servidor
  res.send('API de Numerología funcionando'); // Enviar una respuesta
});

// Usar las 5 rutas
app.use('/api/users', userRoutes);
app.use('/api/numerology-profiles', numerologyProfileRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/compatibility-matches', compatibilityMatchRoutes);
app.use('/api/audit-logs', auditLogRoutes);

app.listen(PORT, () => { // Iniciar el servidor y escuchar en el puerto definido
  console.log(`Servidor corriendo en http://localhost:${PORT}`); // Mostrar un mensaje en la consola
});
