# Candidate Scout Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Candidate Scout to match the supplied dashboard concept while replacing the old one-at-a-time random-candidate flow with real GitHub project-driven talent discovery, filters, sorting, list/grid views, shortlist, and saved-candidate interactions.

**Architecture:** Keep the existing Vite + React + TypeScript + react-router-dom stack. Discover candidates from owners of GitHub repositories matching the search query, hydrate those owners with profile details, derive skill tags from matched repository languages/topics, and keep shortlist/saved collections in localStorage so no backend is required.

**Tech Stack:** React 18, TypeScript, Vite, react-router-dom, react-icons, GitHub REST API, browser localStorage.

**Spec:** User-supplied Candidate Scout dashboard screenshot in the October 26, 2026 chat.

## Global Constraints

- Preserve the existing public GitHub API approach; do not introduce a backend or paid service.
- Remove the hard-coded `jmo5896` reference-profile behavior.
- Implement the new left filter/sidebar, search bar, results toolbar, sorting, list/grid view toggles, and dense candidate cards.
- Keep search, shortlist, and saved navigation functional.
- Keep the app responsive on desktop and mobile.

## Review Focus

- Empty search queries should not trigger malformed GitHub requests.
- GitHub rate-limit and request failures should produce a recoverable error state.
- Duplicate shortlist/saved clicks should not duplicate localStorage entries.
- Missing profile fields should render sensible fallbacks.
- Mobile layouts should collapse the sidebar and result cards without horizontal overflow.

---

### Task 1: Search API and candidate model

**Files:**
- Modify: `src/interfaces/Candidate.interface.tsx`
- Modify: `src/api/API.tsx`

- [x] Expand the candidate interface with repository/follower/account metadata used by the new result cards.
- [x] Add typed GitHub project search and profile hydration for relevant candidate discovery.
- [x] Carry matching project languages/topics into candidate skill tags.

### Task 2: Search dashboard and candidate cards

**Files:**
- Modify: `src/pages/CandidateSearch.tsx`
- Modify: `src/components/CandidateCard.tsx`

- [x] Replace the random single-card state machine with controlled search/filter/sort/view state.
- [x] Implement skill chips, location, experience filters, clear-all, result counts, sort selection, and list/grid view controls.
- [x] Add shortlist and saved actions per result with duplicate-safe localStorage persistence.
- [x] Render profile stats and a GitHub profile link with fallbacks for incomplete profiles.

### Task 3: Navigation and collections

**Files:**
- Modify: `src/components/Nav.tsx`
- Modify: `src/pages/SavedCandidates.tsx`
- Modify: `src/main.tsx`

- [x] Add Search, Shortlist, and Saved navigation matching the supplied UI.
- [x] Reuse the collection page for both shortlist and saved storage keys.
- [x] Keep remove-from-collection behavior functional.

### Task 4: Dashboard styling and verification

**Files:**
- Modify: `src/index.css`
- Add: `.github/workflows/verify.yml`

- [x] Replace the old oversized swipe-card styling with the supplied dense dark-blue dashboard layout.
- [x] Add responsive desktop/tablet/mobile behavior for header, sidebar, toolbar, cards, and grid view.
- [ ] Confirm `npm ci`, `npm run lint`, and `npm run build` in GitHub Actions before merge.
