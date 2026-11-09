import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

// Definición del modelo optimizado para lecturas numerológicas
export const MODELO = 'gemini-3.8-flash';

const apiKey = process.env.GEMINI_API_KEY?.trim();
if (!apiKey) {
  throw new Error('Falta la variable de entorno GEMINI_API_KEY.');
}

// Inicialización de la instancia única del cliente de Google Gen AI
export const ai = new GoogleGenAI({
  apiKey
});

export default ai;
