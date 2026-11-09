import { reducirNumero } from './expresion.service.js';

/**
 * Interpretaciones de los ciclos energéticos del Año Personal (1 a 9 y Números Maestros 11 y 22)
 */
export const CICLOS_ANIO_PERSONAL = {
  1: {
    etapa: 'Año de Inicios y Semillas',
    enfoque: 'Emprendimiento, nuevos comienzos, independencia y liderazgo.',
    descripcion: 'Es el inicio de un nuevo ciclo de nueve años. Momento ideal para sembrar proyectos, tomar decisiones valientes, asumir riesgos calculados y definir el rumbo de tu vida.',
    consejo: 'Confía en tu propia fuerza y no temas dar el primer paso en solitario.'
  },
  2: {
    etapa: 'Año de Cooperación y Paciencia',
    enfoque: 'Relaciones, diplomacia, alianzas y gestación silenciosa.',
    descripcion: 'Año de desarrollo receptivo y paciente. Las semillas del año 1 crecen bajo tierra. Se favorecen las sociedades, la conciliación de conflictos y el trabajo en equipo.',
    consejo: 'Cultiva la diplomacia, escucha a los demás y evita apresurar los resultados.'
  },
  3: {
    etapa: 'Año de Creatividad y Autoexpresión',
    enfoque: 'Vida social, comunicación, optimismo y expansión creativa.',
    descripcion: 'La energía florece con entusiasmo y vitalidad. Período excelente para las artes, la comunicación, los viajes recreativos, ampliar tu círculo social y disfrutar de la vida.',
    consejo: 'Expresa tus ideas libremente y canaliza tu entusiasmo en proyectos concretos.'
  },
  4: {
    etapa: 'Año de Estructura y Trabajo Duro',
    enfoque: 'Organización, disciplina, salud y consolidación de cimientos.',
    descripcion: 'Tiempo de aterrizar planes a la realidad. Requiere orden, esfuerzo metódico y disciplina para construir bases estables tanto en las finanzas como en el hogar.',
    consejo: 'Sé constante, mantén la disciplina y cuida tu bienestar físico y mental.'
  },
  5: {
    etapa: 'Año de Cambios y Libertad',
    enfoque: 'Transformaciones, versatilidad, aventura y nuevas oportunidades.',
    descripcion: 'Punto medio del ciclo de 9 años. Trae giros imprevistos, viajes, dinamismo y necesidad de liberarse de rutinas asfixiantes. Se abren puertas insospechadas.',
    consejo: 'Abraza la flexibilidad y adáptate con rapidez a los cambios.'
  },
  6: {
    etapa: 'Año de Hogar y Responsabilidad Afectiva',
    enfoque: 'Familia, amor, deberes comunitarios y armonía doméstica.',
    descripcion: 'El foco energético se traslada a los lazos afectivos, el hogar y los seres queridos. Momento propicio para compromisos sentimentales, decoración del hogar y reconciliaciones.',
    consejo: 'Brinda apoyo a quienes amas sin descuidar tus propios límites emocionales.'
  },
  7: {
    etapa: 'Año de Introspección y Sabiduría',
    enfoque: 'Estudio, análisis mental, descanso y evolución espiritual.',
    descripcion: 'Un ciclo sabático y reflexivo. Menos orientado a la actividad social exterior y más propicio para el autoconocimiento, la investigación profunda, la meditación y el descanso.',
    consejo: 'Dedica tiempo al silencio, confía en tu intuición y profundiza en tus conocimientos.'
  },
  8: {
    etapa: 'Año de Cosecha y Poder Material',
    enfoque: 'Logro financiero, autoridad, recompensas kármicas y liderazgo ejecutivo.',
    descripcion: 'Año de manifestación material y justicia cósmica. Si has trabajado diligentemente en los años previos, cosecharás abundancia económica, reconocimiento y ascenso profesional.',
    consejo: 'Administra tus recursos con visión ética, firmeza y generosidad.'
  },
  9: {
    etapa: 'Año de Cierre y Trascendencia',
    enfoque: 'Culminación, balance existencial, perdón y liberación de lo caduco.',
    descripcion: 'Finalización del ciclo de nueve años. Es tiempo de soltar apegos, limpiar lo que ya no sirve, cerrar etapas pendientes y prepararse para el renacer del próximo año 1.',
    consejo: 'Perdona, suelta el pasado con gratitud y no inicies proyectos de largo plazo que requieran permanencia.'
  },
  11: {
    etapa: 'Año Maestro de Iluminación y Despertar',
    enfoque: 'Intuición elevada, prueba espiritual e inspiración colectiva.',
    descripcion: 'Vibración maestra de alta exigencia cósmica. Conexión espiritual profunda, intuiciones reveladoras y oportunidades para servir de guía a otros, superando desafíos de fe.',
    consejo: 'Mantén la congruencia ética y escucha siempre la voz de tu sabiduría interior.',
    esMaestro: true
  },
  22: {
    etapa: 'Año Maestro del Gran Constructor',
    enfoque: 'Proyectos a gran escala, impacto social y legado trascendente.',
    descripcion: 'Vibración maestra de realización suprema. Posibilidad de plasmar proyectos gigantescos de beneficio para muchas personas, requiriendo visión global y disciplina férrea.',
    consejo: 'Apunta a metas elevadas que trasciendan tu beneficio puramente individual.',
    esMaestro: true
  }
};

