/* app.js – shared UI helpers: toasts, status chips with emoji, mono numbers, avatars, confetti, count-up, CSV export, dark-mode button */
window.alert=m=>{let c=$('#toasts');if(!c){c=document.createElement('div');c.id='toasts';document.body.appendChild(c)}
 const t=document.createElement('div');t.className='toast';t.textContent=m;t.onclick=()=>t.remove();c.appendChild(t);
 setTimeout(()=>t.remove(),Math.min(12000,3000+String(m).length*60))};
const EMO={present:'✅',approved:'👍',accepted:'🎉',done:'✅',paid:'💸',late:'⏰',pending:'⏳',submitted:'📤',half:'🌗',rejected:'✖️',redo:'🔁'};
function decorate(){
 document.querySelectorAll('.tag:not([data-t])').forEach(e=>{e.dataset.t=1;const s=e.textContent.toLowerCase();
  e.classList.add(/^(present|approved|accepted|done|paid)/.test(s)?'ok':/^(late|pending|submitted|half)/.test(s)?'wn':/^(rejected|redo)/.test(s)?'bad':'x');
  const k=Object.keys(EMO).find(k=>s.startsWith(k));if(k)e.textContent=EMO[k]+' '+e.textContent});
 document.querySelectorAll('.t td:not([data-lb])').forEach(e=>{e.dataset.lb=1;const t=e.closest('table'),h=t&&t.tHead&&t.tHead.rows[0];if(h&&e.colSpan==1&&h.cells[e.cellIndex])e.dataset.label=h.cells[e.cellIndex].textContent.trim()});
 document.querySelectorAll('td:not([data-m])').forEach(e=>{e.dataset.m=1;const s=e.textContent.trim();if(s&&/^[\d\s:.,\-→()dh+]+$/.test(s))e.classList.add('mono')})}
new MutationObserver(decorate).observe(document.documentElement,{childList:true,subtree:true});
/* coloured initials avatar, colour is derived from the name */
function avatar(n){n=String(n||'?');let h=0;for(const c of n)h=(h*31+c.charCodeAt(0))%360;
 return `<span class=av style="background:hsl(${h} 65% 48%)">${esc(n.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join(''))}</span>`}
/* confetti burst */
function confetti(n=130){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const c=document.createElement('canvas');c.id='cf';c.width=innerWidth;c.height=innerHeight;document.body.appendChild(c);const x=c.getContext('2d'),
 cols=['#7c3aed','#db2777','#0ea5e9','#059669','#facc15','#e11d48','#4f46e5'];
 const P=Array.from({length:n},()=>({x:innerWidth/2+(Math.random()-.5)*240,y:innerHeight*.62,vx:(Math.random()-.5)*15,vy:-Math.random()*17-4,s:6+Math.random()*6,r:Math.random()*6,vr:(Math.random()-.5)*.4,c:cols[Math.random()*cols.length|0]}));
 let f=0;(function tick(){x.clearRect(0,0,c.width,c.height);P.forEach(p=>{p.vy+=.45;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);x.restore()});
 if(++f<120)requestAnimationFrame(tick);else c.remove()})()}
/* numbers count up from 0 (elements with data-n) */
function countUp(){document.querySelectorAll('[data-n]').forEach(e=>{const to=+e.dataset.n||0,t0=performance.now();
 (function s(t){const k=Math.min(1,(t-t0)/700);e.textContent=Math.round(to*(1-Math.pow(1-k,3))).toLocaleString();if(k<1)requestAnimationFrame(s)})(t0)})}
/* download rows as a CSV file (cells starting with = + - @ are neutralised) */
function csv(name,rows){const q=v=>{v=String(v==null?'':v);if(/^[=+\-@]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"'};
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([rows.map(r=>r.map(q).join(',')).join('\n')],{type:'text/csv'}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),800);alert('⬇️ '+name+' downloaded')}
/* dark / light toggle (remembered) */
addEventListener('DOMContentLoaded',()=>{const b=document.createElement('button'),R=document.documentElement;b.className='fab';b.title='Dark / light mode';
 const set=()=>b.textContent=R.dataset.mode=='dark'?'☀️':'🌙';set();b.onclick=()=>{R.dataset.mode=R.dataset.mode=='dark'?'light':'dark';localStorage.hcm_mode=R.dataset.mode;set()};document.body.appendChild(b)});
