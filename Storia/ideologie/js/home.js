(() => {
  const D = window.HIST_DATA;
  document.title = `${D.meta.shortTitle} - gbprof e Libera`;
  document.querySelectorAll('[data-short-title]').forEach(el => { el.textContent = D.meta.shortTitle; });
  const route = document.getElementById('homeRoute');
  route.innerHTML = D.lessons.map(l => `<a class="route-card" href="app.html#lezione/${l.id}"><span class="route-number">${l.number}</span><p class="overline">${l.period}</p><h3>${l.title}</h3><p>${l.eyebrow}</p><b aria-hidden="true">→</b></a>`).join('');
  const people = document.getElementById('homePeople');
  people.innerHTML = D.people.slice(0, 5).map(p => `<a class="portrait-card" href="app.html#biografia/${p.id}"><img src="${p.image}" alt="Ritratto di ${p.name}" loading="lazy"><span><strong>${p.name}</strong><small>${p.role}</small></span></a>`).join('');
  const completed = JSON.parse(localStorage.getItem(`${D.meta.storageKey}:completed`) || '[]');
  document.getElementById('homeProgress').style.width = `${completed.length / D.lessons.length * 100}%`;
  document.getElementById('homeProgressLabel').textContent = `${completed.length} di ${D.lessons.length} lezioni`;
  if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('service-worker.js');
})();
