#  Reporte de Auditoría y Pruebas de Seguridad (API REST)

![Seguridad](https://img.shields.io/badge/Seguridad-MIXTO-orange)
![Estado](https://img.shields.io/badge/Estado-100%25%20Completado-blue)
![Entorno](https://img.shields.io/badge/Entorno-DevTunnels-orange)
![Database](https://img.shields.io/badge/Base%20de%20Datos-MongoDB-green)

---

##  Información del Laboratorio

| Parámetro | Detalle |
| :--- | :--- |
| **Fase / Evento** | Auditoría de Robustez y Seguridad API |
| **Sistema Evaluado** | API REST (Usuarios, Perfiles, Lecturas, Compatibilidad, Logs) |
| **Endpoints Auditados** | `/api/users`, `/api/numerology-profiles`, `/api/readings`, `/api/compatibility-matches`, `/api/audit-logs` |
| **Herramienta de Pruebas** | Thunder Client / Postman |
| **Fecha de Ejecución** | Septiembre de 2026 |

---

---

##  Equipo de Evaluación y Desarrolladores

* **Equipo Evaluador / Atacante:**
  * Andrea Carolina Silva Macias
  * Daniel Mauricio Vesga Tibaduiza

* **Equipo de Desarrollo / Defensor:**
  * Lizeth Jheraldin Vasquez Ayala
  * Danna Valentina Suarez Suarez

---

##  Resumen Ejecutivo

| Métrica | Cantidad | Porcentaje |
| :--- | :---: | :---: |
| **Total de Vectores Evaluados** | **14** | **100%** |
| **Defendidos** | **11** | **78.6%** |
| **Vulnerables** | **3** | **21.4%** |

---

##  Detalle de Casos de Prueba (14 Vectores)

### Ataque #01: Omisión de Campos Obligatorios

* **Endpoint:** `POST https://vs0pz7hc-3200.use.devtunnels.ms/api/users`
* **Body enviado:**
```json
{
  "name": "Prueba Incompleta"
}

```

* **Respuesta HTTP:** `400 Bad Request`
* **Body recibido:**

```json
{
    "status": "error",
    "mensaje": "Errores de validación en los datos enviados",
    "errores": [
        {
            "campo": "firstName",
            "mensaje": "El primer nombre es obligatorio"
        },
        {
            "campo": "firstName",
            "mensaje": "El primer nombre no puede estar vacío"
        },
        {
            "campo": "firstName",
            "mensaje": "El primer nombre debe ser un texto"
        },
        {
            "campo": "lastName",
            "mensaje": "El apellido es obligatorio"
        },
        {
            "campo": "lastName",
            "mensaje": "El apellido no puede estar vacío"
        },
        {
            "campo": "lastName",
            "mensaje": "El apellido debe ser un texto"
        },
        {
            "campo": "email",
            "mensaje": "El correo electrónico es obligatorio"
        },
        {
            "campo": "email",
            "mensaje": "Debe ingresar un correo electrónico válido"
        },
        {
            "campo": "password",
            "mensaje": "La contraseña es obligatoria"
        },
        {
            "campo": "password",
            "mensaje": "La contraseña debe tener al menos 6 caracteres"
        },
        {
            "campo": "birthDate",
            "mensaje": "La fecha de nacimiento es obligatoria"
        },
        {
            "campo": "birthDate",
            "mensaje": "Formato de fecha inválido (YYYY-MM-DD)"
        }
    ]
}

```

* **Estado:** **DEFENDIDO**
* **Análisis:** La capa middleware interceptó correctamente la solicitud mediante `express-validator`. El backend rechazó la petición al detectar la ausencia de los campos obligatorios (`firstName`, `lastName`, `email`, `password`, `birthDate`), retornando una respuesta estructurada con formato `400 Bad Request` sin comprometer la base de datos ni los controladores.

---

### Ataque #02: Payload Totalmente Vacío

* **Endpoint:** `POST https://vs0pz7hc-3200.use.devtunnels.ms/api/users`
* **Body enviado:**

```json
{}

```

* **Respuesta HTTP:** `400 Bad Request`
* **Body recibido:**

```json
{
    "status": "error",
    "mensaje": "Errores de validación en los datos enviados",
    "errores": [
        {
            "campo": "firstName",
            "mensaje": "El primer nombre es obligatorio"
        },
        {
            "campo": "firstName",
            "mensaje": "El primer nombre no puede estar vacío"
        },
        {
            "campo": "firstName",
            "mensaje": "El primer nombre debe ser un texto"
        },
        {
            "campo": "lastName",
            "mensaje": "El apellido es obligatorio"
        },
        {
            "campo": "lastName",
            "mensaje": "El apellido no puede estar vacío"
        },
        {
            "campo": "lastName",
            "mensaje": "El apellido debe ser un texto"
        },
        {
            "campo": "email",
            "mensaje": "El correo electrónico es obligatorio"
        },
        {
            "campo": "email",
            "mensaje": "Debe ingresar un correo electrónico válido"
        },
        {
            "campo": "password",
            "mensaje": "La contraseña es obligatoria"
        },
        {
            "campo": "password",
            "mensaje": "La contraseña debe tener al menos 6 caracteres"
        },
        {
            "campo": "birthDate",
            "mensaje": "La fecha de nacimiento es obligatoria"
        },
        {
            "campo": "birthDate",
            "mensaje": "Formato de fecha inválido (YYYY-MM-DD)"
        }
    ]
}

```

* **Estado:** **DEFENDIDO**
* **Análisis:** La API respondió rechazando la solicitud con un código `400 Bad Request`. El middleware de validación capturó la ausencia total de datos en el cuerpo de la petición y desplegó los mensajes de error para cada uno de los campos obligatorios requeridos por el modelo de usuario.

---

### Ataque #03: Inyección de Tipos de Datos Alterados

* **Endpoint:** `POST https://vs0pz7hc-3200.use.devtunnels.ms/api/users`
* **Body enviado:**

```json
{
  "firstName": 12345,
  "lastName": true,
  "email": true,
  "password": 987654,
  "birthDate": 20260921
}

```

* **Respuesta HTTP:** `400 Bad Request`
* **Body recibido:**

```json
{
    "status": "error",
    "mensaje": "Errores de validación en los datos enviados",
    "errores": [
        {
            "campo": "firstName",
            "mensaje": "El primer nombre debe ser un texto"
        },
        {
            "campo": "lastName",
            "mensaje": "El apellido debe ser un texto"
        },
        {
            "campo": "email",
            "mensaje": "Debe ingresar un correo electrónico válido"
        }
    ]
}

```

* **Estado:** **DEFENDIDO**
* **Análisis:** El sistema detectó la incoherencia de tipos de datos enviada en la petición (números y booleanos en lugar de cadenas de texto y correos estructurados). La capa de validación rechazó la solicitud retornando `400 Bad Request` y detallando los campos cuya verificación de tipo o formato falló.

---

### Ataque #04: Cadenas Compuestas Únicamente por Espacios

* **Endpoint:** `POST https://vs0pz7hc-3200.use.devtunnels.ms/api/users`
* **Body enviado:**

```json
{
  "firstName": "   ",
  "lastName": "   ",
  "email": "usuario@test.com",
  "password": "123456",
  "birthDate": "2000-01-01"
}

```

* **Respuesta HTTP:** `400 Bad Request`
* **Body recibido:**

```json
{
  "message": "User validation failed: firstName: Path `firstName` is required., lastName: Path `lastName` is required."
}

```

* **Estado:** **DEFENDIDO**
* **Análisis:** La base de datos/ORM (Mongoose) recortó los espacios en blanco (*trimming*) o la capa de validación rechazó el contenido no imprimible, detectando que `firstName` y `lastName` quedaban vacíos. La petición fue interceptada correctamente antes de persistir datos inconsistentes.

---

### Ataque #05: Inyección de Valores fuera de Enum

* **Endpoint:** `POST https://vs0pz7hc-3200.use.devtunnels.ms/api/users`
* **Body enviado:**

```json
{
  "firstName": "Juan",
  "lastName": "Perez",
  "email": "juan.enum@test.com",
  "password": "123456",
  "birthDate": "2000-01-01",
  "role": "HACKER_SUPER_ADMIN"
}

```

* **Respuesta HTTP:** `400 Bad Request`
* **Body recibido:**

```json
{
  "message": "User validation failed: role: `HACKER_SUPER_ADMIN` is not a valid enum value for path `role`."
}

```

* **Estado:** **DEFENDIDO**
* **Análisis:** El modelo ORM/Mongoose rechazó la inserción del valor arbitrario en la propiedad `role`. Al no coincidir con los valores permitidos en la lista enumerada (*enum*) definida para los roles del sistema, la API impidió la elevación de privilegios no autorizada.

---

### Ataque #06: Desbordamiento de Cadena de Texto

* **Endpoint:** `POST https://vs0pz7hc-3200.use.devtunnels.ms/api/users`
* **Body enviado:**

```json
{
  "firstName": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  "lastName": "Perez",
  "email": "texto.gigante@test.com",
  "password": "123456",
  "birthDate": "2000-01-01"
}

```

* **Respuesta HTTP:** `201 Created`
* **Body recibido:**

```json
{
    "firstName": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "lastName": "Perez",
    "email": "texto.gigante@test.com",
    "password": "$2b$10$JE2o6w3FR/h.34WFWwof2efQQYmTvJtLI4PIwrhBU3s6E/pf3xos.",
    "birthDate": "2000-01-01T00:00:00.000Z",
    "role": "client",
    "_id": "6aba6f313f35d2c966573697",
    "createdAt": "2026-09-28T13:44:17.877Z",
    "updatedAt": "2026-09-28T13:44:17.877Z",
    "__v": 0
}

```

* **Estado:** **VULNERABLE**
* **Análisis:** La API no cuenta con una validación de longitud máxima (`maxLength`) en el middleware de `express-validator` o el esquema de Mongoose para el campo `firstName`. Se procesó y almacenó exitosamente una cadena de más de 180 caracteres, lo que expone el sistema a posibles ataques de denegación de servicio (DoS) por consumo excesivo de memoria o desbordamiento en el frontend.

---

### Ataque #07: Mass Assignment en Creación (POST)

* **Endpoint:** `POST https://vs0pz7hc-3200.use.devtunnels.ms/api/users`
* **Body enviado:**

```json
{
  "firstName": "Usuario",
  "lastName": "Hacker",
  "email": "hacker.post@test.com",
  "password": "123456",
  "birthDate": "2000-01-01",
  "role": "admin",
  "isActive": false,
  "isAdmin": true
}

```

* **Respuesta HTTP:** `201 Created`
* **Body recibido:**

```json
{
    "firstName": "Usuario",
    "lastName": "Hacker",
    "email": "hacker.post@test.com",
    "password": "$2b$10$RwBDPN1LfGV7f6WX7wR6X.hdh.XdQ/FkjF35qWGt146ZUScz/OJ0y",
    "birthDate": "2000-01-01T00:00:00.000Z",
    "role": "admin",
    "_id": "6aba6f693f35d2c966573699",
    "createdAt": "2026-09-28T13:45:13.609Z",
    "updatedAt": "2026-09-28T13:45:13.609Z",
    "__v": 0
}

```

* **Estado:** **VULNERABLE**
* **Análisis:** La API permitió asignar de forma arbitraria un campo protegido o de control (`role: "admin"`) directamente desde el payload de registro público. El sistema procesó la solicitud y guardó el usuario con privilegios elevados sin requerir un flujo de autorización administrativa, permitiendo una vulnerabilidad de asignación masiva (*Mass Assignment*).

---

### Ataque #08: Mass Assignment en Edición (PUT)

* **Endpoint:** `PUT https://vs0pz7hc-3200.use.devtunnels.ms/api/users/6aba6f693f35d2c966573699`
* **Body enviado:**

```json
{
  "firstName": "Usuario Hacker Modificado",
  "role": "admin",
  "isAdmin": true,
  "isActive": false
}

```

* **Respuesta HTTP:** `400 Bad Request`
* **Body recibido:**

```json
{
    "status": "error",
    "mensaje": "Errores de validación en los datos enviados",
    "errores": [
        {
            "campo": "lastName",
            "mensaje": "El apellido es obligatorio"
        },
        {
            "campo": "lastName",
            "mensaje": "El apellido no puede estar vacío"
        },
        {
            "campo": "lastName",
            "mensaje": "El apellido debe ser un texto"
        },
        {
            "campo": "email",
            "mensaje": "El correo electrónico es obligatorio"
        },
        {
            "campo": "email",
            "mensaje": "Debe ingresar un correo electrónico válido"
        },
        {
            "campo": "password",
            "mensaje": "La contraseña es obligatoria"
        },
        {
            "campo": "password",
            "mensaje": "La contraseña debe tener al menos 6 caracteres"
        },
        {
            "campo": "birthDate",
            "mensaje": "La fecha de nacimiento es obligatoria"
        },
        {
            "campo": "birthDate",
            "mensaje": "Formato de fecha inválido (YYYY-MM-DD)"
        }
    ]
}

```

* **Estado:** **DEFENDIDO**
* **Análisis:** El middleware de validación interceptó la solicitud al faltar los campos requeridos por el esquema para el método `PUT`. Aunque no se evaluó propiamente la asignación masiva de campos protegidos debido a que la validación falló primero al exigir la presencia de todos los atributos obligatorios del usuario, se impidió que la actualización procediera de manera inconsistente.

---

### Ataque #09: Búsqueda con Identificador con Formato Inválido

* **Endpoint:** `GET https://vs0pz7hc-3200.use.devtunnels.ms/api/users/123abc`
* **Body enviado:** *(Ninguno - Params de URL)*
* **Respuesta HTTP:** `400 Bad Request`
* **Body recibido:**

```json
{
    "status": "error",
    "mensaje": "Errores de validación en los datos enviados",
    "errores": [
        {
            "campo": "id",
            "mensaje": "El ID de usuario no es válido"
        }
    ]
}

```

* **Estado:** **DEFENDIDO**
* **Análisis:** La capa de validación interceptó el parámetro de la URL antes de ejecutar la consulta en la base de datos. Al detectar que el identificador proporcionado (`123abc`) no cumple con el formato estándar de un ObjectId de MongoDB, la API retornó un código `400 Bad Request` con un mensaje descriptivo, evitando errores internos del servidor (como fallos de cast en Mongoose).

---

### Ataque #10: Búsqueda de Identificador Inexistente

* **Endpoint:** `GET https://vs0pz7hc-3200.use.devtunnels.ms/api/numerology-profiles/6aba6f693f35d2c966573699`
* **Body enviado:** *(Ninguno - Params de URL)*
* **Respuesta HTTP:** `404 Not Found`
* **Body recibido:**

```json
{
    "message": "Profile not found"
}

```

* **Estado:** **DEFENDIDO**
* **Análisis:** La API manejó correctamente la consulta de un recurso con un identificador válido en formato pero inexistente en la base de datos. Se retornó un mensaje controlado informando que el perfil no fue encontrado, previniendo la exposición de trazas internas o fallos en cascada del servidor.

---

### Ataque #11: Invocación de Métodos no Soportados

* **Endpoint:** `DELETE https://vs0pz7hc-3200.use.devtunnels.ms/api/users/login`
* **Body enviado:** *(Ninguno)*
* **Respuesta HTTP:** `400 Bad Request`
* **Body recibido:**

```json
{
    "status": "error",
    "mensaje": "Errores de validación en los datos enviados",
    "errores": [
        {
            "campo": "id",
            "mensaje": "El ID de usuario no es válido"
        }
    ]
}

```

* **Estado:** **DEFENDIDO**
* **Análisis:** El enrutador interpretó el segmento `login` dentro de la ruta `/api/users/:id` como un parámetro dinámico de tipo ID. Dado que la cadena `login` no cumple con el formato de un ObjectId válido, el middleware de validación interceptó la petición y retornó un error `400 Bad Request`, evitando que se ejecute una operación de eliminación no intencionada sobre un recurso de autenticación.

---

### Ataque #12: Referencia a Recursos Inexistentes (Llave Foránea Huérfana)

* **Endpoint:** `POST https://vs0pz7hc-3200.use.devtunnels.ms/api/readings`
* **Body enviado:**

```json
{
  "userId": "60c72b2f9b1d8b2b88888888",
  "prompt": "Generar lectura anual de numerología",
  "response": "Tu año personal es el número 7.",
  "readingType": "anual"
}

```

* **Respuesta HTTP:** `400 Bad Request`
* **Body recibido:**

```json
{
    "status": "error",
    "mensaje": "Errores de validación en los datos enviados",
    "errores": [
        {
            "campo": "perfilId",
            "mensaje": "El ID del perfil numerológico es obligatorio"
        },
        {
            "campo": "perfilId",
            "mensaje": "Debe proporcionar un ID de perfil válido"
        },
        {
            "campo": "tipoLectura",
            "mensaje": "El tipo de lectura es obligatorio"
        },
        {
            "campo": "tipoLectura",
            "mensaje": "El tipo de lectura no puede estar vacío"
        },
        {
            "campo": "tipoLectura",
            "mensaje": "El tipo de lectura debe ser un texto"
        }
    ]
}

```

* **Estado:** **DEFENDIDO**
* **Análisis:** La capa de validación interceptó la petición al no coincidir la estructura de los campos esperados por el esquema de lecturas (`perfilId`, `tipoLectura`). Al faltar las propiedades requeridas y detectar un payload con nombres de campos distintos (`userId`, `readingType`), el sistema rechazó la solicitud con un código `400 Bad Request`, evitando la creación de registros huérfanos o inconsistentes en la base de datos.

---

### Ataque #13: Eliminación de Entidades Padre con Dependencias

* **Endpoint:** `DELETE https://vs0pz7hc-3200.use.devtunnels.ms/api/users/6aba6f693f35d2c966573699`
* **Body enviado:** *(Ninguno - Params de URL)*
* **Respuesta HTTP:** `200 OK`
* **Body recibido:**

```json
{
    "message": "User deleted"
}

```

* **Estado:** **VULNERABLE**
* **Análisis:** La API permitió eliminar la entidad principal (*User*) sin validar ni aplicar restricciones de integridad referencial sobre las entidades dependientes o relacionadas asociadas a este registro. Al no existir un mecanismo de bloqueo en cascada (*cascade delete* o verificación de referencias activas), la eliminación de la entidad padre puede dejar registros huérfanos o inconsistentes en otras colecciones del sistema.

---

### Ataque #14: Actualización Parcial mediante PUT

* **Endpoint:** `PUT https://vs0pz7hc-3200.use.devtunnels.ms/api/users/6aba6f313f35d2c966573697`
* **Body enviado:**

```json
{
  "firstName": "Nombre Actualizado Parcialmente"
}

```

* **Respuesta HTTP:** `400 Bad Request`
* **Body recibido:**

```json
{
    "status": "error",
    "mensaje": "Errores de validación en los datos enviados",
    "errores": [
        {
            "campo": "lastName",
            "mensaje": "El apellido es obligatorio"
        },
        {
            "campo": "lastName",
            "mensaje": "El apellido no puede estar vacío"
        },
        {
            "campo": "lastName",
            "mensaje": "El apellido debe ser un texto"
        },
        {
            "campo": "email",
            "mensaje": "El correo electrónico es obligatorio"
        },
        {
            "campo": "email",
            "mensaje": "Debe ingresar un correo electrónico válido"
        },
        {
            "campo": "password",
            "mensaje": "La contraseña es obligatoria"
        },
        {
            "campo": "password",
            "mensaje": "La contraseña debe tener al menos 6 caracteres"
        },
        {
            "campo": "birthDate",
            "mensaje": "La fecha de nacimiento es obligatoria"
        },
        {
            "campo": "birthDate",
            "mensaje": "Formato de fecha inválido (YYYY-MM-DD)"
        }
    ]
}

```

* **Estado:** **DEFENDIDO**
* **Análisis:** El endpoint implementado con el verbo `PUT` exige la presencia y validación de todos los campos obligatorios del esquema de usuario tal como si se tratara de una sustitución completa del recurso. Al enviar una actualización parcial sin los demás atributos requeridos, la capa de validación rechazó la solicitud con un código `400 Bad Request`. Esto evidencia que el sistema no permite actualizaciones parciales mediante `PUT` (comportamiento que idealmente correspondería al verbo `PATCH`), previniendo modificaciones incompletas pero requiriendo precaución en la arquitectura REST si se planeaban actualizaciones parciales por este medio.

```

```
