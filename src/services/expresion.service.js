/**
 * Tabla Pitagórica Estándar
 * Mapeo de caracteres a valores numéricos del 1 al 9
 */
export const TABLA_PITAGORICA = {
  A: 1, J: 1, S: 1,
  B: 2, K: 2, T: 2,
  C: 3, L: 3, U: 3,
  D: 4, M: 4, V: 4,
  E: 5, N: 5, W: 5,
  F: 6, O: 6, X: 6,
  G: 7, P: 7, Y: 7,
  H: 8, Q: 8, Z: 8,
  I: 9, R: 9
};

/**
 * Interpretaciones de los números de expresión (1-9 y Números Maestros 11, 22, 33)
 */
export const INTERPRETACIONES_EXPRESION = {
  1: {
    arquetipo: 'El Líder Pionero',
    descripcion: 'Pionero, líder nato y autosuficiente. Tu destino es innovar, abrir caminos con determinación y manifestar tu individualidad sin temor a la independencia.',
    palabrasClave: ['Iniciativa', 'Independencia', 'Originalidad', 'Coraje']
  },
  2: {
    arquetipo: 'El Diplomático Pacificador',
    descripcion: 'Diplomático, empático y sensible. Tu fortaleza radica en mediar situaciones complejas, forjar alianzas y trabajar en equipo con cooperación armónica.',
    palabrasClave: ['Diplomacia', 'Empatía', 'Cooperación', 'Sensibilidad']
  },
  3: {
    arquetipo: 'El Comunicador Creativo',
    descripcion: 'Comunicador creativo, carismático y optimista. Tu misión se expresa mediante el arte, la palabra, el entusiasmo contagioso y la inspiración a los demás.',
    palabrasClave: ['Creatividad', 'Optimismo', 'Autoexpresión', 'Carisma']
  },
  4: {
    arquetipo: 'El Constructor Metódico',
    descripcion: 'Constructor metódico, confiable y disciplinado. Destacas por tu perseverancia, lealtad y capacidad para erigir estructuras sólidas y duraderas.',
    palabrasClave: ['Disciplina', 'Orden', 'Estabilidad', 'Perseverancia']
  },
  5: {
    arquetipo: 'El Explorador Libre',
    descripcion: 'Explorador libre, visionario y versátil. Tu energía está orientada a la adaptabilidad, los cambios dinámicos, los viajes y la libertad de pensamiento.',
    palabrasClave: ['Libertad', 'Adaptabilidad', 'Dinamismo', 'Curiosidad']
  },
  6: {
    arquetipo: 'El Protector Armonizador',
    descripcion: 'Protector amoroso, consejero y responsable. Tu vocación se enfoca en el bienestar familiar, la armonía comunitaria y el servicio afectuoso a los seres queridos.',
    palabrasClave: ['Amor', 'Responsabilidad', 'Armonía', 'Servicio']
  },
  7: {
    arquetipo: 'El Filósofo Sabio',
    descripcion: 'Filósofo reflexivo e investigador de verdades profundas. Sobresales por tu agudeza mental, intuición analítica y constante búsqueda de sabiduría interior.',
    palabrasClave: ['Introspección', 'Sabiduría', 'Mente Analítica', 'Espiritualidad']
  },
  8: {
    arquetipo: 'El Estratega de Poder',
    descripcion: 'Estratega visionario, ejecutivo y determinado. Tu camino involucra el dominio del plano material, la generación de abundancia y el liderazgo justo.',
    palabrasClave: ['Abundancia', 'Liderazgo', 'Visión Estratégica', 'Autoridad']
  },
  9: {
    arquetipo: 'El Humanitario Universal',
    descripcion: 'Humanitario generoso, compasivo y universal. Resuenas con ideales elevados, vocación altruista, perdón y compromiso con la evolución colectiva.',
    palabrasClave: ['Compasión', 'Altruismo', 'Amor Universal', 'Cierre de Ciclos']
  },
  11: {
    arquetipo: 'El Iluminador Visionario (Número Maestro)',
    descripcion: 'Vibración maestra de alta sensibilidad e intuición cósmica. Canal de inspiración espiritual para guiar e iluminar la conciencia de quienes te rodean.',
    palabrasClave: ['Intuición Trascendental', 'Visión Cósmica', 'Inspiración', 'Idealismo'],
    esMaestro: true
  },
  22: {
    arquetipo: 'El Maestro Constructor (Número Maestro)',
    descripcion: 'Vibración maestra con el poder de materializar grandes ideales en obras prácticas y tangibles que transformen positivamente a la sociedad.',
    palabrasClave: ['Manifestación Práctica', 'Visión Global', 'Impacto Trascendente', 'Logro Supremo'],
    esMaestro: true
  },
  33: {
    arquetipo: 'El Guía Sanador Universal (Número Maestro)',
    descripcion: 'Vibración maestra de compasión pura, devoción espiritual y servicio desinteresado enfocado en la sanación y elevación moral de la humanidad.',
    palabrasClave: ['Amor Incondicional', 'Sanación Espiritual', 'Devoción', 'Guía Trascendental'],
    esMaestro: true
  }
};

