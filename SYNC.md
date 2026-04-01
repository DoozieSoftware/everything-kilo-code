# Syncing Everything Kilo Code from Upstream

EKC is forked from [everything-claude-code](https://github.com/affaan-m/everything-claude-code) (ECC). This guide explains how to pull upstream changes and convert them to Kilo CLI format.

---

## Quick Reference

| Task | Command |
|------|---------|
| Add upstream remote | `git remote add upstream https://github.com/affaan-m/everything-claude-code.git` |
| Fetch upstream | `git fetch upstream` |
| See upstream changes | `git log --oneline upstream/main` |
| Diff upstream vs local | `git diff --stat upstream/main` |
| Cherry-pick commit | `git cherry-pick <hash>` |
| Convert new files | `node scripts/convert-to-kilo.js` |
| Reinstall | `./install.sh --target kilo --profile full` |

---

## Setup (One-Time)

```bash
cd everything-kilo-code
git remote add upstream https://github.com/affaan-m/everything-claude-code.git
git fetch upstream
```

---

## What Changes During Conversion

ECC uses Claude Code format. EKC uses Kilo CLI format. Here's what gets transformed:

### Agents

| ECC Format | Kilo Format |
|------------|-------------|
| `name: planner` | Filename = agent name |
| `description: ...` | `description: ...` |
| `tools: ["Read", "Grep"]` | Removed (Kilo uses permissions) |
| `model: opus` | `model: anthropic/claude-opus` |
| (no mode field) | `mode: subagent` |
| (no hidden field) | `hidden: false` |

**Source:** `agents/*.md` → **Target:** `.kilo/agent/*.md`

### Commands

| ECC Format | Kilo Format |
|------------|-------------|
| `name: plan` | Filename = command name |
| `description: ...` | `description: ...` |
| `command: true` | Removed |
| `agent: planner` | `agent: planner` |

**Source:** `commands/*.md` → **Target:** `.kilo/command/*.md`

### Skills

| ECC Format | Kilo Format |
|------------|-------------|
| `name: tdd-workflow` | `name: tdd-workflow` |
| `description: ...` | `description: ...` |
| `origin: ECC` | Removed |
| Entry file varies | Must be `SKILL.md` |

**Source:** `skills/*/SKILL.md` → **Target:** `.kilo/skill/*/SKILL.md`

### Rules

No format change. Direct copy.

**Source:** `rules/**` → **Target:** `.kilo/rules/**`

### Directory Names

| ECC | Kilo |
|-----|------|
| `agents/` | `agent/` (singular) |
| `commands/` | `command/` (singular) |
| `skills/` | `skill/` (singular) |
| `~/.claude/` | `~/.config/kilo/` |

---

## Syncing New Agents

1. Fetch upstream and check for new agents:
```bash
git fetch upstream
git diff --name-only upstream/main -- agents/
```

2. For each new agent file, create a Kilo version:
```bash
# Example: upstream added agents/new-agent.md
cat upstream/main:agents/new-agent.md

# Create Kilo version at .kilo/agent/new-agent.md
# - Remove 'name' field (filename is the name)
# - Remove 'tools' field
# - Rename 'model: opus' → 'model: anthropic/claude-opus'
# - Add 'mode: subagent'
# - Add 'hidden: false'
```

3. Reinstall:
```bash
./install.sh --target kilo --profile full
```

## Syncing New Commands

```bash
git diff --name-only upstream/main -- commands/

# Same process: remove 'name' and 'command' fields
# Copy to .kilo/command/
```

## Syncing New Skills

```bash
git diff --name-only upstream/main -- skills/

# For each new skill directory:
# 1. Copy to .kilo/skill/<name>/
# 2. Ensure entry file is SKILL.md
# 3. Remove 'origin' field from frontmatter
```

## Syncing Updated Rules

```bash
git diff --name-only upstream/main -- rules/

# Rules are format-compatible, direct copy:
cp -r upstream/rules/new-lang .kilo/rules/
```

---

## Full Sync Procedure

For a major upstream update with many changes:

```bash
# 1. Fetch upstream
git fetch upstream

# 2. Create sync branch
git checkout -b sync-upstream-$(date +%Y%m%d)

# 3. See what changed
git diff --stat upstream/main

# 4. Copy new/changed source files from upstream
git checkout upstream/main -- agents/new-agent.md
git checkout upstream/main -- commands/new-command.md
git checkout upstream/main -- skills/new-skill/

# 5. Convert to Kilo format
node scripts/convert-to-kilo.js

# 6. Verify conversion
head -8 .kilo/agent/new-agent.md  # Should have description/mode/model

# 7. Test install
./install.sh --target kilo --profile full

# 8. Commit
git add -A
git commit -m "Sync upstream: <summary of changes>"
git push origin sync-upstream-$(date +%Y%m%d)

# 9. Create PR
gh pr create --title "Sync upstream changes" --body "..."
```

---

## Handling Conflicts

If upstream renamed or restructured files:

1. Check if EKC already has the component in `.kilo/`
2. If yes, compare and update
3. If no, convert and add
4. If upstream deleted a file, keep EKC version unless explicitly removed

---

## Hooks (Not Supported)

ECC has a hooks system (`PreToolUse`, `PostToolUse`, etc.) that Kilo CLI does not support. If upstream adds new hooks:

- Skip them during sync
- Document any useful hook logic in relevant skill files instead

---

## Model Name Mapping

| ECC | Kilo |
|-----|------|
| `model: opus` | `model: anthropic/claude-opus` |
| `model: sonnet` | `model: anthropic/claude-sonnet` |
| `model: haiku` | `model: anthropic/claude-haiku` |

---

## Automation

For regular syncing, you can add this to your workflow:

```bash
# Weekly sync check
git fetch upstream
CHANGES=$(git diff --stat upstream/main | tail -1)
if [ "$CHANGES" != "0 files changed" ]; then
  echo "Upstream has $CHANGES"
  echo "Run: git diff --stat upstream/main"
fi
```
