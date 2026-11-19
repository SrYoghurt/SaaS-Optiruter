# MVP Scope — OptiRuter

## 1. Objetivo del MVP

Construir la primera versión funcional de **OptiRuter**, un SaaS de optimización de rutas para flotas de última milla.

El MVP debe permitir que un usuario de una empresa pueda cargar pedidos y vehículos, generar rutas optimizadas, visualizarlas en un mapa y consultar métricas de eficiencia.

El MVP no busca ser una plataforma enterprise completa. Busca validar el flujo central:

> Cargar datos operativos → optimizar rutas → visualizar resultados → medir eficiencia.


## 2. Usuario principal del MVP

El usuario principal será el **operador logístico** de una empresa con flota propia.

Este usuario:

- Planifica las rutas del día.
- Trabaja con pedidos, vehículos y conductores.
- Necesita generar rutas rápidamente.
- Necesita ajustar el plan cuando cambian condiciones.
- Quiere entender qué pedidos fueron asignados y cuáles no.

El MVP se enfoca primero en este perfil porque es quien obtiene el valor operativo más directo del producto.

## 3. Problema que resuelve el MVP

Hoy, un operador suele planificar rutas manualmente usando planillas, mapas y conocimiento propio de la operación.

Esto genera:

- Tiempo excesivo de planificación.
- Rutas poco eficientes.
- Errores en asignación de pedidos.
- Dificultad para respetar ventanas horarias y capacidad.
- Falta de visibilidad sobre el impacto de las decisiones.
- Dificultad para replanificar cuando algo cambia.

OptiRuter resuelve este problema permitiendo generar rutas optimizadas de forma asistida, con reglas operativas visibles y métricas claras.

## 4. Hipótesis central

> Si un operador logístico puede cargar pedidos y vehículos, generar rutas optimizadas y ver métricas claras de eficiencia, entonces percibirá que OptiRuter reduce el tiempo y la dificultad de planificar una jornada operativa.

La validación inicial no depende de tener clientes pagos. Depende de poder demostrar que el flujo central funciona y produce un resultado útil.

## 5. Flujo principal del MVP

El recorrido central será:

1. El usuario se registra y crea una organización.
2. Carga vehículos y conductores.
3. Carga pedidos manualmente o mediante CSV.
4. Define restricciones básicas.
5. Crea un plan de rutas.
6. El sistema encola la optimización.
7. El sistema genera rutas asignadas a vehículos.
8. El usuario visualiza las rutas en un mapa.
9. El usuario consulta KPIs del plan.
10. El usuario puede reoptimizar el plan si es necesario.

Este flujo debe poder completarse de principio a fin sin necesidad de soporte manual.

## 6. Alcance incluido

### 6.1 Autenticación y organizaciones

El sistema debe permitir:

- Registro de usuario con email y contraseña.
- Login.
- Logout.
- Refresh de sesión.
- Creación automática de una organización al registrarse.
- Aislamiento de datos por organización.

Cada usuario pertenece a una organización. Todos los recursos operativos deben estar asociados a esa organización.

### 6.2 Gestión de vehículos

El usuario podrá:

- Crear un vehículo.
- Editar un vehículo.
- Eliminar un vehículo.
- Listar vehículos.
- Ver detalle de un vehículo.

Campos mínimos:

- Patente o identificador.
- Tipo de vehículo.
- Capacidad de peso.
- Capacidad de volumen.
- Estado: disponible o inactivo.
- Punto de inicio.
- Punto de fin.

### 6.3 Gestión de conductores

El usuario podrá:

- Crear un conductor.
- Editar un conductor.
- Eliminar un conductor.
- Listar conductores.
- Asignar un conductor a un vehículo.

Campos mínimos:

- Nombre.
- Email.
- Teléfono.
- Turno inicial.
- Turno final.
- Vehículo asignado.

### 6.4 Gestión de pedidos

El usuario podrá:

- Crear un pedido.
- Editar un pedido.
- Eliminar un pedido.
- Listar pedidos.
- Ver detalle de un pedido.
- Cambiar el estado de un pedido.

Campos mínimos:

- Código externo opcional.
- Dirección.
- Latitud.
- Longitud.
- Peso.
- Volumen opcional.
- Prioridad.
- Ventana horaria opcional.
- Tiempo estimado de servicio.
- Estado.

Estados iniciales:

