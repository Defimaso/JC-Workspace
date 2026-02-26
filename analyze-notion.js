const fs = require('fs');

const wrapper = JSON.parse(fs.readFileSync('C:\\Users\\motok\\.claude\\projects\\C--Users-motok-Desktop-JC\\f5e75eba-2638-49b7-977f-438d4d7c2d0d\\tool-results\\mcp-notion-API-get-block-children-1771500318823.txt', 'utf8'));
const data = JSON.parse(wrapper[0].text);

const getText = (block) => {
  const t = block[block.type];
  if (t?.rich_text?.[0]?.text?.content) return t.rich_text[0].text.content;
  if (t?.rich_text?.[0]?.plain_text) return t.rich_text[0].plain_text;
  return '';
};

console.log('=== SEZIONI PRINCIPALI (H1) ===\n');
data.results.filter(b => b.type === 'heading_1').forEach((b, i) => {
  console.log(`${i + 1}. ${getText(b)}`);
});

console.log('\n=== SOTTOSEZIONI (H3) ===\n');
data.results.filter(b => b.type === 'heading_3').forEach((b, i) => {
  console.log(`  - ${getText(b)}`);
});

console.log('\n=== CALLOUT (DATI CHIAVE) ===\n');
data.results.filter(b => b.type === 'callout').forEach((b, i) => {
  const text = getText(b);
  if (text.length > 0) {
    console.log(`• ${text.substring(0, 150)}${text.length > 150 ? '...' : ''}`);
  }
});

console.log('\n=== BULLET POINTS ===\n');
data.results.filter(b => b.type === 'bulleted_list_item').forEach((b, i) => {
  const text = getText(b);
  if (text.length > 0) {
    console.log(`  • ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
  }
});

// Salva tutto in JSON strutturato
const structured = {
  h1: data.results.filter(b => b.type === 'heading_1').map(getText),
  h3: data.results.filter(b => b.type === 'heading_3').map(getText),
  callouts: data.results.filter(b => b.type === 'callout').map(getText),
  bullets: data.results.filter(b => b.type === 'bulleted_list_item').map(getText),
  paragraphs: data.results.filter(b => b.type === 'paragraph').map(getText)
};

fs.writeFileSync('C:\\Users\\motok\\Desktop\\JC\\notion-content-structured.json', JSON.stringify(structured, null, 2), 'utf8');
console.log('\n✓ Contenuto strutturato salvato in notion-content-structured.json');
