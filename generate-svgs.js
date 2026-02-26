const fs = require("fs");
const E = "\u20AC";
const OUT = "C:/Users/motok/Desktop/JC/creatives/";
const F = "system-ui,sans-serif";

function defs() {
  return [
    "  <defs>",
    "    <radialGradient id=\x27bg\x27 cx=\x2750%\x27 cy=\x2745%\x27 r=\x2760%\x27><stop offset=\x270%\x27 stop-color=\x27#0a1a0f\x27/><stop offset=\x27100%\x27 stop-color=\x27#080c10\x27/></radialGradient>",
    "    <filter id=\x27gG\x27 x=\x27-50%\x27 y=\x27-50%\x27 width=\x27200%\x27 height=\x27200%\x27><feGaussianBlur stdDeviation=\x278\x27 result=\x27b\x27/><feMerge><feMergeNode in=\x27b\x27/><feMergeNode in=\x27b\x27/><feMergeNode in=\x27SourceGraphic\x27/></feMerge></filter>",
    "    <filter id=\x27gS\x27 x=\x27-30%\x27 y=\x27-30%\x27 width=\x27160%\x27 height=\x27160%\x27><feGaussianBlur stdDeviation=\x274\x27 result=\x27b\x27/><feMerge><feMergeNode in=\x27b\x27/><feMergeNode in=\x27SourceGraphic\x27/></feMerge></filter>",
    "    <filter id=\x27gX\x27 x=\x27-60%\x27 y=\x27-60%\x27 width=\x27220%\x27 height=\x27220%\x27><feGaussianBlur stdDeviation=\x2714\x27 result=\x27b\x27/><feMerge><feMergeNode in=\x27b\x27/><feMergeNode in=\x27b\x27/><feMergeNode in=\x27SourceGraphic\x27/></feMerge></filter>",
    "    <radialGradient id=\x27aG\x27 cx=\x2750%\x27 cy=\x2750%\x27 r=\x2750%\x27><stop offset=\x270%\x27 stop-color=\x27#22c55e\x27 stop-opacity=\x270.18\x27/><stop offset=\x27100%\x27 stop-color=\x27#22c55e\x27 stop-opacity=\x270\x27/></radialGradient>",
    "    <radialGradient id=\x27aV\x27 cx=\x2750%\x27 cy=\x2750%\x27 r=\x2750%\x27><stop offset=\x270%\x27 stop-color=\x27#818cf8\x27 stop-opacity=\x270.14\x27/><stop offset=\x27100%\x27 stop-color=\x27#818cf8\x27 stop-opacity=\x270\x27/></radialGradient>",
    "    <radialGradient id=\x27sG\x27 cx=\x2750%\x27 cy=\x2750%\x27 r=\x2750%\x27><stop offset=\x270%\x27 stop-color=\x27#22c55e\x27 stop-opacity=\x270.3\x27/><stop offset=\x27100%\x27 stop-color=\x27#22c55e\x27 stop-opacity=\x270\x27/></radialGradient>",
    "  </defs>"
  ].join("\n");
}

