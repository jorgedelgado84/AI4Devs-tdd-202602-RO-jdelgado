/**
 * Jest Setup File
 * Este archivo se ejecuta antes de cada suite de pruebas
 * Úsalo para configuraciones globales, mocks, etc.
 */

// Configuración de variables de entorno para testing
process.env.NODE_ENV = 'test';

// Opcional: Configurar timeouts globales
jest.setTimeout(10000);

// Aquí puedes agregar mocks globales, fixtures, etc.
