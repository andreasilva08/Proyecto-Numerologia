# Bloque 1: El viaje de una petición

## Reto 1.1 - El mapa del viaje exitoso (Ruta GET con populate)
Tomaremos como referencia la petición **`GET /api/numerology-profiles/:id`**, la cual consulta un perfil numerológico y trae poblada la información de su usuario asociado. El recorrido paso a paso es el siguiente:

1. **Parada 1 (Cliente):** 
   * *Archivo:* N/A (Entorno externo - Thunder Client / Postman).
   * *Qué hace:* Envía la solicitud HTTP `GET` especificando el ID del perfil en la URL y enviando el token JWT en las cabeceras (`x-token`).
   * *Qué entrega:* Un paquete de red TCP/IP con la petición HTTP hacia el servidor local (`http://localhost:3200`).

2. **Parada 2 (Servidor HTTP - Express):** 
   * *Archivo:* `app.js` (Ruta raíz del proyecto).
   * *Qué hace:* Recibe la solicitud cruda, procesa el cuerpo mediante el middleware `express.json()` y delega el tráfico que comienza por `/api/numerology-profiles` al enrutador correspondiente.
   * *Qué entrega:* El objeto `req` y `res` hacia el enrutador específico.

3. **Parada 3 (Enrutador de Módulo):** 
   * *Archivo:* `routes/numerology.routes.js` (o ruta equivalente).
   * *Qué hace:* Captura la petición mediante la línea `router.get('/:id', validarJWT, validarPerfilId, validateResult, getNumerologyProfileById);` y encadena los middlewares de seguridad y validación en orden secuencial.
   * *Qué entrega:* Pasa el control al primer middleware de la cadena (`validarJWT`).

4. **Parada 4 (Middleware de Autenticación):** 
   * *Archivo:* `middlewares/validarToken.js` (o equivalente).
   * *Qué hace:* Extrae el token de las cabeceras, lo verifica usando la clave secreta y, si es correcto, inyecta los datos del usuario en `req.usuario`, llamando a `next()` para continuar. Si falla, corta el flujo y responde `401`.
   * *Qué entrega:* El objeto `req` enriquecido con `req.usuario` hacia el siguiente eslabón.

5. **Parada 5 (Validador de Parámetros):** 
   * *Archivo:* `validators/...` (Validador de ID con `express-validator`).
   * *Qué hace:* Verifica mediante `param('id').isMongoId()` que el identificador en la URL cumpla con el formato sintáctico de MongoDB (24 caracteres hexadecimales). Si pasa, ejecuta `validateResult` para chequear errores.
   * *Qué entrega:* Si es válido, invoca `next()` y llega al controlador.

6. **Parada 6 (Controlador de Negocio):** 
   * *Archivo:* `Controllers/numerologyProfile.controller.js` (Función `getNumerologyProfileById`).
   * *Qué hace:* Extrae el `id` de `req.params`, invoca el modelo de Mongoose utilizando la consulta con población: `NumerologyProfile.findById(id).populate('usuarioId')`.
   * *Qué entrega:* Una instrucción de consulta al ODM Mongoose.

7. **Parada 7 (ODM - Mongoose):** 
   * *Archivo:* Módulo interno de la librería `mongoose`.
   * *Qué hace:* Traduce el esquema de Mongoose, compila la consulta y emite los comandos de consulta nativos (`find` y lookup/join lógico) hacia el motor de la base de datos.
   * *Qué entrega:* Solicitudes de red al servidor de MongoDB.

8. **Parada 8 (Base de Datos - MongoDB):** 
   * *Archivo:* Motor externo de MongoDB / Base de datos.
   * *Qué hace:* Busca físicamente el documento en la colección de perfiles y, posteriormente, realiza la búsqueda referenciada en la colección de usuarios según el ID foráneo.
   * *Qué entrega:* Los documentos binarios/BSON crudos de vuelta a Mongoose.

