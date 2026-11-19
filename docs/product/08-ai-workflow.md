# AI Workflow — OptiRuter

## 1. Objetivo

Este documento define cómo usar IA de forma profesional durante el desarrollo de OptiRuter.

El objetivo no es “que la IA escriba todo”. El objetivo es usar IA como un **pair programmer senior**, manteniendo control sobre la arquitectura, la seguridad, la calidad y el aprendizaje.

La IA puede acelerar el desarrollo, pero el código generado debe tratarse como una propuesta: revisarlo, entenderlo, testearlo y validarlo antes de integrarlo. [222][226][234]

## 2. Principios de trabajo

- La IA propone, tú decides.
- Nunca aceptes código que no entiendes.
- Nunca mezcles código generado sin revisión.
- Siempre pide plan antes de código.
- Siempre pide tests.
- Siempre revisa seguridad.
- Siempre revisa casos límite.
- Siempre documenta decisiones importantes.
- Si algo no funciona, no aceptes un parche mágico: entiende la causa.

## 3. Roles

| Rol | Responsabilidad |
|---|---|
| Tú | Producto, arquitectura, decisiones, revisión y aprendizaje. |
| IA | Investigación, propuestas, generación de código, tests y revisión crítica. |
| Tests | Validar comportamiento real. |
| CI | Detectar errores antes de merge. |
| Documentación | Mantener decisiones y contexto. |

## 4. Flujo de trabajo

### Paso 1 — Definir objetivo

Antes de pedir código, define:

- Qué módulo vas a construir.
- Qué problema resuelve.
- Qué criterios de aceptación tiene.
- Qué dependencias tiene.
- Qué no debe hacer.

### Paso 2 — Pedir plan

Nunca pidas código directamente.

Pide primero:

- Modelo de datos.
- Endpoints.
- DTOs.
- Reglas de negocio.
- Tests.
- Riesgos.
- Estructura de archivos.

### Paso 3 — Revisar plan

Antes de aceptar, preguntate:

- ¿Esto cumple el MVP scope?
- ¿Esto respeta el modelo de datos?
- ¿Esto respeta el API contract?
- ¿Esto introduce complejidad innecesaria?
- ¿Hay algo que no entiendo?

### Paso 4 — Implementar por partes

Implementa un módulo o feature a la vez.

Ejemplo:

- No: “haz todo el backend”.
- Sí: “implementa el módulo de vehículos con CRUD, validación y tests”.

### Paso 5 — Revisar código

Revisa:

- Arquitectura.
- Seguridad.
- Manejo de errores.
- Performance.
- Testabilidad.
- Legibilidad.
- Cumplimiento del contrato.

### Paso 6 — Testear

- Unit tests.
- Integration tests.
- E2E cuando corresponda.
- Casos negativos.
- Casos límite.
- Casos de seguridad.

### Paso 7 — Documentar

Si la decisión es importante, crea un ADR.

Ejemplo:

- Elección de Prisma.
- Elección de OR-Tools.
- Elección de BullMQ.
- Estrategia multi-tenant.

## 5. Reglas de oro

1. **No aceptes código sin entenderlo.**
2. **No aceptes código sin tests.**
3. **No aceptes código sin revisión de seguridad.**
4. **No aceptes código que rompa el contrato de API.**
5. **No aceptes código que rompa el modelo de datos.**
6. **No aceptes código que exponga secretos.**
7. **No aceptes código que ignore multi-tenancy.**
8. **No aceptes código que no maneje errores.**
9. **No aceptes código que no sea testeable.**
10. **No aceptes código que no puedas explicar.**

## 6. Prompts base

### Prompt para planear

```text
Actua como senior backend engineer especializado en NestJS, Prisma, PostgreSQL y BullMQ.

Necesito implementar el módulo de vehículos para OptiRuter.

Antes de escribir código, dame:
- Modelo de datos
- Endpoints
- DTOs
- Reglas de negocio
- Validaciones
- Tests
- Riesgos
- Estructura de archivos

No escribas código todavía.
```

### Prompt para implementar

```text
Implementa solo el módulo de vehículos.

Requisitos:
- NestJS + TypeScript
- Prisma + PostgreSQL
- Validación con DTOs
- Multi-tenancy por organizationId
- Tests unitarios
- Tests de integración
- Swagger
- Manejo de errores consistente

No implementes nada fuera del alcance.
No uses secretos hardcodeados.
No modifiques otros módulos.
```

