# 🚀 WORKFLOW: FRONTEND + GITHUB + VERCEL

**Estado:** Listo para producción  
**Fecha:** March 9, 2026  
**Entorno:** CodeSpace → GitHub → Vercel  

---

## 📋 WORKFLOW COMPLETO

```
LOCAL DEVELOPMENT
├─ npm start (http://localhost:3000)
├─ Probar frontend + API
└─ Tests locales

         ↓↓↓

GIT PUSH → GITHUB
├─ git add .
├─ git commit -m "..."
└─ git push origin main

         ↓↓↓

GITHUB WEBHOOK → VERCEL
├─ Detecta cambios en main
├─ Recompila proyecto
├─ Ejecuta tests (si hay)
└─ Deploy automático

         ↓↓↓

VERCEL PRODUCTION
├─ https://cafeteria-ebenezer.vercel.app
├─ CDN global activado
└─ SSL/TLS automático
```

---

## 🎯 ESTADO ACTUAL

### ✅ Completado
- [x] Backend profesional (11 módulos)
- [x] Frontend SPA (850+ LOC)
- [x] API endpoints (11 funcionales)
- [x] Vercel configurado
- [x] GitHub conectado
- [x] vercel.json existe
- [x] api/index.js (serverless function)

### 🔄 En Progreso
- [ ] Tests automatizados (FASE 0)
- [ ] CI/CD pipeline GitHub Actions (FASE 8)

### 📝 Faltante (Próximas Fases)
- [ ] JWT Authentication (FASE 6)
- [ ] PostgreSQL (FASE 9)
- [ ] Email notifications (FASE 10)

---

## 🛠️ PROCEDIMIENTO LOCAL (DEV)

### 1. Iniciar Servidor Local

```bash
# Terminal 1: Servidor
cd /workspaces/Cafeteria-Ebenezer
npm start

# Output esperado:
# 🚀 Servidor iniciado
# puerto: 3000
# url: http://localhost:3000
```

### 2. Acceder en Navegador

**VS Code Port Forwarding:**
1. Abre: Terminal → Ports
2. Localiza: puerto 3000
3. Clic derecho: "Open in Browser"

**Resultado:** Frontend en navegador del host ✅

### 3. Probar Funcionalidades

#### A. Verificar Health Check
```bash
curl http://localhost:3000/api/health
```

Esperado:
```json
{
  "error": false,
  "message": "Servidor operativo",
  "environment": "development"
}
```

#### B. Crear Pedido
```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "telefono": "+34 600 123 456",
    "producto": "Bocadillo Cubano",
    "cantidad": 1
  }'
```

Esperado: `201` con JSON del pedido

#### C. Crear Reseña
```bash
curl -X POST http://localhost:3000/api/resenas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María",
    "ciudad": "Madrid",
    "texto": "Excelente comida"
  }'
```

Esperado: `201` con JSON de la reseña

#### D. Frontend Manual Testing
1. Navega a "Haz tu pedido"
2. Llena formulario:
   - Nombre: Jorge
   - Teléfono: +34 623 456 789
   - Producto: Pizza Artesana
   - Cantidad: 2
3. Click "Enviar"
4. Esperado: Mensaje verde ✅ "¡Pedido enviado!"

---

## 🔄 PROCESO: LOCAL → GITHUB → VERCEL

### PASO 1: Cambios Locales

```bash
# Edita archivos en VS Code
# Cambios: frontend, backend, config, etc.

# Verifica que funciona:
npm start
# → Prueba en navegador
# → Si OK, continúa

# Terminal 2: Ejecuta tests
npm test
# → Si OK, continúa
```

### PASO 2: Commit a Local Git

```bash
# Ver cambios
git status

# Agregar todos los cambios
git add .

# Crear commit descriptivo
git commit -m "feat(frontend): add order form validation

- Added client-side validation to order form
- Improved error messages display
- Fixed mobile responsive layout
- All tests passing (npm test)"
```

### PASO 3: Push a GitHub

```bash
# Verificar que estás en main
git branch
# Salida debe ser: * main

# Push a GitHub
git push origin main

# Esperado output:
# Counting objects: X, done.
# Compressing objects: 100% (X/X), done.
# Writing objects: 100% (X/X), done.
# Total X (delta X), reused X (delta X)
# To github.com:ialex212004/Cafeteria-Ebenezer.git
#    abc1234..def5678 main -> main
```

