# CLAUDE.md

This file provides Claude Code with essential context about this project.

## Statement of Intent

**What This Project Does**:
JSON2Jinja is a web application that takes arbitrary JSON payloads, renders them as a browsable tree, allows users to select items from the JSON, converts the JSON representation to a Jinja template representation, and provides preview functionality. This is a migration/modernization project - moving the existing Namecheap-hosted app to a more stable AWS Lambda + GitHub Pages architecture.

**Why We're Using the Agentic Framework**:
We're using the Agentic Workflow Framework to maintain consistent development practices during this migration, leverage PM/Engineer workflows for task breakdown, and ensure the transition from Namecheap to AWS/GitHub Pages is well-planned and executed with built-in checkpoints.

**Project Status**:
- 🟢 Active Development
- Started: 2026-01-18
- Current Phase: MVP Development (Migration from Namecheap)

## Project Overview

**JSON2Jinja** - Web app for converting JSON payloads to Jinja templates with interactive tree visualization and preview.

## Tech Stack

- **Frontend**: HTML/CSS/JavaScript (static site for GitHub Pages)
- **Backend**: AWS Lambda (Python) for processing logic
- **Storage**: AWS S3 (if needed for state/assets)
- **Infrastructure**: AWS CDK / CloudFormation, GitHub Pages
- **Testing**: pytest (Lambda), Jest/Playwright (frontend if applicable)
- **CI/CD**: GitHub Actions

## Project Structure

```
JSON2Jinja/
├── existing_project_archive/   # Current Namecheap-hosted app (reference)
├── frontend/                   # GitHub Pages static site
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
├── backend/                    # AWS Lambda functions
│   ├── src/
│   │   └── handlers/
│   ├── tests/
│   └── requirements.txt
├── infrastructure/             # AWS CDK/CloudFormation
│   ├── template.yaml          # SAM template
│   └── cdk/                   # Or CDK if preferred
├── docs/
│   └── agent_guidelines/
├── CLAUDE.md                   # This file
└── README.md
```

## Key Commands

```bash
# Development
# Frontend: Open index.html in browser or use local server
python -m http.server 8000 --directory frontend/

# Testing
pytest backend/tests/                    # Backend tests
# sam local invoke                       # Test Lambda locally

# Code Quality
ruff check backend/                      # Python linting
ruff format backend/                     # Python formatting

# Deployment (you prefer running sam yourself)
# sam build && sam deploy               # Deploy to AWS

# Installation
pip install -e "backend/[dev]"          # Backend deps
```

## Environment Variables

Required environment variables (for Lambda):

- `LOG_LEVEL` - Logging verbosity (default: INFO)

See `.env.example` for template (create if needed).

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
- Keep frontend static (GitHub Pages compatible - no server-side processing)
- Lambda functions should be stateless and focused

**Testing Patterns**:
- TDD: Write tests before implementation when possible
- Coverage target: >80%
- Test types: unit (Lambda logic), integration (API Gateway + Lambda)

**Code Organization**:
- Frontend: Vanilla JS preferred (minimal dependencies for GitHub Pages)
- Backend: Python handlers with clear separation of concerns
- Infrastructure: SAM or CDK templates in infrastructure/

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

**Active**:
- `AWS MCP` - For AWS infrastructure operations (Lambda, S3, API Gateway)

---

### Languages & Tooling

**Primary Language**: Python 3.11+ (Lambda), JavaScript (Frontend)

**Framework/Runtime**: AWS Lambda, Static HTML/JS (GitHub Pages)

**Key Libraries**:
- Jinja2: Template rendering (if used in Lambda)
- boto3: AWS SDK for Python

---

### Test Commands

**Unit Tests**: `pytest backend/tests/unit/`

**Integration Tests**: `pytest backend/tests/integration/`

**All Tests**: `pytest backend/tests/`

**Coverage**: `pytest --cov=backend/src --cov-report=html backend/tests/`

---

### Lint & Format Tools

**Linter**: `ruff check backend/`

**Formatter**: `ruff format backend/`

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
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  GitHub Pages   │────▶│  API Gateway    │────▶│  AWS Lambda     │
│  (Static Site)  │     │                 │     │  (Python)       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                                               │
        │                                               ▼
        │                                       ┌─────────────────┐
        │                                       │  S3 (optional)  │
        │                                       │  (assets/state) │
        └───────────────────────────────────────└─────────────────┘
```

**Key Design Decisions**:
- Frontend is purely static (GitHub Pages compatible)
- All dynamic processing happens in Lambda
- API Gateway provides REST endpoint for frontend to call
- No server-side rendering on the frontend

### Migration from Namecheap

The `existing_project_archive/` directory contains the current implementation. Key migration considerations:
- Identify which logic currently runs server-side on Namecheap
- Move that logic to AWS Lambda
- Keep frontend static and deployable to GitHub Pages
- Ensure feature parity with existing app

## Testing Strategy

### Test Types

1. **Unit Tests** (`backend/tests/unit/`)
   - Test Lambda handler logic in isolation
   - Mock AWS services
   - Fast, focused tests

2. **Integration Tests** (`backend/tests/integration/`)
   - Test Lambda with real/mocked API Gateway events
   - May use LocalStack or SAM local

### Coverage Requirements

- Minimum coverage: 80%
- Focus: All happy paths + critical error cases
- How to check: `pytest --cov=backend/src backend/tests/`

## Success Criteria

**Project Goals**:
- ✅ Feature parity with existing Namecheap app
- ✅ Static frontend deployable to GitHub Pages
- ✅ Backend processing via AWS Lambda
- ✅ Improved reliability (no more Namecheap update breakages)
- ✅ Clear separation of concerns

**Quality Metrics**:
- Test coverage: >80%
- Lighthouse score: >90 (frontend)
- Lambda cold start: <1s

## Additional Resources

**Agentic Framework Resources**:
- Framework docs: `~/.agentic-framework/docs/agent_guidelines/`
- Linear helper: `~/.agentic-framework/scripts/linear_helpers.md`
- MCP tools reference: `~/.agentic-framework/tools.md`

**Project-Specific Resources**:
- existing_project_archive/ - Current implementation reference
- AWS Lambda docs: https://docs.aws.amazon.com/lambda/
- GitHub Pages docs: https://pages.github.com/

## Quick Start for New Developers

1. **Clone and setup**:
   ```bash
   git clone [repository-url]
   cd JSON2Jinja
   ```

2. **Review existing implementation**:
   ```bash
   ls existing_project_archive/
   # Understand current functionality before migrating
   ```

3. **Install backend dependencies**:
   ```bash
   cd backend
   pip install -e ".[dev]"
   ```

4. **Run tests**:
   ```bash
   pytest backend/tests/
   ```

5. **Start frontend locally**:
   ```bash
   python -m http.server 8000 --directory frontend/
   ```

6. **First task**:
   - Review this CLAUDE.md file
   - Run `/context_prime` to load agent guidelines
   - Check Linear for assigned tasks
   - Use `/work_task <ID>` to start your first task

## Notes and Reminders

**Important Notes**:
- The existing_project_archive/ is READ-ONLY reference - don't modify it
- You prefer running sam yourself - Claude should prepare templates but not auto-deploy
- GitHub Pages has limitations - no server-side code, be mindful of CORS

**Migration Gotchas**:
- CORS must be configured on API Gateway for GitHub Pages to call Lambda
- Secrets (if any) must use AWS Secrets Manager, not environment files
- Static assets may need to be served from S3 with CloudFront for performance

---

**Last Updated**: 2026-01-18
**Primary Maintainer**: deedubyah
**Repository**: /home/deedubyah/Projects/JSON2Jinja
