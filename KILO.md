# KILO.md

This file provides guidance to Kilo CLI when working with code in this repository.

## Project Overview

This is **Everything Kilo Code (EKC)** — a collection of production-ready agents, skills, commands, rules, and MCP configurations for Kilo CLI. Battle-tested workflows for software development evolved over 10+ months of intensive daily use.

## Running Tests

```bash
# Run all tests
node tests/run-all.js

# Run individual test files
node tests/lib/utils.test.js
node tests/lib/package-manager.test.js
```

## Architecture

The project is organized into several core components:

- **.kilo/agent/** — Specialized subagents for delegation (planner, code-reviewer, tdd-guide, etc.)
- **.kilo/skill/** — Workflow definitions and domain knowledge (coding standards, patterns, testing)
- **.kilo/command/** — Slash commands invoked by users (/tdd, /plan, /e2e, etc.)
- **.kilo/rules/** — Always-follow guidelines (security, coding style, testing requirements)
- **agents/** — Source agent files (ECC format, converted during install)
- **skills/** — Source skill files (ECC format, converted during install)
- **commands/** — Source command files (ECC format, converted during install)
- **rules/** — Source rule files
- **mcp-configs/** — MCP server configurations for external integrations
- **scripts/** — Install and utility scripts
- **manifests/** — Install module definitions

## Key Commands

- `/tdd` — Test-driven development workflow
- `/plan` — Implementation planning
- `/e2e` — Generate and run E2E tests
- `/code-review` — Quality review
- `/build-fix` — Fix build errors
- `/learn` — Extract patterns from sessions
- `/skill-create` — Generate skills from git history

## Kilo CLI Format Reference

### Agent Format
```yaml
---
description: Expert planning specialist for complex features.
mode: subagent
model: anthropic/claude-opus
hidden: false
---
System prompt for this agent.
```

### Command Format
```yaml
---
description: Create implementation plan.
---
Command body with $ARGUMENTS support.
```

### Skill Format
```yaml
---
name: skill-name
description: Use this skill when...
---
Skill body with workflow instructions.
```

### Config (kilo.jsonc)
- **instructions** — Glob patterns for rule files
- **skills.paths** — Directories containing skill SKILL.md files
- **mcp** — MCP server definitions (local/remote)

## Development Notes

- Kilo config location: `~/.config/kilo/kilo.jsonc`
- Agent dir: `~/.config/kilo/agent/` (singular)
- Command dir: `~/.config/kilo/command/` (singular)
- Skill dir: `~/.config/kilo/skill/` (singular)
- Rules loaded via `instructions` glob in kilo.jsonc

## Installation

```bash
# Full install
./install.sh --target kilo --profile full

# Language-specific
./install.sh --target kilo typescript php python
```

## Contributing

- Agents: Markdown with YAML frontmatter (description, mode, model)
- Skills: Clear sections with SKILL.md entry file
- Commands: Markdown with description frontmatter
- Rules: Markdown files organized by language

File naming: lowercase with hyphens (e.g., `python-reviewer.md`, `tdd-workflow.md`)