- `PENDING`
- `ASSIGNED`
- `IN_PROGRESS`
- `COMPLETED`
- `FAILED`
- `CANCELLED`

### 6.5 Importación de pedidos por CSV

El usuario podrá importar pedidos mediante un archivo CSV.

El sistema debe:

- Permitir subir un archivo CSV.
- Validar el formato.
- Mostrar errores por fila.
- Permitir descargar una plantilla de ejemplo.
- Importar solo filas válidas.
- Informar cuántas filas fueron importadas y cuántas fallaron.

Columnas mínimas:

```csv
external_code,address,latitude,longitude,weight_kg,volume_m3,priority,time_window_start,time_window_end,service_minutes
```

### 6.6 Creación de planes de rutas

El usuario podrá crear un plan de rutas seleccionando:

- Pedidos pendientes.
- Vehículos disponibles.
- Fecha de operación.
- Restricciones básicas.

El sistema debe:

- Validar que existan pedidos y vehículos.
- Crear un plan con estado inicial `QUEUED`.
- Encolar el trabajo de optimización.
- Devolver una respuesta inmediata al usuario.

La optimización debe ejecutarse de forma asíncrona.

### 6.7 Optimización de rutas

El sistema debe poder generar rutas considerando:

- Ubicación de los pedidos.
- Capacidad de los vehículos.
- Prioridad de los pedidos.
- Ventanas horarias.
- Tiempo de servicio por parada.
- Punto de inicio y fin del vehículo.

El resultado debe incluir:

- Ruta por vehículo.
- Secuencia de paradas.
- Distancia total.
- Duración estimada.
- Carga utilizada.
- Pedidos asignados.
- Pedidos no asignados.
- Resumen global del plan.


### 6.8 Visualización de rutas

El usuario podrá ver:

- Mapa con rutas generadas.
- Rutas diferenciadas por vehículo.
- Puntos de entrega.
- Secuencia de paradas.
- Panel lateral con detalle de cada ruta.
- Estado de cada pedido.

El mapa debe permitir:

- Zoom.
- Pan.
- Selección de una ruta.
- Visualización de una parada específica.

### 6.9 KPIs del plan

El usuario podrá consultar métricas del plan:

- Cantidad de vehículos utilizados.
- Cantidad de pedidos asignados.
- Cantidad de pedidos no asignados.
- Distancia total estimada.
- Duración total estimada.
- Carga total utilizada.
- Porcentaje de capacidad utilizada.
- Cantidad de rutas generadas.

Las métricas deben ser visibles en el detalle del plan.

### 6.10 Reoptimización

El usuario podrá solicitar una reoptimización de un plan existente.

Casos soportados en el MVP:

- Agregar pedidos nuevos.
- Cambiar prioridad de un pedido.
- Desactivar un vehículo.
- Cambiar capacidad de un vehículo.

El sistema debe:

- Crear una nueva versión del plan.
- Mantener el plan anterior como historial.
- Mostrar el estado de la nueva optimización.

### 6.11 Estado en tiempo real

El usuario podrá ver el estado de un plan:

- `QUEUED`
- `OPTIMIZING`
- `READY`
- `FAILED`

La actualización debe ocurrir sin recargar la página, mediante WebSocket.

### 6.12 Landing pública

El MVP incluirá una landing pública con:

- Hero con propuesta de valor.
- Explicación del problema.
- Beneficios principales.
- Demo visual del producto.
- CTA para solicitar demo o probar.
- Sección de FAQ.
- Footer básico.

La landing no necesita tener pagos ni registro automático a un plan pago en esta etapa.

## 7. Alcance excluido

Lo siguiente queda **explícitamente fuera del MVP**:

| Feature | Motivo de exclusión | Revisión futura |
|---|---|---|
| Tracking GPS en tiempo real | Requiere integración con dispositivos o apps móviles | Después de validar el flujo de planificación |
| App móvil nativa | El MVP se validará con web responsive | Cuando exista uso recurrente de conductores |
| Pagos y suscripciones | El objetivo inicial es validar el producto, no monetizar | Después de tener usuarios piloto |
| Integraciones ERP | Alta complejidad y dependencia externa | Cuando haya demanda concreta |
| Optimización con tráfico en vivo | Requiere proveedor externo y mayor costo | Después del MVP |
| Predicción de demanda | No es necesario para validar el flujo central | Fase posterior |
| Multi-idioma | Complejidad innecesaria para validar el producto | Cuando haya usuarios internacionales |
| Reportes avanzados | Los KPIs básicos cubren la necesidad inicial | Después de feedback de usuarios |
| Notificaciones por email/SMS | No es crítico para el flujo de optimización | Fase posterior |
| Roles y permisos granulares | El MVP usará roles básicos | Cuando haya equipos más grandes |
| Auditoría completa | No es bloqueante para el MVP | Fase posterior |
| Exportación PDF/Excel | Puede agregarse después de validar el valor | Fase posterior |


