# Nexo SecondBrain — contexto del proyecto

Actualizado: 2026-11-13.

## 0. Lectura rápida para retomar

**Nexo es un SaaS personal para convertir objetivos y compromisos en próximas acciones, reservar tiempo para ejecutarlas y tomar mejores decisiones financieras.** El fundador será su primer usuario.

- Áreas: Universidad, Estudio extracurricular y Finanzas.
- Interfaz en español, principalmente para ordenador; México, MXN y formato `es-MX`.
- Fricción principal: perfeccionismo antes de empezar y dificultad para mantener constancia. Ayudan las fechas visibles, las tareas atómicas y una ruta clara.
- Organización: Universidad por semestres/materias; Estudio por metas/hitos/tareas.
- **Time blocking es una decisión explícita del usuario.** Universidad y Estudio comparten disponibilidad y calendario.
- Navegación: Hoy / Universidad / Estudio / Finanzas. Dentro de Hoy: Hoy | Semana.
- Diferenciadores: captura universal, conexiones contextuales, planeación explicable y aprendizaje activo.
- Finanzas: ingresos fijos y variables, gastos, ahorro, tarjetas, préstamos y compras esenciales con comparación de precios/reposición.
- Base técnica propuesta: monolito modular; Next.js/React/TypeScript, Supabase/PostgreSQL, Drizzle, Zod, Tailwind y componentes seleccionados de shadcn/ui.
- Arquitectura SaaS desde el principio: espacio personal automático, autorización y aislamiento por espacio. La IA propone; las reglas validan; el usuario controla los cambios relevantes.
- Primera versión de productividad: D0–D3. El resto se incorpora por entregas utilizables.

### Estado y documentos de referencia

**D0 completada. D1 en curso:** código de autenticación, espacio personal, preferencias y aislamiento implementado y probado localmente. Falta configurar Supabase remoto y verificar correo, sesiones y pooler reales para cerrar D1. Ver [docs/supabase.md](./docs/supabase.md); **no avanzar a D2 como si D1 ya estuviera aceptada**.

El repositorio Git local está inicializado en `main`, sin commits ni remoto. Hay adaptadores SSR de Supabase, un cliente PostgreSQL restringido y migraciones de identidad; no se han configurado credenciales ni aplicado migraciones al proyecto remoto desde esta sesión. Sin configuración las rutas privadas redirigen al acceso, sin bypass ni datos simulados. Volver a comprobar el estado real al continuar.

- Este archivo conserva **visión, pantallas, arquitectura y decisiones de producto**.
- [entregables-y-requisitos.md](./entregables-y-requisitos.md) conserva **requisitos verificables, entregas, dependencias, estado y decisiones pendientes**. Su tabla de estado es la referencia para elegir el siguiente trabajo.
- Estos dos archivos son la referencia vigente del proyecto y sustituyen el documento externo de planificación para continuar sesiones. No se necesita el historial de conversación.
- El stack es la base elegida para comenzar, no una lista de servicios ya configurados. Versiones, credenciales y detalles abiertos se resuelven en su entrega.
- D0 usa npm con lockfile, Next.js 16.4.6, React 19.3.1, TypeScript 5.9.3 y Tailwind 4.3.5. Node 24 recomendado; verificación realizada con Node 26.3.0/npm 11.16.0. Detalles y excepciones de herramientas en README.
- Decisiones D1 del usuario: **Supabase remoto y enlace por correo**. Implementación PKCE en el mismo navegador, cookies HTTP-only, acceso `/acceso`, callback `/auth/callback` y preferencias/cierre de sesión en `/cuenta`.
- Aislamiento D1: esquema privado `nexo`, rol `nexo_app` separado del migrador, RLS forzado, identidad local a cada transacción y FK compuesta para membresías personales. PostgreSQL real temporal verificado; Auth/pooler remotos aún pendientes.

**Prompt para próximas sesiones:**

> Lee la sección 0 de `nexo-secondbrain.md` y el estado de `entregables-y-requisitos.md`. Revisa el proyecto y continúa con la entrega pendiente, consultando sus requisitos y respetando el modo activo de la sesión.

## 1. Visión y perfil del primer usuario

### Problema que resolver

El producto debe reducir el esfuerzo de decidir qué hacer, cuándo hacerlo y cómo avanzar. Su ventaja frente al uso personal de Notion debe estar en la captura rápida, la información conectada por contexto y una planificación ejecutable.

