# Nexo SecondBrain — requisitos y entregables

Actualizado: 2026-11-13. Contexto y pantallas: [nexo-secondbrain.md](./nexo-secondbrain.md).

## 0. Estado y forma de trabajar

**Estado actual:** D0 completada. D1 implementada y verificada localmente; **pendiente configuración y aceptación contra Supabase remoto**. La siguiente acción es terminar D1 con la guía [docs/supabase.md](./docs/supabase.md), no comenzar D2. No se han configurado credenciales ni aplicado migraciones remotas desde esta sesión.

| Entrega | Resultado | Estado | Dependencias |
| --- | --- | --- | --- |
| D0 | Base técnica y navegación | Completada | Inspección del proyecto |
| D1 | Auth, espacio personal y aislamiento | En curso | D0, Supabase remoto |
| D2 | Objetivos, tareas y captura inicial | Pendiente | D1 |
| D3 | Hoy, Semana, bloques y sesiones | Pendiente | D2 |
| D4 | Cuentas, movimientos, presupuesto y ahorro | Pendiente | D1–D3 |
| D5 | Tarjetas, préstamos y compromisos | Pendiente | D4 |
| D6 | Rutas, recursos y contexto inteligente | Pendiente | D3 |
| D7 | Compras esenciales y reposición | Pendiente | D4–D5 |
| D8 | Aprendizaje activo y repasos | Pendiente | D3, D6 |
| D9 | Beta, operación y suscripciones | Pendiente | Alcance que se decida publicar |

- Orden recomendado: D0 → D1 → D2 → D3 → D4 → D5 → D6 → D7 → D8 → D9.
- D0–D3 forman la primera versión utilizable de productividad. D4–D5 completan el control financiero inicial.
- D6 es independiente de finanzas y puede adelantarse si se acuerda cambiar prioridad. La beta puede abrirse antes de todas las funciones avanzadas.
- Leer solo la entrega activa, sus requisitos y las secciones relevantes del contexto; no es necesario recargar ambos documentos completos en cada sesión.
- Estados permitidos: Pendiente / En curso / Bloqueada / Completada. Marcar completada solo tras verificar sus criterios de aceptación.
- Los requisitos describen el producto objetivo; cada entrega introduce el subconjunto indicado. No construir todas las tablas ni servicios en D0.

## 1. Requisitos funcionales

### F01 — Identidad y espacio personal
- Registro, inicio/cierre de sesión y sesión persistente mediante Supabase Auth.
- Espacio personal y membresía creados automáticamente; reintentar el alta no los duplica.
- Preferencias iniciales de idioma/formato, moneda y zona horaria configurable.
- Mismo producto y aislamiento para fundador y futuros usuarios. Colaboración/roles avanzados pospuestos.

### F02 — Objetivos, hitos y tareas
- Objetivo con resultado, fecha y primera acción; hitos opcionales al comenzar y tareas independientes permitidas.
- Tarea vinculable directamente a objetivo, hito, materia o contexto pertinente, sin duplicación ni anidación ilimitada.
- Criterio de finalización, esfuerzo y dificultad opcionales o sugeridos/corregibles.
- Distinguir vencimiento real, meta personal de terminación y horario de trabajo.
- Completar, corregir, dividir o reprogramar; reducir una sesión conserva el trabajo pendiente.

### F03 — Universidad
- Semestre con inicio/fin; materias y pendientes generales que no requieren materia.
- Materia con tareas, proyectos, evaluaciones y materiales. Listas y calendario reflejan los mismos registros.
- Proyecto con hitos/acciones; examen con fecha, temas y preparación vinculada.
- Conservar semestres anteriores; mostrar próximos compromisos y cercanía del fin del semestre.

### F04 — Estudio y rutas
- Meta por resultado esperado, plazo, punto de partida, disponibilidad y curso/temario cuando exista.
- Ruta de hitos verificables con tareas próximas; permitir empezar sin descomposición completa.
- Reutilizar la disponibilidad compartida y mostrar conflictos de carga.
- Separar avance del curso, tiempo trabajado y evidencia de aprendizaje.