function hrt(cx, cy) {
  return "<path d=\x27M" + cx + "," + (cy+16) + " C" + cx + "," + (cy+8) + " " + (cx-6) + "," + cy + " " + (cx-14) + "," + cy + " C" + (cx-21) + "," + cy + " " + (cx-27) + "," + (cy+7) + " " + (cx-27) + "," + (cy+15) + " C" + (cx-27) + "," + (cy+25) + " " + cx + "," + (cy+35) + " " + cx + "," + (cy+43) + " C" + cx + "," + (cy+35) + " " + (cx+27) + "," + (cy+25) + " " + (cx+27) + "," + (cy+15) + " C" + (cx+27) + "," + (cy+7) + " " + (cx+21) + "," + cy + " " + (cx+14) + "," + cy + " C" + (cx+6) + "," + cy + " " + cx + "," + (cy+8) + " " + cx + "," + (cy+16) + "Z\x27 fill=\x27#22c55e\x27 filter=\x27url(#gS)\x27/>";
}
function buildStory() {
  var p = [];
  p.push("<svg xmlns=\x27http://www.w3.org/2000/svg\x27 width=\x271080\x27 height=\x271920\x27>");
  p.push(defs());
  p.push("  <rect width=\x271080\x27 height=\x271920\x27 fill=\x27url(#bg)\x27/>");
  p.push("  <ellipse cx=\x27200\x27 cy=\x27600\x27 rx=\x27380\x27 ry=\x27300\x27 fill=\x27url(#aG)\x27 opacity=\x270.7\x27/>");
  p.push("  <ellipse cx=\x27880\x27 cy=\x27900\x27 rx=\x27340\x27 ry=\x27280\x27 fill=\x27url(#aV)\x27 opacity=\x270.6\x27/>");
  p.push("  <ellipse cx=\x27540\x27 cy=\x271400\x27 rx=\x27420\x27 ry=\x27260\x27 fill=\x27url(#aG)\x27 opacity=\x270.4\x27/>");
  p.push("  " + hrt(498, 68));
  p.push("  <text x=\x27548\x27 y=\x27106\x27 font-family=\x27" + F + "\x27 font-size=\x2730\x27 font-weight=\x27700\x27 fill=\x27white\x27>Symplo<tspan fill=\x27#22c55e\x27>.ai</tspan></text>");
  p.push("  <rect x=\x27415\x27 y=\x27140\x27 width=\x27250\x27 height=\x2744\x27 rx=\x2722\x27 fill=\x27#22c55e\x27 fill-opacity=\x270.15\x27 stroke=\x27#22c55e\x27 stroke-width=\x271.5\x27/>");
  p.push("  <text x=\x27540\x27 y=\x27168\x27 font-family=\x27" + F + "\x27 font-size=\x2719\x27 font-weight=\x27600\x27 fill=\x27#22c55e\x27 text-anchor=\x27middle\x27 letter-spacing=\x272\x27>CASE STUDY</text>");
  p.push("  <text x=\x27540\x27 y=\x27282\x27 font-family=\x27" + F + "\x27 font-size=\x27110\x27 font-weight=\x27900\x27 fill=\x27#22c55e\x27 text-anchor=\x27middle\x27 filter=\x27url(#gX)\x27>" + E + "150</text>");
  p.push("  <text x=\x27540\x27 y=\x27282\x27 font-family=\x27" + F + "\x27 font-size=\x27110\x27 font-weight=\x27900\x27 fill=\x27#22c55e\x27 text-anchor=\x27middle\x27>" + E + "150</text>");
  p.push("  <text x=\x27540\x27 y=\x27348\x27 font-family=\x27" + F + "\x27 font-size=\x2734\x27 fill=\x27#6b7280\x27 text-anchor=\x27middle\x27>vs</text>");
  p.push("  <text x=\x27540\x27 y=\x27440\x27 font-family=\x27" + F + "\x27 font-size=\x2790\x27 font-weight=\x27900\x27 fill=\x27#ef4444\x27 text-anchor=\x27middle\x27 text-decoration=\x27line-through\x27 opacity=\x270.85\x27>" + E + "20.000+</text>");
  p.push("  <text x=\x27540\x27 y=\x27506\x27 font-family=\x27" + F + "\x27 font-size=\x2727\x27 fill=\x27#9ca3af\x27 text-anchor=\x27middle\x27>Stesso prodotto. Costi completamente diversi.</text>");
  p.push("  <line x1=\x2780\x27 y1=\x27544\x27 x2=\x271000\x27 y2=\x27544\x27 stroke=\x27#22c55e\x27 stroke-width=\x271.5\x27 opacity=\x270.4\x27/>");
  p.push("  <ellipse cx=\x27540\x27 cy=\x27544\x27 rx=\x2780\x27 ry=\x274\x27 fill=\x27#22c55e\x27 opacity=\x270.6\x27/>");
  p.push("  <rect x=\x2755\x27 y=\x27570\x27 width=\x27462\x27 height=\x27430\x27 rx=\x2720\x27 fill=\x27#22c55e\x27 fill-opacity=\x270.06\x27 stroke=\x27#22c55e\x27 stroke-width=\x271.5\x27 stroke-opacity=\x270.5\x27/>");
  p.push("  <text x=\x27286\x27 y=\x27616\x27 font-family=\x27" + F + "\x27 font-size=\x2723\x27 font-weight=\x27700\x27 fill=\x27#22c55e\x27 text-anchor=\x27middle\x27>Symplo (AI-first)</text>");
  p.push("  <line x1=\x2774\x27 y1=\x27630\x27 x2=\x27498\x27 y2=\x27630\x27 stroke=\x27#22c55e\x27 stroke-width=\x271\x27 stroke-opacity=\x270.3\x27/>");
  [[670,"3 settimane"],[728,"1 persona"],[786,E+"43/mese"],[844,"100% AI-powered"],[902,"1 founder"]].forEach(function(r) {
    p.push("  <circle cx=\x2792\x27 cy=\x27" + r[0] + "\x27 r=\x275\x27 fill=\x27#22c55e\x27/><text x=\x27110\x27 y=\x27" + (r[0]+7) + "\x27 font-family=\x27" + F + "\x27 font-size=\x2722\x27 fill=\x27white\x27>" + r[1] + "</text>");
  });
  p.push("  <rect x=\x27563\x27 y=\x27570\x27 width=\x27462\x27 height=\x27430\x27 rx=\x2720\x27 fill=\x27#ef4444\x27 fill-opacity=\x270.06\x27 stroke=\x27#ef4444\x27 stroke-width=\x271.5\x27 stroke-opacity=\x270.5\x27/>");
  p.push("  <text x=\x27794\x27 y=\x27616\x27 font-family=\x27" + F + "\x27 font-size=\x2723\x27 font-weight=\x27700\x27 fill=\x27#ef4444\x27 text-anchor=\x27middle\x27>Agenzia tradizionale</text>");
  p.push("  <line x1=\x27582\x27 y1=\x27630\x27 x2=\x271006\x27 y2=\x27630\x27 stroke=\x27#ef4444\x27 stroke-width=\x271\x27 stroke-opacity=\x270.3\x27/>");
  [[670,"3-6 mesi"],[728,"4-6 persone"],[786,E+"20.000+"],[844,"Dev tradizionale"],[902,"Team dedicato"]].forEach(function(r) {
    p.push("  <circle cx=\x27600\x27 cy=\x27" + r[0] + "\x27 r=\x275\x27 fill=\x27#ef4444\x27/><text x=\x27618\x27 y=\x27" + (r[0]+7) + "\x27 font-family=\x27" + F + "\x27 font-size=\x2722\x27 fill=\x27white\x27>" + r[1] + "</text>");
  });
  p.push("  <ellipse cx=\x27540\x27 cy=\x271062\x27 rx=\x27400\x27 ry=\x2760\x27 fill=\x27url(#sG)\x27/>");
  p.push("  <rect x=\x2796\x27 y=\x271022\x27 width=\x27888\x27 height=\x27100\x27 rx=\x2718\x27 fill=\x27#22c55e\x27 fill-opacity=\x270.12\x27 stroke=\x27#22c55e\x27 stroke-width=\x272\x27/>");
  p.push("  <text x=\x27540\x27 y=\x271064\x27 font-family=\x27" + F + "\x27 font-size=\x2740\x27 font-weight=\x27900\x27 fill=\x27#22c55e\x27 text-anchor=\x27middle\x27 filter=\x27url(#gG)\x27>" + E + "19.850+ risparmiati</text>");
  p.push("  <text x=\x27540\x27 y=\x271064\x27 font-family=\x27" + F + "\x27 font-size=\x2740\x27 font-weight=\x27900\x27 fill=\x27#22c55e\x27 text-anchor=\x27middle\x27>" + E + "19.850+ risparmiati</text>");
  p.push("  <text x=\x27540\x27 y=\x271102\x27 font-family=\x27" + F + "\x27 font-size=\x2719\x27 fill=\x27#6ee7b7\x27 text-anchor=\x27middle\x27>rispetto al modello agenzia tradizionale</text>");
  p.push("  <text x=\x27540\x27 y=\x271174\x27 font-family=\x27" + F + "\x27 font-size=\x2726\x27 font-weight=\x27700\x27 fill=\x27white\x27 text-anchor=\x27middle\x27>Come e stato costruito:</text>");
  [[76,1193,"Claude AI"],[286,1193,"Lovable"],[496,1193,"Supabase"],[706,1193,"Vercel"],[136,1259,"Resend"],[346,1259,"MailerLite"],[556,1259,"GitHub"]].forEach(function(r) {
    p.push("  <rect x=\x27" + r[0] + "\x27 y=\x27" + r[1] + "\x27 width=\x27190\x27 height=\x2746\x27 rx=\x2723\x27 fill=\x27#818cf8\x27 fill-opacity=\x270.15\x27 stroke=\x27#818cf8\x27 stroke-width=\x271.2\x27/><text x=\x27" + (r[0]+95) + "\x27 y=\x27" + (r[1]+29) + "\x27 font-family=\x27" + F + "\x27 font-size=\x2719\x27 font-weight=\x27600\x27 fill=\x27#818cf8\x27 text-anchor=\x27middle\x27>" + r[2] + "</text>");
  });
  p.push("  <rect x=\x2776\x27 y=\x271340\x27 width=\x27928\x27 height=\x27170\x27 rx=\x2716\x27 fill=\x27#0f172a\x27/>");
  p.push("  <text x=\x27540\x27 y=\x271393\x27 font-family=\x27" + F + "\x27 font-size=\x2722\x27 font-style=\x27italic\x27 fill=\x27#d1d5db\x27 text-anchor=\x27middle\x27>\u201CL\u2019AI non sostituisce il founder.</text>");
  p.push("  <text x=\x27540\x27 y=\x271428\x27 font-family=\x27" + F + "\x27 font-size=\x2722\x27 font-style=\x27italic\x27 fill=\x27#d1d5db\x27 text-anchor=\x27middle\x27>Moltiplica quello che puo fare da solo.\u201D</text>");
  p.push("  <text x=\x27540\x27 y=\x271488\x27 font-family=\x27" + F + "\x27 font-size=\x2718\x27 fill=\x27#22c55e\x27 text-anchor=\x27middle\x27>-- Defi Maso, fondatore Symplo</text>");
  p.push("  <line x1=\x2776\x27 y1=\x271556\x27 x2=\x271004\x27 y2=\x271556\x27 stroke=\x27#22c55e\x27 stroke-width=\x271\x27 stroke-opacity=\x270.3\x27/>");
  p.push("  <text x=\x27540\x27 y=\x271624\x27 font-family=\x27" + F + "\x27 font-size=\x2725\x27 fill=\x27#9ca3af\x27 text-anchor=\x27middle\x27>Scopri lo stack completo su</text>");
  p.push("  <text x=\x27540\x27 y=\x271668\x27 font-family=\x27" + F + "\x27 font-size=\x2729\x27 font-weight=\x27700\x27 fill=\x27#22c55e\x27 text-anchor=\x27middle\x27>symplo.vercel.app</text>");
  p.push("  " + hrt(480, 1712));
  p.push("  <text x=\x27518\x27 y=\x271748\x27 font-family=\x27" + F + "\x27 font-size=\x2722\x27 font-weight=\x27700\x27 fill=\x27white\x27>Symplo<tspan fill=\x27#22c55e\x27>.ai</tspan></text>");
  p.push("</svg>");
  return p.join("\n");
}

