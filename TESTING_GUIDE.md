# Guía de Testing con Jest y ts-jest

## 📋 Descripción General

Este proyecto está configurado para testing usando **Jest** con **ts-jest** para TypeScript. La configuración sigue mejores prácticas de la industria.

## 🎯 Estructura del Proyecto

### Backend (Node.js/Express)
```
backend/
├── jest.config.js              # Configuración de Jest
├── tsconfig.json               # Configuración de TypeScript (actualizada)
├── src/
│   └── domain/
│       └── models/
│           └── __tests__/       # Tests unitarios
│               └── Candidate.test.ts
└── tests/
    ├── setup.ts                # Setup global para tests
    └── unit/
        └── candidateService.test.ts
```

### Frontend (React)
```
frontend/
├── jest.config.js              # Configuración de Jest
├── src/
│   ├── setupTests.ts           # Setup global para tests
│   ├── components/
│   │   └── __tests__/          # Tests de componentes
│   │       └── AddCandidateForm.test.tsx
│   └── services/
│       └── __tests__/          # Tests de servicios
│           └── candidateService.test.js
```

## 🚀 Primeros Pasos

### 1. Instalación de Dependencias

El proyecto ya tiene instaladas las dependencias necesarias:

```bash
# Backend
npm install  # Desde /backend

# Frontend  
npm install  # Desde /frontend
```

Si necesitas agregar `identity-obj-proxy` para frontend:
```bash
cd frontend
npm install --save-dev identity-obj-proxy
```

### 2. Ejecutar Tests

```bash
# Backend - ejecutar todos los tests
cd backend
npm test

# Backend - modo watch (tests se re-ejecutan al cambiar archivos)
npm run test:watch

# Backend - con cobertura
npm run test:coverage

# Frontend - ejecutar todos los tests
cd frontend
npm test

# Frontend - modo watch
npm run test:watch

# Frontend - con cobertura
npm run test:coverage
```

## 📝 Escribir Tests

### Test Unitario para Backend (Services/Models)

```typescript
// Ejemplo: tests/unit/myService.test.ts
describe('MyService', () => {
  describe('method1', () => {
    it('should do something correctly', () => {
      // Arrange
      const input = { name: 'Test' };
      
      // Act
      const result = myService.method1(input);
      
      // Assert
      expect(result).toEqual(expected);
    });

    it('should handle edge cases', () => {
      expect(() => myService.method1(null)).toThrow();
    });
  });
});
```

### Test de Componente React

```typescript
// Ejemplo: src/components/__tests__/MyComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    render(<MyComponent />);
    
    const button = screen.getByRole('button', { name: /click me/i });
    await user.click(button);
    
    expect(screen.getByText(/clicked/i)).toBeInTheDocument();
  });
});
```

## 🎓 Mejores Prácticas

### 1. Estructura AAA (Arrange-Act-Assert)
```typescript
it('should calculate total correctly', () => {
  // Arrange - preparar datos
  const items = [10, 20, 30];
  
  // Act - ejecutar la función
  const total = sum(items);
  
  // Assert - verificar resultado
  expect(total).toBe(60);
});
```

### 2. Nombres Descriptivos
```typescript
// ✅ Bien
it('should return formatted date when given valid date object', () => {});

// ❌ Evitar
it('should work', () => {});
```

### 3. Un Concepto por Test
```typescript
// ✅ Bien - cada test prueba un aspecto
it('should accept valid email', () => {});
it('should reject invalid email', () => {});

// ❌ Evitar - múltiples conceptos
it('should validate email and phone', () => {});
```

### 4. Mocking y Stubs
```typescript
// Mock de función
const mockFn = jest.fn();
const mockFn = jest.fn().mockReturnValue('value');
const mockFn = jest.fn().mockResolvedValue(promise);

// Mock de módulo completo
jest.mock('../services/api');
```

### 5. Testing de Componentes Asincronos
```typescript
it('should load data', async () => {
  render(<Component />);
  
  // waitFor espera a que se cumpla la condición
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

## 📊 Cobertura de Tests

Ver el reporte de cobertura:
```bash
npm run test:coverage
# Se genera en coverage/index.html
```

**Objetivos de cobertura recomendados:**
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

## 🔧 Configuración Avanzada

### Path Aliases
En `jest.config.js`, los path aliases se configuran con `moduleNameMapper`:
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1'
}
```

Luego puedes importar así:
```typescript
import { helper } from '@/utils/helpers';
```

### Custom Setup
Modifica `tests/setup.ts` (backend) o `src/setupTests.ts` (frontend) para:
- Configurar variables de entorno
- Crear mocks globales
- Inicializar bases de datos en memoria
- Suprimir warnings

## 🐛 Debugging

### Ejecutar un test específico
```bash
npm test -- Candidate
npm test -- --testNamePattern="should validate"
```

### Ver salida detallada
```bash
npm test -- --verbose
```

### Debugar en VS Code
Añade a `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen"
}
```

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## ✅ Checklist de Setup

- [x] Jest instalado y configurado
- [x] ts-jest configurado para TypeScript
- [x] Jest config archivos creados (backend y frontend)
- [x] Setup archivos creados para configuración global
- [x] Example tests incluidos
- [x] Scripts de test añadidos a package.json
- [x] tsconfig actualizado para incluir tests
- [x] identity-obj-proxy añadido para frontend (CSS modules)

## 🎯 Próximos Pasos

1. **Ejecutar tests de ejemplo**: `npm test`
2. **Escribir tests para nuevas características** antes de implementarlas (TDD)
3. **Aumentar cobertura** gradualmente
4. **Configurar CI/CD** para ejecutar tests automáticamente
5. **Usar tests como documentación** del comportamiento esperado

---

¡Listo para comenzar con TDD! 🚀
