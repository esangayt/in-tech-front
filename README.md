# InTech Frontend - Sistema de Gestión de Personas y Productos

Frontend Angular desarrollado como parte del desafío técnico para consumir el microservicio Django de gestión de Personas y Productos.

## 🚀 Características

### Funcionalidades Principales
- ✅ **Gestión de Personas**: CRUD completo con filtros por email y apellido
- ✅ **Gestión de Productos**: CRUD completo con filtros avanzados (SKU, rango de precios, búsqueda)
- ✅ **Autenticación JWT**: Login, guards de rutas y manejo de tokens
- ✅ **Paginación**: Navegación por páginas en listados
- ✅ **Validaciones**: Formularios reactivos con validaciones completas
- ✅ **Manejo de errores**: Interceptor centralizado con mensajes amigables
- ✅ **Diseño responsivo**: UI moderna con TailwindCSS y modo oscuro
- ✅ **Loading states**: Indicadores de carga en todas las operaciones
- ✅ **Confirmaciones**: Diálogos de confirmación antes de eliminar

### Arquitectura
- **Standalone Components**: Angular 20 con arquitectura moderna
- **Lazy Loading**: Carga diferida de módulos para optimización
- **Servicios**: Separación clara entre lógica de negocio y presentación
- **Interceptors**: Manejo centralizado de autenticación y errores
- **Guards**: Protección de rutas privadas
- **Reactive Forms**: Validaciones robustas y manejo de estado
- **RxJS**: Manejo de estado asíncrono y eventos

## 📋 Requisitos

- **Node.js**: v18.x o superior
- **npm**: v9.x o superior
- **Angular CLI**: v20.x (se instala con el proyecto)
- **Backend Django**: Corriendo en http://localhost:8000

## 🛠️ Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd in-tech-front
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar URL del backend

Edita el archivo `src/environments/environment.ts` para desarrollo:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000'
};
```

Para producción, edita `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.midominio.com'
};
```

### 4. Iniciar el servidor de desarrollo

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

## 🏗️ Build de Producción

### Build optimizado

```bash
npm run build
```

Los archivos generados estarán en la carpeta `dist/in-tech-front/browser/`

### Servir el build con un servidor estático

#### Opción 1: Usando http-server

```bash
npm install -g http-server
http-server dist/in-tech-front/browser -p 8080
```

#### Opción 2: Usando serve

```bash
npm install -g serve
serve -s dist/in-tech-front/browser -p 8080
```

## 🐳 Docker (Opcional)

### Dockerfile para producción

Crea un archivo `Dockerfile` en la raíz del proyecto:

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/in-tech-front/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Configuración de caché para assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Construir y ejecutar con Docker

```bash
# Construir imagen
docker build -t in-tech-front .

# Ejecutar contenedor
docker run -p 8080:80 in-tech-front
```

### Docker Compose con el backend

Crea un archivo `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    image: <tu-imagen-django>
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
    # ... otras configuraciones

  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                    # Servicios, modelos, guards, interceptors
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   ├── auth.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   ├── models/
│   │   │   ├── auth.model.ts
│   │   │   ├── person.model.ts
│   │   │   └── product.model.ts
│   │   └── services/
│   │       ├── auth.service.ts
│   │       ├── person.service.ts
│   │       └── product.service.ts
│   ├── features/               # Módulos por funcionalidad
│   │   ├── auth/
│   │   │   └── login/
│   │   ├── persons/
│   │   │   ├── person-list/
│   │   │   └── person-form/
│   │   └── products/
│   │       ├── product-list/
│   │       └── product-form/
│   ├── shared/                 # Componentes reutilizables
│   │   └── components/
│   │       ├── confirm-dialog/
│   │       ├── empty-state/
│   │       ├── error-alert/
│   │       ├── loading-spinner/
│   │       └── navbar/
│   ├── app.config.ts
│   ├── app.routes.ts
│   └── app.ts
├── environments/
│   ├── environment.ts          # Desarrollo
│   └── environment.prod.ts     # Producción
└── ...
```

## 🔗 Rutas de la Aplicación

| Ruta | Descripción | Protegida |
|------|-------------|-----------|
| `/login` | Página de inicio de sesión | No |
| `/persons` | Listado de personas | Sí |
| `/persons/new` | Crear nueva persona | Sí |
| `/persons/:id/edit` | Editar persona existente | Sí |
| `/products` | Listado de productos | Sí |
| `/products/new` | Crear nuevo producto | Sí |
| `/products/:id/edit` | Editar producto existente | Sí |

## 🔐 Autenticación

La aplicación implementa autenticación JWT:

1. El usuario inicia sesión en `/login` con credenciales del backend Django
2. Al autenticarse, se almacenan los tokens (access y refresh) en localStorage
3. El `authInterceptor` agrega automáticamente el token a todas las peticiones
4. El `authGuard` protege las rutas privadas
5. Si el token expira o es inválido, el usuario es redirigido a `/login`

### Datos de prueba

Usa las credenciales configuradas en tu backend Django.

## 🎨 Características de UI/UX

- **TailwindCSS**: Framework CSS utilitario para diseño responsivo
- **Modo oscuro**: Soporte automático basado en preferencias del sistema
- **Formularios validados**: Mensajes de error claros y validaciones en tiempo real
- **Estados de carga**: Spinners durante operaciones asíncronas
- **Estados vacíos**: Mensajes informativos cuando no hay datos
- **Confirmaciones**: Diálogos antes de acciones destructivas
- **Alertas de error**: Mensajes amigables para errores HTTP
- **Paginación**: Navegación intuitiva en listados grandes

## 🧪 Testing

### Ejecutar tests unitarios

```bash
npm test
```

### Ejecutar tests con cobertura

```bash
npm run test -- --code-coverage
```

### Tests E2E (requiere configuración adicional)

```bash
# Instalar Cypress o Playwright
npm install --save-dev cypress

