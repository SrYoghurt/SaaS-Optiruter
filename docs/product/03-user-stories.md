# User Stories — OptiRuter

## 1. Convenciones

Cada historia incluye:

- ID único.
- Título.
- Historia de usuario.
- Criterios de aceptación.
- Prioridad.
- Módulo.
- Dependencias.
- Fuera de alcance.

Las historias deben ser pequeñas, valiosas, estimables y testeables. El modelo INVEST ayuda a validar que una historia sea independiente, negociable, valiosa, estimable, pequeña y testeable. [132][140][145]

## 2. Épicas

| Épica | Descripción |
|---|---|
| Autenticación y organizaciones | Registro, login, sesión y aislamiento multi-tenant. |
| Flota | Gestión de vehículos y conductores. |
| Pedidos | Creación, edición, listado e importación de pedidos. |
| Planificación | Creación de planes y generación de rutas. |
| Optimización | Ejecución asíncrona del motor de ruteo. |
| Visualización | Mapa, detalle de rutas y KPIs. |
| Reoptimización | Ajuste de rutas ante cambios operativos. |
| Landing | Página pública de presentación del producto. |

## 3. Autenticación y organizaciones

### US-001 — Registrarse

**Como** usuario nuevo,  
**quiero** registrarme con email y contraseña,  
**para que** pueda acceder a OptiRuter y crear mi organización.

**Prioridad:** Must have  
**Módulo:** Auth  
**Dependencias:** Ninguna

**Criterios de aceptación:**

- **Given** un email y password válidos,  
  **when** el usuario envía el formulario de registro,  
  **then** se crea el usuario y una organización asociada.

- **Given** un email ya registrado,  
  **when** el usuario intenta registrarse,  
  **then** el sistema muestra un error claro sin exponer información sensible.

- **Given** una contraseña débil,  
  **when** el usuario intenta registrarse,  
  **then** el sistema rechaza el registro con reglas visibles.

- **Given** un registro exitoso,  
  **when** el usuario completa el proceso,  
  **then** recibe un access token y un refresh token.

**Fuera de alcance:**
- Login social.
- Verificación por email.
- Recuperación de contraseña.

### US-002 — Iniciar sesión

**Como** usuario registrado,  
**quiero** iniciar sesión con mis credenciales,  
**para que** pueda acceder al dashboard de mi organización.

**Prioridad:** Must have  
**Módulo:** Auth  
**Dependencias:** US-001

**Criterios de aceptación:**

- **Given** credenciales válidas,  
  **when** el usuario inicia sesión,  
  **then** recibe tokens de acceso y refresh.

- **Given** credenciales inválidas,  
  **when** el usuario intenta iniciar sesión,  
  **then** recibe un error genérico de credenciales inválidas.

- **Given** un usuario autenticado,  
  **when** accede a una ruta protegida,  
  **then** puede visualizar los datos de su organización.

- **Given** un usuario no autenticado,  
  **when** accede a una ruta protegida,  
  **then** es redirigido al login.

### US-003 — Refrescar sesión

**Como** usuario autenticado,  
**quiero** renovar mi sesión cuando el access token expira,  
**para que** no pierda mi trabajo por cerrarse la sesión inesperadamente.

**Prioridad:** Must have  
**Módulo:** Auth  
**Dependencias:** US-002

**Criterios de aceptación:**

- **Given** un refresh token válido,  
  **when** el access token expira,  
  **then** el sistema emite un nuevo access token.

- **Given** un refresh token inválido o expirado,  
  **when** el usuario intenta refrescar,  
  **then** el sistema cierra la sesión y solicita login nuevamente.

- **Given** un refresh token reutilizado,  
  **when** el sistema detecta el uso,  
  **then** invalida la sesión asociada.

### US-004 — Cerrar sesión

**Como** usuario autenticado,  
**quiero** cerrar sesión,  
**para que** nadie más pueda acceder a mi cuenta desde ese dispositivo.

**Prioridad:** Must have  
**Módulo:** Auth  
**Dependencias:** US-002

**Criterios de aceptación:**