### F05 — Captura universal
- Botón global y atajo; heredar contexto y mostrar valores habituales usados.
- Interpretación → propuesta estructurada editable → validación → guardado. Formularios y captura comparten operaciones.
- Confirmación rápida financiera; pedir únicamente datos imprescindibles que falten.
- Mostrar fechas relativas como fechas concretas; resolver ambigüedades y conservar la interpretación mostrada si la confirmación se demora.
- Conservar capturas incompletas; no guardarlas como movimientos financieros inválidos. Evitar duplicados por reintentos.
- Tipos progresivos: tareas en D2, gastos en D4, evaluaciones/recursos/metas en D6 y precios en D7.
- «Shampoo a $85 en tienda X» registra precio; no demuestra compra. «Gasté 120 en comida» propone gasto.

### F06 — Time blocking y planeación
- Disponibilidad única entre Universidad y Estudio, compromisos fijos/recurrentes y bloques de trabajo movibles/protegidos.
- Preparar semana con prioridades explicables: fechas, dependencias, relevancia, esfuerzo, preferencias y disponibilidad.
- Planificación hacia atrás desde entregas/exámenes, con fechas intermedias sugeridas y vencimiento oficial conservado.
- Propuesta diferente del plan confirmado; aceptar cambios en conjunto y mantener estable el plan vigente.
- Mover, redimensionar o dividir trabajo; alternativas accesibles al arrastre.
- No confirmar silenciosamente solapamientos ni reservar dos veces la misma disponibilidad. Si hay conflictos previos, mostrarlos y permitir resolverlos.
- Si falta duración, pedirla al programar o proponer una estimación visible/corregible. Margen y carga dependen de datos suficientes.
- Si el trabajo no cabe, explicar déficit estimado y opciones: revisar esfuerzo, prioridad, disponibilidad o fechas propias.
- Recuperación de bloques perdidos mediante propuesta confirmada; nunca mover automáticamente un vencimiento real.

### F07 — Hoy, concentración y sesiones
- Mostrar bloque actual previsto/próximo, acción inicial, materiales, resultado esperado y vencimiento relevante.
- Empezar explícitamente; el reloj no inicia sesiones ni completa tareas.
- Tarea = resultado; bloque = tiempo reservado; sesión = ejecución real. Una tarea puede necesitar varios bloques/sesiones.
- Pausar/cerrar sesión; cierre Terminé / Avancé / Me bloqueé. Tiempo real opcional y editable.
- Próximos bloques y alertas accionables; si no hay plan, sugerir acción según tiempo disponible.
- Conservar historial al reprogramar. Usar observaciones suficientes para mejorar estimaciones, sin presentarlas como certezas.

### F08 — Recursos y conexiones
- Materias/metas vinculables a enlaces, recursos, notas y sesiones; incorporar archivos cuando existan sus controles de acceso.
- Prioridad de contexto: pantalla actual → referencias explícitas → similitud cuando se justifique.
- Relaciones claras automáticas/reversibles; ambiguas como sugerencias.
- No inventar asociaciones con exámenes ni duplicar recursos/tareas al mostrarlos en distintas vistas.

### F09 — Aprendizaje activo
- Notas simples y material transformable en preguntas, tarjetas, ejercicios y repasos.
- Conservar fuente, permitir revisar/corregir contenido y responder antes de mostrar solución.
- Registrar intentos y dificultades; proponer práctica espaciada compatible con disponibilidad y fechas.
- Repasos en el mismo calendario/Hoy. Leer o terminar un bloque no equivale a dominar un tema.
- Preferir pequeñas tandas útiles; programación/matemáticas requieren aplicación además de tarjetas.

### F10 — Dinero, presupuesto y ahorro
- Cuentas y saldos iniciales, ingresos, gastos, transferencias, categorías sencillas, correcciones y exportación.
- Presupuesto base sobre ingresos fijos esperados; variables previstos separados de efectivamente cobrados.
- Saldo, disponible estimado y crédito disponible diferenciados. Un ingreso esperado no aumenta el dinero real.
- Disponible con horizonte, fórmula y supuestos explícitos; datos faltantes visibles. Reservas/compromisos no se descuentan dos veces.
- Transferencias propias no generan ingreso/gasto nuevo. Metas de ahorro distintas de dinero efectivamente reservado.
- Propuesta opcional de reparto de ingresos variables cobrados entre ahorro/deuda/gastos, confirmada por el usuario.

