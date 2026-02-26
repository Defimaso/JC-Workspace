const fs = require('fs');
const E = '€';
const OUT = 'C:/Users/motok/Desktop/JC/creatives/';

function buildStory() {
  const p = [];
  p.push("<svg xmlns='http://www.w3.org/2000/svg' width='1080' height='1920'>");
  p.push("  <defs>");
  p.push("    <radialGradient id='bg' cx='50%' cy='45%' r='60%'><stop offset='0%' stop-color='#0a1a0f'/><stop offset='100%' stop-color='#080c10'/></radialGradient>");
  p.push("    <filter id='gG' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur stdDeviation='8' result='b'/><feMerge><feMergeNode in='b'/><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge></filter>");
  p.push("    <filter id='gS' x='-30%' y='-30%' width='160%' height='160%'><feGaussianBlur stdDeviation='4' result='b'/><feMerge><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge></filter>");
  p.push("    <filter id='gX' x='-60%' y='-60%' width='220%' height='220%'><feGaussianBlur stdDeviation='14' result='b'/><feMerge><feMergeNode in='b'/><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge></filter>");
  p.push("    <radialGradient id='aG' cx='50%' cy='50%' r='50%'><stop offset='0%' stop-color='#22c55e' stop-opacity='0.18'/><stop offset='100%' stop-color='#22c55e' stop-opacity='0'/></radialGradient>");
  p.push("    <radialGradient id='aV' cx='50%' cy='50%' r='50%'><stop offset='0%' stop-color='#818cf8' stop-opacity='0.14'/><stop offset='100%' stop-color='#818cf8' stop-opacity='0'/></radialGradient>");
  p.push("    <radialGradient id='sG' cx='50%' cy='50%' r='50%'><stop offset='0%' stop-color='#22c55e' stop-opacity='0.3'/><stop offset='100%' stop-color='#22c55e' stop-opacity='0'/></radialGradient>");
  p.push("  </defs>");
  p.push("  <rect width='1080' height='1920' fill='url(#bg)'/>");
  p.push("  <ellipse cx='200' cy='600' rx='380' ry='300' fill='url(#aG)' opacity='0.7'/>");
  p.push("  <ellipse cx='880' cy='900' rx='340' ry='280' fill='url(#aV)' opacity='0.6'/>");
  p.push("  <ellipse cx='540' cy='1400' rx='420' ry='260' fill='url(#aG)' opacity='0.4'/>");
  return p.join('
');
}

console.log(buildStory().length);