### PASO 4: Verificar en GitHub

```bash
# Navega a: https://github.com/ialex212004/Cafeteria-Ebenezer
# 1. Verifica que commit aparece
# 2. Ver commits recientes
# 3. Ver cambios en Files changed
```

### PASO 5: Vercel Automatic Deploy

**Mientras**: GitHub webhook notifica a Vercel  
**Vercel hace:**
1. Clone del repositorio
2. Install dependencias: `npm install`
3. Build: `npm run vercel-build`
4. Deploy a CDN global

**Tiempo total:** ~30-60 segundos

### PASO 6: Verificar en Producción

```bash
# Opción 1: Dashboard
https://vercel.com/dashboard

# Opción 2: Proyecto directo
https://cafeteria-ebenezer.vercel.app

# Opción 3: Verificar API
curl https://cafeteria-ebenezer.vercel.app/api/health
```

---

## 📊 ESTRUCTURA DEL PROYECTO

```
Cafeteria-Ebenezer/
├── 📁 /src/                       (Backend modules)
│   ├── /config/                   (Configuration)
│   ├── /middleware/               (Express middleware)
│   ├── /routes/                   (API endpoints)
│   ├── /utils/                    (Utilities)
│   ├── /validators/               (Validation schemas)
│   └── /__tests__/                (Tests)
│
├── 📁 /public/                    (Frontend - Static)
│   └── index.html                 (Single Page App)
│
├── 📁 /api/                       (Vercel serverless)
│   └── index.js                   (Express exports)
│
├── 📁 /data/                      (Data storage - temp)
│   ├── pedidos.json               (Orders)
│   └── resenas.json               (Reviews)
│
├── 📄 server.js                   (Local entry point)
├── 📄 vercel.json                 (Vercel config)
├── 📄 package.json                (Dependencies)
├── 📄 .gitignore                  (Git ignore rules)
└── 📄 README.md                   (Documentation)
```

---

## 🔐 CONFIGURACIÓN DE VERCEL

### 1. vercel.json (Rutas)

```json
{
  "version": 2,
  "builds": [
    { "src": "api/index.js", "use": "@vercel/node" },
    { "src": "public/**/*", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "api/index.js" },
    { "src": "/(?!api)(.*)", "dest": "public/index.html" },
    { "src": "/", "dest": "public/index.html" }
  ]
}
```

### 2. GitHub Integration

**Automaticall configurado cuando:**
1. Conectaste Vercel a GitHub
2. Seleccionaste repositorio "Cafeteria-Ebenezer"
3. Rama: "main"

**Resultado:**
- ✅ Cada push a main → Deploy
- ✅ Preview URLs para PRs
- ✅ Logs en dashboard

### 3. Environment Variables (si necesario)

En dashboard Vercel:
1. Settings → Environment Variables
2. Agregar si es necesario:
   ```
   NODE_ENV=production
   CORS_ORIGIN=https://cafeteria-ebenezer.vercel.app
   ```

---

## 📱 TESTING ENDPOINTS

### Health Check
```
GET /api/health
Response: 200
{
  "error": false,
  "message": "Servidor operativo"
}
```

### Create Order
```
POST /api/pedidos
Body: {
  "nombre": "string",
  "telefono": "string",
  "producto": "string",
  "cantidad": number
}
Response: 201 (created)
```

### Get Orders
```
GET /api/pedidos
Response: 200
{
  "error": false,
  "data": [...],
  "total": number
}
```

### Create Review
```
POST /api/resenas
Body: {
  "nombre": "string",
  "ciudad": "string",
  "texto": "string"
}
Response: 201 (created)
```

### Get Reviews (Public)
```
GET /api/resenas
Response: 200
{
  "error": false,
  "data": [...],
  "total": number
}
```

---

## ⚡ OPTIMIZACIONES IMPLEMENTADAS

### Frontend

```html
<!-- Preconnect to fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- CSS inline para critical path -->
<style>
  :root { --viewport-width: 390px; }
  @media (min-width: 768px) { --viewport-width: 768px; }
  @media (min-width: 1920px) { --viewport-width: 1920px; }
</style>

<!-- Lazy loading images -->
<img src="..." loading="lazy" />

<!-- Async fetch, no bloquea render -->
<script>
  fetch('/api/pedidos').then(...)
</script>
```

### Backend

