(() => {
  const D = window.NAP_DATA;
  const people = document.getElementById('homePeople');
  if (people) {
    people.innerHTML = D.people.map(person => `
      <a class="portrait-link" href="app.html#biografia/${person.id}">
        <div class="portrait-frame"><img src="${person.image}" alt="Ritratto storico di ${person.name}" loading="lazy"></div>
        <h3>${person.name}</h3><p>${person.role}</p>
      </a>`).join('');
  }

  let completed = [];
  try { completed = JSON.parse(localStorage.getItem('napCompleted') || '[]'); } catch (_) {}
  const count = D.lessons.filter(lesson => completed.includes(lesson.id)).length;
  const bar = document.getElementById('homeProgress');
  const label = document.getElementById('homeProgressLabel');
  if (bar) bar.style.width = `${(count / D.lessons.length) * 100}%`;
  if (label) label.textContent = `${count} di ${D.lessons.length} lezioni`;

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('service-worker.js');
  }
})();
