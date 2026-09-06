# Arte Mabel

Catálogo interactivo de repostería artesanal. El cliente explora productos, guarda favoritos, crea un pedido y coordina directamente con el negocio por WhatsApp. No hay pagos ni delivery.

## Tecnologías

- Frontend: React, Vite, Bootstrap 5, Bootstrap Icons y Framer Motion.
- Backend: Node.js, Express, MongoDB Atlas/Mongoose, JWT y bcrypt.

## Estructura

```
frontend/     Aplicación React, páginas y componentes reutilizables
backend/      API REST: modelos, rutas, controladores y middleware
```

## Configuración y ejecución

1. Copia `backend/.env.example` como `backend/.env` y define:

   ```env
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=una_clave_larga_y_aleatoria
   CLIENT_URL=http://localhost:5173
   WHATSAPP_NUMBER=50600000000
   ```

2. Copia `frontend/.env.example` como `frontend/.env` y define la API y WhatsApp:

   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_WHATSAPP_NUMBER=50600000000
   ```

3. Instala y arranca los dos procesos en terminales independientes:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Para compilar el frontend: `cd frontend && npm run build`.

## Datos demo

Tras configurar MongoDB, puedes cargar datos de prueba de forma manual (el comando reemplaza los datos de demo de la base seleccionada):

```bash
cd backend
npm run seed
```

- Admin: `admin@artemabel.demo` / `AdminDemo123!`
- Cliente: `cliente@artemabel.demo` / `ClienteDemo123!`

El usuario demo cliente tiene una reseña de ejemplo, pero para probar reseñas nuevas primero debe crear un pedido del producto.

## API principal

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/products`, `GET /api/products/:id`
- `GET|POST|DELETE /api/favorites`
- `GET|POST|PUT|DELETE /api/cart`
- `POST|GET /api/orders`
- Administración protegida: `/api/admin/dashboard`, `/api/admin/orders`, `/api/admin/reviews` y CRUD de `/api/products`.

La API valida el JWT y el rol de administrador en el servidor; el frontend no decide permisos. Los precios se copian al pedido al crearlo.

## Servicios externos

Solo MongoDB Atlas y un número válido de WhatsApp son necesarios para el MVP. Las imágenes se guardan como URL, de modo que se puede usar Cloudinary posteriormente sin cambiar el modelo: basta con cargar el archivo allí y colocar la URL resultante al crear/editar el producto. No hay claves de Cloudinary incluidas ni requeridas actualmente.