function buildPost() {
  var p = [];
  p.push("<svg xmlns=\x27http://www.w3.org/2000/svg\x27 width=\x271080\x27 height=\x271080\x27>");
  p.push(defs());
  p.push("  <rect width=\x271080\x27 height=\x271080\x27 fill=\x27url(#bg)\x27/>");
  p.push("  <ellipse cx=\x27540\x27 cy=\x27300\x27 rx=\x27500\x27 ry=\x27300\x27 fill=\x27url(#aG)\x27 opacity=\x270.5\x27/>");
  p.push("  <ellipse cx=\x27900\x27 cy=\x27700\x27 rx=\x27300\x27 ry=\x27250\x27 fill=\x27url(#aV)\x27 opacity=\x270.4\x27/>");
  p.push("  " + hrt(490, 48));
  p.push("  <text x=\x27540\x27 y=\x2786\x27 font-family=\x27" + F + "\x27 font-size=\x2728\x27 font-weight=\x27700\x27 fill=\x27white\x27>Symplo<tspan fill=\x27#22c55e\x27>.ai</tspan></text>");
  p.push("  <rect x=\x27660\x27 y=\x2752\x27 width=\x27150\x27 height=\x2736\x27 rx=\x2718\x27 fill=\x27#818cf8\x27 fill-opacity=\x270.2\x27 stroke=\x27#818cf8\x27 stroke-width=\x271.2\x27/>");
  p.push("  <text x=\x27735\x27 y=\x2776\x27 font-family=\x27" + F + "\x27 font-size=\x2716\x27 font-weight=\x27600\x27 fill=\x27#818cf8\x27 text-anchor=\x27middle\x27>AI-built</text>");
  p.push("  <text x=\x27540\x27 y=\x27168\x27 font-family=\x27" + F + "\x27 font-size=\x2733\x27 font-weight=\x27800\x27 fill=\x27white\x27 text-anchor=\x27middle\x27>Abbiamo costruito Symplo in 3 settimane.</text>");
  p.push("  <text x=\x27540\x27 y=\x27216\x27 font-family=\x27" + F + "\x27 font-size=\x2733\x27 font-weight=\x27800\x27 fill=\x27white\x27 text-anchor=\x27middle\x27>Con <tspan fill=\x27#22c55e\x27 filter=\x27url(#gS)\x27>" + E + "150</tspan>.</text>");
  var cards = [
    [60, 280, E+"0 dev", "vs " + E + "20K agenzia", "#22c55e"],
    [570, 280, "3 sett.", "vs 3-6 mesi", "#818cf8"],
    [60, 560, "1 persona", "vs team 5+", "#818cf8"],
    [570, 560, E+"43/mese", "costo reale", "#22c55e"]
  ];
  cards.forEach(function(c) {
    var x=c[0], y=c[1], v=c[2], sub=c[3], col=c[4];
    p.push("  <rect x=\x27" + x + "\x27 y=\x27" + y + "\x27 width=\x27450\x27 height=\x27240\x27 rx=\x2720\x27 fill=\x27" + col + "\x27 fill-opacity=\x270.07\x27 stroke=\x27" + col + "\x27 stroke-width=\x271.5\x27 stroke-opacity=\x270.5\x27/>");
    p.push("  <text x=\x27" + (x+225) + "\x27 y=\x27" + (y+100) + "\x27 font-family=\x27" + F + "\x27 font-size=\x2762\x27 font-weight=\x27900\x27 fill=\x27" + col + "\x27 text-anchor=\x27middle\x27 filter=\x27url(#gS)\x27>" + v + "</text>");
    p.push("  <text x=\x27" + (x+225) + "\x27 y=\x27" + (y+158) + "\x27 font-family=\x27" + F + "\x27 font-size=\x2724\x27 fill=\x27#9ca3af\x27 text-anchor=\x27middle\x27>" + sub + "</text>");
  });
  p.push("  <rect x=\x27100\x27 y=\x27840\x27 width=\x27880\x27 height=\x27100\x27 rx=\x2720\x27 fill=\x27#22c55e\x27 fill-opacity=\x270.1\x27 stroke=\x27#22c55e\x27 stroke-width=\x271.5\x27/>");
  p.push("  <text x=\x27480\x27 y=\x27898\x27 font-family=\x27" + F + "\x27 font-size=\x2728\x27 font-weight=\x27700\x27 fill=\x27#22c55e\x27 text-anchor=\x27middle\x27>symplo.vercel.app</text>");
  p.push("  <text x=\x27910\x27 y=\x27900\x27 font-family=\x27" + F + "\x27 font-size=\x2736\x27 fill=\x27#22c55e\x27 text-anchor=\x27middle\x27>&#8594;</text>");
  p.push("  <text x=\x27540\x27 y=\x27990\x27 font-family=\x27" + F + "\x27 font-size=\x2720\x27 fill=\x27#6b7280\x27 text-anchor=\x27middle\x27>Il futuro del product building e adesso.</text>");
  p.push("</svg>");
  return p.join("\n");
}