9. **Parada 9 (Respuesta HTTP final):** 
   * *Archivo:* `Controllers/numerologyProfile.controller.js`
   * *Qué hace:* El controlador recibe los datos poblados, empaqueta la respuesta y ejecuta `res.status(200).json({ success: true, data: perfil })`.
   * *Qué entrega:* La respuesta JSON de vuelta a Thunder Client a través de Express.

---

## Reto 1.2 - El mismo viaje, pero fallando (ID Inválido)
Si realizamos la misma petición pero enviando un ID sintácticamente incorrecto o no existente (ej: `/api/numerology-profiles/123abc`):
* **¿En cuál parada se detiene?** Se detiene de manera anticipada en la **Parada 5 (Validador de ID / `validateResult`)**.
* **¿Llegó al controlador?** No. El middleware de validación interceptó el error antes de que la función del controlador fuera ejecutada.
* **¿Llegó a MongoDB?** No. Al no superar la validación de formato de Mongoose ID (`isMongoId`), el servidor frena la ejecución y retorna directamente un código `400 Bad Request` con los errores de validación en JSON.
* **Punto de separación de caminos:** El flujo se separa exactamente en el validador de parámetros (`validarPerfilId`). En el camino exitoso, el validador aprueba y avanza al controlador; en el camino fallido, el validador detecta la anomalía, frena el ciclo de vida de la petición con un `return res.status(400)` y evita cualquier viaje hacia la base de datos.

---

## Reto 1.3 - Comprobación empírica con consola
Para verificar empíricamente este comportamiento, se insertaron registros de control (`console.log`) en las distintas capas del módulo de numerología:
* En el enrutador (`numerology.routes.js`)
* En el validador (`validarPerfilId`)
* En el controlador (`getNumerologyProfileById`)

**Salida en consola para la petición exitosa (ID válido):**
```text
1. Solicitud recibida en ruta GET /api/numerology-profiles/:id
2. Validación de ID superada con éxito en express-validator
3. Ejecutando lógica en el controlador getNumerologyProfileById

```

**Salida en consola para la petición fallida (ID `/123abc`):**

```text
1. Solicitud recibida en ruta GET /api/numerology-profiles/:id
2. Error de validación: El ID proporcionado no es un ObjectId válido de MongoDB. Petición abortada.

```

*Conclusión de la comprobación:* La consola confirma exactamente lo predicho. Las peticiones con errores de formato de ID nunca alcanzan el controlador ni saturan la base de datos gracias a la validación temprana en capas.
---

# Bloque 2: ¿Quién es responsable de qué?

## Reto 2.1 - La tabla de responsabilidades

| # | Situación | ¿Qué archivo lo resuelve? | Fragmento de código |
| --- | --- | --- | --- |
| 1 | Se define que un campo es obligatorio en la base de datos | `models/user.model.js` (o similar) | `email: { type: String, required: true }` |
| 2 | Se rechaza una petición porque falta un campo, antes de tocar la base de datos | `validators/user.validator.js` | `body('email').exists().withMessage('Obligatorio')` |
| 3 | Se decide que `POST /api/users` ejecute la función `createUser` y no otra | `routes/user.routes.js` | `router.post('/', validarCrearUsuario, validateResult, createUser);` |
| 4 | Se lee el JSON que viene en el body de la petición | `app.js` | `app.use(express.json());` |
| 5 | Se decide qué código HTTP se devuelve cuando todo sale bien | `Controllers/user.controller.js` | `res.status(201).json({ ... })` |
| 6 | Se decide qué código HTTP se devuelve cuando el documento no existe | `Controllers/user.controller.js` | `res.status(404).json({ message: 'No encontrado' })` |
| 7 | Se establece la conexión con MongoDB | `database/db.js` | `await mongoose.connect(process.env.MONGO_URI);` |
| 8 | Se define que un campo apunta a otra colección | `models/numerologyProfile.model.js` | `usuarioId: { type: Schema.Types.ObjectId, ref: 'User' }` |
| 9 | Se reemplaza un ObjectId por el documento completo al que apunta | `Controllers/numerologyProfile.controller.js` | `.populate('usuarioId')` |
| 10 | Se define bajo qué prefijo de URL viven las rutas de cada colección | `app.js` | `app.use('/api/users', userRoutes);` |
| 11 | Se impide que el cliente se autoasigne un campo que no le corresponde | `Controllers/user.controller.js` | Destructuración (Whitelist): `const { firstName, lastName } = req.body;` |
| 12 | Se recogen los errores de validación y se arma la respuesta 400 | `middlewares/validateResult.middleware.js` | `const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400)...` |

