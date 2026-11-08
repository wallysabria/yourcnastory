# Spanish review log

Spanish copy is frozen (`CLAUDE.md` §4.2). This log records anything that looks off so native
speakers can review it later. **Logging never changes the site.**

Also records the only permitted Spanish changes: job-board removals (cross-referenced to
`content-changes-log.md`) and new Spanish interface strings added by the rebuild.

## Observations

| ID | Page URL | Exact text | What looks off | Logged (phase/date) | Reviewer verdict |
|----|----------|------------|----------------|---------------------|------------------|

## New Spanish interface strings

| ID | Where used | Spanish string | English equivalent | Added (phase/date) | Reviewed |
|----|------------|----------------|--------------------|--------------------|----------|

## Phase 1 observations — copy unchanged

| ID | Page | Exact source text | Observation |
|---|---|---|---|
| SR-001 | /es/aspirantes/ (signup) | Consulta los términos.Consulta los términos.Consulta los términos. | Rendered SMS disclosure repeats the terms label; retain verbatim until native-speaker/owner review. |
| SR-002 | /es/aspirantes/ (signup) | Inglés / English / Tiếng Việt / 简体中文 | First two rendered language labels are inconsistent with the expected English/Español options. No source copy corrected. |
| SR-003 | /es/abogado/ | abogado (URL slug) | Flag translated slug/terminology for native-speaker review; preserve path. |

The frozen Spanish source was only inventoried. No translation edits or new Spanish interface strings were introduced.

## Phase 2
New interface strings (native review pending): Cerrar menú (Close menu); Abrir menú (Open menu); Navegación principal (Main navigation); Idioma (Language); Buscar (Search); Volver arriba (Back to top). Menú and Ir al contenido are source strings. Source image alt text/provenance is preserved in global assets/content. Source header CNAP PROGRAM and PREGUNTAS FREQUENTES are retained verbatim and flagged for native review; no correction made.

## Phase 3
24 Spanish content files preserve the rendered source character stream exactly after the five logged job-board removals (four policy substrings/paragraph and one advancement button). No Spanish text correction, translation or new Spanish interface string was added. Source strings, punctuation, translated testimonials and existing terminology remain frozen. Metadata/source parity evidence is in docs/reports/phase-03-parity.*. Native review remains pending.

## Phase 4 native interface strings (2026-11-08)

New interface text only; source Spanish bodies and SMS disclosure remain unchanged. Canonical form options: English and Español; retired Vietnamese/Chinese controls removed.

| Catalog.key | New Spanish string |
|---|---|
| signup.preview | Formulario de prueba: no se creará ninguna suscripción. |
| signup.pending | Enviando… |
| signup.accepted | Se recibió el envío de prueba. No se creó ninguna suscripción. |
| signup.invalid | Revisa los campos indicados. |
| signup.unavailable | No se pudo procesar la solicitud. Inténtalo de nuevo. |
| signup.limited | Espera antes de volver a intentarlo. |
| signup.name | Escribe tu nombre. |
| signup.zip | Escribe un código postal válido. |
| signup.email | Escribe una dirección de correo electrónico válida. |
| signup.phone | Escribe un número de teléfono válido con el código del país. |
| signup.language | Elige English o Español. |
| signup.countryCode | Código del país |
| signup.required | Este campo es obligatorio. |
| search.open | Buscar |
| search.close | Cerrar búsqueda |
| search.clear | Borrar búsqueda |
| search.placeholder | Buscar... |
| search.loading | Buscando… |
| search.none | No se encontraron resultados. |
| search.results | Resultados de búsqueda |
| search.unavailable | La búsqueda no está disponible. Inténtalo de nuevo. |
| search.count | {count} resultados |
| search.one | 1 resultado |
| widgets.previous | Diapositiva anterior |
| widgets.next | Diapositiva siguiente |
| widgets.pause | Pausar |
| widgets.play | Reproducir |
| widgets.playVideo | Reproducir video |
| widgets.closeVideo | Cerrar video |
| widgets.carousel | Carrusel |
| widgets.video | Video |

The source nursing career entries contain literal `.cls-...{fill:none;stroke:...}` fragments in anchor text. Preserved under frozen-copy rules; native-speaker/content review should decide whether to remove these artifacts later.

Phase 4 additional native TOC interface: `widgets.expandContents` = “Expandir tabla de contenido”; `widgets.collapseContents` = “Contraer tabla de contenido”. Existing privacy section headings are reused verbatim as TOC links; source body copy remains frozen.

## Phase 5 proposed Spanish interface strings — 2026-11-08

Proposed only; counsel/owner review pending. None published. Existing Spanish page bodies and policy remain frozen. The third column below enumerates every proposed Spanish interface string.

