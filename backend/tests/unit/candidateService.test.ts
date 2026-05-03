/**
 * Example test for candidateService en Backend
 * Demuestra las mejores prácticas para testing de servicios Node.js
 */

describe('Candidate Service', () => {
  describe('validateEmail', () => {
    it('should validate correct email format', () => {
      const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should accept valid phone numbers', () => {
      const validatePhone = (phone: string) => {
        return phone.length >= 10 && phone.length <= 20;
      };

      expect(validatePhone('+34123456789')).toBe(true);
      expect(validatePhone('123456789')).toBe(false);
    });
  });

  describe('calculateYearsOfExperience', () => {
    it('should calculate years of experience correctly', () => {
      const calculateYears = (startYear: number) => {
        return new Date().getFullYear() - startYear;
      };

      const years = calculateYears(2020);
      expect(years).toBeGreaterThanOrEqual(4);
      expect(years).toBeLessThanOrEqual(6);
    });
  });

  describe('formatCandidateData', () => {
    it('should format candidate data correctly', () => {
      const formatCandidate = (data: any) => ({
        id: data.id,
        fullName: `${data.firstName} ${data.lastName}`.trim(),
        email: data.email.toLowerCase(),
        yearsOfExperience: Math.max(0, data.yearsOfExperience),
      });

      const result = formatCandidate({
        id: '1',
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'JUAN@EXAMPLE.COM',
        yearsOfExperience: -1,
      });

      expect(result.fullName).toBe('Juan Pérez');
      expect(result.email).toBe('juan@example.com');
      expect(result.yearsOfExperience).toBe(0);
    });
  });
});