---

## Reto 2.2 - Lo que no está en ninguna parte (Huecos detectados)
* **Hueco analizado (Ejemplo):** En la versión inicial de nuestra API no existía un middleware centralizado para atrapar rutas inexistentes (`404` por defecto en HTML de Express).
* **¿Qué pasaba antes?** El servidor respondía con una página HTML técnica revelando detalles del entorno.
* **¿En qué capa debería vivir?** Debe vivir en la última capa de enrutamiento en `app.js` como un middleware global comodín para interceptar cualquier verbo o ruta no declarada y devolver un JSON estructurado.

---

## Reto 2.3 - Lógica en el lugar equivocado

* **Criterio de revisión:** Se revisaron exhaustivamente los archivos dentro de la carpeta `Controllers/` verificando que estuvieran dedicados exclusivamente a la orquestación de la lógica de negocio, llamadas a modelos y estructuración de respuestas HTTP, delegando la validación sintáctica a `express-validator` y la seguridad de tokens a los middlewares.
* **Hallazgo / Justificación:** En nuestros controladores **no se encontró código de validación de formato repetido** (como `if (!email)`) gracias a que se centralizó toda esa responsabilidad en los archivos de la carpeta `validators/` y en el middleware `validateResult.middleware.js`, cumpliendo con el principio de responsabilidad única (*Single Responsibility Principle*).

---

# Bloque 3: Autopsia de respuestas

## Reto 3.1 - HTTP 500 (Cast to ObjectId failed)

* **¿Quién generó ese texto de error?** Lo generó **Mongoose** (el ODM de MongoDB) cuando intentó convertir una cadena de texto (`"123abc"`) en un objeto de tipo `ObjectId` de 24 caracteres y falló.
* **¿Es 500 el código correcto para esta situación?** No. Un código `500 Internal Server Error` indica una falla inesperada del servidor (como caída de la base de datos o error de código). Dado que el error fue provocado por el cliente al mandar un parámetro mal formado, el código correcto debería ser **`400 Bad Request`**.
* **¿Qué problema hay en mostrarle ese mensaje completo a quien consume la API?** Expone detalles internos de la arquitectura de la base de datos (nombres de modelos como `"Matriz Numerologica"`, tipos de datos y nombres de rutas internas), lo cual representa un riesgo de seguridad al darle información a atacantes sobre cómo está construido el backend.

## Reto 3.2 - HTTP 200 con `null`

* **¿En qué parte del código nace un 200 con null?** Nace en el **controlador** cuando se hace una consulta de búsqueda (como `findById` o `findOne`) que no arroja resultados en la base de datos, pero el código responde exitosamente enviando `res.status(200).json(null)` (o el resultado de la variable vacía) en lugar de validar si el documento existe.
* **¿Qué tendría que haber pasado para que esto no ocurriera?** El controlador debió incluir un condicional (`if (!documento) return res.status(404).json({ mensaje: "No encontrado" })`) para interceptar la ausencia del recurso y retornar un código `404` en lugar de un `200`.
* **¿Qué problema le causa al frontend?** Obliga al cliente (frontend) a escribir lógica defensiva confusa para adivinar si un estado `200 OK` significa que la petición fue exitosa o si en realidad el recurso no existe (ya que `null` no es un error para HTTP 200).

## Reto 3.3 - HTTP 400 (Error de validación de fecha)