- **Given** un usuario autenticado,  
  **when** cierra sesión,  
  **then** los tokens activos dejan de ser válidos.

- **Given** un usuario que cerró sesión,  
  **when** intenta acceder a una ruta protegida,  
  **then** es redirigido al login.

## 4. Organización y usuarios

### US-005 — Ver información de la organización

**Como** usuario autenticado,  
**quiero** ver los datos de mi organización,  
**para que** pueda confirmar que estoy operando en el contexto correcto.

**Prioridad:** Should have  
**Módulo:** Organizations  
**Dependencias:** US-001

**Criterios de aceptación:**

- **Given** un usuario autenticado,  
  **when** accede a la configuración de la organización,  
  **then** ve nombre, fecha de creación y datos básicos.

- **Given** un usuario de otra organización,  
  **when** intenta acceder a una organización ajena,  
  **then** recibe `403 Forbidden`.

### US-006 — Editar información de la organización

**Como** administrador de una organización,  
**quiero** editar el nombre y datos básicos,  
**para que** la cuenta refleje correctamente la empresa.

**Prioridad:** Could have  
**Módulo:** Organizations  
**Dependencias:** US-005

**Criterios de aceptación:**

- **Given** un administrador autenticado,  
  **when** edita el nombre de la organización,  
  **then** el cambio se guarda y se refleja en la interfaz.

- **Given** un usuario sin permisos de administración,  
  **when** intenta editar la organización,  
  **then** recibe `403 Forbidden`.

## 5. Vehículos

### US-007 — Crear vehículo

**Como** operador logístico,  
**quiero** crear un vehículo con capacidad y ubicación inicial,  
**para que** pueda ser considerado en la optimización de rutas.

**Prioridad:** Must have  
**Módulo:** Vehicles  
**Dependencias:** US-001

**Criterios de aceptación:**

- **Given** datos válidos de vehículo,  
  **when** el operador crea el vehículo,  
  **then** queda disponible para planes futuros.

- **Given** una capacidad negativa o inválida,  
  **when** el operador intenta crear el vehículo,  
  **then** el sistema rechaza la operación.

- **Given** un vehículo creado,  
  **when** el operador consulta el listado,  
  **then** el vehículo aparece con su estado y capacidad.

### US-008 — Editar vehículo

**Como** operador logístico,  
**quiero** editar los datos de un vehículo,  
**para que** el plan use información actualizada.

**Prioridad:** Must have  
**Módulo:** Vehicles  
**Dependencias:** US-007

**Criterios de aceptación:**

- **Given** un vehículo existente,  
  **when** el operador edita capacidad o estado,  
  **then** los cambios se guardan correctamente.

- **Given** un vehículo de otra organización,  
  **when** el operador intenta editarlo,  
  **then** recibe `403 Forbidden`.

### US-009 — Eliminar vehículo

**Como** operador logístico,  
**quiero** eliminar un vehículo que ya no se usa,  
**para que** no aparezca en futuras planificaciones.

**Prioridad:** Must have  
**Módulo:** Vehicles  
**Dependencias:** US-007

**Criterios de aceptación:**

- **Given** un vehículo sin rutas activas,  
  **when** el operador lo elimina,  
  **then** deja de aparecer en el listado activo.

- **Given** un vehículo asociado a un plan activo,  
  **when** el operador intenta eliminarlo,  
  **then** el sistema advierte o impide la operación según la regla definida.

### US-010 — Listar y filtrar vehículos

**Como** operador logístico,  
**quiero** listar y filtrar vehículos,  
**para que** pueda encontrar rápidamente el que necesito.

**Prioridad:** Should have  
**Módulo:** Vehicles  
**Dependencias:** US-007

**Criterios de aceptación:**

- **Given** múltiples vehículos,  
  **when** el operador aplica un filtro por estado o tipo,  
  **then** solo se muestran los vehículos que cumplen el criterio.

- **Given** un operador con muchos vehículos,  
  **when** usa búsqueda por patente,  
  **then** el sistema devuelve resultados relevantes.

## 6. Conductores

### US-011 — Crear conductor

