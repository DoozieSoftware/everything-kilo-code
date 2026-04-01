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
    const repoRoot = input.repoRoot || '';

    for (const module of modules) {
      const paths = Array.isArray(module.paths) ? module.paths : [];

      for (const sourceRelativePath of paths) {
        const normalizedSource = normalizeRelativePath(sourceRelativePath);
        const targetRoot = adapter.resolveRoot(input);

        if (normalizedSource === '.agents' || normalizedSource === 'agents') {
          // Use pre-converted .kilo/agent/ as source (Kilo format)
          const kiloAgentDir = path.join(repoRoot, '.kilo', 'agent');
          if (fs.existsSync(kiloAgentDir)) {
            const files = listMdFiles(kiloAgentDir);
            for (const file of files) {
              operations.push(createManagedOperation({
                moduleId: module.id,
                sourceRelativePath: path.join('.kilo', 'agent', file),
                destinationPath: path.join(targetRoot, 'agent', file),
                strategy: 'remap-copy',
              }));
            }
          }
        } else if (normalizedSource === 'commands') {
          // Use pre-converted .kilo/command/ as source (Kilo format)
          const kiloCommandDir = path.join(repoRoot, '.kilo', 'command');
          if (fs.existsSync(kiloCommandDir)) {
            const files = listMdFiles(kiloCommandDir);
            for (const file of files) {
              operations.push(createManagedOperation({
                moduleId: module.id,
                sourceRelativePath: path.join('.kilo', 'command', file),
                destinationPath: path.join(targetRoot, 'command', file),
                strategy: 'remap-copy',
              }));
            }
          }
        } else if (normalizedSource === 'skills') {
          // Use pre-converted .kilo/skill/ as source (Kilo format)
          const kiloSkillDir = path.join(repoRoot, '.kilo', 'skill');
          if (fs.existsSync(kiloSkillDir)) {
            const skillDirs = fs.readdirSync(kiloSkillDir, { withFileTypes: true })
              .filter(d => d.isDirectory());
            for (const dir of skillDirs) {
              const skillPath = path.join(kiloSkillDir, dir.name);
              const files = listMdFiles(skillPath);
              for (const file of files) {
                operations.push(createManagedOperation({
                  moduleId: module.id,
                  sourceRelativePath: path.join('.kilo', 'skill', dir.name, file),
                  destinationPath: path.join(targetRoot, 'skill', dir.name, file),
                  strategy: 'remap-copy',
                }));
              }
            }
          }
        } else if (normalizedSource.startsWith('skills/')) {
          // Individual skill: use .kilo/skill/<name> as source
          const subPath = normalizedSource.slice('skills/'.length);
          const kiloSkillPath = path.join(repoRoot, '.kilo', 'skill', subPath);
          if (fs.existsSync(kiloSkillPath)) {
            operations.push(createManagedOperation({
              moduleId: module.id,
              sourceRelativePath: path.join('.kilo', 'skill', subPath),
              destinationPath: path.join(targetRoot, 'skill', subPath),
              strategy: 'preserve-relative-path',
            }));
          }
        } else if (normalizedSource === 'rules') {
          // Use pre-converted .kilo/rules/ as source
          operations.push(createManagedOperation({
            moduleId: module.id,
            sourceRelativePath: path.join('.kilo', 'rules'),
            destinationPath: path.join(targetRoot, 'rules'),
            strategy: 'preserve-relative-path',
          }));
        } else if (normalizedSource === 'mcp-configs') {
          // mcp-configs → mcp directory
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
