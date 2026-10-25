/* employees.js – employee directory: add (creates login), edit, delete, search, filter */
function addEmp(){const d=DB.get(),v=k=>$('#'+k).value.trim();
if(!v('en')||!v('ee')||!v('ep')||!v('es'))return alert('Fill all fields');
const email=v('ee').toLowerCase();if(d.users.some(x=>x.email==email))return alert('Email already used');
d.users.push({id:Date.now()+'',role:'employee',name:v('en'),email,pass:v('ep'),dept:v('ed')||'General',salary:+v('es')});
DB.set(d);['en','ee','ep','ed','es'].forEach(k=>$('#'+k).value='');render();confetti(70);alert('🎉 '+d.users[d.users.length-1].name+' added! Login created.')}
function render(){const d=DB.get(),q=$('#q').value.toLowerCase(),f=$('#f').value,E=d.users.filter(x=>x.role=='employee');
$('#f').innerHTML='<option value="">All departments</option>'+[...new Set(E.map(x=>x.dept))].map(x=>`<option ${x==f?'selected':''}>${esc(x)}</option>`).join('');
$('#rows').innerHTML=E.filter(x=>(x.name+x.email).toLowerCase().includes(q)&&(!f||x.dept==f)).map(x=>`<tr><td>${avatar(x.name)}${esc(x.name)}</td><td>${esc(x.email)}</td><td>${esc(x.dept)}</td><td>${x.salary}</td><td><button onclick="edit('${x.id}')">Edit</button> <button class=r onclick="del('${x.id}')">Delete</button></td></tr>`).join('')||'<tr><td colspan=5 class=empty>👥 No employees yet – add your first teammate above!</td></tr>'}
function exportEmp(){const E=DB.get().users.filter(x=>x.role=='employee');csv('employees.csv',[['Name','Email','Department','Monthly salary','Status']].concat(E.map(x=>[x.name,x.email,x.dept,x.salary,x.resigned?'Resigned':'Active'])))}
function edit(id){const d=DB.get(),x=d.users.find(u=>u.id==id);const n=prompt('Name',x.name);if(n===null)return;const p=prompt('Department',x.dept);const s=prompt('Monthly salary',x.salary);
x.name=n.trim()||x.name;x.dept=p||x.dept;x.salary=+s||x.salary;DB.set(d);render()}
function del(id){if(!confirm('Delete this employee and their records?'))return;const d=DB.get();d.users=d.users.filter(u=>u.id!=id);d.att=d.att.filter(a=>a.uid!=id);d.leaves=d.leaves.filter(l=>l.uid!=id);DB.set(d);render()}
