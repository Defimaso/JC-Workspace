const fs = require('fs');

try {
  // Try common variations
  const paths = [
    '/c/Users/motok/.claude/projects/C--Users-motok-Desktop-JC/f5e75eba-2638-49b7-977f-438d4d7c2d0d/tool-results/mcp-notion-API-get-block-children-1771508019371.txt',
    'C:/Users/motok/.claude/projects/C--Users-motok-Desktop-JC/f5e75eba-2638-49b7-977f-438d4d7c2d0d/tool-results/mcp-notion-API-get-block-children-1771508019371.txt'
  ];
  
  let data;
  for (const p of paths) {
    try {
      data = JSON.parse(fs.readFileSync(p, 'utf-8'));
      console.log("File found!");
      break;
    } catch (e) {
      continue;
    }
  }
  
  if (!data) throw new Error('File not found');
  
  if (data.results) {
    console.log(`Total blocks: ${data.results.length}\n`);
    data.results.slice(0, 100).forEach((block, i) => {
      console.log(`${(i+1).toString().padStart(3)}. [${block.type.padEnd(20)}]`);
    });
  }
} catch(e) {
  console.error('Error:', e.message);
  process.exit(1);
}
