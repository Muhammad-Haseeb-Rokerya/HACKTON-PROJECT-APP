/* attendance.js – attendance rule engine: Present / Late / Half Day from office start + grace */
function attStatus(t,c){const m=mins(t),s=mins(c.start);return m>s+ +c.half?'half day':m>s+ +c.grace?'late':'present'}
function checkIn(){const d=DB.get(),u=me();if(d.att.some(a=>a.uid==u.id&&a.date==today()))return alert('Already checked in today');
const s=attStatus(now(),d.company);d.att.push({uid:u.id,date:today(),in:now(),out:'',status:s});DB.set(d);home();
if(s=='present'){confetti();alert('🎉 Checked in at '+now()+' – right on time!')}else alert('Checked in at '+now()+' ('+s+'). Tomorrow is a fresh start 💪')}
function checkOut(){const d=DB.get(),a=d.att.find(a=>a.uid==me().id&&a.date==today());if(!a)return alert('Check in first');if(a.out)return alert('Already checked out');a.out=now();DB.set(d);home();alert('👋 Checked out at '+a.out+'. See you tomorrow!')}
function showAtt(){$('#att').innerHTML=DB.get().att.filter(a=>a.uid==me().id).reverse().map(a=>`<tr><td>${a.date}</td><td>${a.in}</td><td>${a.out||'-'}</td><td><span class=tag>${a.status}</span></td></tr>`).join('')||'<tr><td colspan=4 class=empty>🗓️ No records yet – check in to start your streak!</td></tr>'}
