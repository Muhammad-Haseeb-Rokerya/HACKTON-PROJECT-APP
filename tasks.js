/* tasks.js – employee task submissions (text or file) and admin review */
const fileLink=t=>t.fdata?`<a href="${t.fdata}" download="${esc(t.fname)}">${esc(t.fname)}</a>`:'-';
function submitTask(){const u=me(),t=$('#tt').value.trim(),x=$('#tx').value.trim(),f=$('#tf').files[0];
if(!t)return alert('Write a task title');if(!x&&!f)return alert('Type your work or choose a file');if(f&&f.size>5e5)return alert('File too large (max 500 KB)');
const save=data=>{const d=DB.get();d.tasks.push({id:Date.now()+'',uid:u.id,title:t,text:x,fname:f?f.name:'',fdata:data||'',date:today(),status:'submitted'});
try{DB.set(d)}catch(e){return alert('Browser storage is full. Use a smaller file.')}$('#tt').value=$('#tx').value=$('#tf').value='';myTasks();confetti(80);alert('📤 Task submitted – nice work!')};
if(f){const r=new FileReader();r.onload=()=>save(r.result);r.readAsDataURL(f)}else save()}
function myTasks(){$('#mt').innerHTML=DB.get().tasks.filter(t=>t.uid==me().id).reverse().map(t=>`<tr><td>${esc(t.title)}</td><td>${esc(t.text||'')}</td><td>${fileLink(t)}</td><td><span class=tag>${t.status}</span></td></tr>`).join('')||'<tr><td colspan=4 class=empty>📝 No tasks submitted yet</td></tr>'}
function adminTasks(){$('#rows').innerHTML=DB.get().tasks.slice().reverse().map(t=>`<tr><td>${esc(nameOf(t.uid))}</td><td>${esc(t.title)}</td><td>${esc(t.text||'')}</td><td>${fileLink(t)}</td><td>${t.date}</td><td><span class=tag>${t.status}</span></td><td>${t.status=='submitted'?`<button class=g onclick="review('${t.id}','accepted')">Accept</button> <button class=r onclick="review('${t.id}','redo')">Redo</button>`:''}</td></tr>`).join('')||'<tr><td colspan=7 class=empty>📝 No submissions yet</td></tr>'}
function review(id,st){const d=DB.get();d.tasks.find(t=>t.id==id).status=st;DB.set(d);adminTasks();alert(st=='accepted'?'🎉 Task accepted':'🔁 Sent back for redo')}