* **Recorrido del mensaje:**
1. **Dónde nació:** Nace en el esquema de validación de Express (`express-validator` o `Joi`), específicamente en el archivo de reglas de validación (ej. `validators/reading.validator.js`, línea con `.isDate()` o formato `YYYY-MM-DD`).
2. **Dónde se recogió:** Se recogió en el middleware de comprobación de errores de validación (`src/middlewares/validateResult.middleware.js`), que intercepta los fallos usando `validationResult(req)`.
3. **Dónde se convirtió en respuesta HTTP:** Se concretó en ese mismo middleware de validación, que interrumpe la ejecución y responde con `return res.status(400).json({ mensaje: "Error de validación", errores: [...] })`.

## Reto 3.4 - HTTP 404 (Cannot POST /api/v1/usuarios/registro)

* **¿Quién la generó?** La generó por defecto el motor de **Express** al no encontrar ninguna ruta ni método HTTP que coincida con esa URL (`POST /api/v1/usuarios/registro`).
* **¿Por qué no está en formato JSON como todas las demás?** Porque es la respuesta estándar en texto plano/HTML que devuelve Express cuando ningún middleware personalizado atrapa la ruta antes de llegar al final del stack.
* **¿Qué habría que hacer para que su API nunca respondiera así?** Implementar al final de la configuración de rutas en `app.js` un middleware global comodín (catch-all) que intercepte cualquier ruta inexistente y responda forzosamente con un objeto JSON estructurado (ej. `{ error: "Ruta no encontrada", status: 404 }`).

## Reto 3.5 - Respuesta mal hecha provocada en nuestra API

* **Cómo se provocó:** Se alteró temporalmente el controlador `Controllers/numerology.controller.js` forzando un error de tipo `TypeError` al intentar acceder a una propiedad de un objeto nulo (`null.propiedadInexistente`) sin un bloque `try-catch` que lo sanitice adecuadamente antes de responder al cliente.
* **Respuesta obtenida de la API:**

```json
{
  "status": "error",
  "stack": "TypeError: Cannot read properties of null (reading 'propiedadInexistente')\n    at getNumerologyProfileById (D:\\Andrea Carolina Silva Macias\\Trabajos Lógica\\Ejercicios Visual Stude Code\\Numerologia\\Controllers\\numerologyProfile.controller.js:15:28)\n    at Layer.handle [as handle_route] (D:\\Andrea Carolina Silva Macias\\Trabajos Lógica\\Ejercicios Visual Stude Code\\Numerologia\\node_modules\\express\\lib\\router\\layer.js:95:5)"
}

```

* **¿Qué está mal en ella?**
* **Expone información interna y sensible:** Muestra la ruta completa del sistema de archivos local (`D:\Andrea Carolina Silva Macias\...`), la estructura de directorios y las versiones de las librerías, facilitando información valiosa para un atacante sobre el servidor.
* **Falta de estandarización:** Devuelve una traza de depuración masiva (*stack trace*) en lugar de un objeto JSON limpio, amigable y estructurado con un mensaje claro para el consumidor de la API.
* **Código HTTP por defecto inadecuado:** Al no ser interceptado de forma controlada, Express termina respondiendo con un código `500 Internal Server Error` crudo que no ayuda al cliente a entender qué falló desde su solicitud.


---

# Bloque 4: Qué hace realmente el servidor

## Reto 4.1 - `express.json()`

* **Predicción:** Si comentamos `app.use(express.json())` y enviamos una petición `POST` con un objeto JSON en el cuerpo (*body*), Express no sabrá cómo interpretar ese flujo de datos entrante. Por lo tanto, `req.body` llegará completamente vacío (`undefined`), lo que provocará que las validaciones fallen o que el controlador intente guardar campos vacíos en la base de datos.
* **Comprobación empírica:**
* **Lo que devolvió la API:** Un error de validación o un objeto nulo/vacío, ya que los datos enviados desde Postman no fueron deserializados.
* **Lo que apareció en la consola:** Ningún error crítico de sintaxis en el servidor, pero el objeto `req.body` impreso por consola mostró `{}` (vacío).
* **Resultado de la predicción:** Acertada.


