let entries=[];let isPro=false;
function $(id){return document.getElementById(id);}
function localDateStr(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function haptic(ms=5){if(navigator.vibrate)navigator.vibrate(ms);}
function load(){try{entries=JSON.parse(localStorage.getItem('grat_entries')||'[]');isPro=localStorage.getItem('grat_pro')==='true';}catch(e){entries=[];}render();}
function save(){localStorage.setItem('grat_entries',JSON.stringify(entries));localStorage.setItem('grat_pro',isPro?'true':'false');render();}
function getTotal(){return entries.reduce((a,e)=>a+e.items.length,0);}
function getStreak(){let s=0;for(let i=0;i<365;i++){let d=new Date();d.setDate(d.getDate()-i);let ds=localDateStr(d);if(entries.find(e=>e.date===ds))s++;else break;}return s;}
function render(){
  $('date').textContent=new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'});
  const total=getTotal();$('jarCount').textContent=total;
  const list=$('entriesList');const show=entries.slice().reverse().slice(0,isPro?50:7);
  if(!show.length){list.innerHTML='<div style="text-align:center;padding:30px 0;color:#999;font-weight:500">Your jar is empty. Add your first gratitude.</div>';}
  else{list.innerHTML=show.map(e=>`<div class="entry-card"><div class="entry-date">${e.date}${e.date===localDateStr()?' · Today':''}</div><div class="entry-items">${e.items.map(it=>`<div class="entry-item">${it}</div>`).join('')}</div></div>`).join('');}
  $('upgradeBanner').classList.toggle('hidden',isPro);
}
$('saveBtn').onclick=()=>{
  const items=[$('g1').value.trim(),$('g2').value.trim(),$('g3').value.trim()].filter(Boolean);
  if(items.length===0){alert('Write at least one gratitude');return;}
  const today=localDateStr();const idx=entries.findIndex(e=>e.date===today);
  if(idx>=0){entries[idx].items=items;}else{entries.push({date:today,items:items});}
  if(!isPro&&entries.length>30)entries=entries.slice(-30);
  save();$('g1').value='';$('g2').value='';$('g3').value='';$('g3').blur();haptic([10,30,10]);render();
};
[$('g1'),$('g2'),$('g3')].forEach((inp,idx)=>{inp.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();inp.blur();if(idx===2)$('saveBtn').click();}});});
$('upgradeBtn').onclick=()=>{$('upgradeModal').classList.add('open');};
$('buyPro').onclick=()=>{isPro=true;save();$('upgradeModal').classList.remove('open');haptic([10,30,10]);render();};
$('closeUpgrade').onclick=()=>{$('upgradeModal').classList.remove('open');};
document.querySelector('.modal-backdrop').onclick=()=>document.getElementById('upgradeModal').classList.remove('open');
load();
