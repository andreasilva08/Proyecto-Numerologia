import {
  calcularPinaculos,
  analizarMatrizKarmica,
  calcularHerencia,
  calcularCompatibilidad,
  NumerologyInputError
} from '../services/numerologiaAvanzada.service.js';

const responderCalculo = (res, message, data) => res.status(200).json({
  status: 'success',
  message,
  data
});

const responderError = (res, error, operation) => {
  console.error(`[Error en ${operation}]:`, error);
  const esErrorDeEntrada = error instanceof NumerologyInputError;
  return res.status(esErrorDeEntrada ? 422 : 500).json({
    status: 'error',
    message: esErrorDeEntrada
      ? error.message
      : 'Ocurrió un error interno al realizar el cálculo.'
  });
};

export const calcularPinaculosController = (req, res) => {
  try {
    return responderCalculo(
      res,
      'Cálculo de pináculos realizado exitosamente.',
      calcularPinaculos(req.body.fechaNacimiento)
    );
  } catch (error) {
    return responderError(res, error, 'calcularPinaculosController');
  }
};

export const analizarMatrizKarmicaController = (req, res) => {
  try {
    return responderCalculo(
      res,
      'Análisis de matriz kármica realizado exitosamente.',
      analizarMatrizKarmica(req.body.nombreCompleto)
    );
  } catch (error) {
    return responderError(res, error, 'analizarMatrizKarmicaController');
  }
};

export const calcularHerenciaController = (req, res) => {
  try {
    return responderCalculo(
      res,
      'Cálculo de herencia realizado exitosamente.',
      calcularHerencia(req.body.apellidos)
    );
  } catch (error) {
    return responderError(res, error, 'calcularHerenciaController');
  }
};

export const calcularCompatibilidadController = (req, res) => {
  try {
    return responderCalculo(
      res,
      'Compatibilidad numerológica calculada exitosamente.',
      calcularCompatibilidad(req.body.fechaNacimiento1, req.body.fechaNacimiento2)
    );
  } catch (error) {
    return responderError(res, error, 'calcularCompatibilidadController');
  }
};
