/**
 * @file candidateService.jdelgado.test.ts
 * @description Pruebas unitarias para `addCandidate` (candidateService) y el constructor
 *              del modelo `Candidate`.
 *
 * Estrategia de mocking:
 *   - Todos los modelos de dominio (Candidate, Education, WorkExperience, Resume) y el
 *     validador están mockeados a nivel de módulo para aislar la lógica del servicio de
 *     Prisma y de la base de datos.
 *   - El bloque "Candidate Model" usa `jest.requireActual` para recuperar las
 *     implementaciones reales y probar el constructor y el validador sin mocks.
 *
 * Cobertura:
 *   - addCandidate: flujo feliz, datos relacionados, errores de validación, errores de BD.
 *   - Candidate: asignación de propiedades en constructor, valores por defecto.
 *   - validateCandidateData: formato de email válido e inválido.
 */

import { addCandidate } from '../../application/services/candidateService';
import { Candidate } from '../../domain/models/Candidate';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';
import * as validator from '../../application/validator';

// ─── Mocks de módulo ─────────────────────────────────────────────────────────
// Reemplaza Prisma y el validador con jest.fn() para que ningún test toque la BD.
jest.mock('../../domain/models/Candidate');
jest.mock('../../domain/models/Education');
jest.mock('../../domain/models/WorkExperience');
jest.mock('../../domain/models/Resume');
jest.mock('../../application/validator');

const MockCandidate = Candidate as jest.MockedClass<typeof Candidate>;
const MockEducation = Education as jest.MockedClass<typeof Education>;
const MockWorkExperience = WorkExperience as jest.MockedClass<typeof WorkExperience>;
const MockResume = Resume as jest.MockedClass<typeof Resume>;
const mockValidateCandidateData = validator.validateCandidateData as jest.MockedFunction<
  typeof validator.validateCandidateData
>;

// ─── addCandidate ─────────────────────────────────────────────────────────────