/**
 * Calcula el Año Personal a partir del día y mes de nacimiento y un año base (por defecto 2026).
 * 
 * @param {Object} params
 * @param {number|string} params.dia - Día de nacimiento (1 - 31)
 * @param {number|string} params.mes - Mes de nacimiento (1 - 12)
 * @param {number|string} [params.anio=2026] - Año actual para el cálculo (por defecto 2026)
 * @returns {Object}
 */
export const calcularAnioPersonal = ({ dia, mes, anio = 2026 }) => {
  const diaNum = parseInt(dia, 10);
  const mesNum = parseInt(mes, 10);
  const anioNum = parseInt(anio, 10);

  if (isNaN(diaNum) || diaNum < 1 || diaNum > 31) {
    throw new Error('El día debe ser un valor numérico válido entre 1 y 31.');
  }

  if (isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
    throw new Error('El mes debe ser un valor numérico válido entre 1 y 12.');
  }

  if (isNaN(anioNum) || anioNum < 1000 || anioNum > 3000) {
    throw new Error('El año de cálculo debe ser un valor numérico válido de cuatro dígitos.');
  }

  // Reducciones individuales para transparencia y desglose paso a paso
  const diaReducido = reducirNumero(diaNum, false);
  const mesReducido = reducirNumero(mesNum, false);
  const anioReducido = reducirNumero(anioNum, false);

  // Suma de componentes reducidos
  const sumaComponentes = diaReducido + mesReducido + anioReducido;
  const numeroAnioPersonal = reducirNumero(sumaComponentes, true);
  const esNumeroMaestro = numeroAnioPersonal === 11 || numeroAnioPersonal === 22;

  const interpretacion = CICLOS_ANIO_PERSONAL[numeroAnioPersonal] || {
    etapa: `Ciclo del Año Personal ${numeroAnioPersonal}`,
    enfoque: 'Vibración energética en desarrollo.',
    descripcion: `Transición energética correspondiente a la vibración del número ${numeroAnioPersonal}.`,
    consejo: 'Fluye con la energía del presente.'
  };

  return {
    fechaEvaluada: {
      dia: diaNum,
      mes: mesNum,
      anioActual: anioNum
    },
    pasoAPaso: {
      diaReducido,
      mesReducido,
      anioReducido,
      formula: `${diaReducido} (día) + ${mesReducido} (mes) + ${anioReducido} (año ${anioNum}) = ${sumaComponentes}`
    },
    numeroAnioPersonal,
    esNumeroMaestro,
    interpretacion
  };
};

export default {
  CICLOS_ANIO_PERSONAL,
  calcularAnioPersonal
};
