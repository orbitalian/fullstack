const BASE_URL = 'https://itunes.apple.com/search';

const searchInput = document.getElementById('searchInput');
const resultsEl   = document.getElementById('results');
const statusEl    = document.getElementById('status');
const spinnerEl   = document.getElementById('spinner');
const emptyEl     = document.getElementById('empty');

let debounceTimer = null;

// --- Fetch ---
async function searchMusic(query) {
  const url = `${BASE_URL}?term=${encodeURIComponent(query)}&media=music&limit=20`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Помилка сервера: ${response.status}`);
  }

  const data = await response.json();
  return data.results;
}

// --- Render ---
function renderResults(tracks) {
  resultsEl.innerHTML = '';

  if (tracks.length === 0) {
    emptyEl.classList.add('show');
    statusEl.textContent = '';
    return;
  }

  emptyEl.classList.remove('show');
  statusEl.textContent = `Знайдено ${tracks.length} треків`;

  tracks.forEach(track => {
    const card = document.createElement('a');
    card.className = 'track-card';
    card.href = track.trackViewUrl || '#';
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    const img = track.artworkUrl100
      ? track.artworkUrl100.replace('100x100', '300x300')
      : 'https://via.placeholder.com/300x300/16161f/6b6b8a?text=🎵';

    const preview = track.previewUrl
      ? `<audio class="track-preview" controls src="${track.previewUrl}"></audio>`
      : '';

    card.innerHTML = `
      <img class="track-img" src="${img}" alt="${track.trackName}" loading="lazy" />
      <div class="track-info">
        <div class="track-name">${track.trackName || '—'}</div>
        <div class="track-artist">${track.artistName || '—'}</div>
        <span class="track-genre">${track.primaryGenreName || 'Music'}</span>
        ${preview}
      </div>
    `;

    // Зупиняємо перехід по посиланню при кліку на аудіо
    card.querySelector('audio')?.addEventListener('click', e => e.preventDefault());

    resultsEl.appendChild(card);
  });
}

// --- UI стани ---
function setLoading(loading) {
  spinnerEl.classList.toggle('show', loading);
  if (loading) {
    statusEl.textContent = 'Шукаємо...';
    statusEl.className = 'status';
    emptyEl.classList.remove('show');
    resultsEl.innerHTML = '';
  }
}

function setError(msg) {
  statusEl.textContent = msg;
  statusEl.className = 'status error';
  resultsEl.innerHTML = '';
  emptyEl.classList.remove('show');
}

// --- Live Search з debounce ---
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();

  clearTimeout(debounceTimer);

  if (!query) {
    resultsEl.innerHTML = '';
    emptyEl.classList.remove('show');
    statusEl.textContent = 'Почніть вводити, щоб шукати музику';
    statusEl.className = 'status';
    return;
  }

  if (query.length < 2) {
    statusEl.textContent = 'Введіть ще хоча б один символ...';
    return;
  }

  // Debounce — чекаємо 400мс після останнього символу
  debounceTimer = setTimeout(async () => {
    setLoading(true);

    try {
      const tracks = await searchMusic(query);
      renderResults(tracks);
    } catch (error) {
      console.error('Помилка пошуку:', error);
      setError(`Помилка: ${error.message}. Перевірте підключення до мережі.`);
    } finally {
      setLoading(false);
    }
  }, 400);
});
