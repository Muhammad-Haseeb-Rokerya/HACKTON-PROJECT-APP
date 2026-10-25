/* helper.js – smart helper chat answering from live localStorage data (with suggestion chips + typing bubble) */
const CHIPS={admin:['Who is late today?','Who is absent?','Pending leaves','How many employees?','Office rules'],employee:['My status today','My leave balance','My salary','Pending leave']};
function helperBox(){const r=me().role;$('#helper').innerHTML='<div id=chat><p class=bot>Hi, I am your helper 🤖 Tap a suggestion or type a question.</p></div><div>'+CHIPS[r].map(c=>`<button class=chip onclick="chip(this)">${c}</button>`).join('')+'</div><input id=hq placeholder="Type a question" onkeydown="if(event.key==\'Enter\')send()"> <button onclick="send()">Ask</button>'}
function chip(b){$('#hq').value=b.textContent;send()}
function send(){const q=$('#hq').value.trim();if(!q)return;$('#hq').value='';const c=$('#chat'),id='t'+Date.now();c.insertAdjacentHTML('beforeend',`<p class=me>${esc(q)}</p><p class=bot id=${id}>…</p>`);c.scrollTop=1e9;
setTimeout(()=>{const e=document.getElementById(id);if(e)e.textContent=ask(q);c.scrollTop=1e9},350)}
function ask(q){q=q.toLowerCase();const d=DB.get(),u=me(),t=today(),A=d.att.filter(a=>a.date==t),adm=u.role=='admin',E=d.users.filter(x=>x.role=='employee');
const list=a=>a.length?a.map(x=>nameOf(x.uid)).join(', '):'nobody';
if(adm){
if(/how many.*employee|total employee|headcount/.test(q))return E.length+' employees.';
if(/late/.test(q))return 'Late today: '+list(A.filter(a=>a.status=='late'))+'.';
if(/half/.test(q))return 'Half day today: '+list(A.filter(a=>a.status=='half day'))+'.';
if(/absent/.test(q)){const on=d.leaves.filter(l=>l.status=='approved'&&l.from<=t&&l.to>=t).map(l=>l.uid);return 'Absent (no check-in, not on leave): '+(E.filter(e=>!A.some(a=>a.uid==e.id)&&!on.includes(e.id)).map(e=>e.name).join(', ')||'nobody')+'.'}
if(/present|checked in|came/.test(q))return A.length+' checked in today: '+list(A)+'.';
if(/pending|leave/.test(q))return d.leaves.filter(l=>l.status=='pending').length+' pending leave request(s).';
if(/start|grace|quota|rule|office/.test(q))return `Office starts ${d.company.start}, grace ${d.company.grace} min, half day after ${d.company.half} min, quota ${d.company.quota} days.`}
else{
if(/balance|left|quota/.test(q))return 'Your leave balance is '+balance(u.id)+' day(s).';
if(/salary|pay/.test(q))return 'Your monthly salary is '+u.salary+'.';
if(/status|today|check|late/.test(q)){const a=A.find(x=>x.uid==u.id);return a?`Checked in at ${a.in} (${a.status})${a.out?', out at '+a.out:''}.`:'You have not checked in today.'}
if(/leave|pending/.test(q))return 'You have '+d.leaves.filter(l=>l.uid==u.id&&l.status=='pending').length+' pending request(s).'}
return "Sorry, I can't answer that yet. Try asking about attendance, leaves, balance or salary."}
