# Backend Entrega Final - Ecommerce

## Descripción

Proyecto backend desarrollado como entrega final del curso de Backend.

La aplicación consiste en una API de ecommerce desarrollada con **Node.js y Express**, utilizando **MongoDB Atlas como sistema de persistencia principal** mediante Mongoose.

Durante el desarrollo se realizó la migración de persistencia desde archivos JSON hacia MongoDB y se implementó una arquitectura organizada mediante **DAO, Repository y Services**, separando el acceso a datos de la lógica de negocio.

El proyecto incluye funcionalidades de:

- Gestión de productos.
- Paginación.
- Filtros mediante query params.
- Ordenamiento por precio.
- Gestión de carritos.
- Referencias entre documentos mediante ObjectId.
- `populate()` para obtener información relacionada.
- Registro y autenticación de usuarios.
- Contraseñas protegidas mediante bcrypt.
- Autenticación mediante JWT y Passport.
- Autorización mediante roles.
- Recuperación de contraseña mediante correo electrónico.
- Validación de expiración de tokens de recuperación.
- Generación de tickets de compra.
- Control de stock.
- Compras completas y parciales.
- Vistas con Handlebars.
- Actualización de productos mediante Socket.io.

Repositorio del proyecto:

https://github.com/Mr-Isac/backend-entregaFinal

---

# Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Mongoose Paginate V2
- Express Handlebars
- Socket.io
- Passport
- Passport JWT
- JSON Web Token
- bcrypt
- Nodemailer
- dotenv

---

# Instalación

Clonar el repositorio:

```bash
git clone https://github.com/Mr-Isac/backend-entregaFinal.git
```

Ingresar a la carpeta del proyecto:

```bash
cd backend-entregaFinal
```

Instalar las dependencias:

```bash
npm install
```

---

# Configuración de variables de entorno

El proyecto utiliza variables de entorno para almacenar la configuración sensible.

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=8080

MONGO_URI=URI_DE_MONGODB_ATLAS

JWT_SECRET=CLAVE_SECRETA_PARA_JWT

MAIL_USER=CORREO_DE_GMAIL

MAIL_PASSWORD=APP_PASSWORD_DE_GMAIL
```

### Descripción de las variables

| Variable        | Descripción                                           |
| --------------- | ----------------------------------------------------- |
| `PORT`          | Puerto utilizado por el servidor                      |
| `MONGO_URI`     | Cadena de conexión a MongoDB Atlas                    |
| `JWT_SECRET`    | Clave utilizada para firmar los tokens JWT            |
| `MAIL_USER`     | Correo utilizado para enviar mensajes de recuperación |
| `MAIL_PASSWORD` | App Password utilizada por Nodemailer                 |

Las credenciales utilizadas durante el desarrollo no deben publicarse en el repositorio.

Para ejecutar el proyecto, cada entorno debe configurar sus propias variables de entorno.

No es necesario instalar MongoDB localmente.

---

# Ejecución del proyecto

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

El servidor estará disponible en:

```text
http://localhost:8080
```

---

# Persistencia con MongoDB

La aplicación utiliza MongoDB Atlas mediante Mongoose.

## Modelo Product

Representa los productos disponibles en la tienda.

Campos principales:

- `title`
- `description`
- `code`
- `price`
- `status`
- `stock`
- `category`
- `thumbnails`

## Modelo Cart

Representa los carritos de compra.

Cada carrito almacena referencias hacia productos mediante ObjectId.

Ejemplo:

```json
{
  "products": [
    {
      "product": "id_producto",
      "quantity": 2
    }
  ]
}
```

Para obtener la información completa de los productos asociados se utiliza:

```javascript
populate("products.product");
```

De esta manera se almacena únicamente la referencia del producto y al consultar el carrito se obtiene la información completa.

## Modelo User

Representa los usuarios registrados.

Campos principales:

- `first_name`
- `last_name`
- `email`
- `age`
- `password`
- `cart`
- `role`

Las contraseñas son almacenadas utilizando **bcrypt**.

Cada usuario posee un carrito asociado.

## Modelo Ticket

Representa una compra realizada.

Campos principales:

- `code`
- `purchase_datetime`
- `amount`
- `purchaser`

Cada compra genera un código único de ticket.

---

# Arquitectura del proyecto

El proyecto utiliza una separación por capas:

```text
Router
   ↓
Service
   ↓
Repository
   ↓
DAO
   ↓
Model
   ↓
