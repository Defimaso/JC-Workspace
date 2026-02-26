import fs from 'fs';

const wrapper = JSON.parse(fs.readFileSync('C:\\Users\\motok\\.claude\\projects\\C--Users-motok-Desktop-JC\\f5e75eba-2638-49b7-977f-438d4d7c2d0d\\tool-results\\mcp-notion-API-get-block-children-1771500316221.txt'));
const data = JSON.parse(wrapper[0].text);

const getText = (richText) => richText?.map(t => t.plain_text).join('') || '';

console.log('=== HEADINGS ===\n');
data.results.filter(b => b.type.startsWith('heading_')).forEach(b => {
  const level = b.type.replace('heading_', '');
  const text = getText(b[b.type]?.rich_text);
  console.log(`${'#'.repeat(level)} ${text}`);
});

console.log('\n\n=== TO-DO ITEMS ===\n');
data.results.filter(b => b.type === 'to_do').forEach(b => {
  const checked = b.to_do?.checked;
  const text = getText(b.to_do?.rich_text);
  console.log(`[${checked ? 'X' : ' '}] ${text}`);
});

console.log('\n\n=== CALLOUTS ===\n');
data.results.filter(b => b.type === 'callout').forEach(b => {
  const text = getText(b.callout?.rich_text);
  const icon = b.callout?.icon?.emoji || '';
  console.log(`${icon} ${text}`);
});

console.log('\n\n=== TABELLE ===\n');
const tables = data.results.filter(b => b.type === 'table');
console.log(`Trovate ${tables.length} tabelle (servono child blocks per il contenuto)`);
tables.forEach((t, i) => {
  console.log(`Tabella ${i+1}: ${t.table?.table_width} colonne x ${t.table?.has_column_header ? 'con' : 'senza'} header`);
});

console.log('\n\n=== LISTE ===\n');
console.log('Liste puntate:');
data.results.filter(b => b.type === 'bulleted_list_item').slice(0, 10).forEach(b => {
  const text = getText(b.bulleted_list_item?.rich_text);
  console.log(`  • ${text}`);
});
if (data.results.filter(b => b.type === 'bulleted_list_item').length > 10) {
  console.log(`  ... (${data.results.filter(b => b.type === 'bulleted_list_item').length - 10} altri)`);
}

console.log('\nListe numerate:');
data.results.filter(b => b.type === 'numbered_list_item').forEach((b, i) => {
  const text = getText(b.numbered_list_item?.rich_text);
  console.log(`  ${i+1}. ${text}`);
});

console.log('\n\n=== PARAGRAFI ===\n');
data.results.filter(b => b.type === 'paragraph').forEach(b => {
  const text = getText(b.paragraph?.rich_text);
  if (text.trim()) console.log(text);
});

console.log('\n\n=== TUTTE LE LISTE PUNTATE ===\n');
data.results.filter(b => b.type === 'bulleted_list_item').forEach(b => {
  const text = getText(b.bulleted_list_item?.rich_text);
  console.log(`• ${text}`);
});

console.log('\n\n=== RIEPILOGO ===');
console.log(`Totale blocks: ${data.results.length}`);
console.log(`Has more: ${data.has_more} (ci sono altri blocchi non caricati)`);
console.log(`To-do completati: ${data.results.filter(b => b.type === 'to_do' && b.to_do?.checked).length}/${data.results.filter(b => b.type === 'to_do').length}`);