## 8. Priorización MoSCoW

### Must have

- Auth.
- Organizaciones.
- Vehículos.
- Conductores.
- Pedidos.
- Importación CSV.
- Planes de rutas.
- Optimización asíncrona.
- Mapa de rutas.
- KPIs.
- Reoptimización.
- Estado en tiempo real.
- Landing pública.

### Should have

- Filtros en listados.
- Búsqueda de pedidos.
- Validaciones avanzadas.
- Manejo de errores detallado.
- Exportación CSV de resultados.

### Could have

- Dark mode.
- Notificaciones internas.
- Onboarding guiado.
- Plantillas de configuración.

### Won’t have

- Tracking GPS.
- Pagos.
- Integraciones ERP.
- App móvil nativa.
- Tráfico en vivo.
- Multi-idioma.

## 9. Criterios de aceptación

### Auth

**Dado** un usuario nuevo,  
**cuando** se registra con email y contraseña válidos,  
**entonces** se crea una organización y el usuario queda autenticado.

**Dado** un usuario autenticado,  
**cuando** intenta acceder a recursos de otra organización,  
**entonces** el sistema devuelve `403 Forbidden`.

### Vehículos

**Dado** un usuario autenticado,  
**cuando** crea un vehículo con datos válidos,  
**entonces** el vehículo queda disponible para ser usado en planes.

**Dado** un vehículo con capacidad inválida,  
**cuando** se intenta crear,  
**entonces** el sistema devuelve un error de validación claro.

### Pedidos

**Dado** un pedido con dirección y coordenadas válidas,  
**cuando** se crea,  
**entonces** queda en estado `PENDING`.

**Dado** un pedido sin coordenadas válidas,  
**cuando** se intenta crear,  
**entonces** el sistema rechaza la operación con un mensaje claro.

### Importación CSV

**Dado** un CSV válido con 100 pedidos,  
**cuando** se importa,  
**entonces** el sistema crea 100 pedidos y muestra un resumen de importación.

**Dado** un CSV con filas inválidas,  
**cuando** se importa,  
**entonces** el sistema importa solo las filas válidas y reporta los errores por fila.

### Plan de rutas

**Dado** pedidos pendientes y vehículos disponibles,  
**cuando** el usuario crea un plan,  
**entonces** el sistema responde `202 Accepted` y el plan queda en estado `QUEUED`.

**Dado** un plan en estado `QUEUED`,  
**cuando** finaliza la optimización,  
**entonces** el plan pasa a `READY` y se generan rutas.

**Dado** un plan con pedidos que no pueden asignarse,  
**cuando** finaliza la optimización,  
**entonces** esos pedidos quedan marcados como no asignados con un motivo.

### Mapa

**Dado** un plan en estado `READY`,  
**cuando** el usuario abre el detalle,  
**entonces** ve el mapa con rutas, paradas y vehículos.

**Dado** una ruta seleccionada,  
**cuando** el usuario la selecciona en el mapa,  
**entonces** se resalta la ruta y se muestra el detalle de sus paradas.

### KPIs

**Dado** un plan finalizado,  
**cuando** el usuario consulta el detalle,  
**entonces** ve distancia total, duración total, pedidos asignados y pedidos no asignados.

### Reoptimización

**Dado** un plan existente,  
**cuando** el usuario solicita reoptimización,  
**entonces** se crea una nueva versión del plan sin perder el historial anterior.

### Tiempo real

**Dado** un plan en optimización,  
**cuando** cambia el estado,  
**entonces** la interfaz se actualiza sin recargar la página.

Los criterios de aceptación deben expresar condiciones testeables que definan cuándo una feature está realmente completa. [120][124][126]

## 10. Dependencias técnicas

