# Upload serving proposal — Phase 2

Pending Q-001, retain every document at its exact /wp-content/uploads/... path, copied into public/wp-content/uploads/... after approved extraction. Do not rename, delete, consolidate, or replace document URLs. Static public assets avoid redirect chains. Confirm response content type, byte hashes and references in the later build. The missing uploads archive prevents a complete inventory or coverage claim.

Use separate optimized image derivatives through Next image handling where appropriate, keeping originals for any externally referenced upload URLs. Decide cache policy and image dimensions from the inventory. No uploads migration or URL disposition is implemented in Phase 2.

