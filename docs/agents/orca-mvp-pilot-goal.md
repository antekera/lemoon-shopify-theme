# Goal para Orca — piloto de entrega del MVP

Copia el bloque siguiente en un goal de Orca desde el checkout del tema que contiene esta configuración. Crear este archivo no inicia el goal.

```text
Actúa como coordinador de entrega de Lemoon y ejecuta una primera tanda autónoma del MVP. No me pidas asignar tickets uno por uno.

Lee AGENTS.md, .codex/agents/linear-delivery-coordinator.toml y docs/agents/mvp-queue-policy.md en este checkout. Usa esa política para revisar la cola completa del proyecto Lemoon en Linear, elegir hasta tres tickets ejecutables y congelar la selección antes de empezar. No te limites a los tickets mencionados como ejemplos en la política. Si hay menos de tres listos, explica los bloqueos y trabaja el subconjunto disponible. No amplíes esta tanda ni sustituyas sus tickets una vez congelada.

Trabaja con antekera/lemoon-shopify-theme y antekera/lemoon-next-backoffice. Comprueba ramas, PRs y trabajo existente antes de implementar; preserva todos los cambios locales. Usa los agentes definidos en cada repositorio y el coordinador compartido. Al crear worktrees, verifica el base SHA y pasa expresamente las instrucciones de esta configuración a los trabajadores si todavía no están en su rama base.

Coordina mediante la skill orchestration y el CLI de Orca instalado: carga su guía de versión, crea o reanuda un único Run y usa Tasks/Dispatches supervisados. Máximo dos tickets activos a la vez, respetando además el límite total de trabajadores, la independencia de archivos y las dependencias. No sustituyas el estado de Orca por subagentes sin procedencia Orca.

Te autorizo a seleccionar esos tickets, moverlos a In Progress al comenzar, implementar, probar, coordinar revisiones independientes, hacer commits/push y abrir o actualizar sus PRs. Entrega PRs listos para mi revisión; este goal no autoriza merges ni publicación/despliegue, operaciones productivas, pagos o mensajes reales a clientes. Solo yo paso tickets a In Review o Done. Respeta cualquier estado que ya haya establecido.

Recuerda que configurador, receta compartida, recepción en back office, carga desde perfil y correos son parte del MVP según las decisiones actuales; las descripciones antiguas de fases no pueden diferirlos. Prioriza los prerrequisitos reales. Cada página incluye texto definitivo, integración y QA. No inventes condiciones comerciales ni des por probada una integración con mocks.

Agrupa las decisiones que necesites de mí por ticket, continúa el trabajo independiente seleccionado y registra bloqueos sin ampliar el alcance. Mantén el checkpoint de reanudación indicado en la política y no dupliques trabajadores o implementaciones al retomar.

Finaliza cuando la tanda esté entregada con las evidencias requeridas. Si hay bloqueos que impiden completarla, informa el resultado parcial sin marcar el goal como cumplido. Mantén en In Progress los tickets cuyo trabajo comenzaste, con PR, SHA probado, preview/evidencia, revisiones y pendientes; conserva los estados de los no iniciados y los fijados por Miguel. Antes de terminar, contabiliza y liquida correctamente todos los Dispatches/terminales de Orca. Devuélveme una tabla de los tickets seleccionados, resultado, enlaces y preguntas pendientes, junto con la siguiente tanda recomendada, sin iniciarla.
```