### Prompt para revisar

```text
Revisa este código como senior NestJS engineer.

Buscá problemas de:
- Seguridad
- Arquitectura
- Performance
- Manejo de errores
- Testabilidad
- Multi-tenancy
- Legibilidad

Sé crítico.
Explica cada problema.
Propone soluciones concretas.
```

### Prompt para tests

```text
Genera tests para este módulo.

Incluye:
- Casos exitosos
- Casos inválidos
- Casos límite
- Casos de autorización
- Casos multi-tenant
- Casos de error

No modifiques el código para que los tests pasen.
```

### Prompt para aprender

```text
Explícame este archivo como si estuviera aprendiendo NestJS.

Explica:
- Qué hace cada parte
- Por qué existe
- Cómo se conecta con el resto
- Qué pasaría si lo quitáramos
- Qué decisiones de diseño hay detrás
```

### Prompt para refactor

```text
Revisa este código y propon un refactor.

Objetivos:
- Más legible
- Más testeable
- Más seguro
- Más alineado con la arquitectura

No cambies el comportamiento externo.
Explica cada cambio.
```

## 7. Checklist antes de aceptar código

Antes de aceptar código generado por IA, revisa:

- [ ] Entiendo qué hace.
- [ ] Cumple el MVP scope.
- [ ] Respeta el modelo de datos.
- [ ] Respeta el API contract.
- [ ] Valida inputs.
- [ ] Maneja errores.
- [ ] No expone secretos.
- [ ] Respeta multi-tenancy.
- [ ] Tiene tests.
- [ ] Los tests cubren casos negativos.
- [ ] Pasa lint.
- [ ] Pasa typecheck.
- [ ] Pasa tests.
- [ ] Está documentado si corresponde.
- [ ] Puedo explicarlo con mis palabras.

## 8. Checklist de seguridad

Revisa siempre:

- [ ] No hay secretos hardcodeados.
- [ ] No hay SQL injection.
- [ ] No hay XSS.
- [ ] No hay auth bypass.
- [ ] No hay fuga de datos entre organizaciones.
- [ ] Los endpoints protegidos tienen guard.
- [ ] Los inputs están validados.
- [ ] Los errores no exponen internals.
- [ ] Los tokens no se loguean.
- [ ] Las dependencias son conocidas y seguras.

OWASP recomienda no confiar en tests generados por IA como prueba de seguridad, exigir revisión humana y agregar casos adversarios como inputs inválidos, tokens expirados, payloads malformados y condiciones de concurrencia. [222][227]

## 9. Checklist de calidad

Revisa siempre:

- [ ] Nombres claros.
- [ ] Funciones pequeñas.
- [ ] Responsabilidad única.
- [ ] Sin duplicación innecesaria.
- [ ] Sin dependencias circulares.
- [ ] Sin lógica de negocio en controllers.
- [ ] Sin acceso directo a Prisma desde controllers.
- [ ] Con DTOs de entrada y salida.
- [ ] Con manejo de errores consistente.
- [ ] Con tests significativos.

## 10. Cómo evitar dependencia ciega

### Regla 1 — Leer antes de correr

Nunca ejecutes código sin leerlo antes.

### Regla 2 — Entender antes de aceptar

Si no puedes explicar qué hace, no lo aceptes.

### Regla 3 — Testear antes de integrar

Los tests deben validar comportamiento, no solo que compile.

### Regla 4 — Revisar seguridad por separado

No mezcles revisión funcional con revisión de seguridad.

### Regla 5 — Documentar decisiones

Si una decisión es importante, crea un ADR.

### Regla 6 — Aprender de cada módulo

Después de cada módulo, preguntate:

- ¿Qué aprendí?
- ¿Qué patrón usé?
- ¿Qué mejorarías?
- ¿Qué haría distinto la próxima vez?

## 11. Flujo recomendado por módulo

Para cada módulo, sigue este orden:

1. Leer user stories.
2. Leer modelo de datos.
3. Leer API contract.
4. Pedir plan a IA.
5. Revisar plan.
6. Implementar DTOs.
7. Implementar service.
8. Implementar controller.
9. Implementar tests.
10. Correr tests.
11. Revisar seguridad.
12. Documentar si corresponde.
13. Commit.
14. Pull request.
15. Revisión final.

