import { body } from 'express-validator';

const validarFecha = (campo) => body(campo)
  .exists({ checkFalsy: true })
  .withMessage(`El campo ${campo} es obligatorio.`)
  .bail()
  .isString()
  .withMessage(`El campo ${campo} debe ser una fecha de texto.`)
  .bail()
  .matches(/^\d{4}-\d{2}-\d{2}$/)
  .withMessage(`El campo ${campo} debe tener el formato YYYY-MM-DD.`)
  .bail()
  .custom((valor) => {
    const [anio, mes, dia] = valor.split('-').map(Number);
    const fecha = new Date(0);
    fecha.setUTCHours(0, 0, 0, 0);
    fecha.setUTCFullYear(anio, mes - 1, dia);
    if (
      anio < 1 ||
      Number.isNaN(fecha.getTime()) ||
      fecha.getUTCFullYear() !== anio ||
      fecha.getUTCMonth() + 1 !== mes ||
      fecha.getUTCDate() !== dia
    ) {
      throw new Error(`El campo ${campo} no contiene una fecha válida.`);
    }
    if (fecha.getTime() > Date.now()) {
      throw new Error(`El campo ${campo} no puede ser una fecha futura.`);
    }
    return true;
  });

const validarTexto = (campo, etiqueta) => body(campo)
  .exists({ checkFalsy: true })
  .withMessage(`El campo ${etiqueta} es obligatorio.`)
  .bail()
  .isString()
  .withMessage(`El campo ${etiqueta} debe ser texto.`)
  .bail()
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage(`El campo ${etiqueta} debe tener entre 1 y 100 caracteres.`)
  .bail()
  .matches(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/)
  .withMessage(`El campo ${etiqueta} solo puede contener letras, espacios, apóstrofes y guiones.`);

export const validarPinaculos = [validarFecha('fechaNacimiento')];
export const validarMatrizKarmica = [validarTexto('nombreCompleto', 'nombreCompleto')];
export const validarHerencia = [validarTexto('apellidos', 'apellidos')];
export const validarCompatibilidad = [
  validarFecha('fechaNacimiento1'),
  validarFecha('fechaNacimiento2')
];