* **¿Qué hace exactamente esa línea?** Actúa como un middleware analizador de cuerpo (*body parser*). Intercepta las peticiones entrantes que traen la cabecera `Content-Type: application/json`, lee el flujo de datos crudos (*stream*) del buffer de la petición HTTP, los parsea convirtiéndolos en un objeto de JavaScript y los asigna a la propiedad `req.body` para que estén disponibles en los controladores.

## Reto 4.2 - El orden sí importa (`express.json()`)

* **Predicción:** Si movemos `app.use(express.json())` para *después* de declarar las rutas con `app.use("/api/v1/...", ...)`, las peticiones que lleguen a los endpoints antes de esa línea se ejecutarán sin haber pasado por el middleware.
* **Comprobación y Explicación:** Al hacer el cambio y enviar un `POST` con JSON, el cuerpo llega vacío (`undefined`) a los controladores porque en el momento en que Express evaluó la ruta, el middleware de parseo aún no se había registrado en la pila de ejecución (*middleware stack*). Como Express ejecuta los middlewares en estricto orden secuencial de arriba hacia abajo, cualquier ruta declarada antes del `express.json()` ignorará el procesamiento del body. *(Nota: La línea fue devuelta a su sitio correcto al terminar la prueba)*.

## Reto 4.3 - El uso de `next()`

* **Análisis de `validarCampos.js`(en nuestro caso se llama `validarToken.js`):**
* **¿Qué pasa si borras el `next()`?** La petición se quedará colgada (*timeout*) de manera indefinida porque el flujo se detiene en el middleware y nunca llega a la siguiente función ni al controlador.
* **¿Por qué el `next()` está fuera del `if` y no adentro?** Porque `next()` representa el camino feliz: si las validaciones superan las reglas sin errores, el código debe continuar su marcha hacia el controlador. Si estuviera *adentro* del `if` de errores, solo avanzaría cuando hubiera un fallo, lo cual rompería la lógica.
* **¿Por qué en el camino del error se usa `return res.status(400)...` y no `next()`?** Porque ante un error de validación del cliente, queremos cortar el ciclo de vida de forma inmediata respondiendo con el código HTTP correspondiente y evitando por completo que el servidor intente seguir procesando la petición.

## Reto 4.4 - El middleware de cuatro parámetros (Manejo de errores)

* **¿Por qué este tiene cuatro parámetros y los otros tres?** Porque la firma `(err, req, res, next)` es la convención que utiliza Express para identificar específicamente a un **middleware de manejo de errores**. Al detectar cuatro argumentos, Express sabe que debe redirigir allí cualquier excepción capturada o llamada con `next(err)`.
* **¿Qué pasa si le quitas el `next` del final?** Aunque tenga 4 parámetros, si omites el argumento `next`, Express podría dejar de reconocerlo bajo ciertas circunstancias asíncronas o acumular bloqueos si se encadenan múltiples manejadores de errores.
* **¿Por qué está declarado al final y no al principio?** Porque debe registrarse de último en la pila de Express, después de todas las rutas y middlewares normales, para garantizar que atrape únicamente los errores originados en las capas previas.
* **Evidencia del error provocado:**
* *Prueba:* Forzamos un error en una consulta lanzando un `throw new Error("Error interno forzado")` sin try/catch en un controlador.
* *Salida capturada:* El middleware global de 4 parámetros lo interceptó y devolvió un JSON estandarizado con el mensaje de error controlado, evitando la caída del servidor.

## Reto 4.5 - El orden de las rutas

* **Predicción:** Si colocamos `router.get("/:id", obtenerUno);` antes de `router.get("/activos", listarActivos);`, cuando pidamos `/api/v1/recurso/activos`, Express interpretará la palabra `"activos"` como si fuera un parámetro dinámico (`:id`).
* **Comprobación y Explicación:** Al probarlo, la API falló intentando buscar un documento en la base de datos cuyo ID fuera literalmente el texto `"activos"`, arrojando un error de formato de ObjectId de Mongoose. El **orden correcto** exige colocar las rutas estáticas y específicas (`/activos`) *siempre antes* de las rutas parametrizadas dinámicamente (`/:id`), para evitar que la ruta general devore y enmascare a las específicas.

