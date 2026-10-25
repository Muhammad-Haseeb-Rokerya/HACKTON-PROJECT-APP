/* auth.js – login, session guard, role check, navigation bar */
const root=location.pathname.includes('/pages/')?'../':'';
function login(e,p){const u=DB.get().users.find(x=>x.email==e.trim().toLowerCase()&&x.pass==p&&!x.resigned);if(!u)return false;localStorage.hcm_s=u.id;return true}
function go(r){location.href=root+(r=='admin'?'pages/admin.html':'pages/employee.html')}
function guard(role){const u=me();if(!u||u.role!=role||u.resigned)location.href=root+'index.html';return u}
const IC={admin:'📊',employees:'👥',tasks:'📝',leaves:'🏖️',payroll:'💰',payslip:'🧾',settings:'⚙️',employee:'🏠'};
function nav(u){const L=u.role=='admin'?[['admin','Dashboard'],['employees','Employees'],['tasks','Tasks'],['leaves','Leaves'],['payroll','Payroll'],['payslip','Payslips'],['settings','Settings']]:[['employee','Home'],['payslip','Payslip']];
const cur=location.pathname.split('/').pop().replace('.html','');
$('#nav').innerHTML='<nav><b>'+esc((DB.get().company||{}).name||'HCM Lite')+'</b><div class=links>'+L.map(l=>`<a class="${l[0]==cur?'on':''}" href="${l[0]}.html">${IC[l[0]]} ${l[1]}</a>`).join('')+`</div><span class=who>${avatar(u.name)}<span class=nm>${esc(u.name)}</span></span><a href="#" onclick="localStorage.removeItem('hcm_s');location.href='${root}index.html'">Logout</a></nav>`;
{const a=$('.links a.on');if(a)$('.links').scrollLeft=a.offsetLeft-24}
$('main').insertAdjacentHTML('afterbegin',`<div class=ph><h1>${IC[cur]||''} ${esc(document.title.replace('HCM Lite - ',''))}</h1><span>${new Date().toDateString()}</span></div>`)}
