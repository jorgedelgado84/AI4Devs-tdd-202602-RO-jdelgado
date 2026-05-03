# Testing and Coverage

## Test Execution Configuration

### Backend Setup
1. Jest está configurado con `jest.config.js`
2. ts-jest maneja la compilación de TypeScript
3. Los tests se ejecutan en ambiente Node.js

### Frontend Setup  
1. Jest está configurado con `jest.config.js`
2. ts-jest + jsdom para testing de componentes React
3. React Testing Library está configurado

## Key Configuration Files Created

### Backend
- `jest.config.js` - Configuración principal de Jest con ts-jest
- `tests/setup.ts` - Setup global para tests del backend
- `tsconfig.json` - Actualizado para incluir tipos de Jest y archivos de test
- `src/domain/models/__tests__/Candidate.test.ts` - Test de ejemplo

### Frontend
- `jest.config.js` - Configuración para React testing
- `src/setupTests.ts` - Setup global con React Testing Library
- `src/components/__tests__/AddCandidateForm.test.tsx` - Test de componente
- `src/services/__tests__/candidateService.test.js` - Test de servicio

## npm Scripts Available

### Backend
- `npm test` - Ejecutar tests una vez
- `npm run test:watch` - Modo watch
- `npm run test:coverage` - Con reporte de cobertura

### Frontend
- `npm test` - Ejecutar tests (modo watch por defecto con CRA)
- `npm run test:watch` - Modo watch explícito
- `npm run test:coverage` - Con reporte de cobertura

## Important Notes

1. **ts-jest Configuration**: Ambos proyectos usan ts-jest para compilar TypeScript
2. **Test Environments**: Backend usa Node.js, Frontend usa jsdom
3. **Module Mocking**: CSS modules mocked con `identity-obj-proxy` en frontend
4. **Coverage Reports**: Se generan en `coverage/` directory

## Next Steps

1. Ejecutar `npm install` en backend y frontend (si no está hecho)
2. Ejecutar `npm test` para verificar que todo funciona
3. Crear tests reales basados en los ejemplos proporcionados
4. Aumentar la cobertura de tests progresivamente
