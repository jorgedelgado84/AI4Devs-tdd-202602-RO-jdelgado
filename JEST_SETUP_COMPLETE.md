# 🧪 Configuración Jest & ts-jest - Resumen Completo

## 📦 ¿Qué se ha configurado?

### Backend (Node.js/Express + TypeScript)

✅ **jest.config.js**
- Preset: `ts-jest` para compilar TypeScript
- Environment: `node` 
- Búsqueda de tests en `src/__tests__` y archivos `*.test.ts`
- Configuración de cobertura con umbral inicial de 50%
- Path aliases para imports limpios (`@/utils`)

✅ **tsconfig.json actualizado**
- Agregado `isolatedModules: true` para mejor rendimiento
- Agregado tipos de Jest (`@types/jest`)
- Incluye tanto `src` como `tests` directorios
- Configurado para Node.js moderno (target: es5, lib: es2020)

✅ **tests/setup.ts**
- Archivo de configuración global ejecutado antes de cada suite
- Lugar para configurar variables de entorno, mocks globales, etc.

✅ **package.json scripts**
```json
"test": "jest"                    // Ejecutar tests una vez
"test:watch": "jest --watch"      // Modo watch para desarrollo
"test:coverage": "jest --coverage" // Con reporte de cobertura
```

### Frontend (React + TypeScript)

✅ **jest.config.js**
- Preset: `ts-jest` 
- Environment: `jsdom` (para simular navegador)
- Configuración de CSS modules con `identity-obj-proxy`
- Setup: React Testing Library con `src/setupTests.ts`

✅ **src/setupTests.ts**
- Importa `@testing-library/jest-dom` (matchers adicionales)
- Configuración global para tests de React

✅ **package.json scripts**
```json
"test": "jest --config jest.config.js"
"test:watch": "jest --config jest.config.js --watch"
"test:coverage": "jest --config jest.config.js --coverage"
```

✅ **package.json dependencies**
- Agregado `identity-obj-proxy` para mocking de CSS modules

## 📂 Estructura de Tests

### Backend
```
backend/
├── src/
│   ├── domain/models/
│   │   └── __tests__/
│   │       └── Candidate.test.ts       (✅ ejemplo incluido)
│   ├── application/
│   │   └── services/
│   │       └── __tests__/
│   └── presentation/
│       └── controllers/
│           └── __tests__/
├── tests/
│   ├── setup.ts                        (✅ setup global)
│   ├── unit/
│   │   └── candidateService.test.ts   (✅ ejemplo incluido)
│   └── integration/
```

### Frontend
```
frontend/
├── src/
│   ├── setupTests.ts                   (✅ setup global)
│   ├── components/
│   │   └── __tests__/
│   │       └── AddCandidateForm.test.tsx (✅ ejemplo incluido)
│   └── services/
│       └── __tests__/
│           └── candidateService.test.js  (✅ ejemplo incluido)
```

## 🚀 Cómo Usar

### 1. Instalación de dependencias (si no está hecho)

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### 2. Ejecutar Tests

```bash
# Backend - tests completos
cd backend
npm test

# Backend - modo watch (recomendado para desarrollo)
npm run test:watch

# Backend - con cobertura
npm run test:coverage

# Frontend - similar
cd ../frontend
npm test
npm run test:watch
npm run test:coverage
```

### 3. Escribir Nuevos Tests

#### Patrón para Backend (unitario)
```typescript
// src/domain/models/__tests__/MyModel.test.ts
describe('MyModel', () => {
  describe('method', () => {
    it('should do something', () => {
      // Arrange - preparar datos
      const input = { field: 'value' };
      
      // Act - ejecutar
      const result = myFunction(input);
      
      // Assert - verificar
      expect(result).toEqual(expected);
    });
  });
});
```

#### Patrón para Frontend (componente)
```typescript
// src/components/__tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render', () => {
    render(<MyComponent />);
    expect(screen.getByText(/expected/i)).toBeInTheDocument();
  });

  it('should handle click', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(screen.getByText(/clicked/i)).toBeInTheDocument();
  });
});
```