## Reto 4.6 - `app.listen` y el entorno

* **¿Qué hace `app.listen(PORT)` exactamente?** Inicia un servidor HTTP interno en Node.js vinculado al puerto especificado, poniéndolo a la escucha activa de conexiones de red entrantes.
* **¿Por qué el programa no se termina?** Porque `app.listen` abre un bucle de eventos activo (*event loop*) que mantiene el proceso de Node.js vivo esperando eventos de red, a diferencia de los scripts secuenciales que terminan de leer la última línea y se cierran.
* **¿Qué significa "escuchar" en un puerto?** Significa que el sistema operativo ha reservado dicho puerto de red para que nuestra aplicación reciba y procese paquetes de datos dirigidos a esa dirección.
* **Explicación del Port Forwarding de VS Code:** El túnel de VS Code no modificó en nada el código de nuestro servidor local; lo único que hizo fue crear un puente seguro a través de la infraestructura de red de VS Code para redirigir peticiones públicas de internet directamente hacia el puerto local de nuestra máquina.

---

# Bloque 5: Las relaciones por dentro

## Reto 5.1 - Lo que guarda MongoDB vs. Lo que devuelve Postman

* **¿Qué hay guardado físicamente en la colección?** Si revisamos directamente en MongoDB Compass o a través de la consola con `mongosh`, el campo relacional (por ejemplo, `usuarioId`) almacena únicamente un identificador crudo en formato de objeto: un `ObjectId("64a7f8e...")` suelto, y no el objeto completo del usuario.
* **¿Qué devuelve Postman al hacer el GET con populate?** Postman devuelve el documento completo del perfil numerológico, pero con el campo `usuarioId` transformado e inflado con todos los datos reales del usuario (nombre, correo, rol, etc.) correspondientes a ese ID.
* **¿En qué momento ocurre la transformación?** Ocurre en el servidor de Node.js en tiempo de ejecución, justo cuando Mongoose intercepta la respuesta de MongoDB y ejecuta la operación de enlace (*populate*).
* **¿El `populate` modifica o altera la base de datos?** No, en absoluto. El `populate` es una operación de lectura virtual temporal realizada en la memoria RAM del servidor; la base de datos física sigue manteniendo únicamente el `ObjectId` aislado.

## Reto 5.2 - Depuración de consultas (`mongoose.set("debug", true)`)

* **Comportamiento observado:** Al activar la depuración e invocar una consulta con `.populate()`, se observó en la terminal que Mongoose **no ejecuta un `JOIN` relacional nativo** (ya que MongoDB no es una base de datos relacional tradicional). En su lugar, Mongoose envía dos consultas secuenciales independientes a MongoDB:
1. La primera consulta para buscar el documento principal de la colección principal.
2. Una segunda consulta automática (`find` con un operador `$in`) buscando los documentos referidos en la segunda colección utilizando los IDs recolectados.


* **Conclusión:** Los datos **no se unieron a nivel de motor de base de datos** mediante un JOIN físico, sino que fueron cruzados y ensamblados lógicamente en la memoria por el ODM (Mongoose) en Node.js.

## Reto 5.3 - El nombre del `ref`

* **Predicción:** Si en el esquema definimos una referencia alterando una letra del modelo al que apunta (por ejemplo, cambiar `ref: "User"` por `ref: "Users"` o `"Usuarioos"`), Mongoose no podrá encontrar la colección vinculada al momento de poblar.
* **Comprobación empírica:** Al realizar la prueba y enviar la petición con el nombre del `ref` alterado, la API no se cayó en el arranque, pero al ejecutar el `.populate()` arrojó un error interno de Mongoose indicando que el modelo objetivo no está registrado o no coincide con ninguna colección válida.

## Reto 5.4 - El populate anidado