MongoDB
```

### DAO

Los DAO se encargan directamente de las operaciones de persistencia utilizando Mongoose.

Ejemplos:

- `UsersDAO`
- `ProductsDAO`
- `CartsDAO`
- `TicketsDAO`

### Repository

Los Repository funcionan como una capa intermedia entre los Services y los DAO.

Permiten desacoplar la lógica de negocio del acceso directo a los modelos.

### Services

Los Services contienen la lógica de negocio de la aplicación.

Ejemplos:

- `UsersService`
- `ProductsService`
- `CartsService`
- `PasswordService`
- `TicketsService`
- `PurchaseService`

---

# Autenticación

El proyecto utiliza **JWT (JSON Web Token)** para la autenticación de usuarios.

Al iniciar sesión correctamente se genera un token:

```text
POST /api/users/login
```

El token debe enviarse posteriormente mediante el header:

```text
Authorization: Bearer TOKEN
```

La autenticación se realiza utilizando Passport JWT.

---

# Registro de usuarios

Endpoint:

```text
POST /api/users/register
```

Permite registrar un nuevo usuario.

El sistema:

1. Verifica que el email no esté registrado.
2. Genera un carrito para el usuario.
3. Hashea la contraseña mediante bcrypt.
4. Guarda el usuario en MongoDB.

El rol predeterminado es:

```text
user
```

---

# Login

Endpoint:

```text
POST /api/users/login
```

Ejemplo:

```json
{
  "email": "isaac@test.com",
  "password": "123456"
}
```

Si las credenciales son correctas, se devuelve un JWT.

---

# Usuario actual

Endpoint:

```text
GET /api/sessions/current
```

Requiere autenticación mediante JWT.

Devuelve la información del usuario autenticado sin exponer su contraseña.

La respuesta utiliza un **DTO (Data Transfer Object)** para controlar los datos enviados al cliente.

---

# Autorización por roles

El proyecto implementa autorización mediante roles.

### Admin

El usuario con rol `admin` puede:

- Crear productos.
- Actualizar productos.
- Eliminar productos.

### User

El usuario con rol `user` puede:

- Agregar productos a su carrito.
- Realizar compras.

Las rutas protegidas utilizan Passport JWT junto con middleware de autorización.

---

# Recuperación de contraseña

El proyecto implementa recuperación de contraseña mediante correo electrónico.

## Solicitar recuperación

Endpoint:

```text
POST /api/password/request
```

Ejemplo:

```json
{
  "email": "isaac@test.com"
}
```

El sistema genera un token único de recuperación y envía un enlace al correo del usuario.

El token tiene una duración de **1 hora**.

## Restablecer contraseña

El enlace recibido dirige a:

```text
GET /api/password/reset?token=TOKEN
```

La aplicación muestra un formulario para ingresar la nueva contraseña.

Posteriormente se realiza:

```text
POST /api/password/reset
```

Ejemplo:

```json
{
  "token": "TOKEN_DE_RECUPERACION",
  "newPassword": "nueva_clave"
}
```

El sistema verifica:

- Que el token exista.
- Que el token no haya expirado.
- Que la nueva contraseña sea diferente de la anterior.

Una vez utilizada correctamente, el token se elimina y no puede reutilizarse.

El envío de correos se realiza mediante **Nodemailer**.

---

# Endpoints de Productos

## Obtener productos

```text
GET /api/products
```

Permite recibir parámetros mediante query params.

### Limit

```text
GET /api/products?limit=5
```

Por defecto:

```text
limit = 10
```

### Page

```text
GET /api/products?page=2
```

Por defecto:

```text
page = 1
```

### Sort

Orden ascendente:

```text
GET /api/products?sort=asc
```

Orden descendente:

```text
GET /api/products?sort=desc
```

### Query

Filtrar por categoría:

```text
GET /api/products?query=remeras
```

Filtrar por disponibilidad:

```text
GET /api/products?query=true
```

La respuesta incluye información de paginación:

- `status`
- `payload`
- `totalPages`
- `prevPage`
- `nextPage`
- `page`
- `hasPrevPage`
- `hasNextPage`
- `prevLink`
- `nextLink`

---

## Obtener producto por ID

```text
GET /api/products/:pid
```

---

## Crear producto

```text
POST /api/products
```

Requiere:

```text
Authorization: Bearer TOKEN
```

Rol requerido:

```text
admin
```

---

## Actualizar producto

```text
PUT /api/products/:pid
```

Requiere autenticación y rol `admin`.

---

## Eliminar producto

```text
DELETE /api/products/:pid
```

Requiere autenticación y rol `admin`.

---

# Endpoints de Carritos

## Crear carrito

```text
POST /api/carts
```

---

## Obtener carrito específico

```text
GET /api/carts/:cid
```

Obtiene los productos pertenecientes al carrito solicitado.

Los productos son obtenidos mediante `populate()`.

---

## Agregar producto al carrito

```text
POST /api/carts/:cid/product/:pid
```

Requiere autenticación mediante JWT y rol `user`.

Si el producto ya existe dentro del carrito, aumenta su cantidad.

---

## Actualizar todos los productos del carrito

```text
PUT /api/carts/:cid
```

Recibe un arreglo completo de productos.

Ejemplo:

```json
{
  "products": [
    {
      "product": "id_producto",
      "quantity": 3
    }
  ]
}
```

---

## Actualizar cantidad de un producto

```text
PUT /api/carts/:cid/products/:pid
```

Permite modificar la cantidad de un producto dentro del carrito.

---

## Eliminar producto específico del carrito

```text
DELETE /api/carts/:cid/products/:pid
```

Elimina únicamente el producto seleccionado.

---

## Vaciar carrito

```text
DELETE /api/carts/:cid
```

Elimina todos los productos almacenados dentro del carrito.

---

# Proceso de compra

Endpoint:

```text
POST /api/carts/:cid/purchase
```

Requiere:

- JWT válido.
- Rol `user`.
- Que el carrito pertenezca al usuario autenticado.

El proceso de compra:

1. Verifica que el carrito exista.
2. Verifica que no esté vacío.
3. Comprueba el stock disponible de cada producto.
4. Descuenta el stock de los productos disponibles.
5. Calcula el importe total.
6. Genera un ticket.
7. Elimina del carrito los productos comprados.
8. Mantiene en el carrito los productos que no pudieron comprarse por falta de stock.

Esto permite realizar **compras parciales**.

Por ejemplo, si un carrito contiene:

```text
Producto A → stock suficiente
Producto B → stock insuficiente
```

El Producto A se compra correctamente, mientras que el Producto B permanece en el carrito para una futura compra.

---

# Tickets

Cada compra genera un ticket con:

- Código único.
- Fecha de compra.
- Importe total.
- Email del comprador.

Ejemplo:

```json
{
  "code": "codigo_unico",
  "amount": 320000,
  "purchaser": "isaac@test.com"
}
```

---

# Vistas con Handlebars

## Productos

Ruta:

```text
GET /products
```

Permite visualizar:

- Listado de productos.
- Información de productos.
- Paginación.
- Opciones relacionadas con el carrito.

## Carrito

Ruta:

```text
GET /carts/:cid
```

Permite visualizar los productos pertenecientes a un carrito específico.

---

# WebSockets

Se utiliza Socket.io para actualizar la visualización de productos en tiempo real.

Las operaciones administrativas sobre productos pueden emitir eventos para actualizar automáticamente las vistas conectadas.

---

# Estructura del proyecto

```text
backend-entregaFinal/