## ✨ Características Incluidas

| Característica | Backend | Frontend |
|---|---|---|
| Jest | ✅ | ✅ |
| ts-jest | ✅ | ✅ |
| TypeScript Support | ✅ | ✅ |
| React Testing Library | ❌ | ✅ |
| userEvent | ❌ | ✅ |
| Coverage Reports | ✅ | ✅ |
| Path Aliases (@/) | ✅ | ✅ |
| CSS Mocking | ❌ | ✅ |
| Global Setup | ✅ | ✅ |

## 📊 Cobertura de Tests

El reporte de cobertura se genera en `coverage/` después de ejecutar:
```bash
npm run test:coverage
```

Abre `coverage/index.html` en el navegador para ver visualización interactiva.

**Umbrales iniciales** (se pueden aumentar conforme se escriben tests):
- Statements: 50%
- Branches: 50%
- Functions: 50%
- Lines: 50%

## 🔍 Debugging

### Ver tests específicos
```bash
npm test -- Candidate           # tests que contienen "Candidate"
npm test -- --testNamePattern="should"  # tests que contienen "should"
```

### Modo verbose
```bash
npm test -- --verbose
```

### Debugar en VS Code
Presiona F5 y selecciona "Jest Debug" (si está configurado)

## 📝 Ejemplos Incluidos

### 1. Backend: Model Tests
`src/domain/models/__tests__/Candidate.test.ts`
- Validación de propiedades
- Validación de email
- Validación de años de experiencia

### 2. Backend: Service Tests  
`tests/unit/candidateService.test.ts`
- Validación de email
- Validación de teléfono
- Cálculo de años de experiencia
- Formateo de datos

### 3. Frontend: Component Tests
`src/components/__tests__/AddCandidateForm.test.tsx`
- Rendering del formulario
- Validación de inputs
- Interacciones de usuario
- Llamadas a callbacks

### 4. Frontend: Service Tests
`src/services/__tests__/candidateService.test.js`
- Métodos CRUD
- Validaciones
- Manejo de datos

## 🎯 Próximos Pasos Recomendados

1. **Ejecutar tests de ejemplo**
   ```bash
   npm test  # En backend y frontend
   ```

2. **Implementar TDD**
   - Escribir test ANTES de implementar
   - Ver test fallar (red)
   - Implementar código (green)
   - Refactorizar (refactor)

3. **Aumentar cobertura gradualmente**
   ```bash
   npm run test:coverage
   ```

4. **Configurar CI/CD**
   - GitHub Actions
   - GitLab CI
   - Jenkins, etc.

5. **Mejoras futuras**
   ```bash
   # Agregar pre-commit hooks
   npm install husky lint-staged --save-dev
   
   # Agregar test coverage badges
   npm install --save-dev jest-coverage-report
   ```

## 🔗 Recursos Útiles

- [Jest Docs](https://jestjs.io/)
- [ts-jest Docs](https://kulshekhar.github.io/ts-jest/)
- [React Testing Library](https://testing-library.com/react)
- [Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## ✅ Checklist de Validación

- [x] Jest instalado y configurado
- [x] ts-jest configurado
- [x] Jest config files creados (backend y frontend)
- [x] Setup files creados
- [x] Example tests incluidos
- [x] npm scripts configurados
- [x] tsconfig actualizado
- [x] Path aliases funcionales
- [x] Coverage reporting habilitado
- [x] Sin advertencias de deprecación
- [x] Tests ejecutándose correctamente

## 🎓 TDD Workflow

Para seguir TDD correctamente:

```
1. RED: Escribir test que falla
   └─ npm test (verá fallar)

2. GREEN: Escribir código mínimo para pasar
   └─ npm test (verá pasar)

3. REFACTOR: Mejorar código sin romper tests
   └─ npm test (verá pasar)

4. REPEAT: Volver al paso 1 para nuevo feature
```

---

**¡Proyecto listo para TDD! 🚀**

Los tests de ejemplo pueden servir como referencia. Elimínalos cuando empieces con tests reales del negocio.
