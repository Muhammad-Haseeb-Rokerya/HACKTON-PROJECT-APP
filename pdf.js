/* pdf.js – tiny dependency-free PDF writer (A4, Helvetica). Used for payslips and the payroll report. */
function PDF(){const W=595,H=842,pages=[];let cur;
 const ascii=s=>String(s==null?'':s).replace(/[\u2013\u2014]/g,'-').replace(/[\u00b7\u2022]/g,'|').replace(/[^\x20-\x7e]/g,'?').replace(/([\\()])/g,'\\$1');
 const col=c=>c.map(v=>(v/255).toFixed(3)).join(' ');
 const api={W,H,
  page(){cur=[];pages.push(cur);return api},
  rect(x,y,w,h,c){cur.push(col(c)+' rg '+x+' '+(H-y-h)+' '+w+' '+h+' re f');return api},
  line(x1,y1,x2,y2,c,t){cur.push(col(c)+' RG '+(t||.7)+' w '+x1+' '+(H-y1)+' m '+x2+' '+(H-y2)+' l S');return api},
  text(s,x,y,o){o=o||{};const size=o.size||11,f=o.bold?'F2':'F1';let str=ascii(s);
   const w=str.length*size*(o.bold?.56:.52);if(o.align=='right')x-=w;else if(o.align=='center')x-=w/2;
   cur.push('BT /'+f+' '+size+' Tf '+col(o.color||[15,23,42])+' rg '+x.toFixed(1)+' '+(H-y).toFixed(1)+' Td ('+str+') Tj ET');return api},
  save(name){const objs=[];const add=s=>objs.push(s)-1;
   add('<</Type/Catalog/Pages 2 0 R>>');add('');add('<</Type/Font/Subtype/Type1/BaseFont/Helvetica/Encoding/WinAnsiEncoding>>');add('<</Type/Font/Subtype/Type1/BaseFont/Helvetica-Bold/Encoding/WinAnsiEncoding>>');
   const kids=[];pages.forEach(p=>{const body=p.join('\n'),c=add('<</Length '+body.length+'>>\nstream\n'+body+'\nendstream'),pg=add('<</Type/Page/Parent 2 0 R/MediaBox[0 0 '+W+' '+H+']/Resources<</Font<</F1 3 0 R/F2 4 0 R>>>>/Contents '+(c+1)+' 0 R>>');kids.push((pg+1)+' 0 R')});
   objs[1]='<</Type/Pages/Kids['+kids.join(' ')+']/Count '+kids.length+'>>';
   let out='%PDF-1.4\n';const off=[];objs.forEach((o,i)=>{off.push(out.length);out+=(i+1)+' 0 obj\n'+o+'\nendobj\n'});
   const x=out.length;out+='xref\n0 '+(objs.length+1)+'\n0000000000 65535 f \n'+off.map(o=>String(o).padStart(10,'0')+' 00000 n \n').join('')+'trailer\n<</Size '+(objs.length+1)+'/Root 1 0 R>>\nstartxref\n'+x+'\n%%EOF';
   const b=new Uint8Array(out.length);for(let i=0;i<out.length;i++)b[i]=out.charCodeAt(i)&255;
   const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([b],{type:'application/pdf'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}};
 return api.page()}
const accentRGB=()=>{const h=(getComputedStyle(document.documentElement).getPropertyValue('--a')||'').trim();return /^#[0-9a-f]{6}$/i.test(h)?[1,3,5].map(i=>parseInt(h.substr(i,2),16)):[79,70,229]};
const accent2RGB=()=>{const h=(getComputedStyle(document.documentElement).getPropertyValue('--b')||'').trim();return /^#[0-9a-f]{6}$/i.test(h)?[1,3,5].map(i=>parseInt(h.substr(i,2),16)):[249,115,22]};
