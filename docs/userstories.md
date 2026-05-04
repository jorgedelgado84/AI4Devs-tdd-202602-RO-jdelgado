# Historias de Usuario — LTI-ATS

---

## HU-01 · Registro de nuevo candidato

### Historia

> **Como** reclutador de LTI-ATS,
> **quiero** registrar un nuevo candidato con su información personal, educación, experiencia laboral y CV,
> **para** centralizar su perfil en el sistema y poder gestionar su proceso de selección desde un único lugar.

---

### Validación INVEST

| Criterio | Descripción |
|---|---|
| **I — Independiente** | No depende de la publicación de vacantes, del pipeline de selección ni de la comunicación con candidatos. Puede desarrollarse y entregarse de forma aislada; la única precondición es que el reclutador esté autenticado. |
| **N — Negociable** | Los campos opcionales (teléfono, dirección), el número máximo de entradas de educación/experiencia y los formatos de archivo admitidos para el CV son aspectos negociables con el equipo antes de cada sprint. |
| **V — Valiosa** | Permite al reclutador centralizar la información de un candidato en LTI-ATS desde el primer momento, eliminando el uso disperso de correos, hojas de cálculo o sistemas externos. |
| **E — Estimable** | El alcance está bien delimitado: formulario en frontend, endpoint REST en backend, validaciones de dominio y persistencia en base de datos. Estimación inicial: **5 puntos de historia**. |
| **S — Small** | Acotada exclusivamente a la creación del candidato. La edición, búsqueda, filtrado y gestión del pipeline son historias separadas. Completable en un único sprint de dos semanas. |
| **T — Testeable** | Cada criterio de aceptación es verificable mediante pruebas unitarias, de integración y de aceptación (ver sección siguiente). |

---

### Criterios de Aceptación

#### CA-01 · Campos obligatorios
- **Dado** que el reclutador envía el formulario sin `firstName`, `lastName` o `email`,
- **cuando** el sistema procesa la solicitud,
- **entonces** devuelve un error de validación indicando qué campo falta y no persiste ningún registro.

#### CA-02 · Formato de email válido
- **Dado** que el reclutador introduce un email con formato inválido (p. ej. `juan@` o `sindominio`),
- **cuando** el sistema procesa la solicitud,
- **entonces** devuelve el error `"Invalid email"` y no persiste ningún registro.

#### CA-03 · Email único en el sistema
- **Dado** que ya existe un candidato con el email `juan@empresa.com`,
- **cuando** el reclutador intenta registrar otro candidato con el mismo email,
- **entonces** el sistema devuelve el error `"The email already exists in the database"` y no crea un duplicado.

#### CA-04 · Teléfono con formato español (opcional)
- **Dado** que el reclutador proporciona un teléfono,
- **cuando** éste no sigue el formato español (9 dígitos comenzando por 6, 7 o 9),
- **entonces** el sistema devuelve el error `"Invalid phone"` y no persiste el registro.
- Si el campo teléfono se omite, el sistema lo acepta sin error.

#### CA-05 · Educación (opcional, múltiple)
- **Dado** que el reclutador añade una o varias entradas de educación,
- **cuando** cada entrada incluye institución, título y fecha de inicio con formato `YYYY-MM-DD`,
- **entonces** el sistema las persiste asociadas al candidato recién creado.
- Si se detecta un registro de educación duplicado para el mismo candidato, el sistema devuelve `"Education record already exists for this candidate"`.

#### CA-06 · Experiencia laboral (opcional, múltiple)
- **Dado** que el reclutador añade una o varias entradas de experiencia laboral,
- **cuando** cada entrada incluye empresa, puesto y fecha de inicio con formato `YYYY-MM-DD`,
- **entonces** el sistema las persiste asociadas al candidato recién creado.
- Si se detecta una experiencia duplicada para el mismo candidato, el sistema devuelve `"Work experience record already exists for this candidate"`.

#### CA-07 · CV adjunto (opcional)
- **Dado** que el reclutador adjunta un archivo de CV con `filePath` y `fileType`,
- **cuando** ambos campos están presentes y son cadenas no vacías,
- **entonces** el sistema persiste el CV asociado al candidato.
- Si el objeto `cv` está vacío o no se incluye, el sistema omite la persistencia del CV sin error.

#### CA-08 · Respuesta exitosa
- **Dado** que todos los datos son válidos y el email no existe,
- **cuando** el reclutador envía el formulario,
- **entonces** el sistema devuelve el objeto del candidato creado incluyendo el `id` generado por la base de datos y código HTTP `201`.

---

### Matriz de trazabilidad CA ↔ Tests

| CA | Estado | Tests que lo cubren |
|---|---|---|
| **CA-01** Campos obligatorios | ✅ Cubierto | `debe rechazar un candidato sin firstName` · `debe rechazar un candidato sin lastName` · `debe rechazar un candidato sin email` · `no debe lanzar error cuando todos los campos obligatorios están presentes` · `no debe llamar a save() si la validación falla` |
| **CA-02** Formato de email válido | ✅ Cubierto | `debe aceptar emails con formato válido` · `debe rechazar emails con formato inválido` · `debe lanzar un error cuando la validación del candidato falla` |
| **CA-03** Email único en el sistema | ✅ Cubierto | `no debe permitir registrar un candidato con un email ya existente` · `debe lanzar un mensaje descriptivo cuando el email ya existe (P2002)` |
| **CA-04** Teléfono formato español | ✅ Cubierto | `no debe lanzar error cuando el teléfono se omite` · `debe aceptar teléfonos con formato español válido` · `debe rechazar teléfonos con formato inválido` |
| **CA-05** Educación (opcional, múltiple) | ✅ Cubierto | `debe guardar la educación y asignarle el ID del candidato` · `debe guardar múltiples entradas de educación en orden` · `no debe permitir registrar una educación duplicada para el mismo candidato` |
| **CA-06** Experiencia laboral (opcional, múltiple) | ✅ Cubierto | `debe guardar la experiencia laboral y asignarle el ID del candidato` · `no debe permitir registrar una experiencia laboral duplicada para el mismo candidato` |
| **CA-07** CV adjunto (opcional) | ✅ Cubierto | `debe guardar el CV y asignarle el ID del candidato` · `no debe guardar el CV cuando el objeto cv está vacío` · `no debe guardar entidades relacionadas cuando no se proporcionan` |
| **CA-08** Respuesta exitosa con ID | ✅ Cubierto | `debe insertar un candidato con los campos obligatorios` · `debe retornar el candidato con el ID asignado por la base de datos` · `debe insertar un candidato completo con todos los datos relacionados` |

> **Nota:** el código HTTP `201` de CA-08 corresponde a la capa de routing/controlador y queda fuera del alcance de los tests unitarios del servicio.

---

### Notas técnicas

- Validaciones implementadas en `src/application/validator.ts`.
- Persistencia gestionada por `addCandidate` en `src/application/services/candidateService.ts`.
- Los errores P2002 de Prisma se traducen a mensajes de negocio específicos por entidad (candidato, educación, experiencia laboral).
- Pruebas unitarias cubiertas en `src/tests/unit/candidateService.jdelgado.test.ts`.
