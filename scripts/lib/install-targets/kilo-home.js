const { createInstallTargetAdapter, createManagedOperation, normalizeRelativePath } = require('./helpers');
const fs = require('fs');
const path = require('path');

module.exports = createInstallTargetAdapter({
  id: 'kilo-home',
  target: 'kilo',
  kind: 'home',
  rootSegments: ['.config', 'kilo'],
  installStatePathSegments: ['ecc-install-state.json'],
  nativeRootRelativePath: '.kilo-plugin',

  planOperations(input = {}, adapter) {
    const modules = Array.isArray(input.modules) ? input.modules : [];
    const operations = [];

    for (const module of modules) {
      const paths = Array.isArray(module.paths) ? module.paths : [];

      for (const sourceRelativePath of paths) {
        const normalizedSource = normalizeRelativePath(sourceRelativePath);
        const targetRoot = adapter.resolveRoot(input);

        if (normalizedSource === '.agents') {
          // .agents contains: AGENTS.md (agent), *.md files (agents), skills/ subdirectory
          const sourceRoot = path.join(input.repoRoot || '', '.agents');
          if (fs.existsSync(sourceRoot)) {
            const entries = fs.readdirSync(sourceRoot, { withFileTypes: true });
            for (const entry of entries) {
              const entryPath = path.join(sourceRoot, entry.name);
              if (entry.isFile() && entry.name.endsWith('.md')) {
                // *.md files (including AGENTS.md) → agent/*.md
                operations.push(createManagedOperation({
                  moduleId: module.id,
                  sourceRelativePath: path.join('.agents', entry.name),
                  destinationPath: path.join(targetRoot, 'agent', entry.name),
                  strategy: 'remap-copy',
                }));
              } else if (entry.isDirectory() && entry.name === 'skills') {
                // .agents/skills/* → skill/* (Kilo's singular skills directory)
                const skillsRoot = path.join(sourceRoot, 'skills');
                const skillDirs = fs.readdirSync(skillsRoot, { withFileTypes: true })
                  .filter(d => d.isDirectory());
                for (const dir of skillDirs) {
                  const skillPath = path.join(skillsRoot, dir.name);
                  const files = listMdFiles(skillPath);
                  for (const file of files) {
                    operations.push(createManagedOperation({
                      moduleId: module.id,
                      sourceRelativePath: path.join('.agents', 'skills', dir.name, file),
                      destinationPath: path.join(targetRoot, 'skill', dir.name, file),
                      strategy: 'remap-copy',
                    }));
                  }
                }
              }
            }
          }
        } else if (normalizedSource === 'agents') {
          // agents/*.md → agent/*.md (singular)
          const sourceRoot = path.join(input.repoRoot || '', 'agents');
          if (fs.existsSync(sourceRoot)) {
            const files = listMdFiles(sourceRoot);
            for (const file of files) {
              operations.push(createManagedOperation({
                moduleId: module.id,
                sourceRelativePath: path.join('agents', file),
                destinationPath: path.join(targetRoot, 'agent', file),
                strategy: 'remap-copy',
              }));
            }
          }
        } else if (normalizedSource === 'commands') {
          // commands/*.md → command/*.md (singular)
          const sourceRoot = path.join(input.repoRoot || '', 'commands');
          if (fs.existsSync(sourceRoot)) {
            const files = listMdFiles(sourceRoot);
            for (const file of files) {
              operations.push(createManagedOperation({
                moduleId: module.id,
                sourceRelativePath: path.join('commands', file),
                destinationPath: path.join(targetRoot, 'command', file),
                strategy: 'remap-copy',
              }));
            }
          }
        } else if (normalizedSource === 'skills') {
          // skills/*/SKILL.md → skill/*/SKILL.md (singular)
          const sourceRoot = path.join(input.repoRoot || '', 'skills');
          if (fs.existsSync(sourceRoot)) {
            const skillDirs = fs.readdirSync(sourceRoot, { withFileTypes: true })
              .filter(d => d.isDirectory());
            for (const dir of skillDirs) {
              const skillPath = path.join(sourceRoot, dir.name);
              const files = listMdFiles(skillPath);
              for (const file of files) {
                operations.push(createManagedOperation({
                  moduleId: module.id,
                  sourceRelativePath: path.join('skills', dir.name, file),
                  destinationPath: path.join(targetRoot, 'skill', dir.name, file),
                  strategy: 'remap-copy',
                }));
              }
            }
          }
        } else if (normalizedSource.startsWith('skills/')) {
          // Individual skill paths (e.g., skills/tdd-workflow) → skill/tdd-workflow
          const subPath = normalizedSource.slice('skills/'.length);
          operations.push(createManagedOperation({
            moduleId: module.id,
            sourceRelativePath: normalizedSource,
            destinationPath: path.join(targetRoot, 'skill', subPath),
            strategy: 'preserve-relative-path',
          }));
        } else if (normalizedSource === 'rules') {
          // rules/** → rules/** (same structure)
          operations.push(createManagedOperation({
            moduleId: module.id,
            sourceRelativePath: normalizedSource,
            destinationPath: path.join(targetRoot, 'rules'),
            strategy: 'preserve-relative-path',
          }));
        } else if (normalizedSource === 'mcp-configs') {
          // mcp-configs → mcp directory (merged into kilo.jsonc by post-install)
          operations.push(createManagedOperation({
            moduleId: module.id,
            sourceRelativePath: normalizedSource,
            destinationPath: path.join(targetRoot, 'mcp'),
            strategy: 'remap-copy',
          }));
        } else if (normalizedSource === 'AGENTS.md') {
          // Root AGENTS.md → agent/AGENTS.md
          operations.push(createManagedOperation({
            moduleId: module.id,
            sourceRelativePath: 'AGENTS.md',
            destinationPath: path.join(targetRoot, 'agent', 'AGENTS.md'),
            strategy: 'remap-copy',
          }));
        } else {
          // Default: preserve-relative-path under target root
          operations.push(adapter.createScaffoldOperation(module.id, normalizedSource, input));
        }
      }
    }

    return operations;
  },
});

function listMdFiles(dirPath) {
  const results = [];
  if (!fs.existsSync(dirPath)) return results;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(entry.name);
    } else if (entry.isDirectory()) {
      const subPath = path.join(dirPath, entry.name);
      const subFiles = listMdFiles(subPath);
      for (const subFile of subFiles) {
        results.push(path.join(entry.name, subFile));
      }
    }
  }
  return results;
}
