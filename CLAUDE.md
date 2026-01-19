# CLAUDE.md

This file provides Claude Code with essential context about this project.

## Statement of Intent

**What This Project Does**:
JSON2Jinja is a web application that takes arbitrary JSON payloads, renders them as a browsable tree, allows users to select items from the JSON, converts the JSON representation to a Jinja template representation, and provides preview functionality. This is a complete ground-up rewrite using Next.js deployed to Netlify with git push auto-deploy.

**Why We're Using the Agentic Framework**:
We're using the Agentic Workflow Framework to maintain consistent development practices during this rewrite, leverage PM/Engineer workflows for task breakdown, and ensure quality with built-in checkpoints.

**Project Status**:
- 🟢 Active Development
- Started: 2026-01-18
- Current Phase: MVP Development (Migration from Namecheap)

## Project Overview

**JSON2Jinja** - Web app for converting JSON payloads to Jinja templates with interactive tree visualization and preview.

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **Templating**: Nunjucks (JavaScript Jinja2 port)
- **Hosting**: Netlify (git push auto-deploy)
- **Testing**: Jest/Vitest, React Testing Library
- **Linting**: ESLint with Next.js config

## Project Structure

```
JSON2Jinja/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Main page component
│   │   ├── globals.css         # Global styles (dark theme)
│   │   └── api/
│   │       └── render/
│   │           └── route.ts    # POST /api/render endpoint
│   ├── components/             # React components
│   │   ├── layout/             # Layout components
│   │   ├── json/               # JSON input components
│   │   ├── tree/               # Tree view components
│   │   ├── expression/         # Expression builder components
│   │   └── preview/            # Preview components
│   ├── context/                # React context providers
│   ├── lib/                    # Utility functions
│   │   ├── renderTemplate.ts   # Nunjucks wrapper
│   │   ├── jsonPath.ts         # Path-to-expression utilities
│   │   └── urlMasker.ts        # URL detection/masking
│   └── types/                  # TypeScript type definitions
├── public/                     # Static assets
├── docs/                       # Project documentation
│   └── REQUIREMENTS.md         # Full requirements spec
├── existing_project_archive/   # Original Flask app (reference only)
├── CLAUDE.md                   # This file
├── package.json
├── tsconfig.json
├── next.config.ts
├── netlify.toml                # Netlify deployment config
└── README.md
```

## Key Commands

```bash
# Development
npm run dev                              # Start dev server on localhost:3000

# Build & Production
npm run build                            # Create production build
npm run start                            # Start production server locally

# Testing
npm test                                 # Run tests
npm run test:coverage                    # Run tests with coverage

# Code Quality
npm run lint                             # Run ESLint

# Type Checking
npx tsc --noEmit                         # Run TypeScript compiler

# Installation
npm install                              # Install dependencies
```

## Environment Variables

No environment variables required - the application is entirely stateless and self-contained.

## Framework Integration

### About the Agentic Workflow Framework

This project uses the **Agentic Workflow Framework** which provides:
- PM persona for breaking down features into tasks
- Engineer persona for structured implementation workflow
- Built-in coding standards and review checklists
- Integration with Linear (task management)

**Framework Location**: `~/.agentic-framework/`

**See Also**: [FRAMEWORK_DEFINITION.md](~/.agentic-framework/FRAMEWORK_DEFINITION.md) for complete framework documentation

### Framework Boundaries - IMPORTANT

⚠️ **This project USES the framework; it does NOT modify it.**

**Control-Plane (Framework)**: The workflow commands, agent guidelines, and helper scripts live in the framework directory. These are infrastructure—use them, don't modify them during project work.

**Data-Plane (This Project)**: Your application code, tests, and this CLAUDE.md file. Modify freely as part of your project.

**The Golden Rule**: During project work, treat the framework as infrastructure. If you find framework limitations, note them for later improvement, but don't modify framework files mid-project.

**When to modify framework vs project**:
- Want to add a feature to THIS project → Modify project code (data-plane)
- Want to fix a workflow command that would help ALL projects → Use `/framework_improve` (control-plane)
- Unsure? Ask: "Would this change benefit someone building a completely different project?"
  - Yes → Framework work
  - No → Project work

See [FRAMEWORK_DEFINITION.md](~/.agentic-framework/FRAMEWORK_DEFINITION.md) for detailed boundary definitions.

## Working with This Project

### Before Starting Any Task

1. Run `/context_prime` to load agent guidelines
2. Understand the task scope and references
3. Review the existing_project_archive/ for current implementation patterns
4. Check for any project-specific setup requirements

### Task Workflow

Use `/work_task <TASK_ID>` to implement tasks following the 5-phase workflow:

1. **Retrieve**: Get task from PM system, review scope/acceptance criteria
2. **Plan**: Create implementation plan → **Human Checkpoint #1**
3. **Implement**: Write code following standards
4. **Verify**: Run tests, check criteria → **Human Checkpoint #2**
5. **Merge**: Commit, create PR, update PM system

### Important Patterns

**JSON2Jinja Patterns**:
- Reference existing_project_archive/ for current functionality to preserve
- Use React Context for state management (parsedJson, expressionText, preview)
- Nunjucks for template rendering (server-side in API route)
- Dark theme with two-panel layout

**Testing Patterns**:
- TDD: Write tests before implementation when possible
- Coverage target: >80%
- Test types: unit (utilities), component (React Testing Library), integration (user flows)

**Code Organization**:
- Components in src/components/ organized by feature
- Utilities in src/lib/ as pure functions
- Types in src/types/ for shared TypeScript interfaces
- Single API route for template rendering: /api/render

## MCP Tools Available

**Source of Truth**: See "Project Adapter Contract" section below for which MCP servers are active in this project.

## Project Adapter Contract

