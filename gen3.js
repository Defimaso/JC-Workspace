const fs = require("fs");
const E = "\u20AC";
const OUT = "C:/Users/motok/Desktop/JC/creatives/";
const F = "system-ui,sans-serif";

function logo(cx, cy) {
  return "<path d='M" + cx + "," + (cy+16) + " C" + cx + "," + (cy+8) + " " + (cx-6) + "," + cy + " " + (cx-14) + "," + cy + " C" + (cx-21) + "," + cy + " " + (cx-27) + "," + (cy+7) + " " + (cx-27) + "," + (cy+15) + " C" + (cx-27) + "," + (cy+25) + " " + cx + "," + (cy+35) + " " + cx + "," + (cy+43) + " C" + cx + "," + (cy+35) + " " + (cx+27) + "," + (cy+25) + " " + (cx+27) + "," + (cy+15) + " C" + (cx+27) + "," + (cy+7) + " " + (cx+21) + "," + cy + " " + (cx+14) + "," + cy + " C" + (cx+6) + "," + cy + " " + cx + "," + (cy+8) + " " + cx + "," + (cy+16) + "Z' fill='#22c55e' filter='url(#gS)'/>";
}

function defsBlock() {
  return [
    "<defs>",
    "  <radialGradient id='bg' cx='50%' cy='45%' r='60%'><stop offset='0%' stop-color='#0a1a0f'/><stop offset='100%' stop-color='#080c10'/></radialGradient>",
    "  <filter id='gG' x='-50%' y='-50%' width='200%' height='200%'><feGaussianBlur stdDeviation='8' result='b'/><feMerge><feMergeNode in='b'/><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge></filter>",
    "  <filter id='gS' x='-30%' y='-30%' width='160%' height='160%'><feGaussianBlur stdDeviation='4' result='b'/><feMerge><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge></filter>",
    "  <filter id='gX' x='-60%' y='-60%' width='220%' height='220%'><feGaussianBlur stdDeviation='14' result='b'/><feMerge><feMergeNode in='b'/><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge></filter>",
    "  <radialGradient id='aG' cx='50%' cy='50%' r='50%'><stop offset='0%' stop-color='#22c55e' stop-opacity='0.18'/><stop offset='100%' stop-color='#22c55e' stop-opacity='0'/></radialGradient>",
    "  <radialGradient id='aV' cx='50%' cy='50%' r='50%'><stop offset='0%' stop-color='#818cf8' stop-opacity='0.14'/><stop offset='100%' stop-color='#818cf8' stop-opacity='0'/></radialGradient>",
    "  <radialGradient id='sG' cx='50%' cy='50%' r='50%'><stop offset='0%' stop-color='#22c55e' stop-opacity='0.3'/><stop offset='100%' stop-color='#22c55e' stop-opacity='0'/></radialGradient>",
    "</defs>"
  ].join("\n");
}

console.log("generator ok");