function buildSlide1() {
  var p = [];
  p.push("<svg xmlns=\x27http://www.w3.org/2000/svg\x27 width=\x271080\x27 height=\x271080\x27>");
  p.push(defs());
  p.push("  <rect width=\x271080\x27 height=\x271080\x27 fill=\x27url(#bg)\x27/>");
  p.push("  <ellipse cx=\x27540\x27 cy=\x27540\x27 rx=\x27460\x27 ry=\x27380\x27 fill=\x27url(#aG)\x27 opacity=\x270.6\x27/>");
  p.push("  <ellipse cx=\x27540\x27 cy=\x27540\x27 rx=\x27300\x27 ry=\x27240\x27 fill=\x27url(#aG)\x27 opacity=\x270.7\x27/>");
  p.push("  <ellipse cx=\x27540\x27 cy=\x27480\x27 rx=\x27200\x27 ry=\x27140\x27 fill=\x27url(#aG)\x27 opacity=\x270.5\x27/>");
  p.push("  <text x=\x27540\x27 y=\x27320\x27 font-family=\x27" + F + "\x27 font-size=\x2768\x27 font-weight=\x27900\x27 fill=\x27#22c55e\x27 text-anchor=\x27middle\x27 filter=\x27url(#gX)\x27>Hai mai visto un</text>");
  p.push("  <text x=\x27540\x27 y=\x27320\x27 font-family=\x27" + F + "\x27 font-size=\x2768\x27 font-weight=\x27900\x27 fill=\x27white\x27 text-anchor=\x27middle\x27>Hai mai visto un</text>");
  p.push("  <text x=\x27540\x27 y=\x27412\x27 font-family=\x27" + F + "\x27 font-size=\x2768\x27 font-weight=\x27900\x27 fill=\x27#22c55e\x27 text-anchor=\x27middle\x27 filter=\x27url(#gX)\x27>sito web costruito</text>");
  p.push("  <text x=\x27540\x27 y=\x27412\x27 font-family=\x27" + F + "\x27 font-size=\x2768\x27 font-weight=\x27900\x27 fill=\x27white\x27 text-anchor=\x27middle\x27>sito web costruito</text>");
  p.push("  <text x=\x27540\x27 y=\x27540\x27 font-family=\x27" + F + "\x27 font-size=\x27100\x27 font-weight=\x27900\x27 fill=\x27#22c55e\x27 text-anchor=\x27middle\x27 filter=\x27url(#gX)\x27>con " + E + "150?</text>");
  p.push("  <text x=\x27540\x27 y=\x27540\x27 font-family=\x27" + F + "\x27 font-size=\x27100\x27 font-weight=\x27900\x27 fill=\x27#22c55e\x27 text-anchor=\x27middle\x27>con " + E + "150?</text>");
  p.push("  <text x=\x27540\x27 y=\x27646\x27 font-family=\x27" + F + "\x27 font-size=\x2732\x27 fill=\x27#6ee7b7\x27 text-anchor=\x27middle\x27>\u2192 Swipe per scoprire come \u2192</text>");
  p.push("  <text x=\x27540\x27 y=\x27740\x27 font-family=\x27" + F + "\x27 font-size=\x2722\x27 fill=\x27#6b7280\x27 text-anchor=\x27middle\x27>Case study reale. Stack reale. Numeri reali.</text>");
  p.push("  " + hrt(490, 816));
  p.push("  <text x=\x27530\x27 y=\x27855\x27 font-family=\x27" + F + "\x27 font-size=\x2726\x27 font-weight=\x27700\x27 fill=\x27white\x27>Symplo<tspan fill=\x27#22c55e\x27>.ai</tspan></text>");
  p.push("  <text x=\x27540\x27 y=\x27970\x27 font-family=\x27" + F + "\x27 font-size=\x2720\x27 fill=\x27#374151\x27 text-anchor=\x27middle\x27>Slide 1/5</text>");
  p.push("</svg>");
  return p.join("\n");
}

