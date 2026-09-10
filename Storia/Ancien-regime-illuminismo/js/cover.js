(() => {
'use strict';
const scene=document.querySelector('.cover-scene'),text=document.querySelector('#world-text'),link=document.querySelector('#world-link');
document.querySelectorAll('[data-world]').forEach(button=>button.addEventListener('click',()=>{
 const critique=button.dataset.world==='critica';scene.classList.toggle('world-critique',critique);
 document.querySelectorAll('[data-world]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 text.textContent=critique?'Ragione, esperienza, diritti: ciò che è stato ereditato può essere interrogato, discusso e modificato.':'Nascita, appartenenza, privilegi: il posto dell’individuo sembra scritto prima della sua storia.';
 link.textContent=critique?'Entra nelle domande dei Lumi →':'Osserva la società per ordini →';link.href=critique?'app.html#lezione-lumi':'app.html#lezione-ordini';
}));
if('serviceWorker' in navigator){navigator.serviceWorker.register('service-worker.js').then(()=>navigator.serviceWorker.ready).then(()=>{document.querySelector('#offline-status').textContent='Percorso pronto offline'}).catch(()=>{document.querySelector('#offline-status').textContent='Offline non pronto: riapri il percorso con una connessione sicura.'})}else document.querySelector('#offline-status').textContent='Offline non disponibile in questo browser.';
})();
