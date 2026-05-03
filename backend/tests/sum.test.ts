/**
 * Unit Tests for sum function
 * Pruebas para la función sum
 */

import sum from '../src/application/sum';

describe('sum function', () => {
  describe('Basic addition', () => {
    it('should add two positive numbers', () => {
      const result = sum(2, 3);
      expect(result).toBe(5);
    });

    it('should add two negative numbers', () => {
      const result = sum(-2, -3);
      expect(result).toBe(-5);
    });

    it('should add positive and negative numbers', () => {
      const result = sum(5, -3);
      expect(result).toBe(2);
    });

    it('should return zero when adding zero', () => {
      const result = sum(0, 0);
      expect(result).toBe(0);
    });

    it('should add a number and zero', () => {
      const result = sum(10, 0);
      expect(result).toBe(10);
    });
  });

  describe('Decimal numbers', () => {
    it('should add two decimal numbers', () => {
      const result = sum(1.5, 2.5);
      expect(result).toBe(4);
    });

    it('should add decimal and integer', () => {
      const result = sum(1.5, 2);
      expect(result).toBe(3.5);
    });
  });

  describe('String concatenation (edge case)', () => {
    it('should concatenate strings', () => {
      const result = sum('Hello', ' World');
      expect(result).toBe('Hello World');
    });

    it('should concatenate string and number', () => {
      const result = sum('Number: ', 42);
      expect(result).toBe('Number: 42');
    });
  });

  describe('Large numbers', () => {
    it('should add large numbers', () => {
      const result = sum(1000000, 2000000);
      expect(result).toBe(3000000);
    });

    it('should add very large numbers', () => {
      const result = sum(999999999, 1);
      expect(result).toBe(1000000000);
    });
  });
});