### F11 — Tarjetas, préstamos y pagos
- Tarjetas: saldo actual, estados de cuenta, corte, vencimiento, mínimo y pago para no generar intereses cuando se conozca.
- Saldo actual no sustituye al estado de cuenta; preservar historial de obligaciones.
- Compra con tarjeta aumenta gasto/deuda. Pago reduce efectivo/deuda sin duplicar gasto; intereses/comisiones son gastos.
- Préstamos: capital pendiente, cuotas, condiciones conocidas, vencimientos y aplicación a capital/intereses.
- Desembolso de préstamo es financiación, no ingreso ganado; devolución de capital no es gasto de consumo.
- Alertas de próximos pagos en Hoy. Completar un recordatorio no registra automáticamente un pago.
- Proyecciones identificadas como estimaciones; no inventar tasas ni reglas bancarias. Meses sin intereses y amortizaciones complejas requieren alcance específico.

### F12 — Compras esenciales
- Producto/presentación, unidad comparable, tienda, precio fechado, duración estimada, inicio de uso y reservas.
- Equivalencias explícitas del usuario. Comparar precio unitario y total, envío/traslado conocidos y desembolso compatible con presupuesto.
- Reposición aproximada corregible; comprar no implica comenzar consumo ese día.
- Lista comparada en una tienda o dividida cuando haya información suficiente; mostrar cobertura/precios desactualizados/costes desconocidos.
- Precios y listas no generan gastos. Compra confirmada registra una vez compra/existencias/movimiento y permite vincular un gasto existente.
- Registro manual inicial y captura de precios; no depender de scraping ni bancos.

### F13 — Suscripción del SaaS
- Suscripción, capacidades y límites por espacio, separados de finanzas personales.
- Acceso fundador con el mismo mecanismo; IDs de precios del proveedor encapsulados.
- Medir consumo de funciones costosas; planes/precios comerciales pendientes de validación.
- Cobros cuando se decida monetizar; webhooks verificados, idempotentes y tolerantes a duplicados/desorden.

## 2. Requisitos transversales

### N01 — Aislamiento y autorización
- Autorizar en servidor cada operación con identidad validada y membresía; no confiar en `workspace_id` enviado por cliente.
- RLS efectivo con rol restringido y contexto transaccional; conexiones reutilizadas no conservan identidad de otra solicitud.
- Impedir referencias cruzadas entre espacios, además de filtrar consultas. Credenciales administrativas separadas.
- Aislar archivos, cachés, exportaciones, búsquedas, trabajos y contexto de IA.
- Probar con dos cuentas desde D1: lectura, creación, modificación, eliminación y referencias cruzadas.

### N02 — Integridad y fiabilidad
- Validación compartida y validación servidor; operaciones compuestas atómicas.
- Idempotencia donde un reintento pueda duplicar efectos: alta, captura, pagos, compras, jobs y webhooks.
- Guardado/error visibles y recuperables; no presentar datos locales no guardados como persistidos.
- Correcciones coherentes entre vistas, saldos e historial. Migraciones reproducibles y verificaciones adecuadas a cada cambio.

### N03 — Tiempo, dinero y localización
- México/MXN inicial, formato `es-MX`; importes exactos en centavos enteros y moneda explícita.
- Definir límites/representación monetaria y redondeo de intereses/prorrateos antes de D4; no usar flotantes binarios para cálculos monetarios.
- Fechas de calendario para vencimientos; instantes para sesiones/eventos con hora; zona IANA configurable.
- Recurrencias conservan horario local y zona, incluyendo cambios de horario donde apliquen. México no tiene una única zona.
- Conversión multidivisa pospuesta.