```javascript
// Rate limiting: Previene abuse
app.use('/api/', apiLimiter); // 100 req/15min

// CORS: Configurado para producción
cors: {
  origin: process.env.CORS_ORIGIN,
  credentials: true
}

// Compression: Reduce tamaño de respuesta
app.use(compression());

// Caching: Headers HTTP
res.set('Cache-Control', 'public, max-age=3600');
```

---

## 🧪 VALIDACIÓN PRE-DEPLOY

Antes de cada push a main:

```bash
# 1. Tests (si existen)
npm test

# 2. Linting
npm run lint

# 3. Build check
npm run build

# 4. Manual test
npm start
# → Abre http://localhost:3000
# → Prueba forms
# → Verifica consola (F12)
```

---

## 📊 MONITOREO EN PRODUCCIÓN

### Dashboard Vercel

1. https://vercel.com/dashboard
2. Selecciona: cafeteria-ebenezer
3. Ver:
   - Deployments (historial)
   - Analytics (visitas, tiempo respuesta)
   - Logs (errores, requests)
   - Settings (env vars, domains)

### Logs en Tiempo Real

```bash
# Local (si tienes Vercel CLI)
vercel logs cafeteria-ebenezer

# O en dashboard:
# → Deployments → Ver logs
```

---

## 🆘 TROUBLESHOOTING

### Servidor no inicia

```bash
# Verificar puerto 3000 ocupado
lsof -i :3000

# Matar proceso
kill -9 <PID>

# Intentar de nuevo
npm start
```

### Frontend no carga

```bash
# Verificar static files
ls public/

# Debe existir: index.html

# Limpiar caché navegador
Ctrl+Shift+Delete (Windows/Linux)
Cmd+Shift+Delete (Mac)
```

### API retorna 404

```bash
# Verificar rutas en vercel.json
cat vercel.json | grep routes

# Verificar servidor local responde
curl http://localhost:3000/api/health

# Si falla: revisar src/routes/
```

### CORS error en navegador

```javascript
// Agregar logs
console.log('Attempting to fetch from:', apiUrl);

// Verificar CORS_ORIGIN en Vercel
// → Dashboard → Settings → Env Vars

// Local: debe usar http://localhost:3000
// Prod: debe usar https://cafeteria-ebenezer.vercel.app
```

---

## 🎯 PRÓXIMAS FASES (post-frontend)

| Fase | Objetivo | Tiempo |
|------|----------|--------|
| 0 | Test Infrastructure | 2-3h |
| 1 | Cleanup Archivos | 0.5h |
| 2 | Unify Entry Points | 1-1.5h |
| 3 | Extract Services | 2-3h |
| 4 | Service Tests | 3-4h |
| 5 | Route Tests | 2-3h |
| 6 | **JWT Auth** | 2-3h |
| 7 | Docs | 1-1.5h |
| 8 | CI/CD | 2-3h |

---

## ✅ CHECKLIST: Frontend + GitHub + Vercel

### Desarrollo Local
- [x] Server inicia: `npm start`
- [x] Frontend carga: http://localhost:3000
- [x] Forms funcionan: pedido + opinión
- [x] API responde: /api/health, /api/pedidos, /api/resenas

### Git
- [x] Repositorio: ialex212004/Cafeteria-Ebenezer
- [x] Branch: main
- [x] Commits descriptivos
- [x] .gitignore correcto

### Vercel
- [x] Proyecto conectado
- [x] Webhook activo
- [x] vercel.json existe
- [x] api/index.js exporta app
- [x] public/index.html existe

### Producción
- [x] Live: https://cafeteria-ebenezer.vercel.app
- [x] API: /api/health responde
- [x] Frontend: carga correctamente
- [x] SSL/TLS: automático

---

## 🚀 WORKFLOW RESUMIDO

```
1. EDITA en VS Code
   ↓
2. PRUEBA local (npm start)
   ↓
3. COMMIT (git commit -m "...")
   ↓
4. PUSH (git push origin main)
   ↓
5. ESPERA 30-60 seg
   ↓
6. VERIFICA en https://cafeteria-ebenezer.vercel.app
   ↓
7. ¡LISTO! En producción ✅
```

---

**Workflow completo documentado. Backend + Frontend + GitHub + Vercel integrados.**

**Próximo paso: ¿Empezar FASE 0 (Tests) o hacer más cambios?**
