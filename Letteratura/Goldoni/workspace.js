/* Disposizione dell’ambiente di studio ripresa dalla PWA di Foscolo. */
(() => {
 'use strict';
 const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
 if(document.body.dataset.page==='home'){
  const themes=[
   ['Venezia','La città mette in relazione nobili, mercanti, lavoratori e pubblico teatrale: un laboratorio di comportamenti e conflitti.','.hs-zante'],
   ['Le maschere','La commedia dell’arte offre tipi riconoscibili e il mestiere degli attori. La riforma trasforma gradualmente questi strumenti in caratteri individuali.','.hs-napoleone'],
   ['Mirandolina','La locandiera dirige il lavoro e costruisce una recita: la sua intelligenza permette di leggere insieme autonomia, seduzione e vincoli sociali.','.hs-ortis'],
   ['Il Cavaliere','Il rifiuto delle donne si incrina davanti alla strategia di Mirandolina. Il personaggio mostra la distanza fra ciò che si dichiara e ciò che si prova.','.hs-sepolcri'],
   ['Mondo e Teatro','Il Mondo offre comportamenti da osservare; il Teatro insegna a trasformarli in azioni, dialoghi e conflitti efficaci sulla scena.','.hs-grazie'],
   ['La riforma','Testo scritto, caratteri e ambienti sociali acquistano rilievo attraverso un cambiamento graduale, condotto nel rapporto con attori e pubblico.','.hs-illusioni']
  ];
  const dialog=$('#figure');let current=-1;
  function theme(delta){current=(current+delta+themes.length)%themes.length;const [title,description,selector]=themes[current];$('#theme-title').textContent=title;$('#theme-text').textContent=description;$('#theme-position').textContent=(current+1)+' di '+themes.length;$('#theme-link').href=$(selector).href;if(!dialog.open)dialog.showModal();}
  $('.hs-theme-prev').addEventListener('click',e=>{e.preventDefault();if(current<0)current=0;theme(-1)});
  $('.hs-theme-next').addEventListener('click',e=>{e.preventDefault();theme(1)});
  $('#theme-prev').addEventListener('click',()=>theme(-1));$('#theme-next').addEventListener('click',()=>theme(1));
  $('#close-theme').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
  $('.hs-install').addEventListener('click',()=>{$('#installazione').open=true});
 }
 if(document.body.dataset.page!=='lesson')return;
 const sidebar=$('.lesson-sidebar'),article=$('.lesson-article'),mobile=matchMedia('(max-width: 820px)');
 const visual=$('#visual-pane'),notes=$('#panel-appunti');
 function syncMobile(){const active=document.body.dataset.mobilePanel;$$('[data-mobile-side]').forEach(b=>{const is=active===(b.dataset.mobileSide==='visual'?'visual':'notes');b.setAttribute('aria-pressed',String(is));b.textContent=is?'Lezione':b.dataset.mobileSide==='visual'?'Osserva':'Appunti'});}
 function side(which){const isNotes=which==='notes';sidebar.dataset.focusPanel=which;visual.hidden=isNotes;notes.hidden=!isNotes;$$('[data-side]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.side===which)));if(mobile.matches)document.body.dataset.mobilePanel=which;syncMobile();}
 function read(){document.body.dataset.mobilePanel='read';syncMobile();}
 window.GoldoniWorkspace={side,read};
 $$('[data-side]').forEach(b=>b.addEventListener('click',()=>side(b.dataset.side)));
 $$('[data-mobile-side]').forEach(b=>b.addEventListener('click',()=>{if(document.body.dataset.mobilePanel===b.dataset.mobileSide)read();else side(b.dataset.mobileSide);}));
 function onBreakpoint(){read();if(!mobile.matches){const which=sidebar.dataset.focusPanel||'visual';visual.hidden=which!=='visual';notes.hidden=which!=='notes';}}
 if(mobile.addEventListener)mobile.addEventListener('change',onBreakpoint);else mobile.addListener?.(onBreakpoint);
 const font=$('#font-menu'),fontTrigger=$('#font-trigger');
 const closeFont=()=>{font.hidden=true;fontTrigger.setAttribute('aria-expanded','false')};
 fontTrigger.addEventListener('click',()=>{font.hidden=!font.hidden;fontTrigger.setAttribute('aria-expanded',String(!font.hidden))});
 $$('#font-menu button').forEach(b=>b.addEventListener('click',closeFont));
 document.addEventListener('pointerdown',e=>{if(!e.target.closest('.focus-font-control'))closeFont()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!font.hidden){closeFont();fontTrigger.focus()}});
 const index=$('#index-dialog'),review=$('#learning-dialog');
 $('#open-index').addEventListener('click',()=>{if(!index.open)index.showModal()});
 $('#open-review').addEventListener('click',()=>window.GoldoniStudy.tab('saperi'));
 $$('[data-close]').forEach(b=>b.addEventListener('click',()=>document.getElementById(b.dataset.close).close()));
 [index,review].forEach(d=>d.addEventListener('click',e=>{if(e.target===d)d.close()}));
 $$('[data-reading-anchor]',index).forEach(a=>a.addEventListener('click',()=>{index.close();read();if(location.hash===a.hash)document.getElementById(a.hash.slice(1))?.scrollIntoView({block:'start'})}));
 $('#resume-reading').addEventListener('click',()=>{index.close();read();window.GoldoniStudy.resume()});
 function progress(){const max=article.scrollHeight-article.clientHeight;const percent=max>0?Math.round(Math.max(0,Math.min(100,article.scrollTop/max*100))):0;$('#reading-percent').textContent=percent+'%';$('#reading-bar').style.width=percent+'%';$('.reading-progress').setAttribute('aria-valuenow',String(percent));}
 article.addEventListener('scroll',progress,{passive:true});
 const sizes=()=>{document.documentElement.style.setProperty('--study-dock-height',$('.study-bottombar').offsetHeight+'px');document.documentElement.style.setProperty('--compliance-height',$('.gbprof-compliance-footer').offsetHeight+'px');progress()};
 window.addEventListener('resize',sizes,{passive:true});window.visualViewport?.addEventListener('resize',sizes,{passive:true});
 if('ResizeObserver'in window){const observer=new ResizeObserver(sizes);observer.observe($('.study-bottombar'));observer.observe($('.gbprof-compliance-footer'));observer.observe(article)}
 side('visual');read();sizes();
 window.dispatchEvent(new Event('goldoni-workspace-ready'));
 if(new URLSearchParams(location.search).get('resume')==='1')requestAnimationFrame(()=>window.GoldoniStudy.resume());
})();