### N04 — Usabilidad y accesibilidad
- Desktop-first y móvil funcional; teclado, foco visible, etiquetas y estados de formulario accesibles.
- Acción principal evidente, información progresiva y contexto heredado; estados vacíos que orienten a actuar.
- Gasto habitual <10 segundos y objetivo con primera acción <1 minuto son objetivos a medir, no garantías.
- Corregir/deshacer cuando proceda; permitir volver tras una pausa sin resolver antes todos los atrasos.
- Alternativas a arrastrar bloques; materiales y primera acción accesibles desde Hoy.

### N05 — Inteligencia controlada
- IA produce datos estructurados validados, no escritura libre. El dominio conserva la autoridad sobre permisos, dinero y fechas.
- Contexto mínimo autorizado, proveedor encapsulado, costes/uso por espacio, límites y control de concurrencia desde su primera función en producción.
- Fallo de IA no bloquea formularios, finanzas básicas ni planificación manual.
- Generaciones largas/recordatorios persistentes usan trabajos recuperables con reintentos idempotentes.
- Reglas de prioridad explicables y usuario capaz de cambiar el orden. Las fuentes educativas y propuestas se pueden corregir.

### N06 — Mantenimiento y operación
- Monolito modular y un caso de uso compartido entre captura, formularios e integraciones.
- Tipado, migraciones, documentación mínima de entorno y scripts de verificación; secretos fuera del repositorio.
- Observabilidad desde el primer despliegue utilizable, sin notas/contenido financiero en errores o telemetría.
- Preparar respaldo y exportación al persistir datos reales; verificar restauración antes de abrir la beta a terceros.
- Pruebas significativas en aislamiento, dinero, tiempo e idempotencia. Evitar pruebas que solo reproduzcan implementación o snapshots cosméticos.

## 3. Entregas paso por paso

### D0 — Inspección y base técnica
**Requisitos:** N04, N06; arquitectura de `nexo-secondbrain.md`.

1. Comprobar archivos, instrucciones aplicables, estado Git y herramientas disponibles; preservar trabajo previo.
2. Elegir versiones estables compatibles y gestor de paquetes; iniciar Next.js/React/TypeScript sin sobrescribir estos documentos.
3. Añadir Tailwind/componentes accesibles y navegación Hoy/Universidad/Estudio/Finanzas; estructura modular mínima.
4. Documentar variables sin secretos, scripts y configuración de Drizzle/migraciones para D1.
5. Ejecutar comprobaciones estáticas/build pertinentes y documentar cómo iniciar el proyecto.

**Aceptación:** aplicación local ejecutable, navegación y estados base coherentes, comandos reproducibles y configuración pendiente de servicios identificada. D0 no requiere datos de negocio persistentes todavía.

**Resuelto en D0:** npm con lockfile; Next.js 16.4.6/React 19.3.1/TypeScript 5.9.3/Tailwind 4.3.5; App Router en `src/app`, módulos en `src/modules`, UI/configuración compartidas y esquema Drizzle vacío. Node 24 recomendado, Node 26 compatible. Git inicializado en `main`, sin commits/remoto.

**Verificado:** instalación limpia con `npm ci`, formato/lint/tipos/unitarias/build, navegación Chromium desktop/móvil, generación Drizzle sin tablas y rechazo de migración sin credenciales. Supabase local/remoto se decide/configura en D1; destino de despliegue previsto Vercel + Supabase, todavía sin recursos remotos.

### D1 — Autenticación y aislamiento
**Depende de:** D0 y configuración de Supabase. **Requisitos:** F01, N01–N03, N06.

1. Integrar Supabase Auth, sesiones y método inicial de acceso sencillo.
2. Crear perfil/espacio/membresía de forma idempotente y guardar preferencias.
3. Resolver conexión/pooling, rol restringido, contexto transaccional y RLS antes de añadir datos de negocio.
4. Implementar autorizaciones en rutas/operaciones; preparar política de archivos antes de habilitar Storage.
5. Verificar aislamiento con dos usuarios y solicitudes sucesivas que reutilicen conexión.

**Aceptación:** cada usuario accede únicamente a su espacio; reintentar alta no duplica espacios; no hay filtración de identidad ni referencias cruzadas. Verificar operaciones rechazadas y permitidas contra PostgreSQL real, no solo mocks.

