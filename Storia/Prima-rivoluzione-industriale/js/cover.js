(() => {
'use strict';
const scene=document.querySelector('.cover-scene'),text=document.querySelector('#world-text'),link=document.querySelector('#world-link');
document.querySelectorAll('[data-world]').forEach(button=>button.addEventListener('click',()=>{
 const factory=button.dataset.world==='fabbrica';scene.classList.toggle('world-critique',factory);
 document.querySelectorAll('[data-world]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 text.textContent=factory?'Macchine, salario, orari: il lavoro entra in uno spazio comune e cambia il ritmo della vita.':'Campi, case e botteghe: il lavoro intreccia stagioni, abilità e ordini dei mercanti.';
 link.textContent=factory?'Entra nel tempo della fabbrica →':'Scopri il mondo prima della fabbrica →';link.href=factory?'app.html#lezione-fabbrica':'app.html#lezione-prima';
}));
window.RI_OFFLINE?.();
})();
