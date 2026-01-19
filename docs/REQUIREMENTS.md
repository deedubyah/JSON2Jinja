# JSON2Jinja Requirements Document

**Version:** 1.0
**Date:** 2026-01-18
**Status:** Draft

---

## 1. Executive Summary

JSON2Jinja is a web application that enables users to build Jinja2 template expressions by visually navigating JSON data structures. Users paste JSON, explore it via a collapsible tree view, click on nodes to insert Jinja2 expressions into a text editor, and preview rendered output.

This document defines requirements for a complete ground-up rewrite, migrating from Flask to Next.js with Netlify deployment.

---

## 2. Functional Requirements

### 2.1 JSON Input (FR-001)

| ID | Requirement |
|----|-------------|
| FR-001.1 | The application SHALL provide a text area for users to paste or type JSON data |
| FR-001.2 | The application SHALL validate JSON syntax on user action (parse button click) |
| FR-001.3 | The application SHALL display clear, user-friendly error messages for invalid JSON, including the specific parse error |
| FR-001.4 | The application SHALL preserve the original JSON input text in the input area after parsing |
| FR-001.5 | The application SHALL accept arbitrarily nested JSON structures (objects and arrays) |

### 2.2 Tree View Display (FR-002)

| ID | Requirement |
|----|-------------|
| FR-002.1 | The application SHALL render valid JSON as a hierarchical, browsable tree structure |
| FR-002.2 | The application SHALL display object keys as node labels |
| FR-002.3 | The application SHALL display array indices as node labels (e.g., `0`, `1`, `2`) |
| FR-002.4 | The application SHALL display primitive values (strings, numbers, booleans, null) alongside their keys |
| FR-002.5 | The application SHALL visually distinguish expandable nodes (objects/arrays) from leaf nodes (primitives) |
| FR-002.6 | The application SHALL display top-level nodes expanded by default |
| FR-002.7 | The application SHALL collapse all nested nodes by default |
| FR-002.8 | The application SHALL mask URL values in the tree display (replace with placeholder like "URL") for readability |

### 2.3 Tree View Interaction (FR-003)

| ID | Requirement |
|----|-------------|
| FR-003.1 | The application SHALL allow users to expand collapsed nodes by clicking on them |
| FR-003.2 | The application SHALL allow users to collapse expanded nodes by clicking on them |
| FR-003.3 | When collapsing a node, the application SHALL also collapse all of its descendant nodes |
| FR-003.4 | The application SHALL provide visual indication of expand/collapse state (e.g., arrow rotation) |
| FR-003.5 | Clicking on a leaf node (primitive value) SHALL insert a Jinja2 expression into the expression builder |
| FR-003.6 | **NEW:** Clicking on an array node SHALL insert a Jinja2 expression referencing the full array (e.g., `{{ items }}`) NOT an indexed reference (e.g., `{{ items[0] }}`) |
| FR-003.7 | **NEW:** Clicking on an object node SHALL insert a Jinja2 expression referencing the full object |

### 2.4 Expression Builder (FR-004)

| ID | Requirement |
|----|-------------|
| FR-004.1 | The application SHALL provide a text area for building Jinja2 template expressions |
| FR-004.2 | The application SHALL allow free-form text entry (not just Jinja expressions) |
| FR-004.3 | When a tree node is clicked, the application SHALL insert the corresponding Jinja2 expression at the current cursor position |
| FR-004.4 | The application SHALL use dot notation for expression paths (e.g., `{{ user.address.city }}`) |
| FR-004.5 | The application SHALL use bracket notation for array indices (e.g., `{{ items[0].name }}`) |
| FR-004.6 | The application SHALL properly format expressions with spaces inside braces (e.g., `{{ path }}` not `{{path}}`) |
| FR-004.7 | Inserted expressions SHALL NOT replace selected text; they SHALL be inserted at the cursor position |
| FR-004.8 | After insertion, the cursor SHALL be positioned immediately after the inserted expression |
| FR-004.9 | The expression area SHALL maintain focus after insertion |

### 2.5 Clipboard Operations (FR-005)

| ID | Requirement |
|----|-------------|
| FR-005.1 | The application SHALL provide a "Copy to Clipboard" button |
| FR-005.2 | Clicking "Copy to Clipboard" SHALL copy the entire contents of the expression builder to the system clipboard |
| FR-005.3 | The application SHALL provide visual feedback when copy is successful (e.g., button text changes to "Copied!") |

### 2.6 Template Preview/Render (FR-006)

| ID | Requirement |
|----|-------------|
| FR-006.1 | The application SHALL provide a "Test Template" button |
| FR-006.2 | Clicking "Test Template" SHALL render the expression builder contents as a Jinja2/Nunjucks template |
| FR-006.3 | Template rendering SHALL use the currently parsed JSON data as the context |
| FR-006.4 | The application SHALL display the rendered output in a dedicated preview area |
| FR-006.5 | The application SHALL display template rendering errors clearly in a dedicated error area |
| FR-006.6 | Successful render SHALL clear any previous error messages |
| FR-006.7 | Error display SHALL clear any previous successful render output |

