const state = {
  chapters: [],
  taxonomy: null,
  didactic: null,
  keyPassages: [],
  chapterGuides: [],
  results: [],
  currentChapter: null,
  filters: {
    q: '',
    chapter: '',
    character: '',
    theme: '',
    place: '',
    timeline: '',
    path: ''
  },
  maps: {
    chapters: new Map(),
    characters: new Map(),
    themes: new Map(),
    places: new Map(),
    timeline: new Map(),
    paths: new Map(),
    passages: new Map()
  }
};

const FILTER_KEYS = ['chapter', 'character', 'theme', 'place', 'timeline', 'path'];
const FILTER_SELECTORS = {
  chapter: '#filterChapter',
  character: '#filterCharacter',
  theme: '#filterTheme',
  place: '#filterPlace',
  timeline: '#filterTimeline',
  path: '#filterPath'
};

const $ = selector => document.querySelector(selector);
const $$ = selector => Array.from(document.querySelectorAll(selector));

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === '') return [];
  return [value];
}

function idsFrom(items) {
  return asArray(items)
    .map(item => {
      if (typeof item === 'string' || typeof item === 'number') return String(item);
      return item?.id ? String(item.id) : '';
    })
    .filter(Boolean);
}

function chapterNumbers(items) {
  return asArray(items)
    .map(Number)
    .filter(number => Number.isFinite(number));
}

function unique(values) {
  return Array.from(new Set(values.filter(value => value !== undefined && value !== null && value !== '')));
}

function intersects(a, b) {
  const bSet = b instanceof Set ? b : new Set(b);
  return a.some(value => bSet.has(value));
}

function byId(list, id) {
  return asArray(list).find(item => String(item.id) === String(id));
}

function chapterByNumber(number) {
  return state.maps.chapters.get(Number(number));
}

function chapterLabel(chapterOrNumber) {
  const chapter = typeof chapterOrNumber === 'object' ? chapterOrNumber : chapterByNumber(chapterOrNumber);
  if (!chapter) return Number(chapterOrNumber) === 0 ? 'Introduzione' : `Capitolo ${chapterOrNumber}`;
  return chapter.number === 0 ? 'Introduzione' : (chapter.title || `Capitolo ${chapter.number}`);
}

function chapterShort(number) {
  return Number(number) === 0 ? 'Introduzione' : `Cap. ${number}`;
}

function entityType(id) {
  if (state.maps.characters.has(String(id))) return 'character';
  if (state.maps.themes.has(String(id))) return 'theme';
  if (state.maps.places.has(String(id))) return 'place';
  if (state.maps.timeline.has(String(id))) return 'timeline';
  return '';
}

function filterForType(type) {
  return type === 'character' || type === 'theme' || type === 'place' || type === 'timeline' ? type : '';
}

function entityName(id) {
  const key = String(id);
  return state.maps.characters.get(key)?.name
    || state.maps.themes.get(key)?.name
    || state.maps.places.get(key)?.name
    || state.maps.timeline.get(key)?.name
    || state.maps.paths.get(key)?.title
    || key;
}

function itemBadge(text, cls = '') {
  return `<span class="badge ${cls}">${escapeHtml(text)}</span>`;
}

function badgeForId(id) {
  const type = entityType(id);
  const cls = type || '';
  return itemBadge(entityName(id), cls);
}

function chipForId(id) {
  const type = entityType(id);
  const filter = filterForType(type);
  if (!filter) return itemBadge(entityName(id), type);
  return `<button class="chip ${type}" data-action="filter" data-filter="${filter}" data-id="${escapeHtml(id)}">${escapeHtml(entityName(id))}</button>`;
}

function highlight(text, query) {
  const safeText = escapeHtml(text);
  const words = normalizeText(query)
    .split(/\s+/)
    .filter(word => word.length > 1)
    .slice(0, 6);
  if (!words.length) return safeText;
  const re = new RegExp(`(${words.map(escapeRegExp).join('|')})`, 'gi');
  return safeText.replace(re, '<mark>$1</mark>');
}

function truncate(text, length = 180) {
  const value = String(text || '').replace(/\s+/g, ' ').trim();
  if (value.length <= length) return value;
  return `${value.slice(0, length - 3).trim()}...`;
}

function contextSnippet(text, query) {
  const value = String(text || '').replace(/\s+/g, ' ').trim();
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  if (!words.length) return truncate(value, 460);

  const normalized = normalizeText(value);
  const firstIndex = words
    .map(word => normalized.indexOf(word))
    .filter(index => index >= 0)
    .sort((a, b) => a - b)[0];

  if (firstIndex === undefined) return truncate(value, 460);
  const start = Math.max(0, firstIndex - 150);
  const end = Math.min(value.length, firstIndex + 330);
  return `${start > 0 ? '... ' : ''}${value.slice(start, end).trim()}${end < value.length ? ' ...' : ''}`;
}

function getEnriched(kind, id) {
  const key = {
    character: 'characterCards',
    theme: 'themeCards',
    place: 'placeCards'
  }[kind];
  return key ? byId(state.didactic?.[key], id) : null;
}

function weightedIds(items) {
  return asArray(items)
    .map(item => {
      if (typeof item === 'string' || typeof item === 'number') return { id: String(item), count: 1 };
      return item?.id ? { id: String(item.id), count: Number(item.count || 1) } : null;
    })
    .filter(Boolean);
}

