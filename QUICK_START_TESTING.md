# 🧪 Testing Quick Start

## TL;DR - Empieza Aquí

### Backend
```bash
cd backend
npm test                    # Ejecutar tests
npm run test:watch         # Modo watch
npm run test:coverage      # Ver cobertura
```

### Frontend
```bash
cd frontend
npm test                    # Ejecutar tests (después de npm install)
```

## 📦 Lo que se ha configurado

✅ **Jest** - Framework de testing  
✅ **ts-jest** - Compilación TypeScript en tests  
✅ **React Testing Library** - Testing de componentes (frontend)  
✅ **Coverage Reports** - Reporte de cobertura  
✅ **Example Tests** - Tests de ejemplo para aprender  

## 🎓 Patrón TDD

```
1. ❌ RED
   ├─ Escribe test que falla
   └─ npm test (falla)

2. ✅ GREEN
   ├─ Escribe código para pasar
   └─ npm test (pasa)

3. 🔄 REFACTOR
   ├─ Mejora el código
   └─ npm test (sigue pasando)
```

## 📂 Dónde están los tests

### Backend
- Unitarios: `src/domain/models/__tests__/*.test.ts`
- Servicios: `tests/unit/*.test.ts`
- Setup: `tests/setup.ts`

### Frontend
- Componentes: `src/components/__tests__/*.test.tsx`
- Servicios: `src/services/__tests__/*.test.js`
- Setup: `src/setupTests.ts`

## 💡 Ejemplo Básico

### Test Backend
```typescript
describe('Candidate', () => {
  it('should validate email', () => {
    const email = 'test@example.com';
    const isValid = validateEmail(email);
    expect(isValid).toBe(true);
  });
});
```

### Test Frontend
```typescript
describe('AddCandidateForm', () => {
  it('should submit form', async () => {
    render(<AddCandidateForm onSubmit={mockFn} />);
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    
    expect(mockFn).toHaveBeenCalled();
  });
});
```

## 🚀 Workflow

1. Crea test en `__tests__` directory
2. Ejecuta `npm run test:watch`
3. Ve el test fallar (RED)
4. Escribe código para pasar (GREEN)
5. Refactoriza si es necesario (REFACTOR)

## 📊 Ver Cobertura

```bash
npm run test:coverage
# Se genera en: coverage/index.html
```

## 🔍 Buscar Tests Específicos

```bash
# Buscar por nombre de suite
npm test -- Candidate

# Buscar por nombre de test
npm test -- --testNamePattern="should validate"
```

## 📚 Documentación Completa

- [JEST_SETUP_COMPLETE.md](./JEST_SETUP_COMPLETE.md) - Guía completa
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Mejores prácticas
- [CONFIGURATION_CHECKLIST.md](./CONFIGURATION_CHECKLIST.md) - Checklist de setup

## ✅ Verificación

```bash
# Backend
cd backend && npm test
# Debe mostrar: ✅ Test Suites: 2 passed

# Frontend (con ejemplos)
cd frontend && npm install && npm test
```

## 🎯 Próximos Pasos

1. ✅ Ejecutar tests de ejemplo
2. ✅ Revisar archivos en `__tests__` directories
3. ✅ Crear test para tu primer feature
4. ✅ Implementar código para pasar el test
5. ✅ Refactorizar

---

**¡Listo para TDD! 🚀**

Para preguntas, consulta JEST_SETUP_COMPLETE.md
