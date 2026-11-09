// server.js
import 'dotenv/config';
import app from './app.js';
import conectarDB from './database/db.js';

const PORT = Number(process.env.PORT) || 3200;

try {
  await conectarDB();
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
} catch (error) {
  console.error('No se pudo iniciar el servidor:', error.message);
  process.exitCode = 1;
}