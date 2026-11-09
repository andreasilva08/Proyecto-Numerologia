
---

# Informe de Pruebas de Vulnerabilidad y Seguridad en API REST

**Integrantes del equipo a quien se le hizo el ataque:**

* Silvia Daniela Figueroa 
* Yurley Tatiana Gómez Aparicio

---

## Resumen de Ejecución

Durante la auditoría técnica se ejecutaron 14 pruebas de ataque/estrés sobre los endpoints de la API REST para evaluar la solidez del manejo de errores, la validación de entrada con `express-validator` y la integridad referencial en MongoDB/Mongoose.

### Métricas Generales

* **Ataques Defendidos:** 7 (#01, #02, #04, #06, #09, #10, #14)
* **Vulnerabilidades Detectadas:** 7 (#03, #05, #07, #08, #11, #12, #13)
* **Total de Vectores Evaluados:** 14

---

## Clasificación de Hallazgos por Severidad

### Crítico (Riesgo de corrupción de datos e integridad rota)

* **Ataque #05 (Enum inventado):** Permite guardar roles o estados no contemplados en las reglas del negocio.
* **Ataque #12 (Referencia a la nada):** Permite registrar lecturas/perfiles apuntando a un `usuario_id` que no existe.
* **Ataque #13 (Borrado sin cascada):** Elimina usuarios dejando documentos hijos huérfanos (`usuario_id` resuelve como `null` en `populate`).

### Grave (Falta de saneamiento y asignación masiva de atributos)

* **Ataque #03 (Coerción implícita de tipos):** Acepta números o booleanos en campos de texto/fecha sin lanzar error de tipo.
* **Ataque #07 (Mass Assignment en POST):** El controlador recibe `req.body` directo sin desestructurar o aplicar *whitelist*.
* **Ataque #08 (Mass Assignment en PUT):** Permite la inyección de atributos no autorizados durante la actualización.

### Menor (Formato e inconsistencia en respuestas HTTP)

* **Ataque #11 (Método/Ruta no implementada):** Responde con el HTML predeterminado de Express (`Cannot DELETE /...`) en lugar de un JSON estructurado.

---

## Detalle de Pruebas Ejecutadas

### Ataque #01: Omisión de Campos Obligatorios

* **Endpoint:** `POST /api/usuarios`
* **Body enviado:**
```json
{
  "nombre": "Prueba Incompleta"
}

```


* **Respuesta HTTP:** `400 Bad Request`
* **Estado:** **DEFENDIDO**
* **Análisis:** La capa middleware interceptó la solicitud mediante `express-validator`. Se retornaron los mensajes de error configurados para cada campo faltante (`nombreCompleto`, `email`, `passwordHash`, `fechaNacimiento`), evitando llamadas al controlador o fallos directos desde la base de datos.

---

### Ataque #02: Payload Totalmente Vacío

* **Endpoint:** `POST /api/usuarios`
* **Body enviado:** `{}`
* **Respuesta HTTP:** `400 Bad Request`
* **Estado:** **DEFENDIDO**
* **Análisis:** El envío de un objeto JSON vacío fue capturado por las reglas de presencia de los esquemas de validación, respondiendo ordenadamente con una lista de los parámetros requeridos.

---

### Ataque #03: Inyección de Tipos de Datos Alterados

* **Endpoint:** `POST /api/usuarios`
* **Body enviado:**
```json
{
  "nombreCompleto": 12345,
  "email": true,
  "passwordHash": 987654,
  "fechaNacimiento": 20260921
}

```


* **Respuesta HTTP:** `400 Bad Request` *(Solo rechazó el email)*
* **Estado:** **VULNERABLE**
* **Análisis:** Aunque la API respondió con un `400`, el middleware solo rechazó el campo `email` por fallo de sintaxis `@`. Los datos de `nombreCompleto`, `passwordHash` y `fechaNacimiento` pasaron la validación al ser casteados o ignorados como tipos no válidos. Falta incluir encadenamientos explícitos como `.isString()` o `.isISO8601()`.

---

### Ataque #04: Cadenas compuestas únicamente por espacios

* **Endpoint:** `POST /api/usuarios`
* **Body enviado:**
```json
{
  "nombreCompleto": "   ",
  "email": "usuario@test.com",
  "passwordHash": "123456",
  "fechaNacimiento": "2000-01-01"
}

```


* **Respuesta HTTP:** `400 Bad Request`
* **Estado:** **DEFENDIDO**
* **Análisis:** El uso del sanitizador `.trim()` antes del chequeo de longitud impidió que el registro almacenara cadenas vacías compuestas solo por espacios en blanco.

---

### Ataque #05: Inyección de Valores fuera de Enum

* **Endpoint:** `POST /api/usuarios`
* **Body enviado:**
```json
{
  "nombreCompleto": "Juan Perez",
  "email": "juan.enum@test.com",
  "passwordHash": "123456",
  "fechaNacimiento": "2000-01-01",
  "rol": "HACKER_SUPER_ADMIN"
}

```


* **Respuesta HTTP:** `201 Created`
* **Estado:** **VULNERABLE**
* **Análisis:** La API guardó la entidad omitiendo la verificación del campo `rol`. No se cuenta con una regla `.isIn([...])` en el validador ni con una restricción `enum` estricta a nivel de esquema en Mongoose para filtrar roles no autorizados.

---

### Ataque #06: Desbordamiento de Cadena de Texto

* **Endpoint:** `POST /api/usuarios`
* **Body enviado:** *(Cadena de más de 200 caracteres en `nombreCompleto`)*
* **Respuesta HTTP:** `400 Bad Request`
* **Estado:** **DEFENDIDO**
* **Análisis:** El middleware aplicó correctamente la restricción de longitud máxima (`.isLength({ max: 100 })`), deteniendo el procesamiento antes de impactar el almacenamiento.

---

### Ataque #07: Mass Assignment en Creación (POST)

* **Endpoint:** `POST /api/usuarios`
* **Body enviado:**
```json
{
  "nombreCompleto": "Usuario Hacker",
  "email": "hacker.post@test.com",
  "passwordHash": "123456",
  "fechaNacimiento": "2000-01-01",
  "rol": "admin",
  "activo": false,
  "esAdmin": true
}

```


* **Respuesta HTTP:** `201 Created`
* **Estado:** **VULNERABLE**
* **Análisis:** El controlador pasó todo el `req.body` al método de creación de la base de datos sin filtrar propiedades no permitidas para el cliente. Es necesario desestructurar los argumentos requeridos de forma explícita.

---

### Ataque #08: Mass Assignment en Edición (PUT)

* **Endpoint:** `PUT /api/usuarios/6ab14ada36d26a59809a57a9`
* **Body enviado:**
```json
{
  "nombreCompleto": "Usuario Hacker Modificado",
  "rol": "admin",
  "esAdmin": true,
  "activo": false
}

```


* **Respuesta HTTP:** `200 OK`
* **Estado:** **VULNERABLE**
* **Análisis:** De forma similar a la creación, el endpoint de modificación procesa campos administrativos sin aplicar listas blancas (*whitelisting*) sobre la carga recibida.

---

### Ataque #09: Búsqueda con Identificador con Formato Inválido

* **Endpoint:** `GET /api/usuarios/123abc`
* **Respuesta HTTP:** `400 Bad Request`
* **Estado:** **DEFENDIDO**
* **Análisis:** El parámetro de la ruta fue auditado con `.isMongoId()`, respondiendo con una estructura `400` limpia y evitando un fallo crítico (`CastError` / 500) del ORM.

---

### Ataque #10: Búsqueda de Identificador Inexistente

* **Endpoint:** `GET /api/perfiles-numerologicos/6ab14ada36d26a59809a5799`
* **Respuesta HTTP:** `404 Not Found`
* **Estado:** **DEFENDIDO**
* **Análisis:** El formato del `ObjectId` fue válido, la consulta se realizó a MongoDB y, al no encontrar concordancias, el controlador devolvió la respuesta adecuada (`404`).

---

### Ataque #11: Invocación de Métodos no Soportados

* **Endpoint:** `DELETE /api/auth/login`
* **Respuesta HTTP:** `404 Not Found` *(Content-Type: text/html)*
* **Estado:** **VULNERABLE**
* **Análisis:** La ruta/método no configurado cayó en el manejador básico de Express, devolviendo una página HTML (`<pre>Cannot DELETE /api/auth/login</pre>`). Debe implementarse un middleware final que capture rutas no mapeadas y retorne la respuesta estandarizada en formato JSON.

---

### Ataque #12: Referencia a Recursos Inexistentes (Llave Foránea Huérfana)

* **Endpoint:** `POST /api/lecturas`
* **Body enviado:**
```json
{
  "usuario_id": "60c72b2f9b1d8b2b88888888",
  "prompt": "Generar lectura anual de numerología",
  "respuesta": "Tu año personal es el número 7.",
  "tipoLectura": "anual"
}

```


* **Respuesta HTTP:** `201 Created`
* **Estado:** **VULNERABLE**
* **Análisis:** Se permitió insertar un registro con una clave `usuario_id` válida en estructura pero sin correspondencia real en la colección `usuarios`. Falta incluir una consulta previa de verificación en el validador o controlador.

---

### Ataque #13: Eliminación de Entidades Padre con Dependencias

* **Endpoint:** `DELETE /api/usuarios/6a8c3caef60cdc5ca7f59b7d`
* **Respuesta HTTP:** `200 OK`
* **Estado:** **VULNERABLE**
* **Análisis:** La API eliminó el usuario sin validar si este contaba con lecturas o perfiles asociados. Al ejecutar consultas posteriores con `.populate()`, los documentos hijos apuntan a referencias nulas. Se requiere lógica de borrado en cascada o restricción previa.

---

### Ataque #14: Actualización Parcial mediante PUT

* **Endpoint:** `PUT /api/usuarios/6ab14ada36d26a59809a57a9`
* **Body enviado:**
```json
{
  "nombreCompleto": "Solo Nombre Actualizado"
}

```


* **Respuesta HTTP:** `200 OK`
* **Estado:** **DEFENDIDO**
* **Análisis:** El endpoint actualizó únicamente la propiedad provista, manteniendo intactas las demás propiedades de la entidad (`email`, `passwordHash`, `fechaNacimiento`) gracias a la aplicación nativa del operador `$set` en Mongoose.