/**
 * Reduce un número sumando sus dígitos hasta llegar a un solo dígito (1-9)
 * o conservando los Números Maestros (11, 22, 33).
 * 
 * @param {number} numero - Número entero positivo
 * @param {boolean} [permitirMaestros=true] - Si se deben preservar los números maestros
 * @returns {number}
 */
export const reducirNumero = (numero, permitirMaestros = true) => {
  let num = parseInt(numero, 10);
  if (isNaN(num) || num <= 0) return 0;

  while (num > 9) {
    if (permitirMaestros && (num === 11 || num === 22 || num === 33)) {
      break;
    }
    num = num
      .toString()
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return num;
};

/**
 * Calcula el número de expresión pitagórica de un nombre completo.
 * 
 * @param {string} nombreCompleto - Nombre del consultante
 * @returns {{
 *   nombreAnalizado: string,
 *   desglose: Array<{ caracter: string, valor: number }>,
 *   sumaTotal: number,
 *   numeroExpresion: number,
 *   esNumeroMaestro: boolean,
 *   interpretacion: Object
 * }}
 */
export const calcularNumeroExpresion = (nombreCompleto) => {
  if (!nombreCompleto || typeof nombreCompleto !== 'string') {
    throw new Error('Debe proporcionar un nombre válido en formato de texto.');
  }

  const nombreLimpio = nombreCompleto.trim();
  if (nombreLimpio.length === 0) {
    throw new Error('El nombre no puede estar vacío.');
  }

  // Normalizar acentos (á->a, é->e, etc.) y caracteres diacríticos
  // Nota: La letra 'ñ' se normaliza a 'N' que corresponde al valor 5 pitagórico
  const textoNormalizado = nombreLimpio
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const desglose = [];
  let sumaTotal = 0;

  for (const char of textoNormalizado) {
    if (TABLA_PITAGORICA[char]) {
      const valor = TABLA_PITAGORICA[char];
      desglose.push({ caracter: char, valor });
      sumaTotal += valor;
    } else if (/[1-9]/.test(char)) {
      // Soporte alfanumérico si se ingresa algún dígito 1-9
      const valor = parseInt(char, 10);
      desglose.push({ caracter: char, valor });
      sumaTotal += valor;
    }
  }

  if (desglose.length === 0) {
    throw new Error('El nombre proporcionado no contiene letras ni dígitos válidos para el cálculo.');
  }

  const numeroExpresion = reducirNumero(sumaTotal, true);
  const esNumeroMaestro = numeroExpresion === 11 || numeroExpresion === 22 || numeroExpresion === 33;
  const interpretacion = INTERPRETACIONES_EXPRESION[numeroExpresion] || {
    arquetipo: `Vibración ${numeroExpresion}`,
    descripcion: `Vibración numerológica calculada con valor ${numeroExpresion}.`,
    palabrasClave: []
  };

  return {
    nombreAnalizado: nombreLimpio,
    totalCaracteresValidados: desglose.length,
    sumaTotal,
    numeroExpresion,
    esNumeroMaestro,
    desglose,
    interpretacion
  };
};

export default {
  TABLA_PITAGORICA,
  INTERPRETACIONES_EXPRESION,
  reducirNumero,
  calcularNumeroExpresion
};
