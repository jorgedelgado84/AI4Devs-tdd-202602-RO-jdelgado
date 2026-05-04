Sobre este proyecto se requiere configurar las pruebas usando jest
este proyecto esta escrito usando Typescript por lo que ts-jest es la mejor opción para aplicar pruebas. 
Analiza el proyecto y preparalo para la implementación siguiendo las mejores practicas.

revisa la configuracion para jest e el frontend

revisa las pruebas que fallaron

crea los test que validen la insercion de los candidatos en base de datos

combina las pruebas de Cadidate.test.ts en @backend/src/tests/unit/candidateService.jdelgado.test.ts

documenta trodas las pruebas

candidateService.jdelgado.test.ts
agrega las pruebas:
* Validar que el candidato no este duplicado por el email.
* Validar que no duplique Education
* Validar que no duplique WorkExperience

Valida que las pruebas usen el Arrange-Act-Assert (AAA)

en base a la ¿Qué es LTI-ATS?

LTI-ATS es un sistema de seguimiento de candidatos (ATS) diseñado para democratizar el reclutamiento inteligente. A diferencia de las soluciones enterprise tradicionales, LTI-ATS está construido desde el primer día para ser accesible, rápido de adoptar y escalable — desde una startup de 5 personas hasta un corporativo de miles de empleados.

La plataforma centraliza todo el ciclo de contratación: publicación de vacantes, recepción y filtrado de CVs, gestión del pipeline de selección, comunicación con candidatos y analítica de reclutamiento, todo en una sola herramienta intuitiva y en español.
crea la historia de usuario usnado invest solo de la generacion del candidato

Valida que los criterios de aceptación de la historia de usuario esten cubiertos con las pruebas generadas