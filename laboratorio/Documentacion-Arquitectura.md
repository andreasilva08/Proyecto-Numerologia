# 📐 Documentación de Arquitectura y Base de Datos (Technical Architecture & Data Model)

**Nombre del Proyecto:** Sistema de Gestión Numerológica

**Versión de Arquitectura:** `1.0.0`

**Patrón Arquitectónico:** Modelo-Vista-Controlador (MVC) / API RESTful desacoplada

**Base de Datos:** MongoDB (NoSQL) con ODM Mongoose

**Fecha:** 14 de Septiembre, 2026

---

## 🏗️ 1. Arquitectura General del Sistema

El sistema está diseñado bajo una arquitectura de capas bien definidas utilizando **Node.js** y **Express.js**, orientada a servicios web RESTful stateless.

```text
       ┌────────────────────────────────────────────────────────┐
       │                Cliente (Vue.js / Postman)             │
       └──────────────────────────┬─────────────────────────────┘
                                  │  petición HTTP / JSON
                                  ▼
       ┌────────────────────────────────────────────────────────┐
       │                  Capas del Backend                     │
       │                                                        │
       │  ┌──────────────────────────────────────────────────┐  │
       │  │ Routers (Rutas y Endpoints HTTP)                 │  │
       │  └───────────────────────┬──────────────────────────┘  │
       │                          │                             │
       │  ┌───────────────────────▼──────────────────────────┐  │
       │  │ Middlewares (Auth JWT, express-validator)        │  │
       │  └───────────────────────┬──────────────────────────┘  │
       │                          │                             │
       │  ┌───────────────────────▼──────────────────────────┐  │
       │  │ Controllers (Lógica de Negocio y Mapeo)          │  │
       │  └───────────────────────┬──────────────────────────┘  │
       │                          │                             │
       │  ┌───────────────────────▼──────────────────────────┐  │
       │  │ Models (Esquemas Mongoose / Métodos)            │  │
       │  └───────────────────────┬──────────────────────────┘  │
       └──────────────────────────┼─────────────────────────────┘
                                  │  Driver Mongoose
                                  ▼
       ┌────────────────────────────────────────────────────────┐
       │               Base de Datos MongoDB Atlas              │
       └────────────────────────────────────────────────────────┘

```

### **Principales Capas:**

* **Routers (`/routes`):** Mapean las peticiones en rutas HTTP (`/api/users`, `/api/numerology-profiles`) y redirigen la solicitud según el verbo HTTP (`GET`, `POST`, `PUT`, `DELETE`).
* **Middlewares (`/middlewares`):** Garantizan la seguridad y la desinfección de la entrada de datos. Validan tokens JWT (`x-token`) y procesan las reglas de `express-validator` devolviendo un `400 Bad Request` antes de invocar la lógica del negocio.
* **Controllers (`/controllers`):** Contienen la lógica de negocio (como el cálculo del número del camino de vida `lifePathNumber`), invocan las operaciones en la base de datos y retornan las respuestas HTTP formateadas.
* **Models (`/models`):** Definen la estructura rigurosa de las colecciones de datos, tipos de atributos, restricciones de unicidad y métodos de transformación del objeto.

---

## 🗄️ 2. Modelo de Datos y Esquema de Base de Datos

La persistenia de datos utiliza un modelo híbrido no relacional en **MongoDB**, aprovechando referencias mediante el tipo `Schema.Types.ObjectId` para asociar los registros de perfiles numerológicos con sus respectivos usuarios.

### **2.1 Diagrama Entidad-Relación (Lógico / Mongoose)**

```text
  ┌─────────────────────────────────┐        1 : N        ┌─────────────────────────────────┐
  │              Users              │ ───────────────────> │       NumerologyProfiles        │
  ├─────────────────────────────────┤                     ├─────────────────────────────────┤
  │ _id : ObjectId                  │                     │ _id : ObjectId                  │
  │ firstName : String              │                     │ usuarioId / userId : ObjectId   │ <── (FK)
  │ lastName : String               │                     │ nombreCompleto : String         │
  │ email : String (Unique)         │                     │ fechaNacimiento : Date          │
  │ password : String (Hashed)      │                     │ lifePathNumber : Number         │
  │ birthDate : Date                │                     │ notes : String                  │
  │ role : String [Enum]            │                     │ createdAt : Date                │
  │ createdAt : Date                │                     │ updatedAt : Date                │
  │ updatedAt : Date                │                     └─────────────────────────────────┘
  └─────────────────────────────────┘

```

