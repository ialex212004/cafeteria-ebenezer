# 🤝 Guía de Contribución

Gracias por tu interés en contribuir a Cafetería Ebenezer. Esta guía te ayudará a participar correctamente.

## Antes de Empezar

- Lee el [README.md](README.md) para entender el proyecto
- Revisa los [issues abiertos](../../issues) para ver en qué se está trabajando
- Consulta la [documentación de API](API.md) para entender los endpoints

## Workflow de Contribución

### 1. Fork el Proyecto

Haz un fork del repositorio a tu cuenta de GitHub.

```bash
git clone https://github.com/TU_USUARIO/Cafeteria-Ebenezer.git
cd Cafeteria-Ebenezer
git remote add upstream https://github.com/ialex212004/Cafeteria-Ebenezer.git
```

### 2. Crear una Rama de Feature

```bash
git checkout -b feature/descripcion-del-feature
# o para bugs:
git checkout -b fix/descripcion-del-bug
```

**Nomenclatura de ramas:**

- `feature/nombre-feature` - Nuevas características
- `fix/nombre-bug` - Correcciones de errores
- `docs/mejora-docs` - Mejoras de documentación
- `refactor/nombre` - Refactorización de código
- `test/nombre` - Nuevos tests

### 3. Hacer Cambios

Desarrolla tu feature/fix manteniendo el código limpio:

```bash
# Asegúrate de que el código sigue el estilo del proyecto
npm run format    # Formatea código automáticamente
npm run lint      # Verifica calidad del código
```

### 4. Commit y Push

```bash
# Commits atómicos y descriptivos
git add .
git commit -m "feat: descripción de lo que hace"
# o
git commit -m "fix: descripción del bug arreglado"

git push origin feature/descripcion-del-feature
```

**Formato de Commits (Conventional Commits):**

```
<tipo>(<ámbito>): <descripción>

<cuerpo opcional>

<pie opcional>
```

**Tipos:**

- `feat` - Nueva característica
- `fix` - Corrección de bug
- `docs` - Cambios de documentación
- `style` - Cambios que no afectan lógica (formato, semicolons, etc)
- `refactor` - Cambio de código sin nueva feature ni fix
- `perf` - Mejora de performance
- `test` - Agregar o modificar tests
- `chore` - Cambios en build, deps, etc

**Ejemplos:**

```
feat(api): agregar endpoint para exportar datos de pedidos
fix(validation): corregir validación de teléfono
docs(readme): actualizar instrucciones de instalación
```

### 5. Crear Pull Request

En GitHub:

1. Ve a tu fork y haz clic en "Compare & pull request"
2. Asegúrate que la rama base es `main`
3. Completa el template de PR
4. Describe:
   - **Qué cambia**
   - **Porqué cambia**
   - **Cómo testearlo**
   - **Screenshots** (si aplica)

### 6. Revisión y Merge

- Espera feedback del mantenedor
- Responde los commentarios y haz cambios si es necesario
- Una vez aprobado, se hará merge a `main`

## Estándares de Código

### Estructura de Carpetas

Nuevas funcionalidades deben seguir esta estructura:

```
src/
├── routes/          # Nuevas rutas van aquí
├── middleware/      # Nuevos middlewares
├── validators/      # Nuevas validaciones
└── utils/           # Funciones utilitarias
```

### Código JavaScript

```javascript
// ✅ BIEN
const getUserById = (id) => {
  if (!id) {
    throw new Error('ID es requerido');
  }
  return users.find(u => u.id === id);
};

// ❌ MALO
function GetUserById(id){
  if(id){
    return users.find(u=>u.id===id)
  }
}
```

### Reglas Importantes

1. **Usar `const` por defecto**, `let` si es necesario, nunca `var`
2. **Función => Arrow functions** cuando sea posible
3. **Nombres descriptivos**: `getUserData()` en lugar de `getData()`
4. **Comentarios**: Explicar el **porqué**, no el **qué**
5. **Logging**: Usar `logger` centralizado, no `console.log`
6. **Errores**: Usar estructura de error consistente

### Validación

Siempre validar entrada de datos:

```javascript
// ✅ BIEN - Usa esquenas Joi
const { validatePedido } = require('../validators');
const { value, error } = validatePedido(req.body);

// ❌ MALO - Validación manual sin estructura
if (!req.body.nombre || req.body.nombre === '') {
  // ...
}
```

### Logging

```javascript
// ✅ BIEN
const logger = require('../utils/logger')('Module');
logger.info('Operación exitosa', { userId: 123 });

// ❌ MALO
console.log('User created:', userId);
```

## Testing

Si agregaste código crítico, incluye tests:

```bash
npm test

# O para un archivo específico:
npm test -- src/validators/__tests__/index.test.js
```

Estructura de tests:

```javascript
// src/validators/__tests__/index.test.js
describe('Validators', () => {
  it('debe validar pedido correctamente', () => {
    const { valid } = validate(pedidoSchema, validData);
    expect(valid).toBe(true);
  });
});
```

## Reporte de Bugs

Usa [GitHub Issues](../../issues) para reportar bugs:

1. **Título claro**: "Modal de login falla en Safari"
2. **Descripción detallada**: Qué esperas vs qué ocurre
3. **Pasos para reproducir**:
   ```
   1. Abre la página en Safari
   2. Haz clic en el botón login
   3. Verás error X
   ```
4. **Environment**: SO, navegador, versión de Node
5. **Screenshots/Videos**: Si es UI

## Sugerencias de Mejora

Para features o mejoras:

1. Abre un [Discussion](../../discussions) o [Issue](../../issues)
2. Describe claramente la idea
3. Explica el beneficio
4. Espera feedback antes de empezar a codicar

## Ayuda

¿Preguntas? Contacta a: **admin@cafeteria-ebenezer.com**

## Código de Conducta

Se espera que todos los contribuyentes sean respetuosos y profesionales. No se tolerará:

- Lenguaje discriminatorio o de acoso
- Disrupción o spam
- Violación de privacidad

## ¡Gracias!

Tu contribución, sin importar el tamaño, es valorada y apreciada. 🙌

---

**Happy coding!** 🚀
