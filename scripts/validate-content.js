#!/usr/bin/env node

/**
 * Content Validation Script for Physical AI Book
 * Validates cross-references, links, and content integrity
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Configuration
const DOCS_DIR = path.join(__dirname, '..', 'docs');
const VALIDATION_RULES = {
  // Internal cross-reference patterns
  internalRefs: [
    /\[([^\]]+)\]\(([^)]+)\)/g, // Markdown links
    /\[([^\]]+)\]:\s*(.+)/g, // Reference-style links
  ],
  // External link patterns that should be validated
  externalRefs: [
    /https?:\/\/[^\s)]+/g,
  ],
  // Required frontmatter fields
  requiredFrontmatter: ['sidebar_label'],
  // Forbidden patterns
  forbiddenPatterns: [
    /\b(TODO|FIXME|HACK)\b/gi, // Development markers
    /\[NEEDS CLARIFICATION\]/gi, // Unresolved clarifications
  ],
};

// Utility functions
function readMarkdownFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return null;
  }
}

function extractFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return {};

  const frontmatter = {};
  const lines = frontmatterMatch[1].split('\n');

  for (const line of lines) {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      frontmatter[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
    }
  }

  return frontmatter;
}

function validateFrontmatter(filePath, content) {
  const frontmatter = extractFrontmatter(content);
  const errors = [];

  for (const field of VALIDATION_RULES.requiredFrontmatter) {
    if (!frontmatter[field]) {
      errors.push(`Missing required frontmatter field: ${field}`);
    }
  }

  return errors;
}

function validateLinks(content) {
  const errors = [];
  const links = [];

  // Extract all links
  for (const pattern of VALIDATION_RULES.internalRefs) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      links.push({
        text: match[1],
        url: match[2] || match[1],
        type: 'internal'
      });
    }
  }

  for (const pattern of VALIDATION_RULES.externalRefs) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      if (!content.includes(`](${match[0]})`) && !content.includes(`${match[0]}: `)) {
        links.push({
          url: match[0],
          type: 'external'
        });
      }
    }
  }

  // Validate internal references (basic check for file existence)
  for (const link of links.filter(l => l.type === 'internal')) {
    if (link.url.startsWith('./') || link.url.startsWith('../') || !link.url.includes('://')) {
      const linkPath = path.resolve(path.dirname(filePath), link.url);
      if (!fs.existsSync(linkPath) && !fs.existsSync(linkPath + '.md')) {
        errors.push(`Broken internal link: ${link.url}`);
      }
    }
  }

  return errors;
}

function validateContent(content) {
  const errors = [];

  for (const pattern of VALIDATION_RULES.forbiddenPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      errors.push(`Found forbidden pattern: ${matches[0]}`);
    }
  }

  return errors;
}

async function validateFile(filePath) {
  const content = readMarkdownFile(filePath);
  if (!content) return { file: filePath, valid: false, errors: ['Could not read file'] };

  const errors = [
    ...validateFrontmatter(filePath, content),
    ...validateLinks(content),
    ...validateContent(content),
  ];

  return {
    file: filePath,
    valid: errors.length === 0,
    errors,
  };
}

async function main() {
  console.log('🔍 Validating Physical AI Book content...\n');

  // Find all markdown files in docs directory
  const markdownFiles = await glob('docs/**/*.md', {
    cwd: path.dirname(DOCS_DIR),
  });

  const results = [];
  let totalErrors = 0;

  for (const file of markdownFiles) {
    const filePath = path.join(path.dirname(DOCS_DIR), file);
    const result = await validateFile(filePath);
    results.push(result);

    if (!result.valid) {
      console.log(`❌ ${path.relative(process.cwd(), filePath)}`);
      result.errors.forEach(error => {
        console.log(`   • ${error}`);
        totalErrors++;
      });
    } else {
      console.log(`✅ ${path.relative(process.cwd(), filePath)}`);
    }
  }

  console.log(`\n📊 Validation Summary:`);
  console.log(`   Files checked: ${results.length}`);
  console.log(`   Valid files: ${results.filter(r => r.valid).length}`);
  console.log(`   Files with errors: ${results.filter(r => !r.valid).length}`);
  console.log(`   Total errors: ${totalErrors}`);

  if (totalErrors > 0) {
    console.log('\n❌ Content validation failed');
    process.exit(1);
  } else {
    console.log('\n✅ All content validation passed');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { validateFile, validateFrontmatter, validateLinks, validateContent };