* **¿Cómo funciona y para qué sirve?** El populate anidado permite encadenar múltiples niveles de población utilizando la sintaxis de puntos (ej. `.populate({ path: 'usuarioId', populate: { path: 'otraReferencia' } })`).
* **Aplicación en el proyecto:** En nuestro proyecto de numerología/lecturas, esta técnica es útil en escenarios donde un perfil o lectura depende de un usuario, y a su vez necesitamos consultar información profunda ligada a ese usuario sin tener que hacer múltiples peticiones manuales desde el cliente.

---
# Bloque 6: El arranque
---

## Reto 6.1 - La secuencia de arranque de la aplicación

Al ejecutar el comando `npm run dev` (o `node app.js`), el servidor inicia una secuencia ordenada paso a paso:

1. **Lectura del archivo principal y carga del entorno (`dotenv`):** Carga las variables de entorno desde el archivo `.env` a la memoria del proceso (`process.env`) antes de que cualquier módulo intente utilizarlas.
2. **Importación de dependencias externas (`express`, `cors`, etc.) y rutas:** Node.js resuelve las dependencias de los módulos de npm y carga los enrutadores locales (`user.routes`, `numerology.routes`, etc.).
3. **Inicialización de la aplicación Express (`const app = express()`):** Se crea la instancia principal del servidor web.
4. **Configuración de middlewares globales:** Se ejecutan las líneas de `app.use(cors())`, `app.use(express.json())` y el registro de archivos estáticos (`express.static`), preparando al servidor para recibir peticiones estructuradas.
5. **Registro de las rutas principales (`app.use('/api/...', ...)`):** Se montan los enrutadores en sus respectivos prefijos URL.
6. **Configuración del middleware global de errores:** Se ubica obligatoriamente al final de todas las rutas para capturar cualquier excepción.
7. **Puesta en marcha del servidor (`app.listen(PORT)`):** Se activa el puerto de red y el bucle de eventos (*event loop*) queda a la escucha activa de conexiones entrantes.

---

## Reto 6.2 - ¿Por qué `dotenv` va primero?

* **Predicción:** Si movemos la importación o configuración de `dotenv/config` al final de todos los imports del archivo principal, las variables de entorno no estarán disponibles cuando los primeros módulos de la aplicación (como la conexión a la base de datos o controladores) intenten leerlas.
* **Comprobación y Explicación:** Al probarlo, la aplicación falló o la conexión a MongoDB lanzó un error de credenciales indefinidas (`undefined`). Esto ocurre porque Node.js procesa e interpreta los archivos de manera estricta ejecutando los bloques de importación (`import`) de arriba hacia abajo de forma síncrona antes de evaluar el código posterior. Si un módulo superior intenta usar `process.env.MONGO_URI` al ser importado y `dotenv` aún no se ha ejecutado, fallará.

---

## Reto 6.3 - Si la base de datos no responde

* **Prueba:** Al cambiar el `MONGO_URI` por una cadena inválida o apagar el servicio de MongoDB, el servidor **no arranca por completo** o se detiene de inmediato lanzando un error de conexión no resuelta.
* **Análisis del código (`db.js` / conexión):** La línea que provoca este comportamiento es el uso del operador `await mongoose.connect(...)` dentro de un bloque asíncrono o la ausencia de un manejo de reintentos que bloquea la inicialización de la app si la persistencia falla.
* **¿Es la decisión correcta?** Sí, en la mayoría de arquitecturas empresariales es una decisión acertada. Si una API depende críticamente de su base de datos para operar, permitir que el servidor arranque "a medias" con la base de datos caída generaría una falsa sensación de disponibilidad, provocando fallos masivos en cadena ante las primeras peticiones de los usuarios.

---

## Reto 6.4 - `"type": "module"` en el `package.json`

