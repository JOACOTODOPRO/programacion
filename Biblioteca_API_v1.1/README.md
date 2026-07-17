# 📚 Biblioteca Digital API — v1.1

Aplicación web para la gestión (CRUD) de libros de una biblioteca digital, desarrollada con **Node.js + Express + MongoDB (Mongoose)** en el backend y **HTML, CSS y JavaScript puro** en el frontend, siguiendo una arquitectura **MVC**.

Proyecto académico — versión 1.1 (mejora sobre la versión 1.0).

---

## 📁 Estructura del proyecto

```
Biblioteca_API_v1.1/
├── backend/
│   ├── server.js              # Punto de entrada del servidor Express
│   ├── package.json
│   ├── .env                   # Variables de entorno (puerto, URI de Mongo)
│   ├── config/
│   │   └── database.js        # Conexión a MongoDB
│   ├── models/
│   │   └── Libro.js           # Modelo Mongoose (schema + validaciones)
│   ├── controllers/
│   │   └── libroController.js # Lógica de negocio del CRUD
│   ├── routes/
│   │   └── libros.js          # Definición de endpoints REST
│   └── middleware/
│       └── errorHandler.js    # Manejo centralizado de errores y 404
├── frontend/
│   ├── index.html              # Interfaz principal
│   ├── style.css                # Estilos
│   └── app.js                   # Lógica del cliente (Fetch API)
├── README.md
└── Documentacion.pdf
```

---

## 🛠️ Tecnologías utilizadas

| Capa        | Tecnología                          |
|-------------|--------------------------------------|
| Backend     | Node.js, Express                     |
| Base de datos | MongoDB + Mongoose                 |
| Frontend    | HTML5, CSS3, JavaScript (Fetch API)  |
| Arquitectura| MVC (Modelo - Vista - Controlador)   |

---

## ✅ Requisitos previos

- **Node.js** instalado (v18 o superior recomendado). Verificar con:
  ```bash
  node -v
  npm -v
  ```
- **MongoDB** instalado y corriendo localmente, **o** una base de datos en **MongoDB Atlas** (nube, gratuita).

---

## 🚀 Instalación y ejecución paso a paso

### 1. Descomprimir / clonar el proyecto

Ubicate en la carpeta raíz `Biblioteca_API_v1.1/`.

### 2. Levantar MongoDB

**Opción A — MongoDB local:**

Windows / macOS / Linux (con MongoDB instalado como servicio o manualmente):
```bash
mongod
```
Esto deja MongoDB escuchando en `mongodb://127.0.0.1:27017` por defecto.

**Opción B — MongoDB Atlas (nube):**

1. Crear una cuenta gratuita en https://www.mongodb.com/atlas
2. Crear un cluster gratuito (M0).
3. Crear un usuario de base de datos y habilitar el acceso desde tu IP (o `0.0.0.0/0` para pruebas).
4. Copiar la cadena de conexión (Connection String), similar a:
   ```
   mongodb+srv://usuario:password@cluster0.mongodb.net/biblioteca_digital
   ```

### 3. Configurar las variables de entorno

Abrir el archivo `backend/.env` y configurar:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/biblioteca_digital
```

Si usás Atlas, reemplazá `MONGO_URI` por tu cadena de conexión copiada en el paso anterior.

### 4. Instalar dependencias del backend

```bash
cd backend
npm install
```

Esto instala: `express`, `mongoose`, `cors`, `dotenv` (y `nodemon` como dependencia de desarrollo).

### 5. Ejecutar el backend

```bash
npm start
```

Deberías ver en la consola:

```
✅ Conexión a MongoDB establecida correctamente
   Base de datos: biblioteca_digital
🚀 Servidor corriendo en http://localhost:5000
```

> Para desarrollo con recarga automática, se puede usar `npm run dev` (requiere `nodemon`).

### 6. Abrir el frontend

Con el backend corriendo, abrir el archivo:

```
frontend/index.html
```

directamente en el navegador (doble clic), o servirlo con una extensión tipo *Live Server* de VSCode.

> El frontend está configurado para consumir la API en `http://localhost:5000/libros` (ver constante `API_URL` en `frontend/app.js`). Si el backend corre en otro puerto o host, actualizar esa constante.

---

## 🔗 Endpoints de la API REST

Base URL: `http://localhost:5000`

| Método | Endpoint       | Descripción                        |
|--------|----------------|-------------------------------------|
| GET    | `/libros`      | Obtiene todos los libros            |
| GET    | `/libros/:id`  | Obtiene un libro específico por ID  |
| POST   | `/libros`      | Crea un nuevo libro                 |
| PUT    | `/libros/:id`  | Actualiza un libro existente        |
| DELETE | `/libros/:id`  | Elimina un libro                    |

### Ejemplo de body para `POST /libros` o `PUT /libros/:id`

```json
{
  "titulo": "Cien años de soledad",
  "autor": "Gabriel García Márquez",
  "anio": 1967,
  "genero": "Realismo mágico",
  "estado": "disponible"
}
```

### Ejemplo de respuesta

```json
{
  "exito": true,
  "mensaje": "Libro creado correctamente",
  "datos": {
    "_id": "6613f2a1c2a4b5e1a8f3d9c2",
    "titulo": "Cien años de soledad",
    "autor": "Gabriel García Márquez",
    "anio": 1967,
    "genero": "Realismo mágico",
    "estado": "disponible",
    "createdAt": "2026-07-10T12:00:00.000Z",
    "updatedAt": "2026-07-10T12:00:00.000Z"
  }
}
```

---

## 🧱 Modelo de datos (colección `libros`)

```js
{
  titulo: String,   // obligatorio
  autor: String,    // obligatorio
  anio: Number,     // obligatorio
  genero: String,   // opcional (por defecto: "Sin especificar")
  estado: String,   // "disponible" | "prestado" (por defecto: "disponible")
  createdAt: Date,  // automático
  updatedAt: Date   // automático
}
```

---

## ✨ Mejoras de la versión 1.1 respecto a la 1.0

- Conexión real y desacoplada a MongoDB (`config/database.js`).
- Separación estricta en capas **MVC**: modelos, controladores y rutas en archivos independientes.
- Controladores dedicados por operación del CRUD.
- Rutas organizadas con `express.Router()`.
- Validaciones de datos a nivel de esquema (Mongoose) y a nivel de formulario (frontend).
- Manejo de errores centralizado con middleware (`errorHandler.js`) y respuestas 404 para rutas inexistentes.
- Interfaz gráfica renovada (HTML + CSS) con formulario, tabla y estados visuales de "disponible/prestado".
- Comunicación 100% asíncrona frontend-backend mediante **Fetch API**.
- Mensajes de éxito/error visibles para el usuario.
- Código comentado explicando el rol de cada archivo dentro del patrón MVC.
- README con instrucciones detalladas de instalación y ejecución.

---

## 🩺 Solución de problemas comunes

- **"No se pudo conectar con el servidor"** en el frontend → verificar que el backend esté corriendo (`npm start`) y que `API_URL` en `app.js` apunte al puerto correcto.
- **Error de conexión a MongoDB** → verificar que `mongod` esté corriendo (si es local) o que la cadena `MONGO_URI` de Atlas sea correcta y la IP esté habilitada.
- **CORS bloqueado** → el backend ya incluye el middleware `cors()`, así que no debería ocurrir; si persiste, verificar que se esté llamando a la URL correcta.

---

## 👤 Autor

Proyecto desarrollado como trabajo práctico de programación — versión 1.1.
