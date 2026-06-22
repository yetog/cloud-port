#!/usr/bin/env node
/**
 * Persona Builder for Portfolio
 *
 * Generates Claude Code compatible persona files from YAML + Markdown sources.
 * Based on Sebastian Mordziol's AI Insights architecture.
 *
 * Usage:
 *   node build-personas.js          # Build all personas
 *   node build-personas.js --check  # Check without writing
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const SRC_DIR = path.join(__dirname, 'src');
const META_DIR = path.join(SRC_DIR, 'meta');
const CONTENT_DIR = path.join(SRC_DIR, 'content');
const CLAUDE_CODE_DIR = path.join(__dirname, 'claude-code');
const VS_CODE_DIR = path.join(__dirname, 'vs-code');

// Ensure output directories exist
[CLAUDE_CODE_DIR, VS_CODE_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Load shared metadata
function loadSharedMeta() {
    const sharedPath = path.join(META_DIR, '_shared.yaml');
    if (fs.existsSync(sharedPath)) {
        return yaml.load(fs.readFileSync(sharedPath, 'utf8'));
    }
    return {};
}

// Load persona metadata
function loadPersonaMeta(filename) {
    const metaPath = path.join(META_DIR, filename);
    return yaml.load(fs.readFileSync(metaPath, 'utf8'));
}

// Load persona content
function loadPersonaContent(slug) {
    const contentPath = path.join(CONTENT_DIR, `${slug.replace('-standalone', '')}.md`);
    if (fs.existsSync(contentPath)) {
        return fs.readFileSync(contentPath, 'utf8');
    }
    // Try without suffix
    const baseName = slug.split('-')[0];
    const altPath = path.join(CONTENT_DIR, `${baseName}.md`);
    if (fs.existsSync(altPath)) {
        return fs.readFileSync(altPath, 'utf8');
    }
    return `# ${slug}\n\nNo content file found.`;
}

// Generate Claude Code format
function generateClaudeCode(meta, content, sharedMeta) {
    const tools = meta.cc_tools || meta.tools || [];
    const toolsSection = tools.length > 0
        ? `## Tools Available\n\n${tools.map(t => `- ${t}`).join('\n')}\n\n`
        : '';

    const version = meta.changelog
        ? meta.changelog.split('\n')[0].match(/^(\d+\.\d+\.\d+)/)?.[1] || '1.0.0'
        : '1.0.0';

    return `---
name: "${meta.name}"
description: "${meta.description}"
version: "${version}"
---

${toolsSection}${content}
`;
}

// Generate VS Code format
function generateVSCode(meta, content, sharedMeta) {
    const tools = meta.tools || [];
    const toolsYaml = tools.length > 0
        ? `tools:\n${tools.map(t => `  - ${t}`).join('\n')}\n`
        : '';

    return `---
name: "${meta.name}"
description: "${meta.description}"
${toolsYaml}---

${content}
`;
}

// Main build function
function build(checkOnly = false) {
    const sharedMeta = loadSharedMeta();
    const metaFiles = fs.readdirSync(META_DIR).filter(f => f.endsWith('.yaml') && !f.startsWith('_'));

    let built = 0;
    let errors = [];

    console.log(`\nBuilding ${metaFiles.length} persona(s)...\n`);

    for (const metaFile of metaFiles) {
        try {
            const meta = loadPersonaMeta(metaFile);
            const slug = meta.slug || metaFile.replace('.yaml', '');
            const content = loadPersonaContent(slug);

            // Generate Claude Code version
            const ccOutput = generateClaudeCode(meta, content, sharedMeta);
            const ccFilename = meta.cc_file_name || `${slug}.md`;
            const ccPath = path.join(CLAUDE_CODE_DIR, ccFilename);

            // Generate VS Code version
            const vsOutput = generateVSCode(meta, content, sharedMeta);
            const vsFilename = meta.vs_file_name || `${slug}.agent.md`;
            const vsPath = path.join(VS_CODE_DIR, vsFilename);

            if (!checkOnly) {
                fs.writeFileSync(ccPath, ccOutput);
                fs.writeFileSync(vsPath, vsOutput);
                console.log(`  ✓ ${meta.name}`);
                console.log(`    → ${ccFilename} (Claude Code)`);
                console.log(`    → ${vsFilename} (VS Code)`);
            } else {
                console.log(`  [check] ${meta.name}`);
            }

            built++;
        } catch (err) {
            errors.push({ file: metaFile, error: err.message });
            console.log(`  ✗ ${metaFile}: ${err.message}`);
        }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`Built: ${built} | Errors: ${errors.length}`);

    if (errors.length > 0) {
        console.log('\nErrors:');
        errors.forEach(e => console.log(`  - ${e.file}: ${e.error}`));
        process.exit(1);
    }

    console.log(`\nOutput directories:`);
    console.log(`  Claude Code: ${CLAUDE_CODE_DIR}`);
    console.log(`  VS Code: ${VS_CODE_DIR}`);
}

// Run
const checkOnly = process.argv.includes('--check');
build(checkOnly);
