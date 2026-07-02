
const sideNav=document.getElementById('sideNav');
document.getElementById('menuBtn')?.addEventListener('click',()=>sideNav.classList.toggle('open'));
sideNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>sideNav.classList.remove('open')));
const para=document.getElementById('paraphrase');
document.getElementById('toggleParafrasi')?.addEventListener('click',()=>{para.style.display=para.style.display==='none'?'block':'none'});
let scale=1;document.querySelectorAll('[data-font]').forEach(btn=>btn.addEventListener('click',()=>{scale += btn.dataset.font==='plus'?0.06:-0.06; scale=Math.max(.85,Math.min(1.35,scale));document.getElementById('sourceText').style.fontSize=(1.12*scale)+'rem';}));
const modal=document.getElementById('modal');const modalImg=modal.querySelector('img');
document.querySelectorAll('.zoomable').forEach(img=>img.addEventListener('click',()=>{modalImg.src=img.src;modalImg.alt=img.alt;modal.setAttribute('aria-hidden','false')}));
document.getElementById('closeModal').addEventListener('click',()=>modal.setAttribute('aria-hidden','true'));
modal.addEventListener('click',e=>{if(e.target===modal)modal.setAttribute('aria-hidden','true')});
const questions=[
{q:'Perché Parini dedica il poemetto alla Moda?',a:['Perché vuole davvero lodarla','Perché usa una finta dedica per smascherarne il potere','Perché scrive un trattato di abbigliamento'],ok:1},
{q:'Che cosa sono le “dolci redini”?',a:['Una forma di potere persuasivo','Una legge dello Stato','Un tipo di verso'],ok:0},
{q:'Qual è la tecnica dominante del Giorno?',a:['Allegoria medievale','Antifrasi','Narratore onnisciente realistico'],ok:1},
{q:'Che cosa rappresenta il giovin signore?',a:['L’aristocrazia operosa','Il cittadino rivoluzionario','La nobiltà oziosa e improduttiva'],ok:2}
];
let qi=0,score=0;const box=document.getElementById('quizBox');
function renderQ(){if(!box)return;if(qi>=questions.length){box.innerHTML=`<p><strong>Risultato:</strong> ${score}/${questions.length}. ${score===questions.length?'Ottimo: hai colto il meccanismo.':'Rivedi mappe e antifrasi: lì c’è la chiave.'}</p><button onclick="location.reload()">Ricomincia</button>`;return;}const qu=questions[qi];box.innerHTML=`<p><strong>${qi+1}. ${qu.q}</strong></p>`+qu.a.map((x,i)=>`<button data-i="${i}">${x}</button>`).join('');box.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{const ok=+b.dataset.i===qu.ok;b.classList.add(ok?'correct':'wrong');if(ok)score++;setTimeout(()=>{qi++;renderQ()},650)}));}
renderQ();
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
