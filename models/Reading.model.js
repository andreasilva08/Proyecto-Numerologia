import mongoose from 'mongoose';

const readingSchema = new mongoose.Schema(
  {
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El identificador del usuario (usuario_id) es obligatorio'],
      index: true
    },
    matriz_id: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'El identificador de la matriz (matriz_id) es obligatorio'],
      index: true
    },
    prompt_usado_id: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'El identificador del prompt utilizado (prompt_usado_id) es obligatorio'],
      index: true
    },
    contenido: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'El contenido estructurado de la lectura es obligatorio']
    },
    tokens_usados: {
      type: Number,
      default: 0
    },
    modelo: {
      type: String,
      default: 'gemini-3.8-flash'
    }
  },
  {
    timestamps: true
  }
);

// Índice compuesto para acelerar las búsquedas y verificación de lecturas previas en caché
readingSchema.index({ matriz_id: 1, prompt_usado_id: 1 });

export default mongoose.model('Reading', readingSchema);