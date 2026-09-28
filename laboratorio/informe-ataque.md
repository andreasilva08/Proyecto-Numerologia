# 🛡️ Reporte de Auditoría y Pruebas de Seguridad (API REST)

![Seguridad](https://img.shields.io/badge/Seguridad-DEFENDIDO-brightgreen)
![Estado](https://img.shields.io/badge/Estado-100%25%20Completado-blue)
![Entorno](https://img.shields.io/badge/Entorno-Localhost%20%2F%20Autoprueba-orange)
![Database](https://img.shields.io/badge/Base%20de%20Datos-MongoDB%20Atlas-green)

---

## 📌 Información del Laboratorio

| Parámetro | Detalle |
| :--- | :--- |
| **Fase / Evento** | Laboratorio de Seguridad — Ronda 1 |
| **Sistema Evaluado** | API REST del Sistema de Numerología |
| **Endpoints Auditados** | `/api/users`, `/api/numerology-profiles` |
| **Herramienta de Pruebas** | Thunder Client |
| **Fecha de Ejecución** | Septiembre de 2026 |

---

## 👥 Equipo de Evaluación y Desarrolladores

* **Equipo Evaluador / Atacante:**
  * Silvia Daniela Figueroa Lozano
  * Yurley Tatiana Gómez Aparicio

* **Equipo de Desarrollo / Defensor:**
  * Andrea Carolina Silva Macías
  * Daniel Mauricio Vesga Tibaduiza

---

## 📋 Resumen Ejecutivo

| Métrica | Cantidad | Porcentaje |
| :--- | :---: | :---: |
| **Total de Vectores Evaluados** | **14** | **100%** |
| **Defendidos** | **7** | **50.0%** |
| **Parcialmente Defendidos** | **2** | **14.3%** |
| **Vulnerables** | **5** | **35.7%** |

---

## Detalle de Pruebas Ejecutadas

### Ataque #01: Omisión de Campos Obligatorios

* **Petición:** `POST /api/users`
* **Body enviado:**

```json
{ "prueba": "ataque1" }
```

* **Respondió:** `400 Bad Request`. El validador detectó la ausencia de `firstName`, `lastName`, `email`, `password` y `birthDate` y bloqueó la creación.
* **Veredicto:** DEFENDIDO
* **Qué noté:** esperaba que llegara a la base de datos y reventara con un 500 de Mongoose, pero el middleware cortó la petición antes. Bien.

---

### Ataque #02: Payload Totalmente Vacío

* **Petición:** `POST /api/users`
* **Body enviado:**

```json
{}
```

* **Respondió:** `400 Bad Request` con todas las reglas de campos obligatorios activadas.
* **Veredicto:** DEFENDIDO
* **Qué noté:** mismo comportamiento que el ataque anterior, la capa de validación responde ordenada con lo que falta.

---

### Ataque #03: Tipos de Datos Alterados

* **Petición:** `POST /api/users`
* **Body enviado:** enteros donde van cadenas, y booleanos donde van texto o fechas.
* **Respondió:** `400 Bad Request`. El esquema rechaza números y booleanos en campos de texto y valida el formato de fecha (YYYY-MM-DD).
* **Veredicto:** DEFENDIDO
* **Qué noté:** esto es justo lo que en NUESTRA API no defendimos (nuestro ataque #03 recibido). En la de ellas sí valida el tipo antes del formato.

---

### Ataque #04: Cadenas Vacías / Solo Espacios

* **Petición:** `POST /api/users`
* **Body enviado:** todos los campos obligatorios con cadenas vacías `""`.
* **Respondió:** `400 Bad Request`. Se exige longitud mínima y formato de correo/fecha válidos.
* **Veredicto:** DEFENDIDO
* **Qué noté:** igual que en nuestra API, el `.trim()` antes del chequeo de longitud hace el trabajo.

---

### Ataque #05: Valor Inventado en Enum (rol)

* **Petición:** `POST /api/users`
* **Body enviado:**

```json
{ "role": "superadmin", ... }
```

* **Respondió:** `400 Bad Request` con el mensaje `User validation failed: role: 'superadmin' is not a valid enum value...`
* **Veredicto:** PARCIALMENTE DEFENDIDO
* **Qué noté:** el `enum` del schema de Mongoose sí rechazó el valor (a diferencia de nuestra API, donde el campo ni existía), pero el mensaje que sale es el error interno crudo de Mongoose, con el nombre del modelo y de la validación. Le faltó que el validator lo atrapara antes y respondiera el JSON estandarizado de ellos.

---

### Ataque #06: Malformación de Payload y Fuga de Información

* **Petición:** `POST /api/users`
* **Body enviado:** sintaxis de script de PowerShell dentro del JSON, para provocar un error de deserialización.
* **Respondió:** `400 Bad Request`, pero el servidor devolvió un stack trace en formato HTML exponiendo rutas locales del sistema de archivos (`D:\Andrea Carolina Silva Macias\...`), módulos internos (`body-parser`, `node:internal`) y versiones del entorno.
* **Veredicto:** VULNERABLE (severidad media)
* **Qué noté:** la petición se detuvo, o sea que el error no la dejó pasar, pero el error se mostró crudo. Ese HTML le dice a cualquier atacante la estructura de carpetas del servidor y las librerías que usan.

---

### Ataque #07: Mass Assignment en Creación (POST)

* **Petición:** `POST /api/users`
* **Body enviado:**

```json
{ "role": "admin", ... }
```

* **Respondió:** `201 Created`.
* **Veredicto:** VULNERABLE (crítico)
* **Qué noté:** la API guardó el usuario con privilegios de administrador sin autorización ni filtro de campos. Aquí sí se persistió el campo, no fue como en el #05: pasando un `role` válido del enum, el mass assignment entra completo.

---

### Ataque #08: Escalada de Privilegios en Edición (PUT)

* **Petición:** `PUT /api/users/:id` con un JWT de un usuario normal (`role: client`), inyectando `"role": "admin"`.
* **Respondió:** `200 OK`, verificado después con `GET /api/users/:id`.
* **Veredicto:** VULNERABLE (crítico)
* **Qué noté:** este es el peor de todos: un cliente se auto-elevó a administrador y quedó persistido en la base de datos. Protegen el enum pero no la titularidad del campo. Confirmando con el GET es lo que lo convierte en demostración y no en suposición.

---

### Ataque #09: Id con Formato Inválido (GET)

* **Petición:** `GET /api/users/123abc`
* **Respondió:** `400 Bad Request` ("El ID de usuario no es válido").
* **Veredicto:** DEFENDIDO
* **Qué noté:** el middleware valida la estructura del ObjectId antes de tocar la base de datos. Igual que en nuestra API con `.isMongoId()`.

---

### Ataque #10: Id Válido pero Inexistente (GET)

* **Petición:** `GET /api/users/6a9577d05c4fdf5639f34c1f` con cabecera `x-token`.
* **Respondió:** `404 Not Found` ("User not found").
* **Veredicto:** DEFENDIDO
* **Qué noté:** manejo correcto del recurso no encontrado. Distinto de la ruta de perfiles, donde la verificación falla (ver #12).

---

### Ataque #11: Método HTTP No Implementado

* **Petición:** `PATCH /api/users`
* **Respondió:** `404 Not Found` con el HTML por defecto de Express (`Cannot PATCH /api/users`).
* **Veredicto:** PARCIALMENTE INSEGURO (severidad baja)
* **Qué noté:** la ruta no existe y por eso no pasa nada grave, pero la respuesta es el manejador por defecto en HTML en vez de un JSON estandarizado (o un `405 Method Not Allowed` con cabecera `Allow`). Lo mismo que nos marcaron a nosotras en el ataque #11 recibido.

---

### Ataque #12: Referencia Huérfana (Perfil con Usuario Inexistente)

* **Petición:** `POST /api/numerology-profiles` vinculando `usuarioId` con un ObjectId inexistente (`507f1f77bcf86cd799439011`). Después verifiqué con `GET /api/users/507f1f77bcf86cd799439011` que ese usuario no existe (`404 Not Found`).
* **Respondió:** `201 Created` al registrar el perfil, y `404` al buscar al usuario.
* **Veredicto:** VULNERABLE (severidad alta)
* **Qué noté:** la API dejó crear un perfil apuntando a un usuario fantasma. Es el mismo problema del ataque #12 que nos marcaron a nosotras: el id tiene formato válido pero nadie consulta si existe. La inconsistencia no se ve al insertar, se ve después al hacer `populate`.

---

### Ataque #13: Usuario Inexistente en Base de Datos (GET)

* **Petición:** `GET /api/users/6a8c384b8cd0cd6bac594943`
* **Respondió:** `404 Not Found` ("User not found").
* **Veredicto:** DEFENDIDO
* **Qué noté:** comprobación correcta de ids sintácticamente válidos (24 caracteres hexadecimales) que no corresponden a ningún documento activo.

---

### Ataque #14: Actualización Parcial y Exposición de Datos (BOLA/IDOR)

* **Petición (2 partes):**
  1. `GET /api/numerology-profiles` — el listado revela ids y datos de otros usuarios (perfiles con `userId: null` y datos de "Andrea").
  2. `PUT /api/users/6ab3ecc200912c2d2d4eaa4c` modificando `firstName`, `lastName` y `password`.
* **Respondió:** `200 OK` en el listado y `200 OK` en la modificación.
* **Veredicto:** VULNERABLE (severidad alta)
* **Qué noté:** dos cosas en un mismo endpoint: el listado de perfiles es público y muestra registros de otras cuentas (incluidos los huérfanos del #12, que prueban que la basura del ataque anterior quedó en la base), y el PUT permite sobrescribir el registro de otro usuario sin validar que el id del token coincida con el id del recurso. Este último punto (BOLA) no está en la lista de los 14 de la guía, lo agregamos como ataque extra.

---

## Matriz de Hallazgos Consolidada

| ID | Hallazgo | Severidad |
|---|---|---|
| SEC-01 | Mass assignment en creación (POST) | Alta |
| SEC-02 | Escalada de privilegios vertical en PUT | Crítica |
| SEC-03 | Fuga de información técnica / stack trace | Media |
| SEC-04 | Mensajes de error crudos de Mongoose | Baja |
| SEC-05 | Verbos HTTP no soportados responden HTML | Baja |
| SEC-06 | Integridad referencial ausente (usuario fantasma) | Alta |
| SEC-07 | Exposición de datos y modificación cruzada (BOLA/IDOR) | Alta |

---