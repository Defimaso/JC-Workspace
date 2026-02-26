const fs = require("fs");
const E = "\u20AC";
const OUT = "C:/Users/motok/Desktop/JC/creatives/";
const F = "system-ui,sans-serif";

function defsBlock() {
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

console.log("defs: " + defsBlock().length);
