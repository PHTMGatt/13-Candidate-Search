# Candidate Scout Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Candidate Scout to match the supplied dashboard concept while replacing the old one-at-a-time random-candidate flow with real GitHub user search, filters, sorting, list/grid views, shortlist, and saved-candidate interactions.

**Architecture:** Keep the existing Vite + React + TypeScript + react-router-dom stack. Use GitHub's user search API for query discovery, hydrate the visible result set with profile details, derive lightweight skill tags from the query/profile text, and keep shortlist/saved collections in localStorage so no backend is required.

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

- [ ] Expand the candidate interface with repository/follower/account metadata used by the new result cards.
- [ ] Add a typed GitHub user-search function that accepts query, location, and result count.
- [ ] Hydrate returned search matches with profile details while keeping rate-limit errors explicit.
- [ ] Run the project build/lint commands once implementation is complete.

### Task 2: Search dashboard and candidate cards

**Files:**
- Modify: `src/pages/CandidateSearch.tsx`
- Modify: `src/components/CandidateCard.tsx`

- [ ] Replace the random single-card state machine with controlled search/filter/sort/view state.
- [ ] Implement skill chips, location, experience filters, clear-all, result counts, sort selection, and list/grid view controls.
- [ ] Add shortlist and saved actions per result with duplicate-safe localStorage persistence.
- [ ] Render profile stats and a GitHub profile link with fallbacks for incomplete profiles.

### Task 3: Navigation and collections

**Files:**
- Modify: `src/components/Nav.tsx`
- Modify: `src/pages/SavedCandidates.tsx`
- Modify: `src/main.tsx`

- [ ] Add Search, Shortlist, and Saved navigation matching the supplied UI.
- [ ] Reuse the collection page for both shortlist and saved storage keys.
- [ ] Keep remove-from-collection behavior functional.

### Task 4: Dashboard styling and verification

**Files:**
- Modify: `src/index.css`

- [ ] Replace the old oversized swipe-card styling with the supplied dense dark-blue dashboard layout.
- [ ] Add responsive desktop/tablet/mobile behavior for header, sidebar, toolbar, cards, and grid view.
- [ ] Verify branch diff, lint/build status where available, and GitHub commit status before completion.