**Decidido:** Supabase remoto y enlace por correo (usuario); PKCE con callback, mismo navegador y cookies HTTP-only. Espacio automático al primer acceso verificado, perfil configurable y cierre de sesión local al navegador.

**Implementado/verificado localmente:** esquema privado `nexo`, `nexo_app` separado del migrador, RLS forzado, grants mínimos, FK compuesta y contexto transaccional; bootstrap concurrente/idempotente; preferencias con membresía; renovación SSR preparada en `src/proxy.ts`; páginas dinámicas y respuestas privadas/no-store. Migración `0000_identity.sql`, script de aprovisionamiento sin contraseñas versionadas y guía de instalación.

**Aceptación aún pendiente:** configurar `.env.local` y Auth/redirects, aplicar migración/aprovisionamiento y verificar dos usuarios, enlace real, renovación/cierre de sesión y pooler del proyecto remoto según checklist de `docs/supabase.md`. Las pruebas PostgreSQL locales no sustituyen esta comprobación.

### D2 — Objetivos, tareas y captura inicial
**Depende de:** D1. **Requisitos:** F02, F03/F04 mínimos, F05 para tareas, N01–N04.

1. Modelar objetivos, hitos opcionales y tareas con vencimiento separado del trabajo previsto.
2. Añadir semestre/materia mínimos y metas extracurriculares para ubicar trabajo.
3. Crear listas y panel de tarea, completar/corregir, estados vacíos y persistencia.
4. Implementar captura de tareas por reglas sencillas, contexto heredado, fecha explícita y propuesta editable.
5. Reutilizar casos de uso entre formulario/captura; conservar entrada incompleta y prevenir doble envío.

**Aceptación:** objetivo → primera tarea, o tarea independiente → guardar → recargar → recuperar/completar. Una tarea se refleja consistentemente en sus vistas. No exigir estimaciones, criterio de finalización ni plan completo para guardarla.

**Verificar:** autorización, persistencia, fechas ambiguas y repetición de confirmación. La captura inicial funciona sin proveedor de IA.

### D3 — Hoy, Semana y sesiones
**Depende de:** D2. **Requisitos:** F06, F07, N01–N04, N06.

1. Modelar disponibilidad, compromisos recurrentes, dependencias, bloques protegidos/movibles y sesiones reales.
2. Crear Semana con edición por formulario/teclado y arrastre como comodidad.
3. Implementar propuesta semanal determinista inicial, carga estimada, conflictos y confirmación de cambios.
4. Crear Hoy y concentración con iniciar/pausar/cerrar y resultado de sesión.
5. Recuperar bloques perdidos, conservar historial y mantener vencimientos.

**Aceptación:** programar Universidad/Estudio en una semana compartida, empezar y cerrar una sesión, reprogramar sin alterar vencimiento ni completar la tarea por reloj. Una propuesta imposible muestra el conflicto.

**Verificar:** solapamientos, dependencias, capacidad, zona horaria, recurrencias, bloques protegidos y sesiones parciales. Elegir biblioteca de calendario por accesibilidad/licencia/peso; intervalos/márgenes configurables.

**Hito:** primera versión utilizable de productividad (D0–D3). Probarla con trabajo real y registrar fricción antes de ampliar.

### D4 — Dinero cotidiano y ahorro
**Depende de:** D1–D3. **Requisitos:** F05 para gastos, F10, N01–N04, N06.

1. Definir representación contable, saldos iniciales, límites monetarios, redondeo e invariantes.
2. Definir disponible con horizonte, reservas/compromisos y fórmula explicable, extensible a deudas de D5.
3. Implementar cuentas, ingresos/gastos/transferencias, categorías, correcciones y presupuesto.
4. Añadir metas/reservas de ahorro e ingresos previstos separados de cobrados.
5. Crear Resumen/Movimientos/Ahorro, captura confirmada y exportación.

**Aceptación:** saldo/presupuesto consistente; distinguir real, previsto y reservado; corregir un registro actualiza vistas sin duplicarlo.