## 12. Ejemplo práctico

### Módulo: Vehicles

**Objetivo:**
CRUD de vehículos con multi-tenancy.

**Prompt inicial:**

```text
Actúa como senior NestJS engineer.

Necesito implementar el módulo de vehículos.

Requisitos:
- CRUD completo
- Multi-tenancy
- Validación
- Tests
- Swagger

Antes de código, dame plan.
```

**Después del plan:**

```text
El plan se ve bien, pero quiero ajustar:
- Agregar índice por organizationId
- Agregar validación de capacidad
- Agregar test de acceso cruzado entre organizaciones

Implementa solo DTOs y service.
```

**Después del service:**

```text
Implementa ahora controller y tests.
No modifiques el service salvo que sea necesario.
```

**Después de tests:**

```text
Revisa los tests.
Busca casos faltantes:
- Acceso cruzado
- Capacidad inválida
- Vehículo inexistente
- Token inválido
```

## 13. Errores comunes

| Error | Consecuencia | Solución |
|---|---|---|
| Aceptar código sin leer | Bugs ocultos | Leer y entender |
| No pedir tests | Código frágil | Exigir tests |
| Mezclar todo de una vez | Difícil de revisar | Vertical slices |
| No revisar seguridad | Vulnerabilidades | Checklist de seguridad |
| Confiar en tests generados | Falsa confianza | Revisar assertions |
| No documentar decisiones | Contexto perdido | ADRs |
| No entender el código | Dependencia ciega | Preguntar y aprender |

## 14. Reglas de commits

Usa commits pequeños y claros.

Ejemplos:

```text
feat(vehicles): add vehicle CRUD with multi-tenancy
test(vehicles): add unit and integration tests
docs(api): document vehicles endpoints
refactor(vehicles): extract validation logic
fix(vehicles): prevent cross-tenant access
```

## 15. Reglas de Pull Requests

Cada PR debe:

- Tener un objetivo claro.
- Incluir descripción.
- Incluir tests.
- Incluir screenshots si cambia UI.
- Incluir documentación si cambia contrato.
- Pasar CI.
- Ser revisable en menos de 400 líneas idealmente.

## 16. Reglas de aprendizaje

Después de cada módulo, escribe en tu diario técnico:

- Qué aprendí.
- Qué patrón usé.
- Qué error cometí.
- Qué mejorarías.
- Qué pregunta le haría a un senior.

Esto convierte el proyecto en una herramienta de aprendizaje real, no solo en un entregable.

## 17. Reglas de IA y seguridad

- No pegues secretos en prompts.
- No pegues `.env` real.
- No pegues tokens.
- No pegues credenciales.
- No pegues datos de clientes.
- No pegues código de producción sensible.
- Usa datos ficticios.
- Revisa dependencias nuevas.
- Revisa imports nuevos.

## 18. Reglas de IA y arquitectura

- No dejes que la IA decida la arquitectura.
- No dejes que la IA cambie el modelo sin revisión.
- No dejes que la IA agregue dependencias sin justificación.
- No dejes que la IA introduzca patrones que no entendés.
- No dejes que la IA rompa contratos existentes.

## 19. Reglas de IA y testing

- Pide tests antes de aceptar código.
- Revisa assertions.
- Revisa casos negativos.
- Revisa casos límite.
- Revisa seguridad.
- No aceptes tests que solo validen la implementación.

## 20. Reglas de IA y documentación

- Documenta decisiones, no solo código.
- Documenta por qué, no solo qué.
- Manten ADRs actualizados.
- Manten README actualizado.
- Manten API contract actualizado.

## 21. Flujo final recomendado

```text
1. Definir objetivo
2. Leer documentación
3. Pedir plan
4. Revisar plan
5. Implementar por partes
6. Revisar código
7. Testear
8. Revisar seguridad
9. Documentar
10. Commit
11. PR
12. CI
13. Merge
```

## 22. Regla final

> **La IA acelera, pero no reemplaza criterio.**

Tu valor como desarrollador no está en escribir código más rápido, sino en:
- Entender el problema.
- Diseñar bien.
- Revisar críticamente.
- Testear correctamente.
- Documentar decisiones.
- Aprender de cada iteración.