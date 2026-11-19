# Product Brief — OptiRuter

## 1. Resumen ejecutivo

**OptiRuter** es un SaaS B2B de optimización de rutas para flotas de última milla.

Ayuda a empresas de delivery, distribución y servicios técnicos a convertir pedidos dispersos en rutas operativas, asignadas a vehículos y conductores, considerando capacidad, ventanas horarias, prioridades y restricciones de la operación.

El producto busca reducir el trabajo manual de planificación, disminuir kilómetros recorridos y mejorar la cantidad de entregas completadas a tiempo.

**Propuesta central:**

> Menos kilómetros. Más entregas a tiempo.

## 2. Problema

Las empresas que operan flotas con múltiples entregas por día suelen planificar rutas de forma manual, usando planillas, mapas, grupos de WhatsApp o sistemas poco integrados.

Esto genera problemas operativos concretos:

- Los operadores pierden tiempo asignando pedidos a vehículos.
- Las rutas no siempre respetan capacidad, prioridad o ventanas horarias.
- Los conductores reciben recorridos poco eficientes.
- Aparecen cambios de última hora que obligan a replanificar manualmente.
- La empresa no tiene visibilidad clara sobre distancia, tiempo, cumplimiento y pedidos pendientes.
- Aumentar la cantidad de pedidos o vehículos hace que la planificación manual sea cada vez más difícil.

El problema no es solo “hacer rutas”: es tomar decisiones operativas con muchas variables al mismo tiempo.

## 3. Usuario objetivo

### Cliente ideal

Empresas pequeñas y medianas que realizan entregas o visitas con flota propia:

- Empresas de delivery urbano.
- Distribuidoras mayoristas.
- Empresas de servicios técnicos o mantenimiento.
- Operadores de transporte de personal.
- Negocios de e-commerce con última milla propia.

### Personas usuarias

#### Gerente de operaciones

- Responsable de la eficiencia de la flota.
- Quiere reducir costos operativos.
- Necesita visibilidad sobre cumplimiento, capacidad y desempeño.
- Valora métricas claras y reportes accionables.

#### Operador logístico

- Planifica y despacha las rutas del día.
- Trabaja con pedidos, vehículos, conductores y restricciones.
- Necesita crear, ajustar y reoptimizar rutas rápidamente.
- Quiere reducir errores manuales y tiempo de planificación.

#### Conductor

- Ejecuta la ruta asignada.
- Necesita conocer la próxima parada, dirección, notas y estado del pedido.
- Valora una interfaz simple, clara y usable desde el celular.

## 4. Propuesta de valor

Ruta permite a un operador cargar pedidos y definir su flota, y luego generar rutas optimizadas en segundos.

El sistema considera:

- Ubicación de cada pedido.
- Capacidad de peso y volumen del vehículo.
- Ventanas horarias de entrega.
- Prioridad del pedido.
- Turnos y disponibilidad de conductores.
- Punto de inicio y fin de cada vehículo.
- Restricciones operativas definidas por la empresa.

La propuesta de valor es entregar un plan accionable, no solo una visualización de mapa.

## 5. Solución propuesta

Ruta será una plataforma web donde el equipo de operaciones podrá:

1. Crear una organización.
2. Cargar vehículos, conductores y pedidos.
3. Importar pedidos mediante CSV.
4. Definir restricciones operativas.
5. Generar un plan de rutas optimizado.
6. Visualizar las rutas en un mapa.
7. Consultar métricas de eficiencia.
8. Reoptimizar rutas cuando cambien condiciones.
9. Seguir el estado de cada pedido y entrega.

En el MVP, el producto se enfocará en la planificación y optimización de rutas, dejando para fases posteriores funcionalidades más complejas como tracking GPS en tiempo real, integraciones ERP o facturación.

## 6. Diferenciación

Ruta no pretende competir inicialmente con plataformas enterprise complejas.

Su diferencial propuesto es:

- **Simplicidad operativa:** planificar rutas sin configuraciones excesivas.
- **Optimización real:** usar un motor de optimización basado en restricciones, no solo ordenar puntos en un mapa.
- **Transparencia de resultados:** mostrar kilómetros, tiempo, capacidad utilizada y pedidos no asignados.
- **Multi-tenancy desde el inicio:** cada organización opera con sus propios datos.
- **Arquitectura profesional:** backend NestJS, Prisma, PostgreSQL, Redis, BullMQ y un servicio de optimización separado.


## 7. Alcance del producto

### Incluido en la visión de producto

- Gestión de organizaciones y usuarios.
- Gestión de vehículos y conductores.
- Gestión de pedidos.
- Importación de pedidos por CSV.
- Creación de planes de rutas.
- Optimización de rutas con restricciones.
- Visualización de rutas en mapa.
- KPIs operativos.
- Reoptimización de rutas.
- Estados de pedidos, rutas y entregas.
- Notificaciones y actualizaciones en tiempo real.
- Panel de administración para la organización.