**Purpose**: This section declares which MCP servers, task management systems, documentation tools, languages, and tooling your project uses. This is the **source of truth** for the framework's commands.

---

### Adapter Config

```yaml
# Framework Mode
mode: lite  # full | lite

# PM System
pm_system: Linear
linear_team: Deedubyah
linear_project: JSON2Jinja

# Docs System (lite mode - no Obsidian)
docs_system: None
obsidian_vault: None
```

---

### PM System

**Active**: Linear MCP

---

### Docs/Notes System

**Active**: None

Lite mode - documentation handled manually as needed.

---

### Domain-Specific MCPs

**Active**: None required - Netlify deployment is handled via git push

---

### Languages & Tooling

**Primary Language**: TypeScript 5+

**Framework/Runtime**: Next.js 16+ with App Router, Node.js 20+

**Key Libraries**:
- React 19: UI framework
- Nunjucks: Template rendering (Jinja2-compatible)
- Tailwind CSS: Styling

---

### Test Commands

**Unit Tests**: `npm test -- --testPathPattern=unit`

**Integration Tests**: `npm test -- --testPathPattern=integration`

**All Tests**: `npm test`

**Coverage**: `npm run test:coverage`

---

### Lint & Format Tools

**Linter**: `npm run lint`

**Type Check**: `npx tsc --noEmit`

---

### Fallback Behavior

**When PM System is unavailable**:
- Present task breakdown to human for manual entry

**When Domain MCP is unavailable**:
- Present AWS resource info to human; you prefer running sam yourself anyway

**General Philosophy**: The framework should degrade gracefully. If an adapter isn't available, present the information to the human rather than failing.

---

## Human Review Checkpoints

This project requires human approval at these stages:
1. **After planning** (Checkpoint #1): Before any code is written
2. **After implementation** (Checkpoint #2): Before creating PR and merging

Never skip these checkpoints. They ensure quality and alignment.

## Project-Specific Details

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Netlify                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐     ┌─────────────────────────────┐   │
│  │   Static Pages  │     │   Serverless Functions      │   │
│  │   (Next.js SSG) │────▶│   (/api/render)             │   │
│  │                 │     │   - Nunjucks rendering      │   │
│  └─────────────────┘     └─────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
         │
         │ git push
         ▼
┌─────────────────┐
│     GitHub      │
│   Repository    │
└─────────────────┘
```

**Key Design Decisions**:
- Stateless architecture - no server-side session storage
- Single API route `/api/render` for Nunjucks template rendering
- React Context for client-side state management
- Git push auto-deploy to Netlify
- Dark theme, two-panel layout matching existing app

### Reference Implementation

The `existing_project_archive/` directory contains the original Flask implementation for reference:
- Review for feature parity
- Understand existing UX patterns
- DO NOT modify - read-only reference

## Testing Strategy

### Test Types

1. **Unit Tests** (`src/**/*.test.ts`)
   - Test utility functions (jsonPath, urlMasker, etc.)
   - Pure function testing with Jest/Vitest
   - Fast, focused tests

2. **Component Tests** (`src/**/*.test.tsx`)
   - Test React components with React Testing Library
   - Render, interact, assert
   - Mock context providers as needed

3. **Integration Tests** (`__tests__/integration/`)
   - Test full user flows (paste JSON → click tree → preview)
   - E2E-style testing of component interactions

### Coverage Requirements

- Minimum coverage: 80%
- Focus: All acceptance criteria from REQUIREMENTS.md
- How to check: `npm run test:coverage`

## Success Criteria

**Project Goals**:
- ✅ Feature parity with existing Flask app
- ✅ NEW: Array expression support (`{{ items }}` not `{{ items[0] }}`)
- ✅ Git push auto-deploy to Netlify
- ✅ Improved reliability (stateless, no hosting dependencies)
- ✅ Modern, maintainable codebase

**Quality Metrics**:
- Test coverage: >80%
- JSON parse: <500ms for 1MB payload
- Tree render: <1s for 1000 nodes
- UI response: <100ms

## Additional Resources

**Agentic Framework Resources**:
- Framework docs: `~/.agentic-framework/docs/agent_guidelines/`
- Linear helper: `~/.agentic-framework/scripts/linear_helpers.md`

**Project-Specific Resources**:
- existing_project_archive/ - Original Flask implementation (reference only)
- docs/REQUIREMENTS.md - Full requirements specification
- Next.js docs: https://nextjs.org/docs
- Nunjucks docs: https://mozilla.github.io/nunjucks/
- Netlify docs: https://docs.netlify.com/

## Quick Start for New Developers

1. **Clone and setup**:
   ```bash
   git clone [repository-url]
   cd JSON2Jinja
   npm install
   ```

2. **Review existing implementation** (for reference):
   ```bash
   ls existing_project_archive/
   # Understand current functionality
   ```

3. **Start development server**:
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

4. **Run tests**:
   ```bash
   npm test
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **First task**:
   - Review this CLAUDE.md file
   - Read docs/REQUIREMENTS.md
   - Run `/context_prime` to load agent guidelines
   - Check Linear for assigned tasks
   - Use `/work_task <ID>` to start your first task

## Notes and Reminders

**Important Notes**:
- The existing_project_archive/ is READ-ONLY reference - don't modify it
- Netlify deployment is automatic on git push to main
- Use Nunjucks (not Jinja2) - they're 99% compatible

**Key Differences from Original App**:
- Stateless design - no global server state like Flask's `current_data`
- Array expressions: clicking arrays outputs `{{ items }}` (full reference)
- Server-side template rendering via Next.js API route

---

**Last Updated**: 2026-01-18
**Primary Maintainer**: deedubyah
**Repository**: /home/deedubyah/Projects/JSON2Jinja