---

### **2.2 Especificación de Colecciones y Esquemas**

#### **A. Colección `Users**`

Almacena las credenciales y la información básica de los usuarios registrados en el sistema.

| Campo | Tipo | Requerido | Único | Descripción / Restricción |
| --- | --- | --- | --- | --- |
| `_id` | `ObjectId` | Auto | **Sí** | Identificador primario generado por MongoDB. |
| `firstName` | `String` | **Sí** | No | Nombre del usuario. |
| `lastName` | `String` | **Sí** | No | Apellido del usuario. |
| `email` | `String` | **Sí** | **Sí** | Correo electrónico de acceso. Debe cumplir formato RFC 5322. |
| `password` | `String` | **Sí** | No | Contraseña encriptada con algoritmo hash (`bcryptjs`). |
| `birthDate` | `Date` | **Sí** | No | Fecha de nacimiento registrada en formato ISO `YYYY-MM-DD`. |
| `role` | `String` | **Sí** | No | Valor permitido: `USER_ROLE`, `ADMIN_ROLE` (Default: `USER_ROLE`). |
| `createdAt` | `Date` | Auto | No | Estampa de tiempo asignada automáticamente por Mongoose. |
| `updatedAt` | `Date` | Auto | No | Estampa de tiempo actualizada automáticamente. |

---

#### **B. Colección `NumerologyProfiles**`

Guarda los perfiles numerológicos generados y sus cálculos correspondientes.

| Campo | Tipo | Requerido | Único | Descripción / Restricción |
| --- | --- | --- | --- | --- |
| `_id` | `ObjectId` | Auto | **Sí** | Identificador primario del perfil. |
| `usuarioId` / `userId` | `ObjectId` | **Sí** | No | Referencia (`ref: 'User'`) al identificador del usuario padre. |
| `nombreCompleto` | `String` | **Sí** | No | Nombre completo asociado a la lectura numerológica. |
| `fechaNacimiento` | `Date` | **Sí** | No | Fecha base para el cálculo de los números del perfil. |
| `lifePathNumber` | `Number` | Auto | No | Valor entero derivado del cálculo del camino de vida (1-9, 11, 22, 33). |
| `notes` | `String` | No | No | Observaciones o notas adicionales del perfil. |
| `createdAt` | `Date` | Auto | No | Estampa de tiempo asignada automáticamente. |
| `updatedAt` | `Date` | Auto | No | Estampa de tiempo actualizada automáticamente. |

---

## ⚙️ 3. Variables de Entorno e Integración

Para la correcta ejecución del sistema en distintos entornos (Desarrollo, Pruebas y Producción), se requiere la configuración de las siguientes variables de entorno en el archivo `.env`:

```ini
# Configuración del Servidor
PORT=8080
NODE_ENV=development

# Conexión a la Base de Datos
MONGODB_CNN=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/numerologia

# Seguridad y Autenticación JWT
SECRETORPRIVATEKEY=TuClaveSecretaSuperSeguraParaJWT2026

```

---

## 🛠️ 4. Configuración y Despliegue Local

### **Requisitos Previos:**

* Node.js instalado (Versión v18.x o superior).
* Instancia activa de MongoDB local o Cluster en MongoDB Atlas.

### **Instrucciones de Instalación:**

1. **Clonar repositorio e instalar dependencias:**
```bash
git clone <URL_DEL_REPOSITORIO>
cd backend-numerologia
npm install

```


2. **Configurar el entorno:**
Crear un archivo `.env` en la raíz del proyecto basándose en el bloque de la Sección 3.
3. **Iniciar el servidor en modo desarrollo:**
```bash
npm run dev

```


4. **Verificación de conexión:**
El servidor estará escuchando en `http://localhost:3200/` y confirmará la conexión exitosa hacia MongoDB Atlas en la consola.