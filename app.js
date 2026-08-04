//Daniel Mauricio Vesga Tibaduiza
//Andrea Carolina Silva Macias

import express from 'express'; // Importar el módulo express
import dotenv from 'dotenv'; // Importar el módulo dotenv para manejar variables de entorno
import conectarDB from './db.js'; // Importar la función conectarDB desde el archivo db.js

dotenv.config(); // Cargar las variables de entorno desde el archivo .env

const app = express(); // Crear una instancia de la aplicación Express
const PORT = process.env.PORT || 3200; // Definir el puerto en el que se ejecutará el servidor, usando la variable de entorno PORT o el puerto 3200 por defecto

conectarDB(); // Llamar a la función conectarDB para establecer la conexión con la base de datos MongoDB

app.get('/', (req, res) => { // Definir una ruta GET en la raíz del servidor
  res.send('API de Numerología funcionando'); // Enviar una respuesta indicando que la API de Numerología está funcionando
});

app.listen(PORT, () => { // Iniciar el servidor y escuchar en el puerto definido
  console.log(`Servidor corriendo en http://localhost:${PORT}`); // Mostrar un mensaje en la consola indicando que el servidor está corriendo y en qué URL
});
