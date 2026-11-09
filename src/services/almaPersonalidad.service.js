/**
 * =============================================================================
 * SERVICIO DE NÚMERO DEL ALMA Y NÚMERO DE PERSONALIDAD
 * Cálculos pitagóricos exclusivos de Vocales y Consonantes
 * =============================================================================
 */

import { reducirNumero } from './expresion.service.js';

// ──────────────────────────────────────────────────────────────────────────────
// TABLAS PITAGÓRICAS ESPECÍFICAS
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Valores pitagóricos de las VOCALES únicamente.
 * A=1, E=5, I=9, O=6, U=3 (tabla estándar aplicada solo a vocales)
 */
const VOCALES_PITAGORICAS = {
  A: 1,
  E: 5,
  I: 9,
  O: 6,
  U: 3
};

/**
 * Valores pitagóricos de las CONSONANTES únicamente.
 * Toda la tabla menos las 5 vocales.
 */
const CONSONANTES_PITAGORICAS = {
  B: 2, C: 3, D: 4,
  F: 6, G: 7, H: 8,
  J: 1, K: 2, L: 3, M: 4, N: 5,
  P: 7, Q: 8, R: 9,
  S: 1, T: 2,
  V: 4, W: 5, X: 6, Y: 7, Z: 8
};

// ──────────────────────────────────────────────────────────────────────────────
// INTERPRETACIONES DEL NÚMERO DEL ALMA (VOCALES)
// ──────────────────────────────────────────────────────────────────────────────
const INTERPRETACIONES_ALMA = {
  1: {
    arquetipo: 'Alma Pionera y Autosuficiente',
    descripcion: 'En lo más profundo de tu ser anhelas independencia, liderazgo y la libertad de trazar tu propio camino sin restricciones. Tu impulso interior es crear, iniciar y manifestar tus ideas con coraje y originalidad.',
    palabrasClave: ['Independencia', 'Voluntad Propia', 'Autoliderazgo', 'Iniciativa']
  },
  2: {
    arquetipo: 'Alma Diplomática y Sensible',
    descripcion: 'Tu mundo interior vive en búsqueda constante de armonía, paz y conexión genuina con otros. Anhelas profundamente ser comprendido y valorado en tus relaciones, y tu mayor satisfacción nace del amor y la cooperación.',
    palabrasClave: ['Armonía', 'Sensibilidad', 'Amor', 'Unión']
  },
  3: {
    arquetipo: 'Alma Creativa y Expresiva',
    descripcion: 'El alma vibra con la necesidad de crear, comunicar y compartir alegría con el mundo. Buscas expresar tu mundo interior a través del arte, la palabra y la creatividad como forma esencial de ser.',
    palabrasClave: ['Creatividad', 'Autoexpresión', 'Alegría', 'Comunicación']
  },
  4: {
    arquetipo: 'Alma Constructora y Estable',
    descripcion: 'En tu mundo interior florece un profundo deseo de construir cimientos sólidos, de organizar, trabajar con disciplina y crear seguridad duradera. Anhelas estabilidad, orden y resultados concretos.',
    palabrasClave: ['Estabilidad', 'Disciplina', 'Seguridad', 'Trabajo']
  },
  5: {
    arquetipo: 'Alma Libre y Aventurera',
    descripcion: 'Tu esencia más profunda anhela libertad, movimiento, experiencias nuevas y la constante expansión de horizontes. Eres un alma que necesita vivir plenamente sin ataduras que limiten su vuelo.',
    palabrasClave: ['Libertad', 'Aventura', 'Cambio', 'Expansión']
  },
  6: {
    arquetipo: 'Alma Protectora y Amorosa',
    descripcion: 'El amor, el hogar, la familia y el servicio a los demás son el centro gravitacional de tu mundo interior. Tu mayor satisfacción nace de proteger, sanar y nutrir a quienes amas con devoción sincera.',
    palabrasClave: ['Amor', 'Familia', 'Servicio', 'Protección']
  },
  7: {
    arquetipo: 'Alma Sabia e Introspectiva',
    descripcion: 'Tu alma vive en perpetua búsqueda de significado, verdad profunda y comprensión espiritual. Anhelas el silencio interior, el conocimiento esotérico y la sabiduría que trasciende lo mundano.',
    palabrasClave: ['Sabiduría', 'Introspección', 'Verdad', 'Espiritualidad']
  },
  8: {
    arquetipo: 'Alma Poderosa y Abundante',
    descripcion: 'Tu esencia más íntima aspira al éxito material, el poder justo y la realización de grandes metas. Anhelas dejar una huella significativa en el mundo a través de logros tangibles y liderazgo.',
    palabrasClave: ['Abundancia', 'Poder', 'Éxito', 'Ambición']
  },
  9: {
    arquetipo: 'Alma Compasiva y Universal',
    descripcion: 'Tu corazón más profundo late al ritmo de la humanidad. Anhelas servir, sanar y contribuir a un mundo mejor. El amor universal, el altruismo y la compasión son el combustible de tu alma.',
    palabrasClave: ['Compasión', 'Altruismo', 'Humanidad', 'Trascendencia']
  },
  11: {
    arquetipo: 'Alma Iluminada (Número Maestro)',
    descripcion: 'Alma de alta vibración, sensitiva y con dones espirituales extraordinarios. Anhelas la iluminación, la guía espiritual y ser un faro de luz para los demás. Tu intuición es un regalo divino.',
    palabrasClave: ['Iluminación', 'Intuición Maestra', 'Guía Espiritual', 'Sensibilidad Cósmica'],
    esMaestro: true
  },
  22: {
    arquetipo: 'Alma Maestra Constructora (Número Maestro)',
    descripcion: 'Tu alma vibra con el poder de materializar visiones trascendentales. Anhelas construir algo que perdure más allá de ti mismo y transforme positivamente a la humanidad.',
    palabrasClave: ['Manifestación', 'Visión Global', 'Impacto Duradero', 'Maestría'],
    esMaestro: true
  },
  33: {
    arquetipo: 'Alma Sanadora Universal (Número Maestro)',
    descripcion: 'La vibración más compasiva y elevada. Tu alma anhela sanar, guiar y amar incondicionalmente a toda la humanidad. Eres un canal de amor divino en su expresión más pura.',
    palabrasClave: ['Sanación', 'Amor Incondicional', 'Devoción', 'Servicio Sagrado'],
    esMaestro: true
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// INTERPRETACIONES DEL NÚMERO DE PERSONALIDAD (CONSONANTES)
// ──────────────────────────────────────────────────────────────────────────────
const INTERPRETACIONES_PERSONALIDAD = {
  1: {
    arquetipo: 'Personalidad del Líder Decisivo',
    descripcion: 'Proyectas una imagen de confianza, determinación y liderazgo natural. Los demás te perciben como alguien pionero, independiente y capaz de afrontar cualquier desafío con coraje y originalidad.',
    palabrasClave: ['Confianza', 'Determinación', 'Presencia Fuerte', 'Liderazgo Visible']
  },
  2: {
    arquetipo: 'Personalidad del Diplomático Gentil',
    descripcion: 'Tu presencia irradia dulzura, empatía y equilibrio. Los demás te perciben como alguien accesible, confiable y con una capacidad innata para mediar conflictos y crear lazos afectivos.',
    palabrasClave: ['Amabilidad', 'Empatía', 'Diplomacia', 'Presencia Acogedora']
  },
  3: {
    arquetipo: 'Personalidad del Comunicador Carismático',
    descripcion: 'Proyectas creatividad, optimismo y un carisma irresistible que atrae a las personas naturalmente. Los demás te perciben como alguien brillante, entretenido y lleno de vitalidad expresiva.',
    palabrasClave: ['Carisma', 'Expresividad', 'Creatividad Visible', 'Optimismo']
  },
  4: {
    arquetipo: 'Personalidad del Constructor Confiable',
    descripcion: 'Transmites solidez, responsabilidad y confianza absoluta. Los demás te ven como alguien metódico, honesto y capaz de construir cosas duraderas. Tu presencia genera seguridad y estabilidad.',
    palabrasClave: ['Fiabilidad', 'Solidez', 'Honestidad', 'Practicidad']
  },
  5: {
    arquetipo: 'Personalidad del Explorador Dinámico',
    descripcion: 'Proyectas energía, versatilidad y un magnetismo aventurero que fascina. Los demás te perciben como alguien dinámico, moderno, adaptable y con una mente siempre abierta a lo nuevo.',
    palabrasClave: ['Dinamismo', 'Magnetismo', 'Versatilidad', 'Adaptabilidad']
  },
  6: {
    arquetipo: 'Personalidad del Protector Cálido',
    descripcion: 'Tu presencia irradia calidez, cuidado y responsabilidad. Los demás te perciben como alguien íntegro, familiar, armonioso y siempre dispuesto a apoyar y proteger a quienes ama.',
    palabrasClave: ['Calidez', 'Integridad', 'Responsabilidad', 'Armonía Visible']
  },
  7: {
    arquetipo: 'Personalidad del Sabio Reservado',
    descripcion: 'Proyectas un aura de misterio, profundidad y sabiduría que genera respeto e intriga. Los demás te perciben como alguien reflexivo, analítico y con un mundo interior de gran riqueza.',
    palabrasClave: ['Misterio', 'Profundidad', 'Intelecto', 'Reserva Elegante']
  },
  8: {
    arquetipo: 'Personalidad del Ejecutivo Poderoso',
    descripcion: 'Transmites autoridad, ambición y eficiencia de alto nivel. Los demás te perciben como alguien exitoso, estratégico y con capacidad para manejar grandes responsabilidades y recursos.',
    palabrasClave: ['Autoridad', 'Éxito Visible', 'Eficiencia', 'Impacto']
  },
  9: {
    arquetipo: 'Personalidad del Humanitario Generoso',
    descripcion: 'Proyectas compasión, nobleza y un amor genuino por la humanidad. Los demás te perciben como alguien sabio, generoso y comprometido con causas más grandes que el interés personal.',
    palabrasClave: ['Compasión', 'Nobleza', 'Generosidad', 'Visión Humanitaria']
  },
  11: {
    arquetipo: 'Personalidad del Visionario Inspirador (Número Maestro)',
    descripcion: 'Tu presencia es magnética e inspiradora. Los demás te perciben como alguien con dones especiales, una intuición extraordinaria y la capacidad de elevar la conciencia de quienes te rodean.',
    palabrasClave: ['Magnetismo', 'Inspiración', 'Intuición', 'Carisma Espiritual'],
    esMaestro: true
  },
  22: {
    arquetipo: 'Personalidad del Maestro Realizador (Número Maestro)',
    descripcion: 'Proyectas una presencia monumental que combina visión y pragmatismo. Los demás te perciben como alguien capaz de lograr lo imposible, un constructor de grandes obras y legados.',
    palabrasClave: ['Monumentalidad', 'Visión Práctica', 'Liderazgo Global', 'Legado'],
    esMaestro: true
  },
  33: {
    arquetipo: 'Personalidad del Maestro Sanador (Número Maestro)',
    descripcion: 'Tu presencia transmite amor puro y compasión sin límites. Los demás te perciben como un guía espiritual, un sanador y un ser de luz que transforma entornos con su sola presencia.',
    palabrasClave: ['Amor Puro', 'Presencia Sanadora', 'Guía Espiritual', 'Transformación'],
    esMaestro: true
  }
};

// ──────────────────────────────────────────────────────────────────────────────
// FUNCIÓN AUXILIAR: Normalizar y filtrar caracteres
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Normaliza el nombre: mayúsculas y elimina diacríticos (á→a, ñ→n, etc.)
 * @param {string} nombre
 * @returns {string}
 */
const normalizarNombre = (nombre) => {
  return nombre
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

// ──────────────────────────────────────────────────────────────────────────────
// CÁLCULO DEL NÚMERO DEL ALMA (VOCALES)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Calcula el Número del Alma filtrando únicamente las vocales del nombre.
 *
 * @param {string} nombreCompleto - Nombre completo del consultante
 * @returns {{
 *   nombreAnalizado: string,
 *   vocalesEncontradas: Array<{ caracter: string, valor: number }>,
 *   sumaTotal: number,
 *   numeroAlma: number,
 *   esNumeroMaestro: boolean,
 *   interpretacion: Object
 * }}
 */
export const calcularNumeroAlma = (nombreCompleto) => {
  if (!nombreCompleto || typeof nombreCompleto !== 'string') {
    throw new Error('Debe proporcionar un nombre válido en formato de texto.');
  }

  const nombreLimpio = nombreCompleto.trim();
  if (nombreLimpio.length === 0) {
    throw new Error('El nombre no puede estar vacío.');
  }

  const textoNormalizado = normalizarNombre(nombreLimpio);

  const vocalesEncontradas = [];
  let sumaTotal = 0;

  for (const char of textoNormalizado) {
    if (VOCALES_PITAGORICAS[char] !== undefined) {
      const valor = VOCALES_PITAGORICAS[char];
      vocalesEncontradas.push({ caracter: char, valor });
      sumaTotal += valor;
    }
  }

  if (vocalesEncontradas.length === 0) {
    throw new Error('El nombre proporcionado no contiene vocales válidas para el cálculo del Número del Alma.');
  }

  const numeroAlma = reducirNumero(sumaTotal, true);
  const esNumeroMaestro = numeroAlma === 11 || numeroAlma === 22 || numeroAlma === 33;
  const interpretacion = INTERPRETACIONES_ALMA[numeroAlma] || {
    arquetipo: `Vibración del Alma ${numeroAlma}`,
    descripcion: `Vibración anímica calculada con valor ${numeroAlma}.`,
    palabrasClave: []
  };

  return {
    nombreAnalizado: nombreLimpio,
    totalVocalesValidadas: vocalesEncontradas.length,
    sumaTotal,
    numeroAlma,
    esNumeroMaestro,
    vocalesEncontradas,
    interpretacion
  };
};

// ──────────────────────────────────────────────────────────────────────────────
// CÁLCULO DEL NÚMERO DE PERSONALIDAD (CONSONANTES)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Calcula el Número de Personalidad filtrando únicamente las consonantes del nombre.
 *
 * @param {string} nombreCompleto - Nombre completo del consultante
 * @returns {{
 *   nombreAnalizado: string,
 *   consonantesEncontradas: Array<{ caracter: string, valor: number }>,
 *   sumaTotal: number,
 *   numeroPersonalidad: number,
 *   esNumeroMaestro: boolean,
 *   interpretacion: Object
 * }}
 */
export const calcularNumeroPersonalidad = (nombreCompleto) => {
  if (!nombreCompleto || typeof nombreCompleto !== 'string') {
    throw new Error('Debe proporcionar un nombre válido en formato de texto.');
  }

  const nombreLimpio = nombreCompleto.trim();
  if (nombreLimpio.length === 0) {
    throw new Error('El nombre no puede estar vacío.');
  }

  const textoNormalizado = normalizarNombre(nombreLimpio);

  const consonantesEncontradas = [];
  let sumaTotal = 0;

  for (const char of textoNormalizado) {
    if (CONSONANTES_PITAGORICAS[char] !== undefined) {
      const valor = CONSONANTES_PITAGORICAS[char];
      consonantesEncontradas.push({ caracter: char, valor });
      sumaTotal += valor;
    }
  }

  if (consonantesEncontradas.length === 0) {
    throw new Error('El nombre proporcionado no contiene consonantes válidas para el cálculo del Número de Personalidad.');
  }

  const numeroPersonalidad = reducirNumero(sumaTotal, true);
  const esNumeroMaestro = numeroPersonalidad === 11 || numeroPersonalidad === 22 || numeroPersonalidad === 33;
  const interpretacion = INTERPRETACIONES_PERSONALIDAD[numeroPersonalidad] || {
    arquetipo: `Vibración de Personalidad ${numeroPersonalidad}`,
    descripcion: `Vibración de personalidad calculada con valor ${numeroPersonalidad}.`,
    palabrasClave: []
  };

  return {
    nombreAnalizado: nombreLimpio,
    totalConsonantesValidadas: consonantesEncontradas.length,
    sumaTotal,
    numeroPersonalidad,
    esNumeroMaestro,
    consonantesEncontradas,
    interpretacion
  };
};

export default {
  calcularNumeroAlma,
  calcularNumeroPersonalidad,
  INTERPRETACIONES_ALMA,
  INTERPRETACIONES_PERSONALIDAD
};
