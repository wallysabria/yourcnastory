# D-006 proposal — click-to-load inline external video

Status: approved by owner in chat on 2026-11-08; implemented on Phase 5 branch. Scope: the three inline players on each of the EN/ES Community Resources pages (one Vidyard, two YouTube). Existing click-open video dialogs are unchanged.

Observed: without making a privacy choice, scrolling these iframes into view requests YouTube/Vidyard resources plus Google Analytics and DoubleClick hosts. This bypasses the site's otherwise blocked optional scripts.

Proposed behavior: retain each video's position, 16:9 size and original thumbnail (downloaded/self-hosted), with a centered source-style play button. Initial render includes no external iframe. Clicking the accessible Play video / Reproducir video control replaces the thumbnail with the same existing provider/player and destination. The video is requested by that action; analytics consent is not required to watch it. Explain provider processing in the counsel draft. No blanket claim that providers cannot track after the user requests playback.

Keyboard: button receives focus, Enter/Space loads player and transfers focus to its titled iframe. Existing localized labels are reused. No changes to surrounding copy, links, anchors or layout. Proposed visual prototype is recorded in _source/phase-05/media-consent-proposal.png.

Benefit: prevent passive third-party tracking before a visitor requests external media. Requires explicit approval under CLAUDE.md §4.6 before shipping this interaction change.
