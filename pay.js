/* pay.js – payroll engine: calc(), payroll page, salary alert for employees */
const wkd=iso=>new Date(iso+'T00:00').getDay()%6!=0;
function calc(e,M){const d=DB.get(),t=today(),[Y,N]=M.split('-').map(Number),last=new Date(Y,N,0).getDate();let full=0,due=0;
for(let i=1;i<=last;i++){const iso=M+'-'+String(i).padStart(2,'0');if(wkd(iso)){full++;if(iso<=t)due++}}
const A=d.att.filter(a=>a.uid==e.id&&a.date.startsWith(M)),c=s=>A.filter(a=>a.status==s).length,pres=c('present'),late=c('late'),half=c('half day');
let lv=0;d.leaves.filter(l=>l.uid==e.id&&l.status=='approved').forEach(l=>{for(let x=new Date(l.from+'T00:00');x<=new Date(l.to+'T00:00');x.setDate(x.getDate()+1)){const iso=x.toLocaleDateString('en-CA');if(iso.startsWith(M)&&iso<=t&&wkd(iso))lv++}});
const abs=Math.max(0,due-pres-late-half*.5-lv),ded=Math.round(e.salary/full*abs);return{pres,late,half,lv,abs,ded,due,full,net:e.salary-ded}}
function payroll(){const d=DB.get(),M=$('#m').value;$('#rows').innerHTML=d.users.filter(x=>x.role=='employee'&&!x.resigned).map(e=>{const c=calc(e,M),p=d.pays.find(p=>p.uid==e.id&&p.month==M);
return `<tr><td>${avatar(e.name)}${esc(e.name)}</td><td>${e.salary}</td><td>${c.pres+c.late+c.half}</td><td>${c.lv}</td><td>${c.net}</td><td>${p?'<span class=tag>Paid '+p.date+'</span>':`<button class=g onclick="pay('${e.id}')">Pay</button>`}</td></tr>`}).join('')||'<tr><td colspan=6 class=empty>💼 No employees yet</td></tr>';
const E=d.users.filter(x=>x.role=='employee'&&!x.resigned),k=E.filter(e=>d.pays.some(p=>p.uid==e.id&&p.month==M)).length;
if($('#sum'))$('#sum').innerHTML=E.length?`<b>${k} of ${E.length} paid</b> ${k==E.length?'🎯 All done!':''}<div class=bar><i style="width:${k/E.length*100}%"></i></div>`:''}
function exportPay(){const d=DB.get(),M=$('#m').value,A=accentRGB(),G=[100,116,139],E=d.users.filter(x=>x.role=='employee'&&!x.resigned);if(!E.length)return alert('No employees yet');
const cols=[['Employee',40,'left'],['Salary',250,'right'],['Present',320,'right'],['Leave',385,'right'],['Absent',450,'right'],['Net pay',520,'right'],['Paid',555,'right']];let pdf,y;
const head=()=>{pdf.rect(0,0,595,90,A).rect(0,90,595,5,accent2RGB()).text(d.company.name,40,45,{size:20,bold:1,color:[255,255,255]}).text('PAYROLL  |  '+M,40,70,{size:12,color:[255,255,255]});y=115;
 pdf.rect(40,y,515,26,[241,245,249]);cols.forEach(c=>pdf.text(c[0].toUpperCase(),c[1],y+17,{size:8,bold:1,color:G,align:c[2]}));y+=26};
pdf=PDF();head();let tot=0;
E.forEach(e=>{if(y>780){pdf.page();head()}const c=calc(e,M),paid=d.pays.some(p=>p.uid==e.id&&p.month==M);tot+=c.net;
 [e.name,e.salary,c.pres+c.late+c.half,c.lv,c.abs,c.net,paid?'Yes':'No'].forEach((v,i)=>pdf.text(i==0?String(v).slice(0,30):v,cols[i][1],y+18,{size:10,align:cols[i][2],bold:i==5}));
 pdf.line(40,y+26,555,y+26,[226,232,240]);y+=26});
if(y>760){pdf.page();head()}pdf.rect(40,y+10,515,34,A).text('TOTAL NET PAY',55,y+32,{size:11,bold:1,color:[255,255,255]}).text(tot,540,y+33,{size:14,bold:1,color:[255,255,255],align:'right'});
pdf.save('payroll-'+M+'.pdf')}
function pay(id){const d=DB.get(),M=$('#m').value,e=d.users.find(x=>x.id==id);if(d.pays.some(p=>p.uid==id&&p.month==M))return;if(!confirm('Pay '+e.name+' for '+M+'?'))return;
const c=calc(e,M);d.pays.push({id:Date.now()+'',uid:id,month:M,date:today(),amount:c.net,...c,seen:false});DB.set(d);payroll();confetti(90);alert('💸 Salary sent to '+e.name+'!')}
const payText=p=>`💸 Your salary for ${p.month} has been transmitted: ${p.amount}\nPresent days: ${p.pres+p.late+p.half} (late ${p.late}, half day ${p.half})\nLeave days: ${p.lv}\nAbsent days: ${p.abs}`;
function payAlert(){const d=DB.get(),n=d.pays.filter(p=>p.uid==me().id&&!p.seen);if(!n.length)return;n.forEach(p=>p.seen=true);DB.set(d);confetti(160);alert(n.map(payText).join('\n\n'));myPays()}
function myPays(){$('#mp').innerHTML=DB.get().pays.filter(p=>p.uid==me().id).reverse().map(p=>`<tr><td>${p.month}</td><td>${p.amount}</td><td>${p.pres+p.late+p.half}</td><td>${p.lv}</td><td>${p.date}</td></tr>`).join('')||'<tr><td colspan=5 class=empty>💰 No salary received yet</td></tr>'}