describe('addCandidate', () => {
  /**
   * Datos mínimos válidos reutilizados en todos los tests del servicio.
   * Representan un candidato con solo los campos obligatorios (firstName, lastName, email).
   */
  const candidateBase = {
    firstName: 'Juan',
    lastName: 'García',
    email: 'juan.garcia@example.com',
  };

  /** Resultado simulado que devuelve `candidate.save()` tras una inserción exitosa. */
  const savedCandidateResult = { id: 1, ...candidateBase };

  /**
   * Instancia mock del modelo Candidate.
   * Se recrea en cada test para evitar contaminación entre pruebas.
   * Incluye los arrays `education`, `workExperience` y `resumes` que el servicio
   * necesita para hacer push de las entidades relacionadas.
   */
  let mockCandidateInstance: {
    education: unknown[];
    workExperience: unknown[];
    resumes: unknown[];
    save: jest.Mock;
  };

  /**
   * Antes de cada test:
   *   1. Limpia contadores y configuraciones de todos los mocks.
   *   2. Recrea `mockCandidateInstance` con `save` resolviendo a `savedCandidateResult`.
   *   3. Configura `MockCandidate` para devolver esa instancia al llamar con `new`.
   *   4. Configura el validador para que pase sin lanzar errores por defecto.
   */
  beforeEach(() => {
    jest.clearAllMocks();

    mockCandidateInstance = {
      education: [],
      workExperience: [],
      resumes: [],
      save: jest.fn().mockResolvedValue(savedCandidateResult),
    };

    MockCandidate.mockImplementation(() => mockCandidateInstance as unknown as Candidate);
    mockValidateCandidateData.mockImplementation(() => undefined);
  });

  // ── Flujo feliz ─────────────────────────────────────────────────────────────

  describe('inserción exitosa', () => {
    /**
     * Verifica el flujo completo mínimo:
     *   1. Se llama al validador con los datos recibidos.
     *   2. Se instancia Candidate con esos mismos datos.
     *   3. Se persiste exactamente una vez.
     *   4. El valor retornado coincide con lo que devuelve `save()`.
     */
    it('debe insertar un candidato con los campos obligatorios', async () => {
      // Arrange: candidateBase y mocks configurados en beforeEach

      // Act
      const result = await addCandidate(candidateBase);

      // Assert
      expect(mockValidateCandidateData).toHaveBeenCalledWith(candidateBase);
      expect(MockCandidate).toHaveBeenCalledWith(candidateBase);
      expect(mockCandidateInstance.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(savedCandidateResult);
    });

    /**
     * Confirma que el servicio devuelve el objeto tal como lo retorna `save()`,
     * incluyendo el ID generado por la base de datos (aquí simulado con id = 42).
     */
    it('debe retornar el candidato con el ID asignado por la base de datos', async () => {
      // Arrange
      mockCandidateInstance.save.mockResolvedValue({ id: 42, ...candidateBase });

      // Act
      const result = await addCandidate(candidateBase);

      // Assert
      expect(result.id).toBe(42);
    });

    /**
     * Comprueba que los campos opcionales `phone` y `address` se pasan sin
     * modificación al constructor de Candidate.
     */
    it('debe insertar un candidato con todos los campos opcionales', async () => {
      // Arrange
      const candidateWithOptionals = {
        ...candidateBase,
        phone: '612345678',
        address: 'Calle Mayor 1, Madrid',
      };

      // Act
      await addCandidate(candidateWithOptionals);

      // Assert
      expect(MockCandidate).toHaveBeenCalledWith(candidateWithOptionals);
      expect(mockCandidateInstance.save).toHaveBeenCalledTimes(1);
    });

    /**
     * Garantiza que cuando no se proporcionan `educations`, `workExperiences` ni `cv`,
     * el servicio no instancia ninguna entidad relacionada, evitando escrituras
     * innecesarias en la base de datos.
     */
    it('no debe guardar entidades relacionadas cuando no se proporcionan', async () => {
      // Arrange: candidateBase sin educations/workExperiences/cv (ver beforeEach)

      // Act
      await addCandidate(candidateBase);

      // Assert
      expect(MockEducation).not.toHaveBeenCalled();
      expect(MockWorkExperience).not.toHaveBeenCalled();
      expect(MockResume).not.toHaveBeenCalled();
    });
  });

  // ── Datos relacionados ───────────────────────────────────────────────────────

  describe('inserción con datos relacionados', () => {
    /**
     * Verifica que al incluir un ítem en `educations`:
     *   - Se construye un Education con los datos de ese ítem.
     *   - Se le asigna el `candidateId` obtenido del candidato recién guardado.
     *   - Se persiste exactamente una vez.
     */
    it('debe guardar la educación y asignarle el ID del candidato', async () => {
      // Arrange
      const educationData = {
        institution: 'Universidad Complutense',
        title: 'Ingeniería Informática',
        startDate: '2015-09-01',
        endDate: '2020-06-30',
      };
      const candidateData = { ...candidateBase, educations: [educationData] };
      const mockEducationInstance = {
        candidateId: undefined as number | undefined,
        save: jest.fn().mockResolvedValue({}),
      };
      MockEducation.mockImplementation(() => mockEducationInstance as unknown as Education);

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(MockEducation).toHaveBeenCalledWith(educationData);
      expect(mockEducationInstance.candidateId).toBe(1);
      expect(mockEducationInstance.save).toHaveBeenCalledTimes(1);
    });

    /**
     * Cuando hay varias entradas de educación, el servicio las procesa en orden
     * secuencial. Se verifica que el constructor y `save()` se llamen exactamente
     * una vez por cada entrada, en el mismo orden en que aparecen en el array.
     */
    it('debe guardar múltiples entradas de educación en orden', async () => {
      // Arrange
      const educations = [
        { institution: 'UPM', title: 'Grado', startDate: '2015-09-01', endDate: '2019-06-30' },
        { institution: 'UOC', title: 'Máster', startDate: '2019-09-01', endDate: '2021-06-30' },
      ];
      const mockEduSave = jest.fn().mockResolvedValue({});
      MockEducation.mockImplementation(
        () => ({ candidateId: undefined, save: mockEduSave }) as unknown as Education,
      );

      // Act
      await addCandidate({ ...candidateBase, educations });

      // Assert
      expect(MockEducation).toHaveBeenCalledTimes(2);
      expect(MockEducation).toHaveBeenNthCalledWith(1, educations[0]);
      expect(MockEducation).toHaveBeenNthCalledWith(2, educations[1]);
      expect(mockEduSave).toHaveBeenCalledTimes(2);
    });

    /**
     * Verifica que al incluir un ítem en `workExperiences`:
     *   - Se construye un WorkExperience con los datos de ese ítem.
     *   - Se le asigna el `candidateId` del candidato recién guardado.
     *   - Se persiste exactamente una vez.
     */
    it('debe guardar la experiencia laboral y asignarle el ID del candidato', async () => {
      // Arrange
      const experienceData = {
        company: 'Empresa Tech S.L.',
        position: 'Desarrollador Backend',
        startDate: '2020-01-01',
        endDate: '2023-12-31',
      };
      const candidateData = { ...candidateBase, workExperiences: [experienceData] };
      const mockExpInstance = {
        candidateId: undefined as number | undefined,
        save: jest.fn().mockResolvedValue({}),
      };
      MockWorkExperience.mockImplementation(() => mockExpInstance as unknown as WorkExperience);

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(MockWorkExperience).toHaveBeenCalledWith(experienceData);
      expect(mockExpInstance.candidateId).toBe(1);
      expect(mockExpInstance.save).toHaveBeenCalledTimes(1);
    });

    /**
     * Verifica que cuando `cv` tiene contenido:
     *   - Se construye un Resume con los datos de `cv`.
     *   - Se le asigna el `candidateId` del candidato recién guardado.
     *   - Se persiste exactamente una vez.
     */
    it('debe guardar el CV y asignarle el ID del candidato', async () => {
      // Arrange
      const cvData = { filePath: '/uploads/cv_juan.pdf', fileType: 'application/pdf' };
      const candidateData = { ...candidateBase, cv: cvData };
      const mockResumeInstance = {
        candidateId: undefined as number | undefined,
        save: jest.fn().mockResolvedValue({}),
      };
      MockResume.mockImplementation(() => mockResumeInstance as unknown as Resume);

      // Act
      await addCandidate(candidateData);

      // Assert
      expect(MockResume).toHaveBeenCalledWith(cvData);
      expect(mockResumeInstance.candidateId).toBe(1);
      expect(mockResumeInstance.save).toHaveBeenCalledTimes(1);
    });

    /**
     * El servicio comprueba `Object.keys(cv).length > 0` antes de guardar el CV.
     * Un objeto vacío no debe provocar ninguna instanciación de Resume.
     */
    it('no debe guardar el CV cuando el objeto cv está vacío', async () => {
      // Arrange: cv vacío — ningún mock adicional necesario

      // Act
      await addCandidate({ ...candidateBase, cv: {} });

      // Assert
      expect(MockResume).not.toHaveBeenCalled();
    });

    /**
     * Prueba de integración de todas las entidades relacionadas en una sola llamada.
     * Confirma que el candidato principal y cada entidad relacionada se guardan
     * exactamente una vez, y que el resultado devuelto es el del candidato principal.
     */
    it('debe insertar un candidato completo con todos los datos relacionados', async () => {
      // Arrange
      const fullCandidateData = {
        ...candidateBase,
        phone: '612345678',
        educations: [{ institution: 'UPM', title: 'Grado', startDate: '2015-09-01' }],
        workExperiences: [{ company: 'Tech S.L.', position: 'Dev', startDate: '2020-01-01' }],
        cv: { filePath: '/uploads/cv.pdf', fileType: 'application/pdf' },
      };
      const mockEduSave = jest.fn().mockResolvedValue({});
      const mockExpSave = jest.fn().mockResolvedValue({});
      const mockResSave = jest.fn().mockResolvedValue({});
      MockEducation.mockImplementation(
        () => ({ candidateId: undefined, save: mockEduSave }) as unknown as Education,
      );
      MockWorkExperience.mockImplementation(
        () => ({ candidateId: undefined, save: mockExpSave }) as unknown as WorkExperience,
      );
      MockResume.mockImplementation(
        () => ({ candidateId: undefined, save: mockResSave }) as unknown as Resume,
      );

      // Act
      const result = await addCandidate(fullCandidateData);

      // Assert
      expect(result).toEqual(savedCandidateResult);
      expect(mockCandidateInstance.save).toHaveBeenCalledTimes(1);
      expect(mockEduSave).toHaveBeenCalledTimes(1);
      expect(mockExpSave).toHaveBeenCalledTimes(1);
      expect(mockResSave).toHaveBeenCalledTimes(1);
    });
  });

  // ── Errores de validación ────────────────────────────────────────────────────

  describe('manejo de errores de validación', () => {
    /**
     * Cuando `validateCandidateData` lanza, el servicio captura el error y lo
     * relanza envuelto en un nuevo `Error`. El mensaje original debe estar presente
     * en el error propagado hacia el llamador.
     */
    it('debe lanzar un error cuando la validación del candidato falla', async () => {
      // Arrange
      mockValidateCandidateData.mockImplementation(() => {
        throw new Error('Invalid email');
      });

      // Act
      const act = addCandidate({ ...candidateBase, email: 'invalido' });

      // Assert
      await expect(act).rejects.toThrow('Invalid email');
    });

    /**
     * Si la validación falla, el servicio debe lanzar antes de llegar a la capa
     * de persistencia. Se verifica que `save()` nunca se invoca en ese escenario.
     */
    it('no debe llamar a save() si la validación falla', async () => {
      // Arrange
      mockValidateCandidateData.mockImplementation(() => {
        throw new Error('Invalid name');
      });

      // Act
      const act = addCandidate({});

      // Assert
      await expect(act).rejects.toThrow();
      expect(mockCandidateInstance.save).not.toHaveBeenCalled();
    });
  });

  // ── Errores de base de datos ─────────────────────────────────────────────────

  describe('manejo de errores de base de datos', () => {
    /**
     * Prisma lanza un error con `code: 'P2002'` cuando se viola una restricción
     * de unicidad. El servicio intercepta ese código y lanza un mensaje legible
     * en lugar de exponer el error crudo de Prisma.
     */
    it('debe lanzar un mensaje descriptivo cuando el email ya existe (P2002)', async () => {
      // Arrange
      const prismaUniqueError = Object.assign(new Error('Unique constraint failed'), {
        code: 'P2002',
      });
      mockCandidateInstance.save.mockRejectedValue(prismaUniqueError);

      // Act
      const act = addCandidate(candidateBase);

      // Assert
      await expect(act).rejects.toThrow('The email already exists in the database');
    });

    /**
     * Para cualquier error de base de datos que no sea P2002 (p. ej. pérdida de
     * conexión), el servicio relanza el error original sin modificarlo para que
     * las capas superiores puedan manejarlo o loguearlo correctamente.
     */
    it('debe relanzar errores de base de datos desconocidos sin modificarlos', async () => {
      // Arrange
      const unknownDbError = new Error('Conexión rechazada por el servidor');
      mockCandidateInstance.save.mockRejectedValue(unknownDbError);

      // Act
      const act = addCandidate(candidateBase);

      // Assert
      await expect(act).rejects.toThrow('Conexión rechazada por el servidor');
    });
  });

  // ── Prevención de duplicados ─────────────────────────────────────────────────

  describe('prevención de duplicados', () => {
    /**
     * Simula el intento de registrar un candidato cuyo email ya existe en la BD.
     * Prisma lanza P2002 en `candidate.save()`; el servicio debe interceptarlo y
     * lanzar un mensaje de negocio específico para el campo email, de modo que el
     * llamador pueda informar al usuario sin exponer detalles de Prisma.
     */
    it('no debe permitir registrar un candidato con un email ya existente', async () => {
      // Arrange
      const prismaUniqueError = Object.assign(new Error('Unique constraint failed on email'), {
        code: 'P2002',
      });
      mockCandidateInstance.save.mockRejectedValue(prismaUniqueError);

      // Act
      const act = addCandidate(candidateBase);

      // Assert
      await expect(act).rejects.toThrow('The email already exists in the database');
      expect(mockCandidateInstance.save).toHaveBeenCalledTimes(1);
    });

    /**
     * Simula que la BD detecta un registro de Education duplicado para el mismo
     * candidato (violación de restricción única en Prisma → P2002 en `educationModel.save()`).
     * El servicio debe distinguir este caso del duplicado de email y lanzar un
     * mensaje específico para educación.
     */
    it('no debe permitir registrar una educación duplicada para el mismo candidato', async () => {
      // Arrange
      const prismaUniqueError = Object.assign(
        new Error('Unique constraint failed on education'),
        { code: 'P2002' },
      );
      const educationData = {
        institution: 'Universidad Complutense',
        title: 'Ingeniería Informática',
        startDate: '2015-09-01',
      };
      const mockEduInstance = {
        candidateId: undefined as number | undefined,
        save: jest.fn().mockRejectedValue(prismaUniqueError),
      };
      MockEducation.mockImplementation(() => mockEduInstance as unknown as Education);

      // Act
      const act = addCandidate({ ...candidateBase, educations: [educationData] });

      // Assert
      await expect(act).rejects.toThrow('Education record already exists for this candidate');
      expect(mockCandidateInstance.save).toHaveBeenCalledTimes(1);
      expect(mockEduInstance.save).toHaveBeenCalledTimes(1);
    });

    /**
     * Simula que la BD detecta un registro de WorkExperience duplicado para el mismo
     * candidato (P2002 en `experienceModel.save()`).
     * El servicio debe distinguirlo del duplicado de email/educación y lanzar un
     * mensaje específico para experiencia laboral.
     */
    it('no debe permitir registrar una experiencia laboral duplicada para el mismo candidato', async () => {
      // Arrange
      const prismaUniqueError = Object.assign(
        new Error('Unique constraint failed on work experience'),
        { code: 'P2002' },
      );
      const experienceData = {
        company: 'Empresa Tech S.L.',
        position: 'Desarrollador Backend',
        startDate: '2020-01-01',
      };
      const mockExpInstance = {
        candidateId: undefined as number | undefined,
        save: jest.fn().mockRejectedValue(prismaUniqueError),
      };
      MockWorkExperience.mockImplementation(() => mockExpInstance as unknown as WorkExperience);

      // Act
      const act = addCandidate({ ...candidateBase, workExperiences: [experienceData] });

      // Assert
      await expect(act).rejects.toThrow('Work experience record already exists for this candidate');
      expect(mockCandidateInstance.save).toHaveBeenCalledTimes(1);
      expect(mockExpInstance.save).toHaveBeenCalledTimes(1);
    });
  });
});

// ─── Candidate Model ─────────────────────────────────────────────────────────
/**
 * Tests directos sobre el modelo `Candidate` y el validador real.
 *
 * Se usa `jest.requireActual` para eludir el mock a nivel de módulo declarado
 * al inicio del archivo y así ejercitar la lógica real del constructor y de
 * `validateCandidateData` sin tocar la base de datos (no se llama a `save()`).
 */

describe('Candidate Model', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Candidate: RealCandidate } = jest.requireActual('../../domain/models/Candidate');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { validateCandidateData: realValidate } = jest.requireActual('../../application/validator');

  // ── Constructor ─────────────────────────────────────────────────────────────

  describe('constructor', () => {
    /**
     * Comprueba que todos los campos escalares (firstName, lastName, email, phone,
     * address) se asignan correctamente desde el objeto de datos recibido.
     */
    it('debe asignar correctamente las propiedades del candidato', () => {
      // Arrange
      const data = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        phone: '612345678',
        address: 'Calle Mayor 1',
      };

      // Act
      const candidate = new RealCandidate(data);

      // Assert
      expect(candidate.firstName).toBe('Juan');
      expect(candidate.lastName).toBe('Pérez');
      expect(candidate.email).toBe('juan@example.com');
      expect(candidate.phone).toBe('612345678');
      expect(candidate.address).toBe('Calle Mayor 1');
    });

    /**
     * Cuando `data` no incluye `education`, `workExperience` ni `resumes`, el
     * constructor debe inicializarlos como arrays vacíos para que el servicio
     * pueda hacer push sin errores de tipo.
     */
    it('debe inicializar los arrays relacionados vacíos cuando no se proporcionan', () => {
      // Arrange
      const data = { firstName: 'Juan', lastName: 'Pérez', email: 'juan@example.com' };

      // Act
      const candidate = new RealCandidate(data);

      // Assert
      expect(candidate.education).toEqual([]);
      expect(candidate.workExperience).toEqual([]);
      expect(candidate.resumes).toEqual([]);
    });
  });

  // ── Validación de campos obligatorios (CA-01) ───────────────────────────────

  describe('validación de campos obligatorios', () => {
    /**
     * CA-01: El validador debe rechazar la solicitud cuando falta `firstName`.
     * `validateName(undefined)` evalúa `!name` como verdadero y lanza 'Invalid name'.
     */
    it('debe rechazar un candidato sin firstName', () => {
      // Arrange
      const dataWithoutFirstName = { lastName: 'García', email: 'juan@example.com' };

      // Act
      const act = () => realValidate(dataWithoutFirstName);

      // Assert
      expect(act).toThrow('Invalid name');
    });

    /**
     * CA-01: El validador debe rechazar la solicitud cuando falta `lastName`.
     */
    it('debe rechazar un candidato sin lastName', () => {
      // Arrange
      const dataWithoutLastName = { firstName: 'Juan', email: 'juan@example.com' };

      // Act
      const act = () => realValidate(dataWithoutLastName);

      // Assert
      expect(act).toThrow('Invalid name');
    });

    /**
     * CA-01: El validador debe rechazar la solicitud cuando falta `email`.
     * `validateEmail(undefined)` evalúa `!email` como verdadero y lanza 'Invalid email'.
     */
    it('debe rechazar un candidato sin email', () => {
      // Arrange
      const dataWithoutEmail = { firstName: 'Juan', lastName: 'García' };

      // Act
      const act = () => realValidate(dataWithoutEmail);

      // Assert
      expect(act).toThrow('Invalid email');
    });

    /**
     * CA-01 (positivo): Con los tres campos obligatorios presentes y válidos
     * el validador no debe lanzar ningún error.
     */
    it('no debe lanzar error cuando todos los campos obligatorios están presentes', () => {
      // Arrange
      const validData = { firstName: 'Juan', lastName: 'García', email: 'juan@example.com' };

      // Act
      const act = () => realValidate(validData);

      // Assert
      expect(act).not.toThrow();
    });
  });

  // ── Validación de email (CA-02) ──────────────────────────────────────────────

  describe('validación de email', () => {
    /**
     * Datos base usados en los tests de validación de email.
     * Se omite `email` a propósito para que cada test lo proporcione.
     */
    const baseData = { firstName: 'Juan', lastName: 'García' };

    /**
     * CA-02 (positivo): El validador debe aceptar sin errores emails con formato
     * RFC estándar, incluyendo subdominios y dominios de segundo nivel (p. ej. .co.uk).
     */
    it('debe aceptar emails con formato válido', () => {
      // Arrange
      const validEmails = ['test@example.com', 'user.name@domain.co.uk'];

      // Act & Assert (una aserción por cada email válido)
      validEmails.forEach((email) => {
        const act = () => realValidate({ ...baseData, email });
        expect(act).not.toThrow();
      });
    });

    /**
     * CA-02: El validador debe lanzar 'Invalid email' para cadenas que no siguen
     * el formato usuario@dominio.tld: sin @, sin dominio, o sin usuario.
     */
    it('debe rechazar emails con formato inválido', () => {
      // Arrange
      const invalidEmails = ['invalid', '@example.com', 'invalid@'];

      // Act & Assert (una aserción por cada email inválido)
      invalidEmails.forEach((email) => {
        const act = () => realValidate({ ...baseData, email });
        expect(act).toThrow('Invalid email');
      });
    });
  });

  // ── Validación de teléfono (CA-04) ───────────────────────────────────────────

  describe('validación de teléfono', () => {
    /**
     * Datos base con los campos obligatorios satisfechos.
     * El teléfono se varía en cada test.
     */
    const baseData = { firstName: 'Juan', lastName: 'García', email: 'juan@example.com' };

    /**
     * CA-04 (positivo): El campo `phone` es opcional; si no se incluye,
     * el validador no debe lanzar ningún error.
     */
    it('no debe lanzar error cuando el teléfono se omite', () => {
      // Arrange: baseData no incluye phone

      // Act
      const act = () => realValidate(baseData);

      // Assert
      expect(act).not.toThrow();
    });

    /**
     * CA-04 (positivo): El validador debe aceptar números de 9 dígitos que
     * comiencen por 6, 7 o 9, conforme al formato telefónico español.
     */
    it('debe aceptar teléfonos con formato español válido', () => {
      // Arrange
      const validPhones = ['612345678', '712345678', '912345678'];

      // Act & Assert
      validPhones.forEach((phone) => {
        const act = () => realValidate({ ...baseData, phone });
        expect(act).not.toThrow();
      });
    });

    /**
     * CA-04: El validador debe lanzar 'Invalid phone' cuando el número no cumple
     * el formato /^(6|7|9)\d{8}$/: prefijo incorrecto (1, 5) o longitud incorrecta.
     */
    it('debe rechazar teléfonos con formato inválido', () => {
      // Arrange
      const invalidPhones = [
        '123456789', // prefijo 1, no permitido
        '512345678', // prefijo 5, no permitido
        '61234567',  // solo 8 dígitos, faltan 1
      ];

      // Act & Assert
      invalidPhones.forEach((phone) => {
        const act = () => realValidate({ ...baseData, phone });
        expect(act).toThrow('Invalid phone');
      });
    });
  });
});