El usuario quiere:
- Organizar un semestre con fechas, materias, tareas, proyectos, exámenes y pendientes generales.
- Definir una meta de aprendizaje, un plazo y una ruta viable para terminar un curso o alcanzar una capacidad concreta.
- Sentir la cercanía de los vencimientos junto con una guía para responder a ellos.
- Controlar gastos, ahorrar, gestionar tarjetas/préstamos y evitar endeudamiento innecesario.
- Registrar productos indispensables, sus precios por tienda y cuándo conviene reponerlos.
- Construir un producto mantenible y extensible que pueda convertirse en SaaS; orientación B2C inicial propuesta.

### Principios de experiencia

1. Una acción principal evidente por pantalla; formularios cortos y contexto heredado.
2. Un objetivo puede empezar con resultado, fecha y una primera acción; desarrollar el resto progresivamente.
3. Tareas independientes permitidas; vincularlas después. Hitos opcionales al comenzar.
4. Acciones observables: «resolver y corregir cuatro ejercicios» en lugar de «estudiar matemáticas».
5. Edición directa, teclado, estados de guardado claros y corrección/deshacer cuando proceda.
6. Facilitar retomar después de una pausa; sin rachas punitivas ni limpieza obligatoria de pendientes.
7. Tiempo, progreso de contenido y aprendizaje demostrado son indicadores diferentes.
8. Tipografía clara, espacio en blanco y colores neutros; color para estados/contexto.
9. Móvil funcional para captura y compras; diseño y flujo principal optimizados para ordenador.

## 2. Pantallas acordadas como base de diseño

### Navegación y elementos compartidos
- Lateral plegable: Hoy, Universidad, Estudio, Finanzas; captura y cuenta al pie.
- Hoy contiene las vistas Hoy/Semana; un calendario compartido.
- Captura con botón visible y `⌘/Ctrl + K`; mantener el botón disponible ante conflictos del navegador.
- Panel lateral para tareas y detalles pequeños, conservando la posición de la pantalla de origen.
- Espacio personal creado automáticamente; el usuario inicial no configura organizaciones, equipos ni roles.

### Hoy — ejecutar
- Tarjeta principal del bloque previsto actual o próximo: horario, acción, primer paso, materiales, resultado esperado y vencimiento relevante.
- Acción principal **Empezar**; abre una vista de concentración con pausa/cierre y temporizador opcional.
- El horario no inicia una sesión automáticamente.
- Lista compacta y expandible de bloques siguientes.
- Alertas relevantes con acción directa: pago próximo, entrega sin tiempo reservado, conflicto de carga.
- Si no hay bloques, proponer una acción y permitir indicar tiempo disponible.
- Cierre rápido: **Terminé la tarea / Avancé / Me bloqueé**. La sesión puede terminar con la tarea pendiente.

### Semana — planificar
- Calendario semanal con compromisos recurrentes, disponibilidad y bandeja plegable de pendientes sin programar.
- Acción principal **Preparar semana** o ajustar una propuesta existente.
- Propuestas visualmente distintas de bloques confirmados; revisar diferencias y aceptar el conjunto.
- Mover, redimensionar o dividir trabajo; fijar horarios protegidos. Ofrecer alternativa de formulario/teclado al arrastre.
- Mostrar carga y margen estimados cuando existan datos suficientes; señalar conflictos o información faltante.
- Mantener estable el plan confirmado. La replanificación respeta compromisos, bloques protegidos, dependencias y disponibilidad.

### Universidad — semestre y materias
- Semestre con inicio/fin, tiempo restante, próximas entregas/exámenes y materias con su próximo compromiso.
- Pendientes generales del semestre y acceso a semestres anteriores.
- Acción **Añadir pendiente**, heredando semestre/materia.
- Materia: pestañas **Trabajo** y **Materiales**. Trabajo reúne tareas, proyectos y evaluaciones.
- Proyecto: resultado, fecha, hitos y siguiente acción. Examen: fecha, temas y preparación vinculada.
- Materiales inicialmente como enlaces; después notas/archivos.
- Profesor, créditos y personalización opcionales. El to-do es una vista de las mismas tareas, no una lista duplicada.

### Estudio — metas y rutas
- Lista de metas activas: resultado esperado, fecha, próximo hito y próxima sesión. Acción **Nueva meta**.
- Detalle: siguiente sesión, ruta de hitos, tareas cercanas y recursos.
- Ruta general cuando sea posible; detallar progresivamente el tramo próximo para evitar planificación excesiva.
- Reutilizar disponibilidad y sesiones del calendario común.
- Separar avance del curso de evidencia de aprendizaje; completar videos no implica dominio.