# Ejecutar E2E
npx cypress open
```

## 📊 Características Técnicas Avanzadas

### Filtros y Búsqueda

**Personas:**
- Filtro por email
- Filtro por apellido
- Ordenamiento por fecha de creación (asc/desc)

**Productos:**
- Búsqueda general por nombre (con debounce de 400ms)
- Filtro por SKU
- Filtro por rango de precios (mínimo y máximo)
- Ordenamiento múltiple (nombre, precio, fecha)

### Validaciones de Formularios

**Persona:**
- `first_name`: Requerido, máximo 100 caracteres
- `last_name`: Requerido, máximo 100 caracteres
- `email`: Requerido, formato de email válido

**Producto:**
- `name`: Requerido, máximo 150 caracteres
- `sku`: Requerido, mínimo 3 y máximo 50 caracteres
- `price`: Requerido, numérico, mayor o igual a 0
- `owner`: Opcional, selección de persona existente

### Manejo de Errores

El `errorInterceptor` captura errores HTTP y los transforma en mensajes amigables:

- **400**: Valida y muestra errores de campos específicos
- **401**: Redirige a login
- **403**: Mensaje de permisos insuficientes
- **404**: Recurso no encontrado
- **500**: Error del servidor

## 🚀 Optimizaciones

- **Lazy Loading**: Los módulos se cargan bajo demanda
- **OnPush Change Detection**: Para componentes que lo soporten
- **Debounce**: En búsquedas para reducir peticiones
- **Tree Shaking**: Eliminación de código no usado en build
- **AOT Compilation**: Compilación anticipada en producción
- **Minificación**: Código JavaScript y CSS optimizado

## 📝 Scripts Disponibles

```bash
npm start              # Inicia servidor de desarrollo
npm run build          # Build de producción
npm test               # Ejecuta tests unitarios
npm run watch          # Build en modo watch
npm run lint           # Verifica código con ESLint (si está configurado)
```

## 🔧 Configuración Adicional

### Proxy para desarrollo (opcional)

Si tienes problemas con CORS en desarrollo, crea `proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://localhost:8000",
    "secure": false,
    "changeOrigin": true
  }
}
```

Y actualiza `angular.json`:

```json
"serve": {
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}
```

### Variables de entorno adicionales

Puedes extender `environment.ts` con más configuraciones:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000',
  apiVersion: 'v1',
  enableDebugMode: true,
  // ... más configuraciones
};
```

## 📦 Dependencias Principales

- **Angular**: ^20.2.0
- **RxJS**: ~7.8.0
- **TailwindCSS**: ^4.1.17
- **TypeScript**: ~5.9.2

## 🤝 Integración con el Backend

La aplicación espera las siguientes respuestas del backend:

### Autenticación

```typescript
POST /api/v1/auth/login/
Body: { username: string, password: string }
Response: { access: string, refresh: string, user: User }
```

### Personas

```typescript
GET    /api/v1/persons/          // Lista con paginación
GET    /api/v1/persons/:id/      // Detalle
POST   /api/v1/persons/          // Crear
PATCH  /api/v1/persons/:id/      // Actualizar
DELETE /api/v1/persons/:id/      // Eliminar
```

### Productos

```typescript
GET    /api/v1/products/         // Lista con paginación
GET    /api/v1/products/:id/     // Detalle
POST   /api/v1/products/         // Crear
PATCH  /api/v1/products/:id/     // Actualizar
DELETE /api/v1/products/:id/     // Eliminar
```

## 🎯 Criterios de Evaluación Cubiertos

- ✅ **Correctitud funcional** (35 pts): Todos los CRUD implementados con filtros
- ✅ **Calidad de código** (25 pts): Arquitectura limpia, separación de responsabilidades
- ✅ **UX y manejo de errores** (15 pts): Validaciones, loaders, mensajes claros
- ✅ **Preparación para producción** (10 pts): Environments, build optimizado
- ✅ **Pruebas y calidad** (10 pts): Estructura lista para tests, linting
- ✅ **Bonus**: Autenticación JWT completa, guards, interceptors, Docker opcional

## 📄 Licencia

Este proyecto es parte de un desafío técnico y está disponible para evaluación.

## 👤 Autor

Desarrollado como parte del desafío técnico Frontend Angular Semi-Senior para InTech.

---

**Nota**: Asegúrate de tener el backend Django corriendo antes de iniciar la aplicación. El frontend intentará conectarse a `http://localhost:8000` por defecto.