function buildSlide2() {
  var p = [];
  p.push("<svg xmlns=\x27http://www.w3.org/2000/svg\x27 width=\x271080\x27 height=\x271080\x27>");
  p.push(defs());
  p.push("  <rect width=\x271080\x27 height=\x271080\x27 fill=\x27url(#bg)\x27/>");
  p.push("  <ellipse cx=\x27200\x27 cy=\x27200\x27 rx=\x27300\x27 ry=\x27200\x27 fill=\x27url(#aG)\x27 opacity=\x270.4\x27/>");
  p.push("  <ellipse cx=\x27900\x27 cy=\x27800\x27 rx=\x27280\x27 ry=\x27220\x27 fill=\x27url(#aV)\x27 opacity=\x270.3\x27/>");
  p.push("  <text x=\x27540\x27 y=\x2778\x27 font-family=\x27" + F + "\x27 font-size=\x2737\x27 font-weight=\x27800\x27 fill=\x27white\x27 text-anchor=\x27middle\x27>La stessa app. Due mondi diversi.</text>");
  p.push("  <rect x=\x2760\x27 y=\x27108\x27 width=\x27440\x27 height=\x2756\x27 rx=\x2712\x27 fill=\x27#22c55e\x27 fill-opacity=\x270.15\x27 stroke=\x27#22c55e\x27 stroke-width=\x271.5\x27/>");
  p.push("  <text x=\x27280\x27 y=\x27144\x27 font-family=\x27" + F + "\x27 font-size=\x2722\x27 font-weight=\x27700\x27 fill=\x27#22c55e\x27 text-anchor=\x27middle\x27>Symplo</text>");
  p.push("  <rect x=\x27580\x27 y=\x27108\x27 width=\x27440\x27 height=\x2756\x27 rx=\x2712\x27 fill=\x27#ef4444\x27 fill-opacity=\x270.12\x27 stroke=\x27#ef4444\x27 stroke-width=\x271.5\x27/>");
  p.push("  <text x=\x27800\x27 y=\x27144\x27 font-family=\x27" + F + "\x27 font-size=\x2722\x27 font-weight=\x27700\x27 fill=\x27#ef4444\x27 text-anchor=\x27middle\x27>Agenzia</text>");
  var rows = [
    ["Costo", E+"150", E+"15.000 - "+E+"30.000"],
    ["Tempo", "3 settimane", "3 - 6 mesi"],
    ["Team", "1 founder + AI", "4 - 8 persone"],
    ["Infra", E+"43/mese", E+"200-500/mese"],
    ["Risultato", "MVP live 3w", "Spec. per 2 mesi"]
  ];
  rows.forEach(function(r, i) {
    var y = 186 + i * 148;
    var bg = (i % 2 === 0) ? "#0d1a12" : "#0a0e18";
    p.push("  <rect x=\x2760\x27 y=\x27" + y + "\x27 width=\x27960\x27 height=\x27124\x27 rx=\x2710\x27 fill=\x27" + bg + "\x27/>");
    p.push("  <text x=\x27160\x27 y=\x27" + (y+44) + "\x27 font-family=\x27" + F + "\x27 font-size=\x2718\x27 fill=\x27#6b7280\x27 text-anchor=\x27middle\x27>" + r[0] + "</text>");
    p.push("  <text x=\x27280\x27 y=\x27" + (y+86) + "\x27 font-family=\x27" + F + "\x27 font-size=\x2726\x27 font-weight=\x27700\x27 fill=\x27#22c55e\x27 text-anchor=\x27middle\x27>" + r[1] + "</text>");
    p.push("  <line x1=\x27510\x27 y1=\x27" + (y+16) + "\x27 x2=\x27510\x27 y2=\x27" + (y+108) + "\x27 stroke=\x27#1f2937\x27 stroke-width=\x271\x27/>");
    p.push("  <text x=\x27800\x27 y=\x27" + (y+86) + "\x27 font-family=\x27" + F + "\x27 font-size=\x2726\x27 font-weight=\x27700\x27 fill=\x27#ef4444\x27 text-anchor=\x27middle\x27>" + r[2] + "</text>");
  });
  p.push("  <text x=\x27540\x27 y=\x271046\x27 font-family=\x27" + F + "\x27 font-size=\x2720\x27 fill=\x27#4b5563\x27 text-anchor=\x27middle\x27>Slide 2/5 \u2022 symplo.vercel.app</text>");
  p.push("</svg>");
  return p.join("\n");
}

