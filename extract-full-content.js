const fs = require('fs');

const wrapper = JSON.parse(fs.readFileSync('C:\\Users\\motok\\.claude\\projects\\C--Users-motok-Desktop-JC\\f5e75eba-2638-49b7-977f-438d4d7c2d0d\\tool-results\\mcp-notion-API-get-block-children-1771500318823.txt', 'utf8'));
const data = JSON.parse(wrapper[0].text);

const getFullText = (block) => {
  const t = block[block.type];
  if (!t?.rich_text) return '';
  return t.rich_text.map(rt => rt.plain_text || rt.text?.content || '').join('');
};

const output = {
  metadata: {
    totalBlocks: data.results.length,
    blockTypes: {}
  },
  sections: []
};

data.results.forEach(b => {
  output.metadata.blockTypes[b.type] = (output.metadata.blockTypes[b.type] || 0) + 1;
});

let currentSection = null;

data.results.forEach((block, idx) => {
  const text = getFullText(block);

  if (block.type === 'heading_1') {
    currentSection = {
      title: text,
      type: 'h1',
      content: []
    };
    output.sections.push(currentSection);
  } else if (currentSection) {
    currentSection.content.push({
      type: block.type,
      text: text,
      blockId: block.id
    });
  } else {
    // Blocchi prima della prima sezione
    if (!output.preface) output.preface = [];
    output.preface.push({
      type: block.type,
      text: text
    });
  }
});

fs.writeFileSync('C:\\Users\\motok\\Desktop\\JC\\notion-full-content.json', JSON.stringify(output, null, 2), 'utf8');
console.log('✓ Contenuto completo salvato in notion-full-content.json');
console.log(`✓ Estratte ${output.sections.length} sezioni principali`);
