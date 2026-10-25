/* storage.js – localStorage engine: schema defaults, DB.get/set (per company), helpers */
const $=s=>document.querySelector(s);
(()=>{const o=localStorage.hcm;if(o&&!localStorage.hcm_cos){const c=JSON.parse(o).company;localStorage.hcm_c1=o;localStorage.hcm_cos=JSON.stringify([{id:'c1',name:c?c.name:'My company'}]);localStorage.hcm_cur='c1';localStorage.removeItem('hcm')}})();
const COS=()=>JSON.parse(localStorage.hcm_cos||'[]');
const DB={get(){return Object.assign({company:null,users:[],att:[],leaves:[],tasks:[],pays:[],resigns:[]},JSON.parse(localStorage['hcm_'+localStorage.hcm_cur]||'{}'))},set(d){localStorage['hcm_'+localStorage.hcm_cur]=JSON.stringify(d)}};
const today=()=>new Date().toLocaleDateString('en-CA');
const now=()=>new Date().toTimeString().slice(0,5);
const mins=t=>{const[a,b]=t.split(':');return a*60+ +b};
const esc=s=>String(s).replace(/[<>&"]/g,c=>'&#'+c.charCodeAt(0)+';');
const me=()=>DB.get().users.find(u=>u.id===localStorage.hcm_s);
const nameOf=id=>(DB.get().users.find(u=>u.id==id)||{name:'?'}).name;
