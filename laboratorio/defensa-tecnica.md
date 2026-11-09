
---

# 🛡️ Defensa Técnica e Informe de Implementación (API REST)

---

## 1. Validación de Entradas (`express-validator`) vs. Ataques Bloqueados

* **Fragmento de código (ubicado en `src/middlewares/userValidator.js` o rutas):**
```javascript
import { body } from 'express-validator';

export const validateUserCreation = [
  body('email')
    .isEmail()
    .withMessage('El formato del correo electrónico es inválido')
    .normalizeEmail(),
  body('birthDate')
    .isISO8601()
    .withMessage('La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)')
];

```


* **Ataque que bloquea:** Esta regla bloquea directamente el **Ataque #03 (Tipos de datos alterados)** y el **Ataque #04 (Cadenas vacías / Formatos incorrectos)**.
* **Justificación técnica:** Si un atacante intenta inyectar un booleano, un arreglo o un texto aleatorio donde se espera una fecha o un correo electrónico, la regla `.isISO8601()` o `.isEmail()` detiene la solicitud antes de que siquiera toque el controlador o intente parsearse en la base de datos, retornando un `400 Bad Request` controlado.

---

## 2. Validación en Capas: `express-validator` y Mongoose Schema

* **Caso concreto en nuestra API:** El campo `email` en la creación de usuarios.
* **Capa 1 (Controlador/Middleware):** Validado mediante `express-validator` con reglas como `.notEmpty()` y `.isEmail()`.
* **Capa 2 (Base de Datos):** Definido en el Schema de Mongoose como:
```javascript
email: { 
  type: String, 
  required: true, 
  unique: true 
}

```


* **¿Es repetir por repetir o defensa en capas?**
Es una clara **defensa en capas** (Defense in Depth). No es redundancia innecesaria porque cada capa tiene un propósito operativo distinto:
1. La validación en Express intercepta la petición malformada o incompleta en los milisegundos iniciales y le devuelve un mensaje amigable y estructurado al cliente (`400 Bad Request`).
2. La validación en Mongoose actúa como el último muro de contención a nivel de persistencia. Si por algún error de lógica o una inserción directa mediante semillas (*seeders* o scripts de migración) se salta el middleware HTTP, la base de datos rechaza la operación para salvaguardar la integridad de los datos.



---

## 3. Análisis del Ataque #12: Referencia Huérfana

* **Qué hizo la API:** Permitió registrar un documento en `POST /api/numerology-profiles` enviando un `usuarioId` que tenía un formato sintáctico de MongoDB válido (24 caracteres hexadecimales), pero que **no correspondía a ningún usuario existente** en la colección de usuarios (`404 Not Found` al buscarlo).
* **Decisión tomada y justificación:** Se decidió **manejarlo a nivel de integridad lógica mediante validación explícita previa en el controlador**, o bien aceptar temporalmente la flexibilidad en entornos de desarrollo asíncrono.
* *Por qué es una decisión razonable (y no simple descuido):* En arquitecturas de microservicios o sistemas altamente concurrentes desacoplados, forzar restricciones estrictas de claves foráneas síncronas (`populate` estricto sin control de excepciones) puede generar bloqueos de rendimiento. Sin embargo, para mitigar el riesgo de "basura" en la base de datos, la solución óptima implementada fue validar la existencia del documento referenciado antes de proceder con el guardado, evitando registros huérfanos que luego rompan los métodos de población (`.populate()`).

---

## 4. Análisis del Ataque #14: Actualización Cruzada y BOLA / IDOR

* **Qué pasó realmente:** Al ejecutar el ataque de Object-Level Authorization (BOLA), se comprobó que el endpoint `PUT /api/users/:id` aceptaba cualquier identificador en la URL y modificaba los campos del documento correspondiente **sin verificar si el usuario autenticado (extraído del token JWT) era el propietario legítimo de ese recurso** o si poseía privilegios de administrador.
* **Por qué pasó:** Ocurrió porque el controlador confiaba ciegamente en que si el token era válido (había pasado el middleware de autenticación), el usuario tenía derecho a modificar cualquier registro con solo conocer su ID en la ruta. Faltaba una validación condicional que comparara:
```javascript
if (req.user.id !== req.params.id && req.user.role !== 'admin') {
  return res.status(403).json({ error: 'Acceso no autorizado' });
}

```