**Casos críticos:** saldo inicial 1,000 MXN − gasto 120 = 880; transferir 200 a otra cuenta propia conserva el total de 880 y no añade gasto. Reintentar confirmación crea un solo movimiento. Reservar ahorro no reduce dos veces el disponible.

### D5 — Tarjetas y préstamos
**Depende de:** D4. **Requisitos:** F11, integración F07/F10, N01–N03, N06.

1. Modelar tarjetas, estados de cuenta, corte, vencimiento y pagos requeridos conocidos.
2. Modelar préstamos, cuotas y aplicación de pagos a capital/intereses cuando se conozcan.
3. Conectar compras, pagos, intereses y comisiones con movimientos sin duplicación.
4. Incorporar compromisos al disponible y alertas de Hoy; conservar historial y mostrar supuestos de proyecciones.

**Aceptación:** compra con tarjeta → obligación → pago, con gasto una sola vez; préstamo separa capital de coste financiero.

**Casos críticos:** compra de 120 seguida de pago de 120 deja gasto de 120, no 240. Pago de préstamo de 600 con 500 de capital y 100 de interés reduce efectivo 600, capital pendiente 500 y registra gasto de interés 100. Verificar pagos parciales y datos contractuales incompletos.

**Hito:** control financiero inicial usable. Definir alcance de condiciones complejas antes de incorporarlas.

### D6 — Rutas, materiales y conexiones inteligentes
**Depende de:** D3. **Requisitos:** F03/F04 completos, F05 ampliado, F08, N01–N06.

1. Completar vistas de semestre/materia, proyectos, exámenes y materiales enlazados.
2. Diseñar rutas por resultado, plazo, punto de partida y temario, reutilizando disponibilidad.
3. Sugerir hitos y tareas próximas; incluir preparación de exámenes.
4. Añadir relaciones por contexto/referencia y captura de evaluaciones, recursos y metas.
5. Integrar IA estructurada donde aporte valor; seleccionar proveedor/modelo, límites y presupuesto. Incorporar jobs si la duración lo requiere.

**Aceptación:** curso/examen → ruta editable → primera acción programada. La carga compartida no excede disponibilidad sin conflicto visible. Relaciones ambiguas se proponen y pueden corregirse.

**Verificar:** contexto autorizado, proveedor caído, salida inválida, límites/reintentos y conservación del plan confirmado. No introducir búsqueda vectorial por anticipación.

### D7 — Compras esenciales
**Depende de:** D4–D5. **Requisitos:** F12, F05 para precios, N01–N04, N06.

1. Implementar productos/presentaciones, tiendas, precios fechados y unidades comparables.
2. Registrar reservas/inicio de uso y reposición aproximada corregible.
3. Crear lista y comparación de coste total/unitario con cobertura, costes adicionales conocidos y liquidez.
4. Confirmar compra con cuenta, cantidad/precio y reserva/uso; vincular gasto/existencias de forma atómica e idempotente.

**Aceptación:** registrar precio → anticipar reposición → comparar → comprar. Una cotización no genera gasto; confirmar dos veces no duplica compra; vincular gasto existente tampoco lo duplica.

**Verificar:** unidades, equivalencias, antigüedad/cobertura de precios, stock y diferencias entre fecha de compra e inicio de uso. Reposición manual estimada antes de inferencias avanzadas.

### D8 — Aprendizaje activo
**Depende de:** D3 y D6. **Requisitos:** F09, F07/F08, N01–N06.

1. Añadir notas simples y preguntas/tarjetas/ejercicios con referencia a su fuente.
2. Permitir revisión/corrección de contenido y respuesta antes de solución.
3. Registrar intentos/dificultades y elegir una estrategia de repasos espaciados.
4. Programar repasos compatibles con disponibilidad/vencimientos y mostrarlos en Hoy.

**Aceptación:** material → pregunta/práctica → respuesta/corrección → próximo repaso. Progreso de contenido y aprendizaje diferenciado; usuario puede ajustar contenido y plan.

**Verificar:** fuentes, persistencia de intentos, fechas de repasos, límites/reintentos y carga del calendario. El algoritmo de repasos debe documentar sus supuestos.