├── config/
│   ├── db.js
│   ├── mailer.js
│   └── passport.config.js
│
├── dao/
│   ├── carts.dao.js
│   ├── products.dao.js
│   ├── tickets.dao.js
│   └── users.dao.js
│
├── dto/
│   └── user.dto.js
│
├── middlewares/
│   └── auth.middleware.js
│
├── models/
│   ├── Cart.js
│   ├── Product.js
│   ├── Ticket.js
│   └── User.js
│
├── repositories/
│   ├── carts.repository.js
│   ├── products.repository.js
│   ├── tickets.repository.js
│   └── users.repository.js
│
├── routes/
│   ├── carts.router.js
│   ├── password.router.js
│   ├── products.router.js
│   ├── sessions.router.js
│   ├── users.router.js
│   └── views.router.js
│
├── services/
│   ├── carts.service.js
│   ├── password.service.js
│   ├── products.service.js
│   ├── purchase.service.js
│   ├── tickets.service.js
│   └── users.service.js
│
├── views/
│   ├── layouts/
│   ├── products.handlebars
│   ├── cart.handlebars
│   ├── realTimeProducts.handlebars
│   └── reset-password.handlebars
│
├── public/
│   └── js/
│
├── app.js
├── package.json
├── .env
└── README.md
```

---

# Autor

**Isaac Mendoza**
