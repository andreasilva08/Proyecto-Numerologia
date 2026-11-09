import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Definición del modelo optimizado para lecturas numerológicas
export const MODELO = 'gemini-3.8-flash';

// Inicialización de la instancia única del cliente de Google Gen AI
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export default ai;
