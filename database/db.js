import mongoose from 'mongoose'; // Importar la biblioteca Mongoose para interactuar con MongoDB

const conectarDB = async () => {
  const mongoUri = process.env.MONGO_URI?.trim();
  if (!mongoUri) {
    throw new Error('Falta la variable de entorno MONGO_URI.');
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    throw error;
  }
};

export default conectarDB;