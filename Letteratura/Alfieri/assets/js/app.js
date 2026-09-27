function setupMapModal() {
  const modal = document.querySelector("[data-map-modal]");
  if (!modal) return;

  const image = modal.querySelector("img");
  const title = modal.querySelector("[data-map-title]");
  const closeButtons = modal.querySelectorAll("[data-close-modal]");

  document.querySelectorAll("[data-open-map]").forEach((button) => {
    button.addEventListener("click", () => {
      image.src = button.dataset.mapSrc;
      image.alt = button.dataset.mapTitle || "Mappa concettuale";
      title.textContent = button.dataset.mapTitle || "Mappa";
      if (typeof modal.showModal === "function") {
        modal.showModal();
      } else {
        modal.setAttribute("open", "");
      }
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", () => modal.close ? modal.close() : modal.removeAttribute("open"));
  });

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.close ? modal.close() : modal.removeAttribute("open");
    }
  });
}


setupMapModal();
if ('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register(new URL((document.body.dataset.root || './')+'service-worker.js',location.href)).catch(()=>{}));
const resume=document.querySelector('[data-home-resume]');
try { const last=JSON.parse(localStorage.getItem('alfieri-study-v10-last-lesson')); if(resume && last && /^[a-z-]+$/.test(last.id) && window.ALFIERI_META?.[last.id]) {resume.href='lezioni/'+last.id+'.html?resume=1';resume.hidden=false;} } catch(_){}
document.querySelectorAll('[data-home-lesson]').forEach(card=>{try{const value=JSON.parse(localStorage.getItem('alfieri-study-v10-progress-'+card.dataset.homeLesson));if(value){const label=card.querySelector('[data-card-progress]');if(label)label.textContent='Lettura: '+Math.round(value.ratio*100)+'%';}}catch(_){}});
