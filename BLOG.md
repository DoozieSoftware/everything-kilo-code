# Introducing Everything Kilo Code (EKC): 30 Agents, 136 Skills, 60 Commands for Kilo CLI

*March 31, 2026*

We're excited to announce **Everything Kilo Code (EKC)** — a complete performance optimization system for [Kilo CLI](https://kilo.ai), forked and adapted from the wildly popular [everything-claude-code](https://github.com/affaan-m/everything-claude-code) project (50K+ stars).

**Repo:** [github.com/DoozieSoftware/everything-kilo-code](https://github.com/DoozieSoftware/everything-kilo-code)

---

## What Is EKC?

EKC is a production-ready collection of **30 specialized agents**, **136 domain skills**, **60 slash commands**, **76 coding rules**, and **19 MCP server configurations** — all natively adapted for Kilo CLI's directory structure and format.

Originally built over 10+ months by [Affaan Mustafa](https://x.com/affaanmustafa) (Anthropic Hackathon Winner) for Claude Code, we've ported and restructured the entire system to work seamlessly with Kilo CLI.

---

## What's Included

### 30 Specialized Agents

Delegate to expert subagents for specific tasks:

| Category | Agents |
|----------|--------|
| **Planning** | `planner`, `architect` |
| **Quality** | `code-reviewer`, `security-reviewer`, `tdd-guide` |
| **Build** | `build-error-resolver`, `go-build-resolver`, `java-build-resolver`, `kotlin-build-resolver`, `rust-build-resolver`, `cpp-build-resolver`, `pytorch-build-resolver` |
| **Language** | `typescript-reviewer`, `python-reviewer`, `go-reviewer`, `java-reviewer`, `kotlin-reviewer`, `rust-reviewer`, `cpp-reviewer` |
| **Workflow** | `e2e-runner`, `refactor-cleaner`, `doc-updater`, `docs-lookup`, `database-reviewer`, `loop-operator`, `harness-optimizer` |

### 136 Skills

Auto-activating workflows organized by domain:

- **Core:** TDD, security review, coding standards, continuous learning, verification loops
- **Languages:** TypeScript, Python, Go, Laravel, Django, Spring Boot, C++, Perl, Swift, Kotlin, Rust, Nuxt, Flutter
- **DevOps:** Deployment patterns, Docker, database migrations, API design, E2E testing, PostgreSQL
- **Business:** Article writing, content engine, market research, investor materials
- **AI/LLM:** Cost-aware pipelines, content-hash caching, prompt optimization

### 60 Slash Commands

```
/plan /tdd /code-review /build-fix /refactor-clean /verify /checkpoint
/e2e /eval /go-review /go-test /python-review /learn /learn-eval
/sessions /update-docs /harness-audit /quality-gate /model-route
/multi-plan /multi-execute /orchestrate ...and 37 more
```

### 19 MCP Servers

3 enabled by default (`sequential-thinking`, `memory`, `context7`), 16 available on demand — `github`, `playwright`, `firecrawl`, `exa-web-search`, `supabase`, `vercel`, `railway`, `cloudflare`, `clickhouse`, and more.

---

## Install in 30 Seconds

```bash
git clone https://github.com/DoozieSoftware/everything-kilo-code.git
cd everything-kilo-code && npm install
./install.sh --target kilo --profile full
```

This installs everything to `~/.config/kilo/`:

```
~/.config/kilo/
├── agent/      (30 agents)
├── command/    (60 commands)
├── skill/      (136 skills)
└── rules/      (76 rules)
```

**Language-specific install:**
```bash
./install.sh --target kilo typescript php python
```

---

## What Changed from the Original

We didn't just copy files — we adapted the entire system for Kilo CLI's native format:

| Original (ECC) | EKC |
|----------------|-----|
| `~/.claude/agents/` | `~/.config/kilo/agent/` (singular) |
| `~/.claude/commands/` | `~/.config/kilo/command/` (singular) |
| `~/.claude/skills/` | `~/.config/kilo/skill/` (singular) |
| Agent: `name`, `tools`, `model` | Agent: `description`, `mode`, `model` |
| Command: optional frontmatter | Command: `description` frontmatter |
| Skill: `name`, `description`, `origin` | Skill: `name`, `description` |
| Hooks system (8 event types) | Removed (not supported by Kilo) |
| Platform dirs (`.cursor/`, `.opencode/`, `.codex/`, etc.) | Removed — Kilo only |
| 1482-line README | Clean, focused README |

---

## Why Kilo CLI?

Kilo CLI brings a fresh approach to AI-assisted development:

- **Lightweight config** — Single `kilo.jsonc` for everything (MCP, skills, instructions, permissions)
- **Agent-first architecture** — Agents as first-class citizens with `mode`, `permission`, and `model` controls
- **Skills system** — Simple `SKILL.md` files with auto-activation based on context
- **No hooks overhead** — Cleaner, simpler mental model
- **Open ecosystem** — Works with any model provider

EKC brings 10+ months of battle-tested workflows to this platform.

---

## Credits

Forked from [everything-claude-code](https://github.com/affaan-m/everything-claude-code) by [Affaan Mustafa](https://x.com/affaanmustafa). Adapted for Kilo CLI by [DoozieSoftware](https://github.com/DoozieSoftware).

**License:** MIT

---

**Get started:** [github.com/DoozieSoftware/everything-kilo-code](https://github.com/DoozieSoftware/everything-kilo-code)