### Fuera de alcance inicial

- Tracking GPS en tiempo real.
- Integraciones con ERP, WMS o TMS.
- Facturación y pagos.
- App móvil nativa.
- Optimización con tráfico en vivo.
- Predicción de demanda.
- Multi-idioma.
- Marketplace de integraciones.
- Reportes avanzados personalizables.

## 8. Objetivos de producto

### Objetivo 1

Reducir el tiempo necesario para planificar una jornada operativa.

**Métrica:**
- Tiempo desde carga de pedidos hasta rutas listas.

**Meta inicial:**
- Generar un plan para 20 vehículos y 200 pedidos en menos de 30 segundos.

### Objetivo 2

Mejorar la eficiencia de las rutas generadas.

**Métricas:**
- Kilómetros totales recorridos.
- Tiempo total estimado.
- Cantidad de pedidos asignados.
- Porcentaje de pedidos no asignados.

**Meta inicial:**
- Reducir al menos 15% la distancia total respecto de una secuencia manual de referencia.

### Objetivo 3

Mejorar el cumplimiento de entregas.

**Métrica:**
- Porcentaje de pedidos entregados dentro de la ventana horaria.

**Meta inicial:**
- 95% o más de entregas dentro de la ventana horaria en escenarios de prueba.

## 9. Métricas de éxito

### Métricas de producto

| Métrica | Definición | Meta inicial |
|---|---|---|
| Tiempo de planificación | Tiempo entre creación del plan y resultado disponible | Menos de 30 segundos |
| Tasa de asignación | Pedidos asignados / pedidos totales | 98% o más |
| Reducción de distancia | Comparación contra ruta manual de referencia | 15% o más |
| Cumplimiento de ventanas | Pedidos dentro de ventana horaria / pedidos con ventana | 95% o más |
| Adopción semanal | Usuarios activos semanales | Medir y mejorar iterativamente |
| Tiempo de onboarding | Tiempo hasta crear el primer plan | Menos de 10 minutos |


### Métricas de negocio futuras

- MRR.
- Churn.
- CAC.
- LTV.
- Conversión de trial a pago.
- Retención de cuentas activas.


## 10. Riesgos y supuestos

### Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| El optimizador tarda demasiado | Mala experiencia de usuario | Ejecutar optimización de forma asíncrona con colas |
| Datos de entrada incompletos | Rutas inválidas o pedidos no asignados | Validación estricta y mensajes claros |
| Restricciones demasiado complejas | Complejidad técnica y mantenimiento | Empezar con reglas básicas y extender progresivamente |
| Falta de diferenciación frente a competidores | Baja adopción | Enfocarse en simplicidad y claridad operativa |
| Problemas de multi-tenancy | Fuga de datos entre organizaciones | Filtrado obligatorio por `organizationId` |
| Alta dependencia de IA para desarrollo | Código poco comprendido | Revisión, tests, documentación y aprendizaje activo |

### Supuestos

- El usuario inicial tiene acceso a datos básicos de pedidos y vehículos.
- Las direcciones pueden geocodificarse o ingresarse con coordenadas.
- La operación inicial no requiere tracking GPS en tiempo real.
- El MVP puede resolverse con optimización por lotes, sin tráfico en vivo.
- Las empresas valoran reducir tiempo de planificación y costo operativo.

## 11. Visión de producto

**Visión a 12 meses:**

> Ruta será la forma más simple para que una empresa con flota propia planifique, optimice y ejecute sus rutas de última milla sin depender de planillas manuales.

**Visión a largo plazo:**

> Ruta será una plataforma operativa para logística de última milla, conectando planificación, despacho, ejecución de conductores, visibilidad de entregas y análisis de performance.

## 12. Principios de producto

- **Claridad antes que complejidad.**
- **Resultados medibles antes que funcionalidades decorativas.**
- **El operador debe entender qué cambió y por qué.**
- **Cada pantalla debe tener una acción principal clara.**
- **La optimización debe ser transparente, no una caja negra.**
- **Los datos de cada organización deben permanecer aislados.**
- **El producto debe funcionar primero, escalar después.**

## 13. Criterios de éxito del MVP

El MVP se considera exitoso si:

- Un usuario puede registrarse y crear una organización.
- Puede cargar vehículos, conductores y pedidos.
- Puede importar pedidos por CSV.
- Puede generar un plan de rutas optimizado.
- Puede ver las rutas en un mapa.
- Puede consultar métricas del plan.
- Puede ver el estado de optimización en tiempo real.
- Puede reoptimizar un plan.
- El sistema mantiene aislamiento entre organizaciones.
- La experiencia es comprensible sin necesidad de capacitación extensa.