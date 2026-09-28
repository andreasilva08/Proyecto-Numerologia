import jwt from 'jsonwebtoken';

export const generarJWT = (uid = '') => {
  return new Promise((resolve, reject) => {
    // 1. Verificar que existas la clave secreta en las variables de entorno
    if (!process.env.JWT_SECRET) {
      console.error('Error: JWT_SECRET no está definido en las variables de entorno');
      return reject('No se configuró la clave secreta del servidor');
    }

    const payload = { uid };

    // 2. Firmar el Token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '4h', // Permite personalizar el tiempo desde el .env
      },
      (err, token) => {
        if (err) {
          console.error('Error al generar el JWT:', err);
          reject('No se pudo generar el token');
        } else {
          resolve(token);
        }
      }
    );
  });
};