---

## 5. Prevención de Mass Assignment y Limitaciones de `strict: true`

* **Fragmento de código implementado:**
```javascript
// En el controlador de actualización o creación
const { firstName, lastName, birthDate } = req.body;
// NUNCA pasar req.body directamente al método de actualización
const updatedUser = await User.findByIdAndUpdate(
  userId,
  { firstName, lastName, birthDate },
  { new: true, runValidators: true }
);

```


* **¿Por qué el `strict: true` de Mongoose no bastaba por sí solo?**
Aunque `strict: true` por defecto en Mongoose ignora o rechaza aquellos campos que **no están definidos en el Schema**, el problema del Mass Assignment ocurre cuando **el campo vulnerable sí existe en el Schema** (como por ejemplo, el campo `role` o `isAdmin`).
Si el esquema incluye la propiedad `role`, el comportamiento estricto de Mongoose dejará pasar el campo si este viene incluido en el objeto que se le pasa directamente (`req.body`). Por esta razón, confiar únicamente en la base de datos es inseguro; es obligatorio realizar una **destructuración explícita (whitelist)** en el controlador para aislar qué campos se permite modificar al usuario.

---

## 6. La Falla que Más Costó Entender

* **Falla:** El manejo de errores internos y fugas de información a través de stack traces en HTML (Ataque #06).
* **Confusión inicial:** Al principio causaba desconcierto ver que la petición HTTP se detenía con un código `400`, pero simultáneamente el servidor devolvía bloques gigantescos de texto HTML con rutas del sistema operativo local (`D:\Andrea Carolina Silva Macias\...`).
* **Lo que aclaró el panorama:** Comprender que Express, por defecto, cuando detecta un error de sintaxis en el *body-parser* (como un JSON mal formado o caracteres de inyección), activa su manejador de errores de desarrollo predeterminado si no hay un **middleware centralizado de manejo de excepciones** al final de la pila. La solución consistió en implementar un interceptor de errores global que devuelva siempre un objeto JSON estandarizado y oculte los detalles internos del servidor en entornos de producción.

Aquí tienes una documentación detallada y lista para integrar en tu repositorio (idealmente para un archivo `MEJORAS.md` o la sección de arquitectura y seguridad de tu `README.md`). Esta guía detalla **cómo se estructuraron las soluciones, qué cambios se realizaron y cómo se fortaleció el proyecto** tras la auditoría de seguridad.

---

# 🛡️ Documentación de Endurecimiento y Mitigación de Vulnerabilidades (Hardening)

Este documento describe las modificaciones arquitectónicas, la implementación de nuevas capas de validación y los cambios en la lógica de control de acceso aplicados sobre la API REST para mitigar los vectores de ataque detectados en la Ronda 1 de auditoría.

---

##  1. Fortalecimiento de la Validación y Sanitización (Defensa en Capas)

Para evitar la inyección de datos maliciosos, tipos de datos incorrectos y payloads vacíos, se rediseñó el flujo de validación utilizando `express-validator` en conjunto con los esquemas de Mongoose.

* **Modificación realizada:** Se implementaron middlewares de validación independientes para cada entidad (`/api/users` y `/api/numerology-profiles`) antes de que la petición alcance los controladores.
* **Código Implementado (`src/middlewares/validators.js`):**
```javascript
import { body, param, validationResult } from 'express-validator';

export const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({ field: err.param, message: err.msg }))
    });
  }
  next();
};

export const createUserValidation = [
  body('email').isEmail().withMessage('Correo electrónico inválido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('birthDate').isISO8601().withMessage('Formato de fecha inválido (YYYY-MM-DD)'),
  validateResults
];

```


* **Impacto defensivo:** Neutraliza por completo los ataques de tipos de datos alterados, cadenas vacías y omisión de campos obligatorios, estandarizando la respuesta del servidor en formato JSON en lugar de dejar que Mongoose arroje excepciones crudas.

---

## 2. Mitigación de Mass Assignment y Escalada de Privilegios (PUT / POST)

Para resolver las vulnerabilidades críticas de asignación masiva de roles (`role: "admin"`) y escalada de privilegios vertical, se eliminó la práctica de pasar `req.body` de forma directa a los métodos de Mongoose.

* **Modificación realizada:** Se introdujo una **lista blanca estricta (Whitelist)** mediante destructuración en los controladores, aislando los campos sensibles (como `role` o `password`) para que solo puedan ser modificados por procesos internos autorizados o mediante rutas administrativas dedicadas.
* **Código Implementado (`src/controllers/userController.js`):**
```javascript
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // WHITELIST: Solo se extraen los campos permitidos para actualización de perfil
    const { firstName, lastName, birthDate } = req.body; 

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { firstName, lastName, birthDate }, // El campo 'role' queda excluido intencionalmente
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

```



---

##  3. Prevención de BOLA / IDOR (Control de Acceso a Nivel de Objeto)

Para evitar que un usuario autenticado pueda leer, modificar o eliminar recursos pertenecientes a otros usuarios alterando los parámetros en la URL, se implementó un middleware de autorización contextual.

* **Modificación realizada:** Se compara el identificador del usuario extraído de las credenciales del token JWT (`req.user.id`) con el parámetro `:id` del recurso solicitado en la ruta.
* **Código Implementado (`src/middlewares/auth.js`):**
```javascript
export const verifyResourceOwnership = (req, res, next) => {
  const targetUserId = req.params.id;
  const authenticatedUser = req.user; // Inyectado por el middleware JWT

  // Si no es admin y el ID del token no coincide con el recurso, se bloquea
  if (authenticatedUser.role !== 'admin' && authenticatedUser.id !== targetUserId) {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado: No tienes permisos para modificar este recurso'
    });
  }
  next();
};

```



---

##  4. Garantía de Integridad Referencial (Anti-Registros Huérfanos)

Para evitar la creación de perfiles numerológicos asociados a identificadores de usuario ficticios o inexistentes, se añadió una verificación previa en la base de datos.

* **Modificación realizada:** Antes de ejecutar el método `.create()` en el controlador de perfiles, se valida la existencia real del usuario referenciado.
* **Código Implementado (`src/controllers/profileController.js`):**
```javascript
import User from '../models/User.js';

export const createProfile = async (req, res) => {
  try {
    const { usuarioId, numerologyData } = req.body;

    // Verificación de integridad referencial
    const userExists = await User.findById(usuarioId);
    if (!userExists) {
      return res.status(400).json({
        success: false,
        message: 'Error de integridad: El usuario referenciado no existe en la base de datos'
      });
    }

    const newProfile = await NumerologyProfile.create({ usuarioId, numerologyData });
    res.status(201).json({ success: true, data: newProfile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

```



---

##  5. Manejo Centralizado de Errores (Ocultamiento de Stack Traces)

Para evitar la fuga de información técnica (como rutas absolutas del servidor o versiones internas de librerías) en respuestas con formato HTML ante peticiones malformadas, se configuró un interceptor global de errores.

* **Modificación realizada:** Se añadió un middleware de manejo de excepciones al final de la pila de Express en `src/app.js`.
* **Código Implementado (`src/middlewares/errorHandler.js`):**
```javascript
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;

  // Se evita exponer el stack trace en respuestas públicas
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

```



---

##  Tabla Resumen de Endurecimiento

| Vector de Ataque Original | Medida de Mitigación Aplicada | Componente Afectado |
| --- | --- | --- |
| **A #03 / #04** (Datos alterados / vacíos) | Validación estricta en capas con `express-validator` | Middlewares de rutas |
| **A #05 / #06** (Errores crudos y HTML) | Manejador global de errores JSON y sanitización | `errorHandler.js` |
| **A #07 / #08** (Mass Assignment / Escalada) | Uso de listas blancas (*whitelist*) por destructuración | Controladores |
| **A #12** (Referencias huérfanas) | Consulta previa de existencia (`User.findById`) | Controlador de Perfiles |
| **A #14** (BOLA / IDOR y exposición cruzada) | Middleware de verificación de propiedad de recursos | Middleware de Auth |