### Finanzas — decisiones
| Vista | Contenido | Acción principal |
| --- | --- | --- |
| Resumen | Disponible estimado, compromisos y presupuesto | Registrar movimiento |
| Movimientos | Ingresos, gastos y transferencias; filtros/corrección | Añadir |
| Deudas | Tarjetas/préstamos y próximos pagos | Registrar pago |
| Ahorro | Metas y cantidades efectivamente reservadas | Registrar aportación |
| Compras | Reposición, lista y comparación de precios | Añadir producto |

El disponible explica su horizonte y cálculo. Saldo en cuenta, crédito disponible y dinero libre de compromisos tienen significados distintos. Los datos desconocidos se muestran como pendientes.

### Captura, detalle y primera experiencia
- Captura: campo único, propuesta compacta editable, valores habituales visibles y preguntas imprescindibles.
- Detalle de tarea: título, vencimiento, próximo bloque, materiales y criterio de finalización si existe; extras desplegables.
- Registro → espacio automático → «¿Qué necesitas avanzar?» → pendiente, semestre o meta.
- Pedir disponibilidad al programar; configurar finanzas al comenzar a usarlas.
- La primera experiencia debe terminar con una acción concreta preparada para hacer.

## 3. Tres recorridos de referencia

### Objetivo → primera acción → bloque
Capturar resultado/fecha, aclarar punto de partida solo si hace falta, proponer una primera acción editable, reservar un hueco válido, mostrarla en Hoy, iniciar y cerrar sesión. La siguiente acción puede definirse después.

### Registrar un gasto
«Gasté 120 en comida con mi tarjeta» → propuesta de importe MXN, categoría, fecha y cuenta → aclarar solo lo ambiguo → confirmar → actualizar movimiento/presupuesto/deuda una vez → permitir corrección. Pagar después la tarjeta no vuelve a registrar el gasto.

### Decidir una compra esencial
Aviso de reposición aproximada → corregir existencias si hace falta → comparar presentaciones equivalentes, precios fechados y coste total → añadir a lista → confirmar compra/cuenta → actualizar gasto y existencias una vez → indicar inicio de uso o reserva.

## 4. Técnicas y fundamento

