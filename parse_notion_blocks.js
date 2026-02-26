const fs = require('fs');

const filePath = 'C:/Users/motok/.claude/projects/C--Users-motok-Desktop-JC/f5e75eba-2638-49b7-977f-438d4d7c2d0d/tool-results/mcp-notion-API-get-block-children-1771508019371.txt';

try {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(fileContent);

  if (!data.results) {
    console.log('No results found');
    process.exit(1);
  }

  let output = '';
  output += `═══════════════════════════════════════════════════════════════\n`;
  output += `PAGINA 362GRADI - ELENCO BLOCCHI (${data.results.length} blocchi totali)\n`;
  output += `═══════════════════════════════════════════════════════════════\n\n`;

  data.results.forEach((block, i) => {
    const type = block.type;
    let content = '';

    // Extract content based on type
    if (block[type]) {
      if (block[type].rich_text && Array.isArray(block[type].rich_text)) {
        content = block[type].rich_text
          .map(t => t.plain_text || '')
          .join('')
          .substring(0, 75)
          .trim();
      }
    }

    // Special handling for certain types
    if (type === 'child_page') {
      content = 'Page: ' + (block.child_page?.title || 'Untitled');
    } else if (type === 'image') {
      content = '[Image]';
    } else if (type === 'divider') {
      content = '────────────────────';
    } else if (type === 'table') {
      content = '[Table]';
    } else if (type === 'column_list') {
      content = '[Column Layout]';
    }

    const num = String(i + 1).padStart(3);
    const typeStr = type.padEnd(22);
    output += `${num}. [${typeStr}] ${content}\n`;
  });

  output += `\n═══════════════════════════════════════════════════════════════\n`;
  console.log(output);
} catch (e) {
  console.error('Error:', e.message);
  process.exit(1);
}
