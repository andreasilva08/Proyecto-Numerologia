//Daniel Mauricio Vesga
//Andrea Carolina Silva Macias

import express from "express"; // Importar Express
import dotenv from "dotenv"; // Importar dotenv para manejar variables de entorno
import mongoose from "mongoose"; // Importar Mongoose para la conexión a MongoDB

dotenv.config(); // cargar variables del .env

const app = express(); // Crear instancia de Express
const PORT = process.env.PORT || 3200; // Puerto del servidor

// Middleware para leer json
app.use(express.json());  // Middleware para parsear JSON en las solicitudes

// Conexión a Mongo
mongoose.connect(process.env.MONGO_URI)  // Conectar a MongoDB usando la URI del archivo .env
  .then(() => console.log('Conectado a MongoDB')) // Mensaje de éxito
  .catch((err) => console.error('Error conectando a Mongo:', err)); // Mensaje de error

// Ruta de prueba
app.get('/', (req, res) => { // Ruta raíz
  res.send('Servidor Express funcionando!');  // Responder con un mensaje de éxito
});

// Levantar servidor
app.listen(PORT, () => {  // Iniciar el servidor en el puerto especificado
  console.log(`Servidor corriendo en http://localhost:${PORT}`);  // Mensaje de éxito al iniciar el servidor
});