### D9 — Beta, operación y suscripciones
**Depende de:** alcance que se publique, con D1 y requisitos transversales verificados. **Requisitos:** F13, N01–N06 y flujos habilitados.

1. Validar onboarding y recorridos con usuarios adicionales; exportación y ciclo de vida de cuenta según alcance.
2. Verificar despliegue/migraciones, respaldo/restauración, errores y rendimiento. La observabilidad de despliegues previos ya debe existir.
3. Revisar capacidades/límites, costes operativos y acceso fundador mediante el mismo mecanismo.
4. Definir oferta/precios; integrar Stripe Billing cuando se decida cobrar.
5. Probar webhooks verificados, idempotentes y tolerantes al desorden.

**Aceptación:** usuarios independientes completan recorridos habilitados con aislamiento; operación recuperable y costes observables. Si se habilitan cobros, capacidades/suscripción convergen correctamente ante eventos duplicados/desordenados.

La beta puede ser gratuita. Si cobros quedan pendientes, registrar D9 como parcial y separar claramente el hito beta del hito monetización.

## 4. Cierre y verificación de cada entrega

- Recorrido funcional con persistencia cuando la entrega la introduce; estados vacíos/carga/error y autorización correspondiente.
- Migraciones reproducibles y configuración documentada; ningún secreto en código, documentación o ejemplos.
- Ejecutar checks apropiados al cambio: tipado, lint/build cuando correspondan, integración y E2E de los riesgos reales.
- Distinguir pruebas ejecutadas de escenarios propuestos; no marcar aceptación sin evidencia.
- Medir fricción con uso real: pasos para iniciar, tiempo de captura, reprogramación y claridad del siguiente resultado. Las horas registradas no bastan como medida de productividad.
- Registrar rutas relevantes, migraciones, verificaciones, bloqueos y próxima acción; actualizar tabla inicial y decisiones afectadas.

## 5. Decisiones abiertas por etapa

| Etapa | Resolver antes de implementar esa parte |
| --- | --- |
| D0 | Resuelto: versiones, npm, estructura y Git local. Ejecución sin servicios; destino previsto Vercel + Supabase |
| D1 | Elegidos enlace por correo y Supabase remoto; implementar configuración privada y verificar Auth/pooler remotos. Roles/RLS/migración ya implementados |
| D3 | Biblioteca de calendario, asignación inicial, duración/márgenes y recurrencias |
| D4–D5 | Esquema contable, fórmula de disponible, redondeos y alcance contractual de deudas |
| D6 | Proveedor/modelo de IA, presupuesto/límites, jobs y tipos de captura asistidos |
| D7 | Unidades/equivalencias, consumo estimado y cobertura de precios |
| D8 | Estrategia de repasos y criterios de evidencia de aprendizaje |
| D9 | Oferta/precios, ciclo de vida de cuentas y operación de suscripciones |

Ya resuelto: México/MXN, uso principal en ordenador, ingresos mixtos, tarjetas/préstamos, áreas, intención SaaS y time blocking. No repetir esas preguntas ni reabrir el stack sin una razón técnica concreta.

Pospuesto: inversiones, bancos, OCR, scraping, editor complejo, offline, colaboración, calendarios externos, grafos y búsqueda vectorial.

## 6. Registro de continuidad

### 2026-11-13 — Documentación inicial del proyecto
- Directorio inspeccionado: vacío antes de crear estos archivos; no se encontraron instrucciones `AGENTS.md` en el proyecto ni en sus ancestros.
- Incorporados contexto y requisitos/entregas en la raíz del proyecto; sustituyen la planificación externa como referencia de trabajo.
- Implementación y servicios todavía pendientes. Ninguna entrega técnica se marca completada por documentarla.
- Próxima acción: D0, revisando primero el estado real y preservando esta documentación.

