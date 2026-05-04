/**
 * Jest Setup File for React Testing
 * Este archivo se ejecuta antes de cada suite de pruebas
 * Configura React Testing Library y otros utilitarios
 */

import '@testing-library/jest-dom';

// Configurar variables de entorno para testing
process.env.REACT_APP_ENV = 'test';
process.env.NODE_ENV = 'test';

// Suprimir warnings específicos de React durante tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    // Filtrar warnings específicos que no son relevantes en tests
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Warning: useLayoutEffect') ||
        args[0].includes('Warning: ReactDOMTestUtils.act') ||
        (args[0].includes('Error:') &&
          (args[0].includes('Not implemented: HTMLFormElement.prototype.requestSubmit') ||
            args[0].includes('Not implemented: HTMLFormElement.prototype.submit'))))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Configuración global de timeouts
jest.setTimeout(10000);

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

