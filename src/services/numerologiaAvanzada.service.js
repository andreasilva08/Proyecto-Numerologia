import { reducirNumero, TABLA_PITAGORICA } from './expresion.service.js';

export class NumerologyInputError extends Error {}

const obtenerComponentesFecha = (fechaNacimiento) => {
  if (typeof fechaNacimiento !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimiento)) {
    throw new NumerologyInputError('La fecha debe tener el formato YYYY-MM-DD.');
  }

  const [anio, mes, dia] = fechaNacimiento.split('-').map(Number);
  const fechaUTC = new Date(0);
  fechaUTC.setUTCHours(0, 0, 0, 0);
  fechaUTC.setUTCFullYear(anio, mes - 1, dia);
  if (
    anio < 1 ||
    Number.isNaN(fechaUTC.getTime()) ||
    fechaUTC.getUTCFullYear() !== anio ||
    fechaUTC.getUTCMonth() + 1 !== mes ||
    fechaUTC.getUTCDate() !== dia
  ) {
    throw new NumerologyInputError('La fecha de nacimiento no es válida.');
  }
  if (fechaUTC.getTime() > Date.now()) {
    throw new NumerologyInputError('La fecha de nacimiento no puede ser futura.');
  }

  return { dia, mes, anio };
};

const normalizarNombre = (nombre) => nombre
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toUpperCase();

const valoresDeLetras = (texto) => [...normalizarNombre(texto)]
  .filter((caracter) => Object.hasOwn(TABLA_PITAGORICA, caracter))
  .map((caracter) => ({ caracter, valor: TABLA_PITAGORICA[caracter] }));

export const calcularPinaculos = (fechaNacimiento) => {
  const { dia, mes, anio } = obtenerComponentesFecha(fechaNacimiento);
  const caminoDeVida = reducirNumero(
    reducirNumero(dia, false) + reducirNumero(mes, false) + reducirNumero(anio, false),
    true
  );
  const primerFin = 36 - reducirNumero(caminoDeVida, false);
  const segundoInicio = primerFin + 1;
  const segundoFin = segundoInicio + 8;
  const tercerInicio = segundoFin + 1;
  const tercerFin = tercerInicio + 8;
  const primerPinaculo = reducirNumero(mes + dia, true);
  const segundoPinaculo = reducirNumero(dia + reducirNumero(anio, false), true);

  const pinaculos = [
    { numero: primerPinaculo, edadDesde: 0, edadHasta: primerFin },
    { numero: segundoPinaculo, edadDesde: segundoInicio, edadHasta: segundoFin },
    { numero: reducirNumero(primerPinaculo + segundoPinaculo, true), edadDesde: tercerInicio, edadHasta: tercerFin },
    { numero: reducirNumero(mes + reducirNumero(anio, false), true), edadDesde: tercerFin + 1, edadHasta: null }
  ];

  return { caminoDeVida, pinaculos };
};

export const analizarMatrizKarmica = (nombreCompleto) => {
  const letras = valoresDeLetras(nombreCompleto);
  if (letras.length === 0) throw new NumerologyInputError('El nombre debe contener letras válidas.');

  const numerosPresentes = [...new Set(letras.map(({ valor }) => valor))].sort((a, b) => a - b);
  const numerosKarmicos = Array.from({ length: 9 }, (_, index) => index + 1)
    .filter((numero) => !numerosPresentes.includes(numero));

  return {
    nombreAnalizado: nombreCompleto.trim(),
    totalLetras: letras.length,
    numerosPresentes,
    numerosKarmicos
  };
};

export const calcularHerencia = (apellidos) => {
  const desglose = valoresDeLetras(apellidos);
  if (desglose.length === 0) throw new NumerologyInputError('Los apellidos deben contener letras válidas.');

  const sumaTotal = desglose.reduce((total, { valor }) => total + valor, 0);
  return {
    apellidosAnalizados: apellidos.trim(),
    desglose,
    sumaTotal,
    numeroHerencia: reducirNumero(sumaTotal, true)
  };
};

export const calcularCompatibilidad = (fechaNacimiento1, fechaNacimiento2) => {
  const calcularCamino = (fecha) => {
    const { dia, mes, anio } = obtenerComponentesFecha(fecha);
    return reducirNumero(
      reducirNumero(dia, false) + reducirNumero(mes, false) + reducirNumero(anio, false),
      true
    );
  };

  const caminoDeVida1 = calcularCamino(fechaNacimiento1);
  const caminoDeVida2 = calcularCamino(fechaNacimiento2);
  const vibracion1 = reducirNumero(caminoDeVida1, false);
  const vibracion2 = reducirNumero(caminoDeVida2, false);
  const distancia = Math.min(
    Math.abs(vibracion1 - vibracion2),
    9 - Math.abs(vibracion1 - vibracion2)
  );
  const porcentaje = 100 - distancia * 12.5;

  let descripcion;
  if (porcentaje >= 87.5) {
    descripcion = 'Afinidad numerológica alta: sus caminos comparten una vibración cercana.';
  } else if (porcentaje >= 62.5) {
    descripcion = 'Afinidad numerológica moderada: las diferencias pueden complementarse con diálogo.';
  } else {
    descripcion = 'Afinidad numerológica desafiante: sus ritmos son distintos y ofrecen oportunidades de aprendizaje.';
  }

  return { caminoDeVida1, caminoDeVida2, distancia, porcentaje, descripcion };
};

export default {
  calcularPinaculos,
  analizarMatrizKarmica,
  calcularHerencia,
  calcularCompatibilidad
};
