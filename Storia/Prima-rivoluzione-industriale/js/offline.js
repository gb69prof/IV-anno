window.RI_OFFLINE=async function(){
 const el=document.querySelector('#offline-status');
 const show=t=>{if(el)el.textContent=t};
 if(!('serviceWorker' in navigator)){show('Offline non disponibile in questo browser.');return}
 try{
  const reg=await navigator.serviceWorker.register('service-worker.js');
  const update=()=>show(navigator.onLine?'Percorso pronto offline':'Sei offline · Percorso disponibile');
  if(reg.active)update();
  else{
   show('Salvataggio del percorso per l’uso offline…');
   await new Promise((resolve,reject)=>{const w=reg.installing||reg.waiting;if(!w){if(reg.active)resolve();else reject();return}if(w.state==='activated'){resolve();return}w.addEventListener('statechange',()=>{if(w.state==='activated')resolve();if(w.state==='redundant')reject()})});
   update();
  }
  window.addEventListener('online',update);window.addEventListener('offline',update);
 }catch{show('Offline non pronto: riapri il percorso con una connessione sicura.');}
};