### 2.7 Reset Functionality (FR-007)

| ID | Requirement |
|----|-------------|
| FR-007.1 | The application SHALL provide a "Reset" button |
| FR-007.2 | Clicking "Reset" SHALL clear the expression builder text area |
| FR-007.3 | Clicking "Reset" SHALL clear the preview output area |
| FR-007.4 | Clicking "Reset" SHALL clear any error messages |
| FR-007.5 | Clicking "Reset" SHALL NOT clear the JSON input or tree view |
| FR-007.6 | After reset, focus SHALL return to the expression builder |

---

## 3. Non-Functional Requirements

### 3.1 Performance (NFR-001)

| ID | Requirement |
|----|-------------|
| NFR-001.1 | JSON parsing SHALL complete within 500ms for payloads up to 1MB |
| NFR-001.2 | Tree view rendering SHALL complete within 1 second for JSON with up to 1000 nodes |
| NFR-001.3 | Template preview rendering SHALL complete within 2 seconds |
| NFR-001.4 | UI interactions (expand/collapse, click-to-insert) SHALL respond within 100ms |

### 3.2 Reliability (NFR-002)

| ID | Requirement |
|----|-------------|
| NFR-002.1 | The application SHALL be stateless (no server-side session storage required) |
| NFR-002.2 | The application SHALL gracefully handle malformed JSON without crashing |
| NFR-002.3 | The application SHALL gracefully handle invalid Jinja2 templates without crashing |
| NFR-002.4 | The application SHALL function correctly after page refresh (no stale state) |

### 3.3 Usability (NFR-003)

| ID | Requirement |
|----|-------------|
| NFR-003.1 | The application SHALL use a dark theme consistent with the existing design |
| NFR-003.2 | The application SHALL use a two-panel layout (JSON/Tree on left, Expression Builder on right) |
| NFR-003.3 | The application SHALL use monospace fonts for JSON input, expression builder, and preview areas |
| NFR-003.4 | The application SHALL be usable on desktop browsers (minimum 1024px viewport width) |
| NFR-003.5 | All interactive elements SHALL have visible hover states |
| NFR-003.6 | Error messages SHALL be displayed in red/warning colors |

### 3.4 Compatibility (NFR-004)

| ID | Requirement |
|----|-------------|
| NFR-004.1 | The application SHALL support the latest versions of Chrome, Firefox, Safari, and Edge |
| NFR-004.2 | Nunjucks template syntax SHALL be 99%+ compatible with Jinja2 for common use cases |
| NFR-004.3 | The application SHALL support standard Jinja2 features: variable output, filters, conditionals, loops |

### 3.5 Deployment (NFR-005)

| ID | Requirement |
|----|-------------|
| NFR-005.1 | The application SHALL be deployable to Netlify |
| NFR-005.2 | The application SHALL support automatic deployment via git push |
| NFR-005.3 | The application SHALL use Next.js framework with API routes |
| NFR-005.4 | The application SHALL not require external database or persistent storage |

---

## 4. Acceptance Criteria

### 4.1 JSON Input

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| AC-001 | Paste valid JSON `{"name": "test"}` and click Parse | Tree displays with "name: test" node |
| AC-002 | Paste invalid JSON `{name: test}` and click Parse | Error message displays indicating invalid JSON |
| AC-003 | Paste deeply nested JSON (5+ levels) and click Parse | All levels render correctly in tree |
| AC-004 | Paste JSON with arrays and click Parse | Array indices display as node labels |

### 4.2 Tree View

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| AC-005 | Parse JSON with nested objects | Top-level nodes visible, nested nodes collapsed |
| AC-006 | Click on collapsed object node | Node expands showing children |
| AC-007 | Click on expanded object node | Node collapses, all descendants also collapse |
| AC-008 | Parse JSON with URL value | URL is masked in display |

### 4.3 Expression Building

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| AC-009 | Click on primitive leaf node `user.name` | `{{ user.name }}` inserted at cursor |
| AC-010 | Type "Hello ", then click on `name` node | Text area contains "Hello {{ name }}" |
| AC-011 | Click on array node `items` | `{{ items }}` inserted (NOT `{{ items[0] }}`) |
| AC-012 | Click on `items[0].id` path | `{{ items.0.id }}` or `{{ items[0].id }}` inserted |
| AC-013 | Position cursor mid-text, click node | Expression inserted at cursor position |

### 4.4 Template Preview

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| AC-014 | Enter `{{ name }}` with JSON `{"name": "Alice"}`, click Test | Preview shows "Alice" |
| AC-015 | Enter "Hello {{ name }}!" with JSON `{"name": "World"}`, click Test | Preview shows "Hello World!" |
| AC-016 | Enter `{{ invalid }}` (undefined variable), click Test | Error message displays |
| AC-017 | Enter `{{ items }}` with JSON `{"items": [1,2,3]}`, click Test | Preview shows "[1, 2, 3]" or similar array representation |