**Como** operador logístico,  
**quiero** crear un conductor con turno y vehículo asignado,  
**para que** pueda ser considerado en la planificación.

**Prioridad:** Must have  
**Módulo:** Drivers  
**Dependencias:** US-007

**Criterios de aceptación:**

- **Given** datos válidos de conductor,  
  **when** el operador lo crea,  
  **then** queda disponible para asignación.

- **Given** un conductor con turno inválido,  
  **when** se intenta crear,  
  **then** el sistema rechaza la operación.

- **Given** un conductor asignado a un vehículo,  
  **when** se consulta el vehículo,  
  **then** se muestra el conductor asociado.

### US-012 — Editar conductor

**Como** operador logístico,  
**quiero** editar los datos de un conductor,  
**para que** su disponibilidad y asignación estén actualizadas.

**Prioridad:** Must have  
**Módulo:** Drivers  
**Dependencias:** US-011

**Criterios de aceptación:**

- **Given** un conductor existente,  
  **when** el operador cambia su turno o vehículo,  
  **then** los cambios se guardan.

- **Given** un conductor de otra organización,  
  **when** se intenta editar,  
  **then** recibe `403 Forbidden`.

### US-013 — Eliminar conductor

**Como** operador logístico,  
**quiero** eliminar un conductor inactivo,  
**para que** no sea considerado en futuras rutas.

**Prioridad:** Must have  
**Módulo:** Drivers  
**Dependencias:** US-011

**Criterios de aceptación:**

- **Given** un conductor sin rutas activas,  
  **when** se elimina,  
  **then** deja de estar disponible.

- **Given** un conductor con rutas activas,  
  **when** se intenta eliminar,  
  **then** el sistema advierte o impide la operación.

## 7. Pedidos

### US-014 — Crear pedido manualmente

**Como** operador logístico,  
**quiero** crear un pedido con dirección, peso, prioridad y ventana horaria,  
**para que** pueda ser incluido en un plan de rutas.

**Prioridad:** Must have  
**Módulo:** Orders  
**Dependencias:** US-001

**Criterios de aceptación:**

- **Given** un pedido con datos válidos,  
  **when** se crea,  
  **then** queda en estado `PENDING`.

- **Given** un pedido sin coordenadas válidas,  
  **when** se intenta crear,  
  **then** el sistema rechaza la operación.

- **Given** un pedido con prioridad alta,  
  **when** se consulta,  
  **then** se muestra claramente su prioridad.

### US-015 — Editar pedido

**Como** operador logístico,  
**quiero** editar un pedido pendiente,  
**para que** refleje cambios de dirección, peso o prioridad.

**Prioridad:** Must have  
**Módulo:** Orders  
**Dependencias:** US-014

**Criterios de aceptación:**

- **Given** un pedido en estado `PENDING`,  
  **when** se edita,  
  **then** los cambios se guardan.

- **Given** un pedido ya asignado,  
  **when** se intenta editar,  
  **then** el sistema define claramente si permite edición o requiere reoptimización.

### US-016 — Eliminar pedido

**Como** operador logístico,  
**quiero** eliminar un pedido pendiente,  
**para que** no sea considerado en la planificación.

**Prioridad:** Must have  
**Módulo:** Orders  
**Dependencias:** US-014

**Criterios de aceptación:**

- **Given** un pedido pendiente,  
  **when** se elimina,  
  **then** deja de aparecer en el listado activo.

- **Given** un pedido asignado a una ruta,  
  **when** se intenta eliminar,  
  **then** el sistema advierte o impide la operación.

### US-017 — Importar pedidos por CSV

**Como** operador logístico,  
**quiero** importar pedidos desde un CSV,  
**para que** pueda cargar muchos pedidos sin cargarlos uno por uno.

**Prioridad:** Must have  
**Módulo:** Orders  
**Dependencias:** US-014

**Criterios de aceptación:**

- **Given** un CSV válido,  
  **when** se importa,  
  **then** se crean los pedidos correspondientes.

- **Given** un CSV con filas inválidas,  
  **when** se importa,  
  **then** el sistema importa solo filas válidas y reporta errores por fila.