function rankedIdsFromChapters(chapterNums, field, exclude = []) {
  const chapters = new Set(chapterNums.map(Number));
  const excluded = new Set(exclude);
  const counts = new Map();
  state.chapters.forEach(chapter => {
    if (!chapters.has(chapter.number)) return;
    weightedIds(chapter[field]).forEach(({ id, count }) => {
      if (!excluded.has(id)) counts.set(id, (counts.get(id) || 0) + count);
    });
  });
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || entityName(a[0]).localeCompare(entityName(b[0]), 'it'))
    .map(([id]) => id);
}

function chaptersWithEntity(field, id) {
  return state.chapters
    .filter(chapter => {
      if (idsFrom(chapter[field]).includes(id)) return true;
      return chapter.paragraphs.some(paragraph => idsFrom(paragraph[field]).includes(id));
    })
    .map(chapter => chapter.number);
}

function relatedPassages({ ids = [], chapters = [] }, limit = 8) {
  const idSet = new Set(ids.map(String));
  const chapterSet = new Set(chapters.map(Number));
  return state.keyPassages
    .map(passage => {
      const tagScore = idsFrom(passage.tags).filter(id => idSet.has(id)).length * 5;
      const chapterScore = chapterSet.has(Number(passage.chapter)) ? 2 : 0;
      return { passage, score: tagScore + chapterScore };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.passage.chapter - b.passage.chapter || a.passage.paragraph - b.passage.paragraph)
    .slice(0, limit)
    .map(item => item.passage);
}

function passagesForPath(path, limit = 6) {
  return relatedPassages({ ids: idsFrom(path.themes), chapters: chapterNumbers(path.chapters) }, limit);
}

function makeMaps() {
  state.maps.chapters = new Map(state.chapters.map(chapter => [chapter.number, chapter]));
  state.maps.characters = new Map((state.taxonomy.characters || []).map(item => [String(item.id), item]));
  state.maps.themes = new Map((state.taxonomy.themes || []).map(item => [String(item.id), item]));
  state.maps.places = new Map((state.taxonomy.places || []).map(item => [String(item.id), item]));
  state.maps.timeline = new Map((state.taxonomy.timeline || []).map(item => [String(item.id), item]));
  state.maps.paths = new Map((state.didactic?.guidedPaths || []).map(item => [String(item.id), item]));
  state.maps.passages = new Map(state.keyPassages.map(item => [String(item.id), item]));
}

function fillSelect(selector, list, label, getText = item => item.name || item.title) {
  const element = $(selector);
  element.innerHTML = `<option value="">${escapeHtml(label)}</option>`
    + list.map(item => `<option value="${escapeHtml(item.id)}">${escapeHtml(getText(item))}</option>`).join('');
}

async function init() {
  try {
    const [chapters, taxonomy, didactic, keyPassages, chapterGuides] = await Promise.all([
      fetch('data/chapters.json').then(response => response.json()),
      fetch('data/taxonomy.json').then(response => response.json()),
      fetch('data/didactic_index.json').then(response => response.json()).catch(() => null),
      fetch('data/key_passages.json').then(response => response.json()).catch(() => []),
      fetch('data/chapter_guides.json').then(response => response.json()).catch(() => [])
    ]);

    state.chapters = chapters;
    state.taxonomy = taxonomy;
    state.didactic = didactic || { characterCards: [], themeCards: [], placeCards: [], guidedPaths: [], relationshipHints: [] };
    state.keyPassages = keyPassages;
    state.chapterGuides = chapterGuides;
    makeMaps();

    fillControls();
    renderStats();
    renderQuickLists();
    renderRelationHints();
    renderChaptersGrid();
    renderTaxonomyCards();
    renderPaths();
    renderKeyPassages();
    renderTimeline();
    bind();
    runSearch();
    renderReader(state.chapters.find(chapter => chapter.number === 1) || state.chapters[0]);
    registerServiceWorker();
  } catch (error) {
    $('#results').innerHTML = `<p class="empty-state">Non riesco a caricare i dati dell'atlante. Apri il progetto da un server locale e riprova.</p>`;
    console.error(error);
  }
}

function fillControls() {
  fillSelect(
    '#filterChapter',
    state.chapters.map(chapter => ({ id: String(chapter.number), name: chapterLabel(chapter) })),
    'Tutti i capitoli'
  );
  fillSelect('#filterCharacter', state.taxonomy.characters || [], 'Tutti i personaggi');
  fillSelect('#filterTheme', state.taxonomy.themes || [], 'Tutti i temi');
  fillSelect('#filterPlace', state.taxonomy.places || [], 'Tutti i luoghi');
  fillSelect('#filterTimeline', state.taxonomy.timeline || [], 'Tutte le fasi');
  fillSelect('#filterPath', state.didactic?.guidedPaths || [], 'Tutti i percorsi', item => item.title);
}

function renderStats() {
  const cardsCount = (state.didactic.characterCards || []).length
    + (state.didactic.themeCards || []).length
    + (state.didactic.placeCards || []).length
    + (state.didactic.guidedPaths || []).length;
  $('#statChapters').textContent = state.chapters.filter(chapter => chapter.number > 0).length.toLocaleString('it-IT');
  $('#statPars').textContent = state.chapters.reduce((sum, chapter) => sum + Number(chapter.paragraphCount || 0), 0).toLocaleString('it-IT');
  $('#statCards').textContent = cardsCount.toLocaleString('it-IT');
  $('#statPassages').textContent = state.keyPassages.length.toLocaleString('it-IT');
}

function bind() {
  $('#searchInput').addEventListener('input', event => {
    state.filters.q = event.target.value;
    runSearch();
  });

  FILTER_KEYS.forEach(key => {
    $(FILTER_SELECTORS[key]).addEventListener('change', event => {
      state.filters[key] = event.target.value;
      runSearch();
    });
  });

  $('#resetBtn').addEventListener('click', clearFilters);
  $('#printBtn').addEventListener('click', () => window.print());
  $('#showAllBtn').addEventListener('click', () => {
    clearFilters(false);
    runSearch(true);
  });

  $$('.nav-actions [data-scroll]').forEach(button => {
    button.addEventListener('click', () => document.querySelector(button.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' }));
  });

  document.addEventListener('click', handleDocumentClick);
  document.addEventListener('keydown', handleKeyboardOpen);
  window.addEventListener('online', updatePwaStatus);
  window.addEventListener('offline', updatePwaStatus);
}

function handleDocumentClick(event) {
  const action = event.target.closest('[data-action]');
  if (action) {
    event.preventDefault();
    event.stopPropagation();
    handleAction(action);
    return;
  }

  const card = event.target.closest('[data-detail-kind][data-id]');
  if (!card) return;
  openDetail(card.dataset.detailKind, card.dataset.id);
}

function handleKeyboardOpen(event) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  if (event.target.closest('button, a, input, select, textarea')) return;
  const card = event.target.closest('[data-detail-kind][data-id]');
  if (!card) return;
  event.preventDefault();
  openDetail(card.dataset.detailKind, card.dataset.id);
}

function handleAction(action) {
  const type = action.dataset.action;
  if (type === 'filter') {
    setFilter(action.dataset.filter, action.dataset.id);
    return;
  }
  if (type === 'open-chapter') {
    const chapter = chapterByNumber(action.dataset.chapter);
    renderReader(chapter, Number(action.dataset.paragraph || 0));
    $('#reader').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (type === 'detail') {
    openDetail(action.dataset.kind, action.dataset.id);
    return;
  }
  if (type === 'close-detail') {
    $('#detailPanel').classList.add('hidden');
  }
}

function setFilter(key, value, scroll = true) {
  if (!(key in state.filters)) return;
  state.filters[key] = String(value || '');
  syncFilterInputs();
  runSearch();
  if (scroll) $('#search').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function clearFilters(scroll = true) {
  state.filters = { q: '', chapter: '', character: '', theme: '', place: '', timeline: '', path: '' };
  syncFilterInputs();
  runSearch();
  if (scroll) $('#search').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function syncFilterInputs() {
  $('#searchInput').value = state.filters.q;
  FILTER_KEYS.forEach(key => {
    $(FILTER_SELECTORS[key]).value = state.filters[key];
  });
}

function runSearch(showAll = false) {
  const filters = state.filters;
  const query = filters.q.trim();
  const qWords = normalizeText(query).split(/\s+/).filter(Boolean);
  const path = filters.path ? state.maps.paths.get(filters.path) : null;
  const pathChapters = new Set(chapterNumbers(path?.chapters));
  const pathThemes = new Set(idsFrom(path?.themes));
  const results = [];

  for (const chapter of state.chapters) {
    if (filters.chapter && String(chapter.number) !== filters.chapter) continue;
    if (filters.timeline && chapter.timeline !== filters.timeline) continue;
    if (filters.character && !chapterOrParagraphHas(chapter, 'characters', filters.character)) continue;
    if (filters.place && !chapterOrParagraphHas(chapter, 'places', filters.place)) continue;
    if (filters.theme && !chapterOrParagraphHas(chapter, 'themes', filters.theme)) continue;
    if (path && !chapterMatchesPath(chapter, pathChapters, pathThemes)) continue;

    for (const paragraph of chapter.paragraphs) {
      if (filters.character && !paragraphOrChapterHas(paragraph, chapter, 'characters', filters.character)) continue;
      if (filters.place && !paragraphOrChapterHas(paragraph, chapter, 'places', filters.place)) continue;
      if (filters.theme && !paragraphOrChapterHas(paragraph, chapter, 'themes', filters.theme)) continue;
      if (path && !paragraphMatchesPath(paragraph, chapter, pathChapters, pathThemes)) continue;

      let score = 1;
      if (qWords.length) {
        const normalizedParagraph = normalizeText(paragraph.text);
        if (!qWords.every(word => normalizedParagraph.includes(word))) continue;
        score += 10 + qWords.reduce((sum, word) => sum + normalizedParagraph.split(word).length - 1, 0);
      }
      if (path && pathChapters.has(chapter.number)) score += 2;
      results.push({ chapter, paragraph, score });
    }
  }

  results.sort((a, b) => b.score - a.score || a.chapter.number - b.chapter.number || a.paragraph.n - b.paragraph.n);
  state.results = showAll ? results : results;
  renderResults();
  renderActiveFilters();
}

function chapterOrParagraphHas(chapter, field, id) {
  return idsFrom(chapter[field]).includes(id)
    || chapter.paragraphs.some(paragraph => idsFrom(paragraph[field]).includes(id));
}

function paragraphOrChapterHas(paragraph, chapter, field, id) {
  return idsFrom(paragraph[field]).includes(id) || idsFrom(chapter[field]).includes(id);
}

function chapterMatchesPath(chapter, pathChapters, pathThemes) {
  return pathChapters.has(chapter.number) || intersects(idsFrom(chapter.themes), pathThemes);
}

function paragraphMatchesPath(paragraph, chapter, pathChapters, pathThemes) {
  return pathChapters.has(chapter.number)
    || intersects(idsFrom(paragraph.themes), pathThemes)
    || intersects(idsFrom(chapter.themes), pathThemes);
}

function renderActiveFilters() {
  const filters = state.filters;
  const badges = [];
  if (filters.q) badges.push(itemBadge(`testo: "${filters.q}"`));
  if (filters.chapter) badges.push(itemBadge(chapterLabel(filters.chapter)));
  if (filters.character) badges.push(itemBadge(entityName(filters.character), 'character'));
  if (filters.theme) badges.push(itemBadge(entityName(filters.theme), 'theme'));
  if (filters.place) badges.push(itemBadge(entityName(filters.place), 'place'));
  if (filters.timeline) badges.push(itemBadge(entityName(filters.timeline), 'timeline'));
  if (filters.path) badges.push(itemBadge(state.maps.paths.get(filters.path)?.title || filters.path, 'path'));
  $('#activeFilters').innerHTML = badges.length
    ? badges.join('')
    : '<span class="muted">Nessun filtro attivo.</span>';
}

function renderResults() {
  const max = 140;
  const shown = state.results.slice(0, max);
  $('#resultCounter').textContent = `${state.results.length.toLocaleString('it-IT')} risultati`;
  if (!shown.length) {
    $('#results').innerHTML = '<p class="empty-state">Nessun risultato per i filtri selezionati.</p>';
    return;
  }

  $('#results').innerHTML = shown.map(({ chapter, paragraph }) => {
    const tags = [
      ...idsFrom(paragraph.characters).slice(0, 4).map(badgeForId),
      ...idsFrom(paragraph.places).slice(0, 3).map(badgeForId),
      ...idsFrom(paragraph.themes).slice(0, 4).map(badgeForId)
    ].join('');
    return `<article class="result-card">
      <div class="result-meta">
        <button class="text-button" data-action="open-chapter" data-chapter="${chapter.number}" data-paragraph="${paragraph.n}">${escapeHtml(chapterLabel(chapter))}</button>
        ${itemBadge(`par. ${paragraph.n}`)}
        ${chapter.timeline ? itemBadge(entityName(chapter.timeline), 'timeline') : ''}
      </div>
      <p class="result-text">${highlight(contextSnippet(paragraph.text, state.filters.q), state.filters.q)}</p>
      <div class="result-tags">${tags}</div>
      <div class="card-actions">
        <button class="pill" data-action="open-chapter" data-chapter="${chapter.number}" data-paragraph="${paragraph.n}">Apri testo</button>
        <button class="pill ghost" data-action="detail" data-kind="chapter" data-id="${chapter.number}">Scheda capitolo</button>
      </div>
    </article>`;
  }).join('') + (state.results.length > max
    ? `<p class="muted result-limit">Mostrati i primi ${max} risultati. Raffina i filtri per una concordanza più precisa.</p>`
    : '');
}

function renderReader(chapter, paragraphNumber = 0) {
  if (!chapter) return;
  state.currentChapter = chapter;
  const guide = state.chapterGuides.find(item => Number(item.chapter) === chapter.number);
  const tags = [
    ...idsFrom(chapter.characters).slice(0, 6).map(badgeForId),
    ...idsFrom(chapter.places).slice(0, 4).map(badgeForId),
    ...idsFrom(chapter.themes).slice(0, 6).map(badgeForId)
  ].join('');

  $('#reader').classList.remove('hidden');
  $('#readerTitle').textContent = chapterLabel(chapter);
  $('#readerSummary').textContent = chapter.summary || '';
  $('#readerStats').innerHTML = `${itemBadge(`${Number(chapter.paragraphCount || chapter.paragraphs.length).toLocaleString('it-IT')} paragrafi`)} ${itemBadge(`${Number(chapter.wordCount || 0).toLocaleString('it-IT')} parole`)}`;
  $('#readerTags').innerHTML = tags;
  $('#chapterGuideBox').innerHTML = guide ? renderChapterGuide(guide) : '';
  $('#readerBody').innerHTML = chapter.paragraphs
    .map(paragraph => `<p id="${escapeHtml(chapter.id)}-p${paragraph.n}" data-paragraph="${paragraph.n}">${highlight(paragraph.text, state.filters.q)}</p>`)
    .join('');

  if (paragraphNumber) {
    setTimeout(() => {
      const target = document.getElementById(`${chapter.id}-p${paragraphNumber}`);
      if (!target) return;
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('focus-par');
      setTimeout(() => target.classList.remove('focus-par'), 2200);
    }, 100);
  }
}

function renderChapterGuide(guide) {
  const questions = asArray(guide.questions)
    .map(question => `<li>${escapeHtml(question)}</li>`)
    .join('');
  return `<div>
    <h3>${escapeHtml(guide.title || guide.chapterTitle || 'Guida al capitolo')}</h3>
    <p><strong>Cosa succede:</strong> ${escapeHtml(guide.whatHappens || '')}</p>
    <p><strong>Perché conta:</strong> ${escapeHtml(guide.whyItMatters || '')}</p>
    <p><strong>Uso in classe:</strong> ${escapeHtml(guide.classroomUse || '')}</p>
    ${questions ? `<ul>${questions}</ul>` : ''}
  </div>`;
}

function renderQuickLists() {
  const quickThemes = ['provvidenza', 'provvida-sventura', 'potere-sopruso', 'giustizia', 'paura', 'conversione', 'peste', 'perdono']
    .map(id => state.maps.themes.get(id))
    .filter(Boolean);
  const quickCharacters = ['renzo', 'lucia', 'don-abbondio', 'fra-cristoforo', 'don-rodrigo', 'gertrude', 'innominato', 'federigo']
    .map(id => state.maps.characters.get(id))
    .filter(Boolean);

  $('#quickThemes').innerHTML = quickThemes.map(item => quickButton(item, 'theme')).join('');
  $('#quickCharacters').innerHTML = quickCharacters.map(item => quickButton(item, 'character')).join('');
}

function quickButton(item, filter) {
  return `<button class="quick-item" data-action="filter" data-filter="${filter}" data-id="${escapeHtml(item.id)}">
    <strong>${escapeHtml(item.name)}</strong>
    <small>${escapeHtml(truncate(item.description || '', 92))}</small>
  </button>`;
}

function renderRelationHints() {
  const hints = state.didactic?.relationshipHints || [];
  $('#relationHints').innerHTML = hints.slice(0, 8).map(hint => {
    const fromType = entityType(hint.from);
    const toType = entityType(hint.to);
    return `<div class="relation-item">
      <div>
        <button class="text-button" data-action="detail" data-kind="${fromType}" data-id="${escapeHtml(hint.from)}">${escapeHtml(entityName(hint.from))}</button>
        <span>${escapeHtml(hint.type || 'relazione')}</span>
        <button class="text-button" data-action="detail" data-kind="${toType}" data-id="${escapeHtml(hint.to)}">${escapeHtml(entityName(hint.to))}</button>
      </div>
      <p>${escapeHtml(hint.note || '')}</p>
    </div>`;
  }).join('');
}

function renderChaptersGrid() {
  $('#chaptersGrid').innerHTML = state.chapters.map(chapter => {
    const guide = state.chapterGuides.find(item => Number(item.chapter) === chapter.number);
    const passages = state.keyPassages.filter(passage => Number(passage.chapter) === chapter.number);
    const themeBadges = idsFrom(chapter.themes).slice(0, 4).map(badgeForId).join('');
    return `<article class="atlas-card chapter-card" tabindex="0" role="button" data-detail-kind="chapter" data-id="${chapter.number}">
      <div class="card-topline">${escapeHtml(chapterShort(chapter.number))}</div>
      <h3>${escapeHtml(chapterLabel(chapter))}</h3>
      <p>${escapeHtml(truncate(guide?.whatHappens || chapter.summary, 185))}</p>
      <div class="badges">${themeBadges}</div>
      <div class="card-meta">
        <span>${Number(chapter.paragraphCount || chapter.paragraphs.length).toLocaleString('it-IT')} paragrafi</span>
        <span>${passages.length} passi</span>
      </div>
      <div class="card-actions">
        <button class="pill" data-action="open-chapter" data-chapter="${chapter.number}">Leggi</button>
        <button class="pill ghost" data-action="filter" data-filter="chapter" data-id="${chapter.number}">Filtra</button>
      </div>
    </article>`;
  }).join('');
}

function renderTaxonomyCards() {
  $('#charactersGrid').innerHTML = (state.taxonomy.characters || []).map(item => taxonomyCard(item, 'character')).join('');
  $('#themesGrid').innerHTML = (state.taxonomy.themes || []).map(item => taxonomyCard(item, 'theme')).join('');
  $('#placesGrid').innerHTML = (state.taxonomy.places || []).map(item => taxonomyCard(item, 'place')).join('');
}

function taxonomyCard(item, kind) {
  const enriched = getEnriched(kind, item.id);
  const detail = detailForTaxonomy(kind, item.id, false);
  const description = enriched?.function
    || enriched?.definition
    || enriched?.symbolicFunction
    || item.description
    || '';
  return `<article class="atlas-card" tabindex="0" role="button" data-detail-kind="${kind}" data-id="${escapeHtml(item.id)}">
    <div class="card-topline">${escapeHtml(kindLabel(kind))}</div>
    <h3>${escapeHtml(item.name)}</h3>
    <p>${escapeHtml(truncate(description, 170))}</p>
    <div class="badges">${detail.themeIds.slice(0, 4).map(badgeForId).join('')}</div>
    <div class="card-meta">
      <span>${detail.chapters.length} capitoli</span>
      <span>${detail.passages.length} passi</span>
    </div>
    <div class="card-actions">
      <button class="pill" data-action="filter" data-filter="${kind}" data-id="${escapeHtml(item.id)}">Cerca</button>
      <button class="pill ghost" data-action="detail" data-kind="${kind}" data-id="${escapeHtml(item.id)}">Scheda</button>
    </div>
  </article>`;
}

function kindLabel(kind) {
  return {
    character: 'Personaggio',
    theme: 'Tema',
    place: 'Luogo',
    path: 'Percorso',
    passage: 'Passo chiave',
    timeline: 'Fase narrativa'
  }[kind] || 'Scheda';
}

function renderPaths() {
  const paths = state.didactic?.guidedPaths || [];
  $('#pathsGrid').innerHTML = paths.map(path => {
    const chapters = chapterNumbers(path.chapters);
    const characterIds = rankedIdsFromChapters(chapters, 'characters').slice(0, 5);
    const passageList = passagesForPath(path, 4);
    return `<article class="path-card atlas-card" tabindex="0" role="button" data-detail-kind="path" data-id="${escapeHtml(path.id)}">
      <div class="card-topline">Percorso guidato</div>
      <h3>${escapeHtml(path.title)}</h3>
      <p>${escapeHtml(path.subtitle || '')}</p>
      <div class="linked-rows">
        ${linkedRow('Capitoli', chapters.map(number => `<span>${escapeHtml(chapterShort(number))}</span>`).join(''))}
        ${linkedRow('Personaggi', characterIds.map(badgeForId).join(''))}
        ${linkedRow('Temi', idsFrom(path.themes).map(badgeForId).join(''))}
        ${linkedRow('Passi', passageList.map(passage => `<button class="text-button" data-action="open-chapter" data-chapter="${passage.chapter}" data-paragraph="${passage.paragraph}">${escapeHtml(passage.title)}</button>`).join(''))}
      </div>
      <p class="student-task"><strong>Consegna:</strong> ${escapeHtml(path.finalQuestion || '')}</p>
      <div class="card-actions">
        <button class="pill" data-action="filter" data-filter="path" data-id="${escapeHtml(path.id)}">Avvia itinerario</button>
        <button class="pill ghost" data-action="detail" data-kind="path" data-id="${escapeHtml(path.id)}">Scheda</button>
      </div>
    </article>`;
  }).join('');
}

function linkedRow(label, content) {
  return `<div class="linked-row"><strong>${escapeHtml(label)}</strong><div>${content || '<span class="muted">Non indicati</span>'}</div></div>`;
}

function renderKeyPassages() {
  $('#keyPassagesGrid').innerHTML = state.keyPassages.map(passage => {
    const tagBadges = idsFrom(passage.tags).slice(0, 6).map(badgeForId).join('');
    return `<article class="passage-card atlas-card" tabindex="0" role="button" data-detail-kind="passage" data-id="${escapeHtml(passage.id)}">
      <div class="result-meta">
        <button class="text-button" data-action="open-chapter" data-chapter="${passage.chapter}" data-paragraph="${passage.paragraph}">${escapeHtml(chapterShort(passage.chapter))} · par. ${escapeHtml(passage.paragraph)}</button>
      </div>
      <h3>${escapeHtml(passage.title)}</h3>
      <p class="focus">${escapeHtml(passage.focus || '')}</p>
      <blockquote>${highlight(passage.text || '', '')}</blockquote>
      <div class="badges">${tagBadges}</div>
      <p><strong>Perché conta:</strong> ${escapeHtml(passage.whyItMatters || '')}</p>
      <p class="student-task"><strong>Consegna:</strong> ${escapeHtml(passage.studentTask || '')}</p>
      <div class="card-actions">
        <button class="pill" data-action="open-chapter" data-chapter="${passage.chapter}" data-paragraph="${passage.paragraph}">Apri testo</button>
        <button class="pill ghost" data-action="detail" data-kind="passage" data-id="${escapeHtml(passage.id)}">Scheda</button>
      </div>
    </article>`;
  }).join('');
}

function renderTimeline() {
  $('#timelineGrid').innerHTML = (state.taxonomy.timeline || []).map(item => {
    const chapters = chapterNumbers(item.chapters);
    const characterIds = rankedIdsFromChapters(chapters, 'characters').slice(0, 4);
    return `<article class="atlas-card path-card" tabindex="0" role="button" data-detail-kind="timeline" data-id="${escapeHtml(item.id)}">
      <div class="card-topline">Fase narrativa</div>
      <h3>${escapeHtml(item.name)}</h3>
      <p>${escapeHtml(item.description || '')}</p>
      <div class="linked-rows">
        ${linkedRow('Capitoli', chapters.map(number => `<span>${escapeHtml(chapterShort(number))}</span>`).join(''))}
        ${linkedRow('Personaggi', characterIds.map(badgeForId).join(''))}
      </div>
      <div class="card-actions">
        <button class="pill" data-action="filter" data-filter="timeline" data-id="${escapeHtml(item.id)}">Filtra fase</button>
        <button class="pill ghost" data-action="detail" data-kind="timeline" data-id="${escapeHtml(item.id)}">Scheda</button>
      </div>
    </article>`;
  }).join('');
}

function openDetail(kind, id) {
  const detail = getDetail(kind, id);
  if (!detail) return;
  $('#detailKicker').textContent = detail.kicker;
  $('#detailTitle').textContent = detail.title;
  $('#detailContent').innerHTML = renderDetail(detail);
  const panel = $('#detailPanel');
  panel.classList.remove('hidden');
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  panel.focus({ preventScroll: true });
}

function getDetail(kind, id) {
  if (kind === 'chapter') return detailForChapter(Number(id));
  if (kind === 'character' || kind === 'theme' || kind === 'place') return detailForTaxonomy(kind, id);
  if (kind === 'path') return detailForPath(id);
  if (kind === 'passage') return detailForPassage(id);
  if (kind === 'timeline') return detailForTimeline(id);
  return null;
}

function detailForChapter(number) {
  const chapter = chapterByNumber(number);
  if (!chapter) return null;
  const guide = state.chapterGuides.find(item => Number(item.chapter) === number);
  const passages = state.keyPassages.filter(passage => Number(passage.chapter) === number);
  return {
    kicker: 'Scheda capitolo',
    title: chapterLabel(chapter),
    description: guide?.whatHappens || chapter.summary || '',
    chapters: [number],
    themeIds: idsFrom(guide?.mainThemes).length ? idsFrom(guide.mainThemes) : idsFrom(chapter.themes),
    characterIds: idsFrom(guide?.mainCharacters).length ? idsFrom(guide.mainCharacters) : idsFrom(chapter.characters),
    placeIds: idsFrom(guide?.mainPlaces).length ? idsFrom(guide.mainPlaces) : idsFrom(chapter.places),
    passages,
    studentTask: asArray(guide?.questions).join(' '),
    notes: [
      guide?.whyItMatters ? { label: 'Perché conta', text: guide.whyItMatters } : null,
      guide?.classroomUse ? { label: 'Uso in classe', text: guide.classroomUse } : null
    ].filter(Boolean)
  };
}

function detailForTaxonomy(kind, id, includeNotes = true) {
  const source = state.maps[`${kind}s`]?.get(String(id));
  const enriched = getEnriched(kind, id);
  if (!source && !enriched) return null;

  const directChapters = chapterNumbers(enriched?.keyChapters);
  const discoveredChapters = chaptersWithEntity(`${kind}s`, String(id));
  const chapters = unique([...directChapters, ...discoveredChapters]).map(Number).sort((a, b) => a - b);

  const themeIds = kind === 'theme'
    ? unique([String(id), ...idsFrom(enriched?.linkedThemes), ...rankedIdsFromChapters(chapters, 'themes').slice(0, 8)])
    : unique([...(idsFrom(enriched?.keyThemes).length ? idsFrom(enriched.keyThemes) : idsFrom(enriched?.linkedThemes)), ...rankedIdsFromChapters(chapters, 'themes').slice(0, 8)]);

  const characterIds = kind === 'character'
    ? unique([String(id), ...rankedIdsFromChapters(chapters, 'characters', [String(id)]).slice(0, 8)])
    : unique([...(idsFrom(enriched?.keyCharacters) || []), ...rankedIdsFromChapters(chapters, 'characters').slice(0, 8)]);

  const placeIds = kind === 'place'
    ? unique([String(id), ...rankedIdsFromChapters(chapters, 'places', [String(id)]).slice(0, 5)])
    : rankedIdsFromChapters(chapters, 'places').slice(0, 6);

  const passages = relatedPassages({ ids: unique([String(id), ...themeIds, ...characterIds, ...placeIds]), chapters }, 8);
  const description = enriched?.function
    || enriched?.definition
    || enriched?.symbolicFunction
    || source?.description
    || '';

  const notes = includeNotes ? [
    enriched?.arc ? { label: 'Arco', text: enriched.arc } : null,
    enriched?.centralConflict ? { label: 'Conflitto', text: enriched.centralConflict } : null,
    enriched?.howItWorks ? { label: 'Come funziona', text: enriched.howItWorks } : null,
    enriched?.avoid ? { label: 'Attenzione', text: enriched.avoid } : null,
    enriched?.warning ? { label: 'Nota', text: enriched.warning } : null,
    enriched?.classUse ? { label: 'Uso in classe', text: enriched.classUse } : null
  ].filter(Boolean) : [];

  return {
    kicker: `Scheda ${kindLabel(kind).toLowerCase()}`,
    title: enriched?.name || source?.name || id,
    description,
    chapters,
    themeIds,
    characterIds,
    placeIds,
    passages,
    studentTask: enriched?.classQuestion || enriched?.classUse || '',
    notes
  };
}

function detailForPath(id) {
  const path = state.maps.paths.get(String(id));
  if (!path) return null;
  const chapters = chapterNumbers(path.chapters);
  const themeIds = idsFrom(path.themes);
  const characterIds = rankedIdsFromChapters(chapters, 'characters').slice(0, 8);
  const placeIds = rankedIdsFromChapters(chapters, 'places').slice(0, 6);
  return {
    kicker: 'Scheda percorso guidato',
    title: path.title,
    description: path.subtitle || '',
    chapters,
    themeIds,
    characterIds,
    placeIds,
    passages: passagesForPath(path, 8),
    studentTask: path.finalQuestion || '',
    steps: asArray(path.steps),
    notes: []
  };
}

function detailForPassage(id) {
  const passage = state.maps.passages.get(String(id));
  if (!passage) return null;
  const tagIds = idsFrom(passage.tags);
  const themeIds = tagIds.filter(tag => entityType(tag) === 'theme');
  const characterIds = tagIds.filter(tag => entityType(tag) === 'character');
  const placeIds = tagIds.filter(tag => entityType(tag) === 'place');
  const fallbackCharacters = rankedIdsFromChapters([Number(passage.chapter)], 'characters').slice(0, 5);
  return {
    kicker: 'Scheda passo chiave',
    title: passage.title,
    description: passage.focus || '',
    chapters: [Number(passage.chapter)],
    themeIds: themeIds.length ? themeIds : rankedIdsFromChapters([Number(passage.chapter)], 'themes').slice(0, 5),
    characterIds: characterIds.length ? characterIds : fallbackCharacters,
    placeIds,
    passages: [passage],
    studentTask: passage.studentTask || '',
    notes: [
      passage.whyItMatters ? { label: 'Perché conta', text: passage.whyItMatters } : null
    ].filter(Boolean)
  };
}

function detailForTimeline(id) {
  const timeline = state.maps.timeline.get(String(id));
  if (!timeline) return null;
  const chapters = chapterNumbers(timeline.chapters);
  return {
    kicker: 'Scheda fase narrativa',
    title: timeline.name,
    description: timeline.description || '',
    chapters,
    themeIds: rankedIdsFromChapters(chapters, 'themes').slice(0, 8),
    characterIds: rankedIdsFromChapters(chapters, 'characters').slice(0, 8),
    placeIds: rankedIdsFromChapters(chapters, 'places').slice(0, 6),
    passages: relatedPassages({ ids: rankedIdsFromChapters(chapters, 'themes').slice(0, 8), chapters }, 8),
    studentTask: '',
    notes: []
  };
}

function renderDetail(detail) {
  return `<div class="detail-grid">
    <div class="detail-main">
      <p class="detail-description">${escapeHtml(detail.description || 'Descrizione non indicata nei dati.')}</p>
      ${detail.notes?.length ? `<div class="detail-notes">${detail.notes.map(note => `<p><strong>${escapeHtml(note.label)}:</strong> ${escapeHtml(note.text)}</p>`).join('')}</div>` : ''}
      ${detail.steps?.length ? `<ol class="steps-list">${detail.steps.map(step => `<li><strong>${escapeHtml(chapterShort(step.chapter))} · ${escapeHtml(step.title || '')}</strong><span>${escapeHtml(step.point || '')}</span></li>`).join('')}</ol>` : ''}
      ${detail.studentTask ? `<p class="student-task large"><strong>Consegna didattica:</strong> ${escapeHtml(detail.studentTask)}</p>` : ''}
    </div>
    <div class="detail-side">
      ${renderDetailChapters(detail.chapters)}
      ${renderDetailEntities('Temi collegati', detail.themeIds)}
      ${renderDetailEntities('Personaggi collegati', detail.characterIds)}
      ${renderDetailEntities('Luoghi collegati', detail.placeIds)}
      ${renderDetailPassages(detail.passages)}
    </div>
  </div>`;
}

function renderDetailChapters(chapters) {
  const content = chapters?.length
    ? chapters.map(number => `<button class="chip" data-action="filter" data-filter="chapter" data-id="${number}">${escapeHtml(chapterLabel(number))}</button>`).join('')
    : '<span class="muted">Non indicati nei dati.</span>';
  return `<section class="detail-block"><h3>Capitoli collegati</h3><div class="chip-list">${content}</div></section>`;
}

function renderDetailEntities(title, ids) {
  const content = ids?.length
    ? ids.slice(0, 12).map(chipForId).join('')
    : '<span class="muted">Non indicati nei dati.</span>';
  return `<section class="detail-block"><h3>${escapeHtml(title)}</h3><div class="chip-list">${content}</div></section>`;
}

function renderDetailPassages(passages) {
  const content = passages?.length
    ? `<ul class="detail-passages">${passages.map(passage => `<li>
        <button class="text-button" data-action="open-chapter" data-chapter="${passage.chapter}" data-paragraph="${passage.paragraph}">${escapeHtml(passage.title)}</button>
        <span>${escapeHtml(chapterShort(passage.chapter))} · par. ${escapeHtml(passage.paragraph)}</span>
      </li>`).join('')}</ul>`
    : '<span class="muted">Non indicati nei dati.</span>';
  return `<section class="detail-block"><h3>Passi chiave</h3>${content}</section>`;
}

function registerServiceWorker() {
  updatePwaStatus();
  if (!('serviceWorker' in navigator)) {
    $('#pwaStatus').textContent = 'Il browser non supporta il service worker.';
    return;
  }
  if (location.protocol === 'file:') {
    $('#pwaStatus').textContent = 'Per offline e installazione apri la cartella da un server locale.';
    return;
  }
  navigator.serviceWorker.register('./service-worker.js')
    .then(() => {
      updatePwaStatus();
    })
    .catch(() => {
      $('#pwaStatus').textContent = 'PWA disponibile dopo l\'avvio da server locale o GitHub Pages.';
    });
}

function updatePwaStatus() {
  const status = $('#pwaStatus');
  if (!status) return;
  status.textContent = navigator.onLine
    ? 'PWA installabile da browser compatibili; dati pronti per cache offline.'
    : 'Modalità offline: consultazione dei dati già memorizzati.';
}

init();