| Dependencia | Uso | Estado inicial |
|---|---|---|
| PostgreSQL | Base de datos principal | Requerido |
| Prisma | ORM y migraciones | Requerido |
| Redis | Cola y estado de jobs | Requerido |
| BullMQ | Procesamiento asíncrono | Requerido |
| NestJS | API backend | Requerido |
| React + TypeScript | Frontend | Requerido |
| MapLibre GL JS | Mapa y rutas | Requerido |
| Google OR-Tools | Motor de optimización | Requerido |
| Python + FastAPI | Servicio optimizador | Requerido |
| WebSocket | Actualizaciones en tiempo real | Requerido |
| Docker Compose | Entorno local | Requerido |
| GitHub Actions | CI básico | Recomendado |

Las dependencias externas y servicios requeridos deben mapearse antes de construir, porque suelen generar demoras si no están resueltas desde el inicio. [120]

## 11. Restricciones

- El MVP será web responsive.
- El backend será NestJS + TypeScript.
- La base de datos será PostgreSQL.
- El ORM será Prisma.
- La optimización será asíncrona.
- El optimizador será un servicio separado en Python.
- La autenticación será por JWT con refresh token.
- Todos los recursos estarán aislados por organización.
- No se usarán secretos en el repositorio.
- Toda API estará versionada bajo `/api/v1`.
- Toda entrada será validada.
- Toda respuesta de error tendrá formato consistente.

## 12. Definición de Done

Una feature se considera terminada cuando:

- Está implementada en backend y frontend.
- Tiene validación de entrada.
- Tiene manejo de errores.
- Tiene tests automatizados.
- Está documentada en Swagger si expone un endpoint.
- Está documentada en `docs/` si introduce una decisión técnica.
- Funciona en desktop y mobile.
- No expone datos de otra organización.
- No deja estados inconsistentes.
- Puede ser demostrada de extremo a extremo.

“Done” no significa “compila”: significa que la funcionalidad cumple criterios verificables y puede usarse en el flujo real. [120][122]

## 13. Criterios de éxito del MVP

El MVP se considera exitoso si:

- [ ] Un usuario puede registrarse y crear una organización.
- [ ] Un usuario puede cargar vehículos y conductores.
- [ ] Un usuario puede crear pedidos manualmente.
- [ ] Un usuario puede importar pedidos por CSV.
- [ ] Un usuario puede crear un plan de rutas.
- [ ] El sistema genera rutas optimizadas.
- [ ] El usuario puede ver rutas en un mapa.
- [ ] El usuario puede ver KPIs del plan.
- [ ] El usuario puede reoptimizar un plan.
- [ ] El estado del plan se actualiza en tiempo real.
- [ ] Los datos están aislados por organización.
- [ ] El flujo completo puede demostrarse sin intervención manual.

## 14. Roadmap del MVP

### Fase 1 — Fundación

- Crear repositorio.
- Configurar monorepo.
- Configurar NestJS.
- Configurar Prisma.
- Configurar PostgreSQL.
- Configurar Redis.
- Configurar Docker Compose.
- Configurar CI básico.

### Fase 2 — Núcleo operativo

- Auth.
- Organizaciones.
- Usuarios.
- Vehículos.
- Conductores.
- Pedidos.
- Importación CSV.

### Fase 3 — Optimización

- Planes.
- Cola BullMQ.
- Worker.
- Servicio Python OR-Tools.
- Rutas y paradas.
- KPIs.
- Reoptimización.

### Fase 4 — Experiencia

- Dashboard.
- Mapa.
- Detalle de plan.
- Estado en tiempo real.
- Landing pública.
- Tests E2E.

### Fase 5 — Preparación para demo

- Deploy.
- Documentación.
- Datos de demo.
- Screenshots.
- README profesional.
- Caso de uso completo.

## 15. Fuera de alcance, pero deseable después

Estas features no entran al MVP, pero son candidatas naturales para la siguiente versión:

- Proof of delivery con foto o firma.
- Notificaciones al cliente final.
- Integración con Google Maps o proveedores de mapas.
- Optimización dinámica con tráfico.
- Roles avanzados.
- Reportes exportables.
- API pública.
- Facturación.
- App móvil para conductores.

Las plataformas de route optimization suelen incluir capacidades como optimización con restricciones, app de conductor, tracking, notificaciones, proof of delivery, dispatch y rerouting; para el MVP conviene elegir solo las que sostienen el flujo central. [117][129][130]