# Approval checklist

**Sign-off is not complete.** No box is implied checked by a source capture, successful test, reviewer assignment or previous merge. Record approver, date, version/commit and exact verdict. A reviewer may approve with explicit exceptions, but unresolved public placeholders cannot ship as final policy text.

## Recorded owner decisions

| ID | Decision | Status |
|---|---|---|
| B-01 | Entity: Quality Care Health Foundation | Confirmed in chat 2026-11-19 |
| B-02 | Privacy contact: info@yourcnastory.org | Confirmed in chat 2026-11-19 |
| B-03 | Retain email plus optional SMS; verify consent/terms before launch | Confirmed in chat 2026-11-19 |
| B-04 | Production host migration to SiteGround before launch | Confirmed earlier in chat 2026-11-19; migration not performed |
| B-05 | Retain GA4, Clarity, Google Ads, Floodlight and MNTN | Existing owner decision; live configuration/verification still pending |

## Assign reviewers

- [ ] Spanish native-language reviewer: name/role __________
- [ ] Privacy/legal reviewer: name/role __________
- [ ] Owner approving wording/business process: __________
- [ ] Technical verifier for actual SiteGround/live integrations: __________

## Spanish acceptance

- [ ] All 24 rows in spanish-register.md have a named reviewer and keep/edit verdict.
- [ ] All 61 current strings in spanish-interface.md reviewed, including context and mobile fit.
- [ ] ES-01 menu spelling correction approved or explicitly retained.
- [ ] Tone/terminology decisions and exact ES-02/ES-04 edits approved; no bulk rewrite of facts or testimonials.
- [ ] EN/ES SMS disclosure and one correct terms link approved; ES-03 duplicate-label treatment approved for all nine affected pages.
- [ ] EN/ES privacy wording aligned; no untranslated or unresolved release notes in final public copy.
- [ ] Remaining source-body, metadata/alt/link observations adjudicated individually. Historical URL decisions remain outside editorial changes.

## Owner/legal facts and workflow

- [ ] Confirm this policy's scope (YourCNAStory website versus wider QCHF/CAHF services), inbox owner, and any needed postal/entity details.
- [ ] Define applicable rights, request intake/verification/response/deletion/appeal process and responsible staff.
- [ ] Approve children/minor policy and safe request handling. Remove password-request wording in the final replacement.
- [ ] Confirm actual data recipients and account access for Mailchimp, external application responses, hosting, analytics and advertising.
- [ ] Supply retention periods/criteria for: email/SMS records; contact requests; Microsoft Forms responses; hosting/security logs; vendor data. Explain deletion/backups/legal exceptions where relevant.
- [ ] Approve vendor roles/contracts/transfers and any required sale/sharing disclosures; no inferred “anonymous” or “no sharing” claims.
- [ ] Supply the final SMS program identity, consent language and terms link, and confirm opt-out handling in the actual platform.
- [ ] Approve effective date and how policy changes will be notified. Do not replace the date on an otherwise unreviewed old policy.

## Technical release acceptance

- [ ] SiteGround deployment and exact host-specific behavior tested, with staging noindex until approved cutover.
- [ ] Real Mailchimp/SMS configuration and audience mappings verified with an approved safe test destination. Preview response text changed only with the real route.
- [ ] GTM/GA4/Clarity/Ads/Floodlight/MNTN actual mappings and category-specific consent verified; no production IDs tested on ordinary previews.
- [ ] Clarity/session-replay masking and sensitive-field/page handling verified independently of the local event layer.
- [ ] Microsoft Forms field list, owner/access and retention confirmed; click-to-load notices approved.
- [ ] External-media disclosures match actual provider requests. Disabled inquiry form remains accurately described unless separately replaced.
- [ ] Privacy preference expiry, default deny, GPC/DNT, category selection, withdrawal and legacy privacy links rechecked on final host.
- [ ] Chat is explicitly excluded while paused; any later activation has its own approved notice and operational checks.

## Final release record

- English policy version/commit: __________ · Approver/date: __________
- Spanish policy version/commit: __________ · Native approver/date: __________
- Exact source-copy changes authorized: __________
- Business/legal exceptions accepted: __________
- Technical evidence / target deployment: __________
- Owner approval to implement and publish: __________

Until the above gates are satisfied, this package is a review draft. It is not a replacement privacy policy, a live integration approval or launch approval.
