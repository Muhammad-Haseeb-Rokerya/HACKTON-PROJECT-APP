/* theme.js – palettes [dark, main, partner], heading fonts, applyTheme() */
const PALETTES={Crimson:['#881337','#e11d48','#f97316'],Indigo:['#312e81','#4f46e5','#0ea5e9'],Ocean:['#0c4a6e','#0284c7','#06b6d4'],Mint:['#065f46','#059669','#0891b2'],Teal:['#115e59','#0d9488','#6366f1'],Grape:['#4c1d95','#7c3aed','#c026d3'],Bubblegum:['#9d174d','#db2777','#7c3aed'],Coral:['#9f1239','#e11d48','#f97316']};
const FONTS=['Fredoka','Plus Jakarta Sans','Playfair Display','Montserrat','Baloo 2','Lora','Raleway','Oswald','Nunito','Space Grotesk'];
function applyTheme(t){if(!t)return;const r=document.documentElement.style,p=PALETTES[t.c];if(p){r.setProperty('--p',p[0]);r.setProperty('--a',p[1]);r.setProperty('--b',p[2])}
if(t.f){r.setProperty('--hf',`'${t.f}',sans-serif`);let l=document.getElementById('gf');if(!l){l=document.createElement('link');l.id='gf';l.rel='stylesheet';document.head.appendChild(l)}l.href='https://fonts.googleapis.com/css2?family='+t.f.replace(/ /g,'+')+':wght@600;700&display=swap'}}
applyTheme((DB.get().company||{}).theme);