| Interface          | English context                                                                                                                                                 | Proposed Spanish string                                                                                                                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Heading            | Your privacy choices                                                                                                                                            | Tus opciones de privacidad                                                                                                                                                                                 |
| Explanation        | We use optional analytics to understand how this website is used. You can accept or decline analytics and change your choice at any time using Privacy choices. | Usamos herramientas de análisis opcionales para entender cómo se utiliza este sitio web. Puedes aceptar o rechazar el análisis y cambiar tu elección en cualquier momento mediante Opciones de privacidad. |
| Accept             | Accept analytics                                                                                                                                                | Aceptar análisis                                                                                                                                                                                           |
| Decline            | Decline analytics                                                                                                                                               | Rechazar análisis                                                                                                                                                                                          |
| Preferences        | Manage preferences                                                                                                                                              | Administrar preferencias                                                                                                                                                                                   |
| Necessary category | Necessary — always on                                                                                                                                           | Necesarias — siempre activas                                                                                                                                                                               |
| Analytics category | Analytics — optional                                                                                                                                            | Análisis — opcional                                                                                                                                                                                        |
| Save               | Save choices                                                                                                                                                    | Guardar opciones                                                                                                                                                                                           |
| Close              | Close                                                                                                                                                           | Cerrar                                                                                                                                                                                                     |
| Footer             | Privacy choices                                                                                                                                                 | Opciones de privacidad                                                                                                                                                                                     |
| GPC state          | Global Privacy Control is enabled in your browser. Analytics remains off.                                                                                       | El Control Global de Privacidad está activado en tu navegador. El análisis permanece desactivado.                                                                                                          |
| DNT state          | Do Not Track is enabled in your browser. Analytics remains off.                                                                                                 | No rastrear está activado en tu navegador. El análisis permanece desactivado.                                                                                                                              |

## Phase 5 revised proposed Spanish consent strings — 2026-11-08

Supersedes the analytics-only proposal above, following owner retention of advertising. Proposal only, not published; existing Spanish bodies remain frozen.

| Interface | English context | Revised proposed Spanish |
|---|---|---|
| Heading              | Your privacy choices                                                                                                                                                                                                                                                 | Tus opciones de privacidad                                                                                                                                                                                                                                                                                                  |
| Explanation          | We use optional analytics to understand how this website is used and optional advertising tools to measure campaigns and support relevant advertising. You can accept or decline optional tools, manage each category, and change your choice using Privacy choices. | Usamos herramientas de análisis opcionales para entender cómo se utiliza este sitio web y herramientas publicitarias opcionales para medir campañas y apoyar publicidad relevante. Puedes aceptar o rechazar las herramientas opcionales, administrar cada categoría y cambiar tu elección mediante Opciones de privacidad. |
| Accept               | Accept all optional tools                                                                                                                                                                                                                                            | Aceptar todas las herramientas opcionales                                                                                                                                                                                                                                                                                   |
| Decline              | Decline all optional tools                                                                                                                                                                                                                                           | Rechazar todas las herramientas opcionales                                                                                                                                                                                                                                                                                  |
| Preferences          | Manage preferences                                                                                                                                                                                                                                                   | Administrar preferencias                                                                                                                                                                                                                                                                                                    |
| Necessary category   | Necessary — always on                                                                                                                                                                                                                                                | Necesarias — siempre activas                                                                                                                                                                                                                                                                                                |
| Analytics category   | Analytics — optional                                                                                                                                                                                                                                                 | Análisis — opcional                                                                                                                                                                                                                                                                                                         |
| Advertising category | Advertising — optional                                                                                                                                                                                                                                               | Publicidad — opcional                                                                                                                                                                                                                                                                                                       |
| Save                 | Save choices                                                                                                                                                                                                                                                         | Guardar opciones                                                                                                                                                                                                                                                                                                            |
| Close                | Close                                                                                                                                                                                                                                                                | Cerrar                                                                                                                                                                                                                                                                                                                      |
| Footer               | Privacy choices                                                                                                                                                                                                                                                      | Opciones de privacidad                                                                                                                                                                                                                                                                                                      |
| GPC state            | Global Privacy Control is enabled in your browser. Analytics and advertising remain off.                                                                                                                                                                             | El Control Global de Privacidad está activado en tu navegador. El análisis y la publicidad permanecen desactivados.                                                                                                                                                                                                         |
| DNT state            | Do Not Track is enabled in your browser. Analytics remains off.                                                                                                                                                                                                      | No rastrear está activado en tu navegador. El análisis permanece desactivado.                                                                                                                                                                                                                                               |
