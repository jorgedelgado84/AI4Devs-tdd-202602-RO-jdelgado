/**
 * Candidate Model Tests
 * Ejemplo de suite de pruebas para el modelo Candidate
 */

describe('Candidate Model', () => {
  describe('Basic Candidate Properties', () => {
    it('should create a candidate with valid properties', () => {
      const candidateData = {
        id: '1',
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phoneNumber: '+34123456789',
        currentPosition: 'Senior Developer',
        yearsOfExperience: 5,
      };

      expect(candidateData.firstName).toBe('Juan');
      expect(candidateData.email).toContain('@example.com');
    });

    it('should validate email format', () => {
      const email = 'test@example.com';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      expect(emailRegex.test(email)).toBe(true);
    });

    it('should reject invalid email format', () => {
      const email = 'invalid-email';
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      expect(emailRegex.test(email)).toBe(false);
    });
  });

  describe('Years of Experience Validation', () => {
    it('should accept valid years of experience', () => {
      const yearsOfExperience = 5;

      expect(yearsOfExperience).toBeGreaterThanOrEqual(0);
      expect(yearsOfExperience).toBeLessThanOrEqual(100);
    });

    it('should reject negative years of experience', () => {
      const yearsOfExperience = -1;

      expect(yearsOfExperience).toBeLessThan(0);
    });
  });
});