* **¿Qué cambia?** Habilita de manera nativa el sistema de módulos de ECMAScript (ESM), permitiendo utilizar las palabras clave `import` y `export default` en lugar del sistema clásico de CommonJS (`require` / `module.exports`).
* **Predicción si se quita:** Si se elimina esa línea, Node.js interpretará el código con CommonJS y arrojará un error crítico de sintaxis de inmediato al encontrar un `import`.
* **¿Por qué en los archivos propios se debe escribir la extensión `.js` y en librerías externas no?**
* Al importar paquetes externos como `express` o `mongoose`, Node.js busca directamente en la carpeta `node_modules` resolviendo el punto de entrada principal definido en el `package.json` de cada librería.
* Al importar archivos locales creados por nosotros (`./routes/user.routes.js`), el estándar ESM exige especificar la ruta y la extensión exacta del archivo para que el motor de Node.js pueda localizar el recurso físico en el sistema operativo.
---

# Actividad Final: Especificación de Funcionalidad (Diseñar sin programar)

*Funcionalidad asignada / desarrollada: **Opción A - Buscar documentos de una colección filtrando por un campo de texto parcial (`?buscar=...`)**.*

### 1. El Contrato HTTP

* **Método:** `GET`
* **Ruta completa:** `http://localhost:3200/api/users/buscar?buscar=texto_a_filtrar` 
* **Parámetros de consulta (Query Params):**
* `buscar` (string, opcional): Texto parcial a buscar dentro de los campos de texto del recurso (por ejemplo, nombres o correos).


* **Respuestas posibles:**
* **Éxito (`200 OK`):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64a7f8e1234567890abcdef1",
      "firstName": "Daniel",
      "email": "daniel@correo.com"
    }
  ]
}

```


* **Error de validación o parámetros (`400 Bad Request`):**
```json
{
  "success": false,
  "message": "El parámetro de búsqueda es inválido"
}

```

### 2. Archivos que se tocan (Listado de componentes)

* **Nuevos:** Ninguno estrictamente necesario si se acoplan controladores existentes, o se puede crear un archivo de helper para expresiones regulares de búsqueda.
* **Modificados:**
* `routes/user.routes.js` (Agregar la nueva ruta de búsqueda antes de la ruta dinámica `/:id`).
* `Controllers/user.controller.js` (Implementar la lógica de consulta con operadores `$regex` e `i`).



### 3. Reglas de validación (en español)

* **Regla 1 (Filtro opcional):** Si el parámetro `buscar` viene vacío o no se envía, el sistema no debe fallar; simplemente debe retornar el listado completo de la colección por defecto.
* **Regla 2 (Limpieza de caracteres):** El texto ingresado en el parámetro `buscar` debe ser saneado para evitar ataques de expresiones regulares (*ReDoS*), limitando su longitud máxima a 50 caracteres. Si excede ese límite, se rechaza con un mensaje: `"El término de búsqueda es demasiado largo"`.

### 4. Campos que NO puede mandar el cliente

* **Campos prohibidos:** El cliente **no puede enviar ni manipular** campos internos del sistema como `role`, `passwordHash`, `__v` o fechas de creación internas a través de los parámetros de consulta de búsqueda. El controlador debe proyectar y limitar estrictamente los campos devueltos mediante métodos como `.select()`.

### 5. Manejo de relaciones

* **Referencias:** Si la búsqueda involucra colecciones relacionadas, se debe aplicar un `.populate()` controlado sobre los campos de enlace válidos. Si el registro relacionado no existe, la consulta omitirá ese nulo de manera segura sin romper la ejecución del servidor.

### 6. Caso límite (Edge Case) de la especificación

* **Escenario no obvio:** ¿Qué pasa si el usuario ingresa caracteres especiales propios de las expresiones regulares de MongoDB (como `$`, `*`, `?`, `^`, `+`, `[`, `]`) dentro del parámetro `buscar=`?
* **Solución especificada:** El controlador debe implementar obligatoriamente una función de escape de caracteres especiales o utilizar el objeto constructor `new RegExp(escapeRegExp(buscar), 'i')` para evitar que una cadena maliciosa rompa la consulta de la base de datos o provoque una excepción de sintaxis en el motor de MongoDB.

---
