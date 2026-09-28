# 📘 Especificación Técnica y Documentación de la API REST (API Reference)

**Versión de la API:** `1.0.0`

**Protocolo:** `HTTP / HTTPS`

**Formato de Intercambio de Datos:** `JSON`

**Base de Datos:** MongoDB Atlas

---

## 🔐 Autenticación y Cabeceras

Los endpoints protegidos requieren enviar un token de autenticación en los encabezados de la petición (Headers).

| Header | Tipo | Requerido | Descripción |
| --- | --- | --- | --- |
| `Content-Type` | `string` | **Sí** | Debe ser `application/json` para peticiones con body. |
| `x-token` | `string` | **Sí** *(en rutas protegidas)* | Token JWT emitido al iniciar sesión o registrarse. |

---

## 🟢 1. Módulo de Usuarios (`/api/users`)

### **1.1 Registrar / Crear Usuario**

Crea un nuevo usuario en la base de datos.

* **Método:** `POST`
* **Ruta:** `/api/users`
* **Autenticación:** No requerida

#### **Body de la Petición (`application/json`):**

```json
{
  "firstName": "Andrea",
  "lastName": "Silva",
  "email": "andrea.silva@example.com",
  "password": "Password123!",
  "birthDate": "1998-05-15"
}

```

#### **Respuesta Exitosa (`201 Created`):**

```json
{
  "status": "success",
  "message": "Usuario registrado exitosamente",
  "data": {
    "_id": "6a8c38438cd0cd6bac594941",
    "firstName": "Andrea",
    "lastName": "Silva",
    "email": "andrea.silva@example.com",
    "birthDate": "1998-05-15T00:00:00.000Z",
    "role": "USER_ROLE",
    "createdAt": "2026-09-14T10:00:00.000Z"
  }
}

```

---

### **1.2 Obtener Todos los Usuarios**

Devuelve una lista paginada de los usuarios registrados.

* **Método:** `GET`
* **Ruta:** `/api/users`
* **Parámetros de Consulta (Query Params):**
* `limit` (opcional, default `10`): Número de registros a retornar.
* `from` (opcional, default `0`): Índice de inicio para la paginación.



#### **Respuesta Exitosa (`200 OK`):**

```json
{
  "status": "success",
  "total": 1,
  "users": [
    {
      "_id": "6a8c38438cd0cd6bac594941",
      "firstName": "Andrea",
      "lastName": "Silva",
      "email": "andrea.silva@example.com",
      "role": "USER_ROLE"
    }
  ]
}

```

---

### **1.3 Actualizar Usuario**

Actualiza la información personal de un usuario existente.

* **Método:** `PUT`
* **Ruta:** `/api/users/:id`
* **Autenticación:** Requerida (`x-token`)

#### **Body de la Petición (`application/json`):**

```json
{
  "firstName": "Andrea Carolina",
  "lastName": "Silva Macias",
  "email": "andrea.silva@example.com",
  "password": "NewPassword123!",
  "birthDate": "1998-05-15"
}

```

#### **Respuesta Exitosa (`200 OK`):**

```json
{
  "status": "success",
  "message": "Usuario actualizado correctamente",
  "user": {
    "_id": "6a8c38438cd0cd6bac594941",
    "firstName": "Andrea Carolina",
    "lastName": "Silva Macias",
    "email": "andrea.silva@example.com"
  }
}

```

---

### **1.4 Eliminar Usuario**

Realiza la eliminación de un registro de usuario.

* **Método:** `DELETE`
* **Ruta:** `/api/users/:id`
* **Autenticación:** Requerida (`x-token`)

#### **Respuesta Exitosa (`200 OK`):**

```json
{
  "status": "success",
  "message": "User deleted"
}

```

---

## 🟣 2. Módulo de Perfiles Numerológicos (`/api/numerology-profiles`)

### **2.1 Crear Perfil Numerológico**

Genera un nuevo perfil asociado a un usuario existente.

* **Método:** `POST`
* **Ruta:** `/api/numerology-profiles`
* **Autenticación:** Requerida (`x-token`)

#### **Body de la Petición (`application/json`):**

```json
{
  "usuarioId": "6a8c38438cd0cd6bac594941",
  "nombreCompleto": "Andrea Carolina Silva Macias",
  "fechaNacimiento": "1998-05-15"
}

```

#### **Respuesta Exitosa (`201 Created`):**

```json
{
  "status": "success",
  "data": {
    "_id": "6a8c443284f574584cee85da",
    "usuarioId": "6a8c38438cd0cd6bac594941",
    "nombreCompleto": "Andrea Carolina Silva Macias",
    "fechaNacimiento": "1998-05-15T00:00:00.000Z",
    "lifePathNumber": 3,
    "createdAt": "2026-09-14T10:15:00.000Z"
  }
}

```

---

### **2.2 Obtener Perfil por ID**

Consulta los detalles y cálculos de un perfil específico integrando la relación del usuario (`populate`).

* **Método:** `GET`
* **Ruta:** `/api/numerology-profiles/:id`
* **Autenticación:** No requerida

#### **Respuesta Exitosa (`200 OK`):**

```json
{
  "_id": "6a8c443284f574584cee85da",
  "userId": {
    "_id": "6a8c38438cd0cd6bac594941",
    "firstName": "Andrea",
    "email": "andrea.silva@example.com"
  },
  "nombreCompleto": "Andrea Carolina Silva Macias",
  "fechaNacimiento": "1998-05-15T00:00:00.000Z",
  "createdAt": "2026-09-14T10:15:00.000Z",
  "updatedAt": "2026-09-14T10:15:00.000Z"
}

```

---

### **2.3 Actualizar Perfil Numerológico**

Actualiza la información completa de un perfil existente.

* **Método:** `PUT`
* **Ruta:** `/api/numerology-profiles/:id`
* **Autenticación:** Requerida (`x-token`)

#### **Body de la Petición (`application/json`):**

```json
{
  "usuarioId": "6a8c38438cd0cd6bac594941",
  "nombreCompleto": "Andrea Carolina Silva Macias",
  "fechaNacimiento": "1998-05-15",
  "notes": "Perfil actualizado con observaciones"
}

```

#### **Respuesta Exitosa (`200 OK`):**

```json
{
  "status": "success",
  "message": "Perfil actualizado correctamente",
  "data": {
    "_id": "6a8c443284f574584cee85da",
    "nombreCompleto": "Andrea Carolina Silva Macias",
    "notes": "Perfil actualizado con observaciones"
  }
}

```

---

## ⚠️ Respuestas Estándar de Error

Todas las validaciones fallidas y errores de cliente devuelven una estructura estandarizada con código de estado HTTP 400 (`Bad Request`).

#### **Ejemplo de Respuesta de Error de Validación (`400 Bad Request`):**

```json
{
  "status": "error",
  "mensaje": "Errores de validación en los datos enviados",
  "errores": [
    {
      "campo": "nombreCompleto",
      "mensaje": "El nombre completo es obligatorio"
    },
    {
      "campo": "fechaNacimiento",
      "mensaje": "La fecha debe tener un formato válido (YYYY-MM-DD)"
    }
  ]
}

```

#### **Ejemplo de Recurso No Encontrado (`404 Not Found`):**

```json
{
  "message": "Profile not found"
}

```