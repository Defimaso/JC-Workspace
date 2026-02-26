const fs = require('fs');
const path = '/c/Users/motok/.claude/projects/C--Users-motok-Desktop-JC/f5e75eba-2638-49b7-977f-438d4d7c2d0d/tool-results/mcp-notion-API-get-block-children-1771508019371.txt';

try {
  const data = JSON.parse(fs.readFileSync(path, 'utf-8'));
  
  if (data.results) {
    console.log(`═══════════════════════════════════════════════════════════════`);
    console.log(`PAGINA 362GRADI - ELENCO BLOCCHI (${data.results.length} blocchi totali)`);
    console.log(`═══════════════════════════════════════════════════════════════\n`);
    
    data.results.forEach((block, i) => {
      const type = block.type;
      let content = '';
      
      // Extract content based on block type
      if (block[type]) {
        if (block[type].rich_text && Array.isArray(block[type].rich_text)) {
          content = block[type].rich_text.map(t => t.plain_text || '').join('').substring(0, 70);
        } else if (block[type].title) {
          content = block[type].title;
        }
      }
      
      if (type === 'child_page') {
        content = `Page: ${block.child_page?.title || 'Untitled'}`;
      } else if (type === 'image') {
        content = `[Image]`;
      } else if (type === 'divider') {
        content = '───────────';
      } else if (type === 'table') {
        content = '[Table]';
      } else if (type === 'column_list') {
        content = '[Column Layout]';
      }
      
      const num = (i + 1).toString().padStart(3);
      const typeStr = type.padEnd(20);
      console.log(`${num}. [${typeStr}] ${content}`);
    });
    
    console.log(`\n═══════════════════════════════════════════════════════════════`);
  }
} catch(e) {
  console.error('Error:', e.message);
}