### 4.5 Other Functions

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| AC-018 | Enter text in expression builder, click Copy | Text copied to clipboard, "Copied!" feedback shown |
| AC-019 | Enter text, click Reset | Expression builder cleared, preview cleared, JSON intact |

---

## 5. Out of Scope

The following features are explicitly NOT part of this project:

| Item | Rationale |
|------|-----------|
| Cloud saving/loading of templates | Keep it simple - single session tool |
| Template library/presets | Out of scope for MVP |
| Multiple JSON sources | Single JSON input is sufficient |
| User authentication/accounts | No persistence needed |
| Mobile-responsive design | Desktop tool only |
| Syntax highlighting in expression builder | Nice-to-have, not required |
| Jinja2 control structures in tree (for loops, if statements) | Users type these manually |
| JSON schema validation | Accept any valid JSON |
| Export to file functionality | Copy to clipboard is sufficient |
| Undo/redo functionality | Browser default is acceptable |
| Collaborative editing | Single-user tool |
| Dark/light theme toggle | Dark theme only |
| Internationalization (i18n) | English only |
| Offline/PWA support | Online-only is acceptable |

---

## 6. Risks and Assumptions

### 6.1 Assumptions

| ID | Assumption |
|----|------------|
| A-001 | Users have modern desktop browsers with JavaScript enabled |
| A-002 | Users understand basic Jinja2/template syntax |
| A-003 | JSON payloads will typically be under 1MB |
| A-004 | Nunjucks compatibility with Jinja2 is sufficient for user needs |
| A-005 | Users will manually add Jinja2 control structures (for loops, conditionals) |
| A-006 | Consuming systems can handle array expressions like `{{ items }}` appropriately |
| A-007 | Netlify free tier is sufficient for expected traffic |

### 6.2 Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|------------|--------|------------|
| R-001 | Nunjucks differs from Jinja2 in edge cases | Medium | Medium | Document known differences; test common patterns |
| R-002 | Large JSON payloads cause performance issues | Low | Medium | Implement lazy rendering for very large trees |
| R-003 | Complex nested structures confuse users | Low | Low | Clear visual hierarchy; expand/collapse UX |
| R-004 | Netlify serverless function cold starts | Medium | Low | Keep API routes lightweight; consider edge functions |
| R-005 | Users expect features from existing app that weren't documented | Medium | Medium | Thorough testing against existing app behavior |

### 6.3 Dependencies

| ID | Dependency | Notes |
|----|------------|-------|
| D-001 | Next.js framework | Required for API routes and React components |
| D-002 | Nunjucks library | JavaScript Jinja2 implementation |
| D-003 | Netlify hosting | Deployment platform with git integration |
| D-004 | Node.js runtime | For Next.js and build tooling |

---

## 7. Technical Notes

### 7.1 Existing Behavior Reference

From analysis of the existing Flask application:

1. **JSON Storage**: Currently uses server-side global variable `current_data` - new implementation should be stateless (pass JSON with each render request or handle client-side)

2. **URL Masking**: Existing app replaces URLs with `"->URL-HERE<--"` in tree display

3. **Expression Format**: Uses `{{ path.to.value }}` format with spaces inside braces

4. **Tree Rendering**: Recursive function handles objects and arrays uniformly, using keys/indices as labels

5. **API Endpoints**:
   - `POST /parse_json` - Accepts JSON, stores server-side
   - `POST /test_template` - Accepts template string, renders against stored JSON

### 7.2 New Array Expression Behavior

**Current behavior (to be changed):**
- Clicking array items inserts indexed access: `{{ items[0].field }}`

**New behavior (required):**
- Clicking on an array node itself inserts: `{{ items }}`
- Clicking on array item primitive still inserts: `{{ items.0.field }}` or `{{ items[0].field }}`
- This allows consuming systems to iterate over the array as needed

---

## 8. Appendix

### 8.1 Glossary

| Term | Definition |
|------|------------|
| Jinja2 | Python templating engine with `{{ variable }}` syntax |
| Nunjucks | JavaScript port of Jinja2, near 100% syntax compatible |
| Expression | A Jinja2 variable reference like `{{ user.name }}` |
| Leaf node | A JSON value that is a primitive (string, number, boolean, null) |
| Branch node | A JSON value that is an object or array |

### 8.2 Reference Files

- Existing Flask app: `/home/deedubyah/Projects/JSON2Jinja/existing_project_archive/app.py`
- Existing UI template: `/home/deedubyah/Projects/JSON2Jinja/existing_project_archive/templates/index.html`
- Existing styles: `/home/deedubyah/Projects/JSON2Jinja/existing_project_archive/static/style.css`
