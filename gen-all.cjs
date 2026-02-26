const fs = require('fs');
const W = (p, a) => fs.writeFileSync(p, a.join(\n), 'utf8');
const B = 'C:/Users/motok/Desktop/JC/easyai/src/pages/';

// GUIDE.TSX
const g = [];
const p = (s) => g.push(s);
p('import { Link } from react-router-dom;');
p('import SympLogo from @/components/SympLogo;');
p('import { BookOpen, Lock, ArrowRight, Star } from lucide-react;');
