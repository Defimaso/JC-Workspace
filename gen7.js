const fs = require("fs");
function defs() { return [
  "<defs>",
  "  <radialGradient id=\x27bg\x27>test</radialGradient>",
  "</defs>"
].join("\n"); }
console.log(defs());