- **Given** un CSV con formato incorrecto,  
  **when** se importa,  
  **then** el sistema muestra un error claro.

- **Given** una importación exitosa,  
  **when** finaliza,  
  **then** el sistema muestra cantidad de filas importadas y rechazadas.

## 8. Planes y optimización

### US-018 — Crear plan de rutas

**Como** operador logístico,  
**quiero** crear un plan seleccionando pedidos y vehículos,  
**para que** el sistema genere rutas optimizadas.

**Prioridad:** Must have  
**Módulo:** Plans  
**Dependencias:** US-007, US-014

**Criterios de aceptación:**

- **Given** pedidos pendientes y vehículos disponibles,  
  **when** el operador crea un plan,  
  **then** el sistema responde `202 Accepted`.

- **Given** un plan creado,  
  **when** se consulta,  
  **then** aparece con estado `QUEUED`.

- **Given** un plan sin pedidos o sin vehículos,  
  **when** se intenta crear,  
  **then** el sistema rechaza la operación.

### US-019 — Ver estado del plan

**Como** operador logístico,  
**quiero** ver el estado de un plan,  
**para que** sepa cuándo estará listo.

**Prioridad:** Must have  
**Módulo:** Plans  
**Dependencias:** US-018

**Criterios de aceptación:**

- **Given** un plan en cola,  
  **when** se consulta,  
  **then** muestra `QUEUED`.

- **Given** un plan en proceso,  
  **when** se consulta,  
  **then** muestra `OPTIMIZING`.

- **Given** un plan finalizado,  
  **when** se consulta,  
  **then** muestra `READY` y sus rutas.

- **Given** un plan fallido,  
  **when** se consulta,  
  **then** muestra `FAILED` y un motivo.

### US-020 — Ver rutas generadas

**Como** operador logístico,  
**quiero** ver las rutas generadas por vehículo,  
**para que** pueda revisar el plan antes de despacharlo.

**Prioridad:** Must have  
**Módulo:** Routes  
**Dependencias:** US-018

**Criterios de aceptación:**

- **Given** un plan en estado `READY`,  
  **when** el operador abre el detalle,  
  **then** ve las rutas por vehículo.

- **Given** una ruta,  
  **when** se consulta,  
  **then** muestra secuencia de paradas, distancia y duración.

- **Given** un pedido no asignado,  
  **when** se consulta el plan,  
  **then** aparece claramente identificado.

### US-021 — Ver KPIs del plan

**Como** gerente de operaciones,  
**quiero** ver métricas del plan,  
**para que** pueda evaluar la eficiencia de la optimización.

**Prioridad:** Must have  
**Módulo:** Dashboard  
**Dependencias:** US-018

**Criterios de aceptación:**

- **Given** un plan finalizado,  
  **when** se consulta,  
  **then** muestra distancia total, duración total, pedidos asignados y no asignados.

- **Given** un plan con múltiples rutas,  
  **when** se consulta,  
  **then** muestra métricas por ruta y globales.

- **Given** un plan sin resultados,  
  **when** se consulta,  
  **then** muestra un estado vacío claro.

## 9. Reoptimización

### US-022 — Reoptimizar plan

**Como** operador logístico,  
**quiero** reoptimizar un plan existente,  
**para que** el sistema ajuste las rutas ante cambios operativos.

**Prioridad:** Must have  
**Módulo:** Plans  
**Dependencias:** US-018

**Criterios de aceptación:**

- **Given** un plan existente,  
  **when** el operador solicita reoptimización,  
  **then** se crea una nueva versión del plan.

- **Given** una reoptimización en curso,  
  **when** se consulta,  
  **then** muestra el estado actual.

- **Given** una reoptimización finalizada,  
  **when** se consulta,  
  **then** muestra las nuevas rutas y conserva el historial.

### US-023 — Agregar pedidos a un plan

**Como** operador logístico,  
**quiero** agregar pedidos nuevos a un plan existente,  
**para que** puedan ser incluidos en la próxima optimización.

**Prioridad:** Should have  
**Módulo:** Plans  
**Dependencias:** US-022

