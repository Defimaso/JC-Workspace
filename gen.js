const fs = require("fs");
const E = "€";
const F = "system-ui,sans-serif";

function defs(extras) {
  const d = ["<defs>"];
  d.push("  <radialGradient id="bg" cx="50%" cy="45%" r="60%"><stop offset="0%" stop-color="#0a1a0f"/><stop offset="100%" stop-color="#080c10"/></radialGradient>");
  d.push("  <filter id="gG" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>");
  d.push("  <filter id="gS" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>");
  d.push("  <filter id="gX" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="14" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>");
  d.push("  <radialGradient id="aG" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#22c55e" stop-opacity="0.18"/><stop offset="100%" stop-color="#22c55e" stop-opacity="0"/></radialGradient>");
  d.push("  <radialGradient id="aV" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#818cf8" stop-opacity="0.14"/><stop offset="100%" stop-color="#818cf8" stop-opacity="0"/></radialGradient>");
  d.push("  <radialGradient id="sG" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#22c55e" stop-opacity="0.3"/><stop offset="100%" stop-color="#22c55e" stop-opacity="0"/></radialGradient>");
  if (extras) extras.forEach(function(e){ d.push("  " + e); });
  d.push("</defs>");
  return d.join("
");
}

function logo(cx, y, small) {
  const s = small ? 0.7 : 1;
  const hx = cx - 20*s, hy = y;
  return "<path d="M" + cx + "," + (hy+16*s) + " C" + cx + "," + (hy+8*s) + " " + (cx-6*s) + "," + hy + " " + (cx-14*s) + "," + hy + " C" + (cx-21*s) + "," + hy + " " + (cx-27*s) + "," + (hy+7*s) + " " + (cx-27*s) + "," + (hy+15*s) + " C" + (cx-27*s) + "," + (hy+25*s) + " " + cx + "," + (hy+35*s) + " " + cx + "," + (hy+43*s) + " C" + cx + "," + (hy+35*s) + " " + (cx+27*s) + "," + (hy+25*s) + " " + (cx+27*s) + "," + (hy+15*s) + " C" + (cx+27*s) + "," + (hy+7*s) + " " + (cx+21*s) + "," + hy + " " + (cx+14*s) + "," + hy + " C" + (cx+6*s) + "," + hy + " " + cx + "," + (hy+8*s) + " " + cx + "," + (hy+16*s) + "Z" fill="#22c55e" filter="url(#gS)"/>";
}

function txt(x,y,size,weight,fill,anchor,extra,content) {
  let attr = "x="" + x + "" y="" + y + "" font-family="" + F + "" font-size="" + size + "" font-weight="" + weight + "" fill="" + fill + "" text-anchor="" + anchor + """;
  if(extra) attr += " " + extra;
  return "<text " + attr + ">" + content + "</text>";
}

function rect(x,y,w,h,rx,fill,fo,stroke,sw,so) {
  let s = "<rect x="" + x + "" y="" + y + "" width="" + w + "" height="" + h + "" rx="" + rx + "" fill="" + fill + """;
  if(fo!==undefined) s += " fill-opacity="" + fo + """;
  if(stroke) { s += " stroke="" + stroke + "" stroke-width="" + sw + """; if(so) s += " stroke-opacity="" + so + """; }
  s += "/>";
  return s;
}

console.log("generator loaded");