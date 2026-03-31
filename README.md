# Everything Kilo Code (EKC)

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
![Shell](https://img.shields.io/badge/-Shell-4EAA25?logo=gnu-bash&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white)
![Go](https://img.shields.io/badge/-Go-00ADD8?logo=go&logoColor=white)
![Java](https://img.shields.io/badge/-Java-ED8B00?logo=openjdk&logoColor=white)
![PHP](https://img.shields.io/badge/-PHP-777BB4?logo=php&logoColor=white)
![Markdown](https://img.shields.io/badge/-Markdown-000000?logo=markdown&logoColor=white)

**The performance optimization system for Kilo CLI.**

Not just configs. A complete system: 30 agents, 136 skills, 60 commands, rules, and MCP configurations evolved over 10+ months of intensive daily use. Originally from [everything-claude-code](https://github.com/affaan-m/everything-claude-code), ported and adapted for [Kilo CLI](https://kilo.ai).

---

## Quick Start

```bash
# Clone
git clone https://github.com/DoozieSoftware/everything-kilo-code.git
cd everything-kilo-code

# Install dependencies
npm install

# Install for Kilo CLI (full)
./install.sh --target kilo --profile full

# Or install specific languages
./install.sh --target kilo typescript php python
```

This installs everything to `~/.config/kilo/`:

| Component | Location | Count |
|-----------|----------|-------|
| Agents | `~/.config/kilo/agent/*.md` | 30 |
| Commands | `~/.config/kilo/command/*.md` | 60 |
| Skills | `~/.config/kilo/skill/*/SKILL.md` | 136 |
| Rules | `~/.config/kilo/rules/{common,typescript,...}/` | 77 |
| MCP Config | `~/.config/kilo/kilo.jsonc` | 19 servers |

---

## What's Included

### Agents (30)

Specialized subagents for delegation:

| Agent | Purpose |
|-------|---------|
| `planner` | Feature planning, architectural changes |
| `architect` | System design decisions |
| `tdd-guide` | Test-driven development guidance |
| `code-reviewer` | Code quality and security review |
| `security-reviewer` | Vulnerability analysis |
| `build-error-resolver` | Fix build/compile errors |
| `e2e-runner` | Playwright E2E testing |
| `refactor-cleaner` | Dead code cleanup |
| `doc-updater` | Documentation sync |
| `docs-lookup` | API reference research |
| `database-reviewer` | Database/SQL review |
| `typescript-reviewer` | TypeScript/JavaScript review |
| `python-reviewer` | Python code review |
| `go-reviewer` / `go-build-resolver` | Go review and build fixes |
| `java-reviewer` / `java-build-resolver` | Java/Spring Boot |
| `kotlin-reviewer` / `kotlin-build-resolver` | Kotlin/Android |
| `rust-reviewer` / `rust-build-resolver` | Rust |
| `cpp-reviewer` / `cpp-build-resolver` | C++ |
| `pytorch-build-resolver` | PyTorch/CUDA training errors |
| `loop-operator` | Autonomous loop execution |
| `harness-optimizer` | Harness config tuning |

### Commands (60)

Slash commands for quick actions:

**Planning & Quality:**
`/plan`, `/tdd`, `/code-review`, `/build-fix`, `/refactor-clean`, `/verify`, `/checkpoint`, `/test-coverage`, `/e2e`, `/eval`

**Language-Specific:**
`/go-review`, `/go-test`, `/go-build`, `/python-review`, `/cpp-review`, `/cpp-build`, `/cpp-test`, `/kotlin-review`, `/kotlin-build`, `/kotlin-test`, `/rust-review`, `/rust-build`, `/rust-test`

**Learning & Memory:**
`/learn`, `/learn-eval`, `/evolve`, `/instinct-status`, `/instinct-import`, `/instinct-export`, `/prune`

**Session Management:**
`/sessions`, `/save-session`, `/resume-session`

**Documentation:**
`/update-docs`, `/update-codemaps`, `/docs`

**Multi-Agent:**
`/multi-plan`, `/multi-execute`, `/multi-backend`, `/multi-frontend`, `/multi-workflow`, `/orchestrate`

**Harness:**
`/harness-audit`, `/quality-gate`, `/model-route`, `/context-budget`, `/prompt-optimize`, `/loop-start`, `/loop-status`

### Skills (136)

Auto-activating domain workflows organized by category:

**Core:** `tdd-workflow`, `security-review`, `coding-standards`, `continuous-learning`, `verification-loop`, `eval-harness`, `search-first`, `autonomous-loops`

**Languages:** `typescript-*`, `python-*`, `golang-*`, `laravel-*`, `django-*`, `springboot-*`, `cpp-*`, `perl-*`, `swift-*`, `kotlin-*`, `rust-*`, `nuxt4-*`, `flutter-*`

**DevOps:** `deployment-patterns`, `docker-patterns`, `database-migrations`, `api-design`, `e2e-testing`, `postgres-patterns`

**Business:** `article-writing`, `content-engine`, `market-research`, `investor-materials`, `investor-outreach`

**AI/LLM:** `cost-aware-llm-pipeline`, `content-hash-cache-pattern`, `regex-vs-llm-structured-text`, `prompt-optimizer`

### MCP Servers (19)

3 enabled by default:
- `sequential-thinking` — Chain-of-thought reasoning
- `memory` — Persistent memory across sessions
- `context7` — Live documentation lookup

16 available (disabled, enable as needed): `github`, `firecrawl`, `supabase`, `playwright`, `exa-web-search`, `vercel`, `railway`, `cloudflare-docs`, `clickhouse`, `magic`, `filesystem`, `fal-ai`, `browserbase`, `token-optimizer`, `confluence`

---

## Kilo CLI Format

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
name: tdd-workflow
description: Use this skill when writing new features.
---
Skill body with workflow instructions.
```

### Configuration (kilo.jsonc)
```jsonc
{
  "instructions": ["rules/common/**/*.md", "rules/typescript/**/*.md"],
  "skills": { "paths": [".kilo/skill"] },
  "mcp": { "sequential-thinking": { "type": "local", "command": [...], "enabled": true } }
}
```

---

## Usage Examples

```
@planner Add user authentication
/tdd
/code-review src/services/
/build-fix
/plan
/verify
/learn
```

---

## Project Structure

```
everything-kilo-code/
├── .kilo/                    # Kilo CLI native directory
│   ├── agent/                # 30 agent definitions (Kilo format)
│   ├── command/              # 60 slash commands (Kilo format)
│   ├── skill/                # 136 skills (Kilo format)
│   └── rules/                # Rule files (common, typescript, php, ...)
├── agents/                   # Source agent files (ECC format)
├── commands/                 # Source command files (ECC format)
├── skills/                   # Source skill files (ECC format)
├── rules/                    # Source rule files
├── mcp-configs/              # MCP server definitions
├── manifests/                # Install module definitions
├── scripts/                  # Install and utility scripts
├── kilo.jsonc                # Kilo config template
├── AGENTS.md                 # Agent instructions
├── KILO.md                   # Project context for Kilo CLI
├── install.sh                # Installer (Linux/macOS)
└── install.ps1               # Installer (Windows)
```

---

## Updating

```bash
cd everything-kilo-code
git pull origin main
./install.sh --target kilo --profile full
```

---

## Credits

Forked from [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by [Affaan Mustafa](https://x.com/affaanmustafa). Adapted for Kilo CLI by [DoozieSoftware](https://github.com/DoozieSoftware).

## License

MIT — Use freely, modify as needed, contribute back if you can.