**Criterios de aceptación:**

- **Given** pedidos nuevos disponibles,  
  **when** se agregan al plan,  
  **then** quedan marcados para reoptimización.

- **Given** una reoptimización posterior,  
  **when** finaliza,  
  **then** los pedidos nuevos aparecen asignados o con motivo de no asignación.

## 10. Visualización

### US-024 — Ver mapa de rutas

**Como** operador logístico,  
**quiero** ver las rutas en un mapa,  
**para que** pueda entender visualmente la distribución de la flota.

**Prioridad:** Must have  
**Módulo:** Map  
**Dependencias:** US-020

**Criterios de aceptación:**

- **Given** un plan finalizado,  
  **when** se abre el mapa,  
  **then** se muestran rutas por vehículo con colores diferenciados.

- **Given** una parada,  
  **when** se selecciona,  
  **then** se muestra información del pedido.

- **Given** un mapa,  
  **when** el usuario hace zoom o pan,  
  **then** la interacción funciona correctamente.

### US-025 — Ver detalle de parada

**Como** operador logístico,  
**quiero** ver el detalle de una parada,  
**para que** pueda revisar pedido, ETA y estado.

**Prioridad:** Must have  
**Módulo:** Map  
**Dependencias:** US-024

**Criterios de aceptación:**

- **Given** una parada en el mapa,  
  **when** se selecciona,  
  **then** se muestra pedido, ETA, estado y vehículo asignado.

- **Given** una parada sin ETA,  
  **when** se consulta,  
  **then** se muestra un estado claro.

## 11. Tiempo real

### US-026 — Recibir actualizaciones del plan

**Como** operador logístico,  
**quiero** recibir actualizaciones en tiempo real,  
**para que** no tenga que recargar la página para saber el estado.

**Prioridad:** Must have  
**Módulo:** Realtime  
**Dependencias:** US-018

**Criterios de aceptación:**

- **Given** un plan en optimización,  
  **when** cambia de estado,  
  **then** la interfaz se actualiza automáticamente.

- **Given** una pérdida de conexión,  
  **when** se restablece,  
  **then** la interfaz sincroniza el estado actual.

## 12. Landing

### US-027 — Ver landing pública

**Como** visitante,  
**quiero** entender qué hace OptiRuter,  
**para que** pueda decidir si es relevante para mi operación.

**Prioridad:** Must have  
**Módulo:** Landing  
**Dependencias:** Ninguna

**Criterios de aceptación:**

- **Given** un visitante,  
  **when** accede a la landing,  
  **then** ve propuesta de valor, beneficios y CTA.

- **Given** un visitante interesado,  
  **when** hace clic en CTA,  
  **then** puede solicitar demo o registrarse.

### US-028 — Solicitar demo

**Como** visitante,  
**quiero** solicitar una demo,  
**para que** pueda evaluar el producto con mi caso de uso.

**Prioridad:** Should have  
**Módulo:** Landing  
**Dependencias:** US-027

**Criterios de aceptación:**

- **Given** un formulario válido,  
  **when** se envía,  
  **then** se registra la solicitud.

- **Given** un formulario inválido,  
  **when** se envía,  
  **then** se muestran errores por campo.

## 13. Reglas transversales

Todas las historias deben cumplir:

- Aislamiento por organización.
- Validación de entrada.
- Manejo de errores consistente.
- Tests automatizados.
- Documentación de API.
- Responsive design.
- Accesibilidad básica.
- Seguridad por defecto.

Las historias deben poder verificarse mediante criterios observables; si no son testeables, no están listas para desarrollo. [134][139][143]

## 14. Orden sugerido de implementación

1. US-001  
2. US-002  
3. US-003  
4. US-004  
5. US-007  
6. US-008  
7. US-009  
8. US-011  
9. US-012  
10. US-013  
11. US-014  
12. US-015  
13. US-016  
14. US-017  
15. US-018  
16. US-019  
17. US-020  
18. US-021  
19. US-022  
20. US-024  
21. US-025  
22. US-026  
23. US-027  
24. US-028