- **Time blocking:** elegido por el usuario; asignar trabajo concreto a horarios reales con margen y posibilidad de ajuste.
- **Intenciones de implementación:** conectar una señal/contexto con una acción inicial concreta. [Sheeran, Listrom y Gollwitzer, 2025; 642 pruebas](https://doi.org/10.1080/10463283.2024.2334563).
- **Gestión del tiempo:** asociada con desempeño y bienestar; la evidencia general no establece un formato de time blocking universalmente superior. [Aeon et al., 2021](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0245066).
- **Recuperación activa y práctica espaciada:** recordar/resolver antes de consultar, corregir y volver a practicar en distintos días. [Dunlosky et al., 2013](https://doi.org/10.1177/1529100612453266).
- **Seguimiento del progreso:** registrar resultados y contrastarlos con la meta. [Harkin et al., 2016](https://pubmed.ncbi.nlm.nih.gov/26479070/).
- Bloques, descansos y márgenes son ajustables; Pomodoro puede ser opción, sin tratar 25/5 como duración óptima universal.
- La evidencia de las técnicas orienta el diseño. La aplicación y sus metas de usabilidad se validarán mediante uso real.

## 5. Arquitectura de referencia

### Stack
| Capa | Elección | Incorporación |
| --- | --- | --- |
| Aplicación | Next.js + React + TypeScript | D0 |
| Interfaz | Tailwind CSS + shadcn/ui seleccionado | D0 |
| Base de datos | PostgreSQL en Supabase | D0–D1 |
| Autenticación/archivos | Supabase Auth / Storage | D1 / al incorporar archivos |
| Consultas y migraciones | Drizzle ORM | D0–D1 |
| Validación | Zod | Desde las primeras operaciones |
| Despliegue | Vercel + Supabase | Primer despliegue utilizable |
| Trabajos persistentes | Inngest | Al necesitar generaciones largas/recordatorios |
| Observabilidad | Sentry sin notas ni contenido financiero | Primer despliegue utilizable |
| Pruebas | Vitest + Playwright e integración con PostgreSQL | Según riesgos de cada entrega |
| Cobro del SaaS | Stripe Billing | D9, cuando se decida cobrar |

### Organización del código
- Monolito modular: identidad, planificación, universidad, estudio, finanzas, compras, captura/inteligencia y suscripciones/consumo.
- Separación proporcionada entre interfaz, casos de uso, reglas y persistencia; evitar capas vacías.
- Server Actions para UI; Route Handlers para webhooks/integraciones. Comparten casos de uso.
- Formularios y captura ejecutan las mismas operaciones de negocio.
- Planificador y cálculos financieros verificables fuera de componentes/prompts.
- Proveedor de IA e integraciones encapsulados; no introducir microservicios, GraphQL ni estado global complejo por anticipación.

### SaaS y acceso a datos
- Usuario → membresía → espacio personal automático; alta idempotente y misma estructura para fundador y otros usuarios.
- Datos privados con `workspace_id`; comprobar membresía desde identidad autenticada. Las relaciones tampoco pueden cruzar espacios.
- Autorización servidor + Row Level Security (RLS). Aislar también Storage, cachés, búsquedas, exportaciones, trabajos y contexto de IA.
- **Drizzle no activa RLS automáticamente.** Acceso habitual con rol restringido, sin owner/BYPASSRLS, y contexto autenticado limitado a la transacción. Probarlo con la conexión/pooling reales antes de crear datos de negocio.
- Credenciales de migración/administración separadas. El contexto de una solicitud no puede filtrarse a la siguiente.
- Jobs/webhooks con privilegios apropiados, validación de alcance e idempotencia.
- Capacidades y límites del producto por espacio; acceso fundador mediante ese mecanismo, sin excepciones por correo hardcodeadas.
- Suscripción comercial separada de tarjetas, deudas y movimientos personales del cliente.

### Inteligencia
- Contexto autorizado → interpretación → propuesta estructurada → validación → confirmación necesaria → caso de uso.
- Reglas para entradas sencillas; IA para lenguaje flexible, descomposición y contenido educativo.
- Proveedor/modelo pendiente de selección. Medir costes, aplicar límites por espacio y controlar concurrencia desde la primera función de IA en producción.
- Persistencia/reintentos para trabajos largos; funciones normales utilizables cuando falle la IA.
- Conexiones: contexto explícito primero, referencias después y similitud cuando se justifique. Relaciones claras reversibles; ambiguas sugeridas.

### Modelo conceptual, no esquema definitivo
| Dominio | Conceptos |
| --- | --- |
| Identidad | Usuario, perfil, espacio, membresía, preferencias |
| Universidad | Semestre, materia, evaluación, proyecto vinculado a objetivo |
| Planificación | Objetivo, hito, tarea, dependencia, disponibilidad, compromiso, bloque, sesión |
| Estudio | Meta/objetivo, curso/recurso, ruta, material, nota |
| Captura | Entrada original, propuesta, confirmación, referencia al registro creado |
| Finanzas | Cuenta, movimiento, categoría, presupuesto, meta/reserva de ahorro |
| Deudas | Tarjeta/préstamo, estado de cuenta, obligación/cuota, pago/aplicación |
| Compras | Producto/presentación, tienda, precio observado, existencias/consumo, lista, compra |
| Aprendizaje | Pregunta/tarjeta, fuente, intento/respuesta, repaso |
| SaaS | Suscripción, capacidades, consumo, trabajo persistente |

Objetivos/hitos/tareas se reutilizan entre áreas. Semestre y materia son contenedores de contexto. Un proyecto no debe duplicarse como dos registros con estados divergentes. Las finanzas mantienen su propio modelo: completar un recordatorio no demuestra un pago.

## 6. Alcance posterior y continuidad

Pospuesto: inversiones, bancos, scraping, OCR de tickets, editor tipo Notion, offline/sincronización, colaboración, integración con calendarios externos, grafos y búsqueda vectorial. Incorporarlos por necesidad validada.

No se han fijado precios, fechas de entrega, proveedor de IA ni condiciones bancarias particulares. Los parámetros técnicos pendientes se resuelven en la entrega correspondiente de [entregables-y-requisitos.md](./entregables-y-requisitos.md).

Al terminar trabajo, actualizar el estado en ese archivo con rutas relevantes, verificaciones reales, bloqueos y siguiente acción. Modificar este contexto solo cuando cambien decisiones de producto/arquitectura. Mantener los documentos libres de secretos, logs extensos y afirmaciones de funcionalidades no implementadas.
