# Phase 5 privacy-policy recommendations — counsel draft

Draft dated 2026-11-08. **Not published; does not replace either existing policy.** Counsel and the owner must establish the legal entity/contact, applicable laws, vendor contracts, disclosures, retention and rights process before release. Bracketed text must be resolved. This draft describes the approved intended configuration; the current migration preview uses mocks and does not load analytics or advertising SDKs.

## English proposed additions

### Website technologies and choices
We use necessary website features, including storing your privacy preferences in your browser. Optional analytics tools help us understand website use. Optional advertising tools measure campaigns and support relevant advertising. You may accept or decline all optional tools or choose analytics and advertising separately. Select **Privacy choices** in the footer to review or change your choice at any time. Declining optional tools does not prevent access to website content.

We plan to retain Google Analytics 4 and Microsoft Clarity for analytics and Google Ads, Floodlight and MNTN for advertising. [Owner/counsel: confirm every destination, vendor role, data category, sharing/sale characterization, purpose, retention and vendor policy link against the final exported configuration.] The migration preview currently sends no events to these vendors. When a live configuration is approved, optional vendor scripts will remain blocked until the relevant category is permitted. Changing your choice stops further optional site events; removing prior information held by vendors requires the applicable rights process.

Your choice is stored in local storage under `ycna_privacy_v1`, without a name or email address, for 180 days. If browser storage is unavailable, the choice applies to the current page session and may be requested again. Expired, invalid or missing choices default to optional tools off. We treat Global Privacy Control and Do Not Track signals as declining both optional categories. The signal overrides a saved grant. Necessary hosting/security requests still occur. [Counsel: confirm signal handling and any required opt-out rights/notice for this organization.]

### Events and embedded media
The proposed site event layer uses approved page paths, language, template, coarse search length/result counts, selected search-result paths, document keys, approved destination hosts and scroll depth. It excludes search text, page query strings/fragments and form-field values. [Owner: verify that each vendor's own collection, URL handling, session replay masking and consent settings match this statement before enabling it.] Microsoft Clarity masking must be reviewed separately; the site event whitelist is not a guarantee about a vendor SDK's collection.

YouTube and Vidyard players remain unloaded until you select Play. Selecting Play requests content from that provider, which may process information under its own policies. The site does not require an analytics grant to watch a requested video. [Owner/counsel: review provider disclosures before release.]

### Contact, signup and SMS
The migration signup form currently uses a mock endpoint; it does not add subscribers to Mailchimp or send SMS. Before a live connection, disclose the actual fields, purpose, lawful basis where required, recipients and retention. State whether SMS is offered, identify its separate opt-in and opt-out process, and link approved terms. Do not describe clicking a general signup button as consent to SMS. [Owner/counsel to supply final operational disclosures and contact details.]

### Future chat
Chat is not operating on the migration site. A proposed later phase would redact personal information from retained chat logs and delete logs after 12 months. Do not publish that as an existing practice until redaction, deletion, vendor handling, security and rights workflows are implemented and tested. [Counsel: approve a final chat notice before enabling chat.]

### Requests and contact
[Insert the responsible legal entity, contact channel, rights eligibility, request verification/appeal process, applicable retention schedule, effective date and required jurisdiction-specific disclosures. Do not invent addresses or promise an unimplemented deletion process.]

## Adiciones propuestas en español

### Tecnologías del sitio y tus opciones
Usamos funciones necesarias del sitio, incluido el almacenamiento de tus preferencias de privacidad en tu navegador. Las herramientas de análisis opcionales nos ayudan a entender el uso del sitio. Las herramientas publicitarias opcionales permiten medir campañas y apoyar publicidad relevante. Puedes aceptar o rechazar todas las herramientas opcionales o elegir por separado el análisis y la publicidad. Selecciona **Opciones de privacidad** en el pie de página para revisar o cambiar tu elección en cualquier momento. Rechazar las herramientas opcionales no impide acceder al contenido del sitio.

Planeamos conservar Google Analytics 4 y Microsoft Clarity para el análisis, y Google Ads, Floodlight y MNTN para la publicidad. [El titular y su asesoría jurídica deben confirmar los destinos, proveedores, categorías de datos, finalidades, plazos de conservación y avisos antes de publicar.] La vista previa de la migración no envía eventos a estos proveedores. Tras aprobar una configuración activa, los scripts opcionales permanecerán bloqueados hasta que se permita la categoría correspondiente. Cambiar tu elección detiene los eventos opcionales posteriores del sitio; para los datos ya conservados por proveedores se aplica el proceso de solicitudes correspondiente.

Guardamos tu elección durante 180 días en el almacenamiento local de tu navegador con la clave `ycna_privacy_v1`, sin nombre ni correo electrónico. Si el navegador no permite guardar la elección, se aplica a la sesión de la página actual y puede volver a solicitarse. Si la elección falta, vence o no es válida, las herramientas opcionales permanecen desactivadas. Tratamos las señales de Control Global de Privacidad y No rastrear como un rechazo de ambas categorías opcionales, incluso si antes se habían aceptado. Las solicitudes necesarias de alojamiento y seguridad siguen realizándose. [Revisión jurídica pendiente.]

### Eventos, videos y formularios
La capa de eventos propuesta utiliza rutas aprobadas, idioma, plantilla, longitud de búsqueda y cantidad de resultados, rutas de resultados seleccionados, claves de documentos, dominios aprobados y profundidad de desplazamiento. Excluye el texto de búsqueda, los parámetros de URL, los fragmentos y los valores de los campos de formularios. [Debe verificarse por separado la recopilación y el enmascaramiento de cada proveedor antes de activarlo.]

Los reproductores de YouTube y Vidyard no se cargan hasta que seleccionas Reproducir. Esa acción solicita contenido al proveedor, que puede procesar información según sus propias políticas. No se exige aceptar el análisis para ver un video solicitado. [Revisar los avisos de los proveedores antes de publicar.]

El formulario de la migración usa actualmente una respuesta de prueba: no añade suscriptores a Mailchimp ni envía SMS. Antes de una conexión activa deben aprobarse los campos, finalidades, destinatarios, conservación y avisos. Si se ofrecen SMS, deben explicarse su consentimiento separado y cómo cancelarlos. [El titular y su asesoría jurídica deben proporcionar los datos definitivos.]

### Chat futuro y contacto
El chat no está activo en el sitio migrado. Una fase posterior propone eliminar información personal de los registros conservados y borrar esos registros a los 12 meses. No debe presentarse como una práctica actual hasta que esté implementada y verificada. [Añadir la entidad responsable, datos de contacto, derechos aplicables, procedimiento de solicitudes y fecha de vigencia después de revisión jurídica.]

## Primary references for review

- [Google basic versus advanced consent mode](https://developers.google.com/tag-platform/security/concepts/consent-mode): this implementation selects basic blocking; a denied signal alone does not establish no requests.
- [Microsoft Clarity ConsentV2](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2): vendor consent and masking configuration still need owner verification.
- [California Attorney General GPC guidance](https://oag.ca.gov/privacy/ccpa/gpc): applicability and organization-specific disclosures require counsel determination.

These are implementation references, not a legal compliance certification or a finalized policy.
