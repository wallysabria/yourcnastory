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

## Phase 5 consent interface — 2026-11-08

New UI copy under approved D-005; counsel/native-language review before release. Existing Spanish source copy remains frozen. Every new catalog string follows:

- `privacy.title`: Tus opciones de privacidad
- `privacy.description`: Usamos herramientas de análisis opcionales para entender cómo se utiliza este sitio web y herramientas publicitarias opcionales para medir campañas y apoyar publicidad relevante. Puedes aceptar o rechazar las herramientas opcionales, administrar cada categoría y cambiar tu elección mediante Opciones de privacidad.
- `privacy.accept`: Aceptar todas las herramientas opcionales
- `privacy.decline`: Rechazar todas las herramientas opcionales
- `privacy.manage`: Administrar preferencias
- `privacy.necessary`: Necesarias — siempre activas
- `privacy.necessaryDescription`: Necesarias para el sitio web y tus opciones de privacidad guardadas.
- `privacy.analytics`: Análisis — opcional
- `privacy.analyticsDescription`: Nos ayuda a entender el uso del sitio web mediante Google Analytics y Microsoft Clarity.
- `privacy.advertising`: Publicidad — opcional
- `privacy.advertisingDescription`: Permite medir campañas y apoyar publicidad relevante mediante Google Ads, Floodlight y MNTN.
- `privacy.save`: Guardar opciones
- `privacy.close`: Cerrar
- `privacy.footer`: Opciones de privacidad
- `privacy.gpc`: El Control Global de Privacidad está activado en tu navegador. El análisis y la publicidad permanecen desactivados.
- `privacy.dnt`: No rastrear está activado en tu navegador. El análisis y la publicidad permanecen desactivados.
- `privacy.storageUnavailable`: Tu navegador no pudo guardar esta elección. Se aplica solo a esta página.
- `privacy.saved`: Se han guardado tus opciones de privacidad.
- `privacy.savedSession`: Tus opciones de privacidad se aplican a esta página.
- `privacy.policy`: Política de privacidad

The proposed Spanish policy additions are recorded in docs/recommendations/privacy-policy-draft.md in full; all are new draft-only text for counsel/native-language review, not published or substituted into frozen policy content.

Phase 5 handoff: both language consent paths, footer reopening, signal overrides and media Play labels were verified. The Spanish counsel draft external-media paragraph now describes approved D-006 click-to-load behavior. All draft Spanish remains in docs/recommendations/privacy-policy-draft.md for counsel/native-language review; original Spanish policy and page JSON are unchanged.

## Phase 7 planning — 2026-11-08

Search Console confirms the Spanish CNA Program page is a preservation priority. No Spanish copy or metadata was rewritten. Proposed SEO content recommendations are English drafts only; Spanish opportunities are flagged for native speakers. No new Spanish UI string has been added.

## Phase 7 implementation — 2026-11-08

Spanish body copy, title/description wording, FAQ questions/answers and alt text remain unchanged. JSON-LD reuses exact normalized existing Q&A and visible heading labels. Restored source OG locale rather than the prior generic fallback. No new Spanish interface translation; the llms directory uses existing labels, including Español. SEO recommendations flag Spanish description/social-image opportunities for native review without drafting replacement Spanish. Approved /es/preguntas-frecuentes-2/ canonical alias redirects directly to the existing Career Seekers FAQ; /faqs/ remains separate/gated.


Phase 7 final owner decision — 2026-11-08: the three retired-language direct redirects in phase-07-retired-counterparts.json are approved and implemented (including slash and percent-encoding case variants). Destinations use declared English counterparts. No page copy or styling changes. Phase 6 and Employers remain deferred.


## Preliminary Phase 10 QA — 2026-11-08

Detailed limited QA plan approved in chat. Career Seekers/shared EN/ES only; Employers remains English-only and on hold, and Phase 6 remains deferred. A renderer defect converted fragment-only career links into homepage links. Restoring the original fragment semantics is an implementation defect fix with no copy/design/route change. EN/ES nursing jump regression tests pass. Ten source-evidenced legacy redirects are proposed separately, inactive pending owner approval. Source-missing cnap-flyer and cusp anchors and one broken Spanish legacy link remain reported; no invented replacements. D-004 remains declined. No new Spanish UI text or visual design change.


Preliminary QA cross-browser fix: explicitly focus the clicked Privacy choices/Manage preferences opener before dispatching the existing open event. WebKit pointer activation otherwise does not focus buttons, so returning focus could target the page body. No consent wording, categories, storage or styling changed. Final representative matrix: 108 Edge/Firefox/WebKit checks passed; Chromium suite: 62 passed. Native Safari/iOS and physical devices remain unverified.


Owner approved all ten source-evidenced legacy redirects on 2026-11-08. Implemented 20 direct 301 rules including slash variants, preserving queries and existing destination paths. Total active rules: 280. Earlier pending status is superseded. The source-broken Spanish start-career link and three source-missing anchor destinations remain unresolved.


Preliminary QA handoff: 62 final regression tests pass, including 280 HTTP redirects; 48 content/source matches; 108 extended browser representative checks; 192-state baseline axe retains only D-004. All 54 mobile lab runs completed: 6/18 LCP, 11/18 score≥90, 18/18 CLS and TBT. Protected preview checks passed 48 pages/552 assets and both fixes, with temporary credentials revoked. One source-broken Spanish path, three source-missing anchor targets, source visual differences, performance/security and remaining integration/native-device/counsel gates remain explicit. No merge/publication or full-site launch sign-off.


## Add-on 01 — approved reduced scope

Owner approved favicon/app icons and mega-menu usability only, on addon-01-favicon-menu-og. Social preview images/samples/log entry are deferred; existing OG/Twitter image metadata, titles and descriptions remain unchanged. Original 270px favicon upload is preserved byte-for-byte; no vector source exists. Hover timing is centralized (100ms open/350ms close), with a measured invisible bridge, keyboard/focus and touch handling. Mobile markup/source wording and inactive Employer destinations stay unchanged. No new Spanish UI string, new dependency, tracking activation or phase advancement. Separate review PR/report; no merge/publication without owner instruction.
