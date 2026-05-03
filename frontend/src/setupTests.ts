/**
 * Jest Setup File for React Testing
 * Este archivo se ejecuta antes de cada suite de pruebas
 * Configura React Testing Library y otros utilitarios
 */

import '@testing-library/jest-dom';

// Opcional: Configurar variables de entorno
process.env.REACT_APP_ENV = 'test';

// Opcional: Suprimir mensajes de consola en tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