### 2026-11-13 — D0 completada
- Inicializados Next.js App Router, TypeScript, Tailwind, componentes UI locales y estructura modular mínima. Rutas reales: `/`, `/semana`, `/universidad`, `/estudio`, `/finanzas` y 404 útil.
- Navegación adaptable con lateral contraíble, nombres accesibles, enlace para saltar al contenido y estados vacíos explícitos. Captura aún deshabilitada (D2); calendario funcional pendiente (D3).
- Configuración en `package.json`, `next.config.ts`, `components.json`, `vitest.config.ts`, `playwright.config.ts`, `drizzle.config.ts` y `drizzle.migrate.config.ts`; secretos excluidos y variables documentadas en `.env.example`.
- Generador de migraciones sin credenciales; URL de migración separada/validada, sin cliente DB ni tablas de dominio. Journal Drizzle vacío versionable en `drizzle/meta/_journal.json`.
- Git local en `main`, sin commits ni remoto. Instalación limpia reproducida con `npm ci`; entorno verificado Node 26.3.0/npm 11.16.0.
- Verificaciones: `npm run check` correcto (formato, lint, tipos, 19 pruebas unitarias y build); navegador Chromium desktop/móvil con 17 pruebas aprobadas y 1 exclusión intencional del lateral en móvil. Revisión visual de Hoy en ambos tamaños.
- `npm run db:generate` sin cambios; `db:migrate` rechaza URL vacía antes de conectar. `npm audit`: 0 vulnerabilidades con dos overrides transitivos acotados/documentados. Avisos upstream de herramientas obsoletas y compatibilidad de ESLint explicados en README.
- Configuración y comandos en `README.md`. No se han conectado servicios externos ni implementado autenticación, datos persistentes de usuario o funcionalidades de entregas posteriores.
- Próxima acción: D1. Resolver método de acceso y entorno Supabase, y verificar rol restringido/contexto transaccional/RLS con dos usuarios antes de añadir datos de negocio.

### 2026-11-13 — D1 implementada localmente; cierre remoto pendiente
- El usuario eligió Supabase remoto y acceso por enlace. No había variables privadas ni Docker; se utilizó PostgreSQL 18.3 local en clusters temporales aislados, sin tocar bases existentes.
- Código: `src/server/supabase/` (SSR/identidad), `src/proxy.ts` (renovación/protección/cache), `src/modules/identity/` (reglas/casos de uso/formularios), rutas `/acceso`, `/auth/callback` y `/cuenta`, layouts privados dinámicos y estados de error recuperables.
- Datos: `src/server/db/schema/index.ts`, `user-database.ts`, migración `drizzle/0000_identity.sql` y snapshot. Perfil/espacio/membresía, RLS forzado, rol de runtime no propietario, prohibición de acceso público y referencias cruzadas. Bootstrap usa lectura rápida del espacio existente y upserts solo cuando faltan registros.
- Herramientas: `db:provision` configura contraseña desde entorno privado sin imprimirla; `test:db` migra/aprovisiona un PostgreSQL desechable y prueba dos identidades, permisos, concurrencia, FK, reutilización/rollback y rechazo de privilegios elevados.
- Verificado al cierre local: `npm run check` (formato, lint, tipos, 69 unitarias y build), `npm run test:db` (12 pruebas PostgreSQL real), `npm run test:e2e` y repetición de Playwright sobre el último build (18 E2E aprobados de rutas sin sesión/callbacks inválidos, desktop y móvil). `npm run db:generate` sin diferencias y `npm audit` con 0 vulnerabilidades. Conexiones remotas de aplicación/migración exigen TLS `sslmode=verify-full`, cubierto por pruebas.
- Límites de evidencia: las identidades de la suite PostgreSQL son fixtures que representan usuarios ya verificados; los E2E usan proveedor sin configurar. No se ha probado correo, intercambio exitoso con Supabase, renovación/cierre real ni pooler remoto. No existe bypass de autenticación en la aplicación.
- Configuración y checklist: `docs/supabase.md`, `.env.example`, `README.md`, `drizzle/README.md`. No compartir claves por el chat ni marcar D1 completada antes de la validación remota.
- Próxima acción: el usuario configura el proyecto y `.env.local`; después aplicar `db:migrate`, ejecutar `db:provision` y verificar los recorridos reales antes de cerrar D1.

Al continuar, añadir un registro breve con entrega, resultado, archivos relevantes, comprobaciones realizadas, bloqueos y siguiente paso. Mantener el estado vigente en la sección 0.