function buildSlide3() {
  var p = [];
  p.push("<svg xmlns=\x27http://www.w3.org/2000/svg\x27 width=\x271080\x27 height=\x271080\x27>");
  p.push(defs());
  p.push("  <rect width=\x271080\x27 height=\x271080\x27 fill=\x27url(#bg)\x27/>");
  p.push("  <ellipse cx=\x27540\x27 cy=\x27200\x27 rx=\x27500\x27 ry=\x27200\x27 fill=\x27url(#aG)\x27 opacity=\x270.3\x27/>");
  p.push("  <ellipse cx=\x27900\x27 cy=\x27900\x27 rx=\x27300\x27 ry=\x27200\x27 fill=\x27url(#aV)\x27 opacity=\x270.25\x27/>");
  p.push("  <text x=\x27540\x27 y=\x2768\x27 font-family=\x27" + F + "\x27 font-size=\x2737\x27 font-weight=\x27800\x27 fill=\x27white\x27 text-anchor=\x27middle\x27>Il tech stack completo di Symplo</text>");
  var tools = [
    {name:"Claude", role:"Codice + strategia", col:"#818cf8", cost:E+"20/m"},
    {name:"Lovable", role:"UI builder AI", col:"#22c55e", cost:E+"25/m"},
    {name:"ChatGPT", role:"Copy + ricerca", col:"#818cf8", cost:E+"20/m"},
    {name:"Supabase", role:"Database + auth", col:"#22c55e", cost:"free"},
    {name:"Vercel", role:"Deploy + hosting", col:"#818cf8", cost:"free"},
    {name:"Resend", role:"Email transaz.", col:"#22c55e", cost:E+"10/m"},
    {name:"MailerLite", role:"Email marketing", col:"#818cf8", cost:"free"},
    {name:"GitHub", role:"Versionamento", col:"#22c55e", cost:"free"},
    {name:"Notion", role:"Planning + docs", col:"#818cf8", cost:"free"}
  ];
  tools.forEach(function(t, i) {
    var col = i % 3;
    var row = Math.floor(i / 3);
    var x = 60 + col * 328;
    var y = 108 + row * 248;
    p.push("  <rect x=\x27" + x + "\x27 y=\x27" + y + "\x27 width=\x27298\x27 height=\x27218\x27 rx=\x2716\x27 fill=\x27" + t.col + "\x27 fill-opacity=\x270.07\x27 stroke=\x27" + t.col + "\x27 stroke-width=\x271.5\x27 stroke-opacity=\x270.5\x27/>");
    p.push("  <text x=\x27" + (x+149) + "\x27 y=\x27" + (y+78) + "\x27 font-family=\x27" + F + "\x27 font-size=\x2738\x27 font-weight=\x27900\x27 fill=\x27" + t.col + "\x27 text-anchor=\x27middle\x27 filter=\x27url(#gS)\x27>" + t.name + "</text>");
    p.push("  <text x=\x27" + (x+149) + "\x27 y=\x27" + (y+134) + "\x27 font-family=\x27" + F + "\x27 font-size=\x2719\x27 fill=\x27#9ca3af\x27 text-anchor=\x27middle\x27>" + t.role + "</text>");
    p.push("  <text x=\x27" + (x+149) + "\x27 y=\x27" + (y+178) + "\x27 font-family=\x27" + F + "\x27 font-size=\x2715\x27 fill=\x27" + t.col + "\x27 text-anchor=\x27middle\x27 opacity=\x270.7\x27>" + t.cost + "</text>");
  });
  p.push("  <rect x=\x27260\x27 y=\x27868\x27 width=\x27560\x27 height=\x2770\x27 rx=\x2720\x27 fill=\x27#22c55e\x27 fill-opacity=\x270.12\x27 stroke=\x27#22c55e\x27 stroke-width=\x272\x27/>");
  p.push("  <text x=\x27540\x27 y=\x27912\x27 font-family=\x27" + F + "\x27 font-size=\x2728\x27 font-weight=\x27900\x27 fill=\x27#22c55e\x27 text-anchor=\x27middle\x27 filter=\x27url(#gG)\x27>Totale: " + E + "43/mese</text>");
  p.push("  <text x=\x27540\x27 y=\x27912\x27 font-family=\x27" + F + "\x27 font-size=\x2728\x27 font-weight=\x27900\x27 fill=\x27#22c55e\x27 text-anchor=\x27middle\x27>Totale: " + E + "43/mese</text>");
  p.push("  <text x=\x27540\x27 y=\x27976\x27 font-family=\x27" + F + "\x27 font-size=\x2719\x27 fill=\x27#4b5563\x27 text-anchor=\x27middle\x27>Slide 3/5 \u2022 tutto open source o free tier</text>");
  p.push("</svg>");
  return p.join("\n");
}

var files = [
  { name: "story-ai-vs-agenzia.svg", content: buildStory() },
  { name: "post-ai-vs-agenzia.svg", content: buildPost() },
  { name: "carosello-slide-1.svg", content: buildSlide1() },
  { name: "carosello-slide-2.svg", content: buildSlide2() },
  { name: "carosello-slide-3.svg", content: buildSlide3() }
];

files.forEach(function(f) {
  fs.writeFileSync(OUT + f.name, f.content, "utf8");
  console.log("OK: " + f.name + " (" + f.content.length + " chars)");
});
