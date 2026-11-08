# Integrations and public form inventory

Read-only on 2026-11-07. Server HTML: `script-inventory.csv`, `form-instances.json`, `embed-instances.csv`. Browser-loaded tags are separately recorded in `browser-evidence.json` (host/path and tag IDs only; visitor query identifiers omitted).

## Observed services

- GTM: GTM-TLC2T6FQ. Browser observation also found Google Ads / Floodlight loaders, DoubleClick, and Mountain/MNTN pixel hosts. These require an explicit keep/drop decision in Phase 5; this is not permission to recreate every tag.
- GA4 signal G-RC2WSP3DYG and Google tag GT-NB3VX8H were observed. Account ownership and property correctness remain unverified; supplied IDs/tag audit are still required.
- Microsoft Clarity: public loader contains project yr1ps67xpa. Account/project ownership remains unverified.
- Mailchimp: native embedded form posts to yourcnastory.us8.list-manage.com. No submissions performed. Public field names are FNAME, LNAME, MMERGE4 (ZIP), EMAIL, SMSPHONE, MMERGE3 (language), plus honeypot and submit input. Public HTML alone cannot establish all audience tags/groups or SMS configuration.
- Fluent Forms: `fluentform_4` appears on /train-and-gain/ and its discovered language variants. Its future handling is undecided. MetForm widgets and two exported form records are listed in `elementor-widgets.csv`; plugin presence is not proof that every form is publicly used.
- MxChat and add-on scripts appear on the live site; browser confirms the career-page launcher. No chat questions or signup were submitted.
- Microsoft Forms and video iframe URLs are inventoried by placement in `embed-instances.csv`. No employer application submitted.
- Elementor/PRO Elements, The7, Page Scroll to ID, fonts/icon libraries, translation and performance scripts are retained as inventory, not dependencies for the replacement.

## Mailchimp placements

- https://yourcnastory.org/career-seekers/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/career-advancement/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/earn-and-learn-la/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/frequently-asked-questions/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/earn-and-learn-cvalley/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/earn-and-learn-bayarea/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/earn-and-learn-norcal/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/in-demand/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/affordable-career/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/teamwork/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/earn-and-learn-san-diego/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/earn-and-learn/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/purpose/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/es/en-equipo/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/es/aspirantes/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/es/carrera-economica/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/es/preguntas-frecuentes/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/es/avance-profesional/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/es/ganar-y-aprender-la/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/es/gana-y-aprende-cvalley/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/es/gana-y-aprende-bayarea/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/es/earn-and-learn-norcal/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/es/carreras-en-demanda/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/es/gana-y-aprende-san-diego/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/es/earn-and-learn/ — mc-embedded-subscribe-form; section placement: page signup block
- https://yourcnastory.org/es/vocacion/ — mc-embedded-subscribe-form; section placement: page signup block

## Exact rendered signup copy — English

```text
* indicates required
First Name *
Last Name *
Zip Code *
Email Address *
SMS Phone Number
Your CNA Story - By providing your phone number, you agree to receive promotional and marketing messages, notifications, and customer service communications from Your CNA Story. Message and data rates may apply. Consent is not a condition of purchase. Message frequency varies. Text HELP for help. Text STOP to cancel.See terms.
Language Preference *
English
Español
Tiếng Việt
简体中文
Select the language you prefer to be contacted in.
```

## Exact rendered signup copy — Spanish

```text
* Obligatorio
Nombre *
Apellido *
Código postal *
Correo electrónico *
Teléfono móvil para SMS
Tu Historia como CNA: Al proporcionar tu teléfono, aceptas recibir mensajes promocionales y de marketing, notificaciones y comunicaciones de servicio al cliente de Tu Historia como CNA. Se pueden aplicar tarifas por mensajes y datos. No es necesario proporcionar tus datos para realizar una compra. La frecuencia de los mensajes varía. Envía HELP para obtener ayuda. Envía STOP para cancelar. Consulta los términos.Consulta los términos.Consulta los términos.
Preferencia de Idioma *
Inglés
English
Tiếng Việt
简体中文
Selecciona el idioma que prefieres.
```

These are audit references, not rewritten copy. Duplicate Spanish terms text is logged for native-speaker review. The source still offers Vietnamese and Chinese; the replacement language options remain governed by CLAUDE.md.

## Popups

- 52154: The7 search popup. Header magnifier opens it; search input and Search button; close control. Browser verified. Searches were not submitted.
- 73689: The7 mobile menu popup. Mobile hamburger opens it; nested Career Seekers/Employers/language items expand through the plus control. Browser verified in EN and ES. Mobile Employers submenu links to the Career Seekers FAQ, while desktop Employers menu links to /faqs/ — record discrepancy for owner decision.
- 30220: WOO popup shop filters; published template in export.
- 77242: WOO mini cart popup; published template in export.
- The WooCommerce template activation/conditions are not established by public triggers. Exported settings are in `popup-settings.json`; the missing database limits certainty about conditional/site-wide activation.
- Elementor video lightboxes are actions, separately inventoried in `elementor-actions.json`.

## Limits

No WordPress admin login, live form submissions, account changes, production settings, or content changes. Database-only settings and consent/tag firing details require later inputs and browser/tag-assistant verification. Runtime-loaded popup links are in browser evidence and must be reconciled with server menus.

## Phase 5 input update — 2026-11-08

Owner confirmed GA4 Property 407144160, Measurement G-RC2WSP3DYG and Clarity project yr1ps67xpa in chat. Earlier ownership-unverified statements describe the Phase 1 capture, not current confirmation status. Fresh authorized public observations and their limits are in phase-05-tag-audit.md / phase-05-tag-audit.json. Replacement GTM ID and tag-plan approval remain pending.
