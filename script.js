const tokenInput = document.getElementById('token');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search');
const suggestionsContainer = document.getElementById('suggestions');
const resultsContainer = document.getElementById('results');
const lyricsContainer = document.getElementById('lyrics');
const statusEl = document.getElementById('status');
const playBtn = document.getElementById('play');
const pauseBtn = document.getElementById('pause');
const coverEl = document.getElementById('cover');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const genreSelect = document.getElementById('genre');
const moodSelect = document.getElementById('mood');
const tempoInput = document.getElementById('tempo');
const tempoValue = document.getElementById('tempo-value');

tempoInput.addEventListener('input', () => {
  tempoValue.textContent = tempoInput.value;
  renderSuggestions();
});

genreSelect.addEventListener('change', renderSuggestions);
moodSelect.addEventListener('change', renderSuggestions);

const suggestions = [
  {
    title: 'As It Was',
    artist: 'Harry Styles',
    genre: 'pop',
    mood: 'uplifting',
    tempo: 175,
    album: 'https://i.scdn.co/image/ab67616d0000b273e8e5adcddd1dc6b7c2e9f6c0',
    id: '4LRPiXqCikLlN15c3yImP7',
    preview: 'https://p.scdn.co/mp3-preview/ca5f8f35c234c615e160c2a0f7a5cd67d6c0b799?cid=774b29d4f13844c495f206cafdad9c86'
  },
  {
    title: 'Levitating',
    artist: 'Dua Lipa',
    genre: 'dance',
    mood: 'energetic',
    tempo: 103,
    album: 'https://i.scdn.co/image/ab67616d0000b273d0cc1579d42bd25a4b859932',
    id: '463CkQjx2Zk1yXoBuierM9',
    preview: 'https://p.scdn.co/mp3-preview/4e075ef6a3b114aea9156fe0f34ba1a5d5086bd3?cid=774b29d4f13844c495f206cafdad9c86'
  },
  {
    title: 'Viva La Vida',
    artist: 'Coldplay',
    genre: 'rock',
    mood: 'uplifting',
    tempo: 138,
    album: 'https://i.scdn.co/image/ab67616d0000b27319d5465cc7a3c8f0c1fba1b5',
    id: '1mea3bSkSGXuIRvnydlB5b',
    preview: 'https://p.scdn.co/mp3-preview/7a8d5ed0e4ce17f9bd02f24cf68b7e1b6b9c2d80?cid=774b29d4f13844c495f206cafdad9c86'
  },
  {
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    genre: 'pop',
    mood: 'energetic',
    tempo: 171,
    album: 'https://i.scdn.co/image/ab67616d0000b273fdc3f28edc840f9e0e1f0b81',
    id: '0VjIjW4GlUZAMYd2vXMi3b',
    preview: 'https://p.scdn.co/mp3-preview/df901d28ca06e810a51104f53aa8fa837acdf58c?cid=774b29d4f13844c495f206cafdad9c86'
  },
  {
    title: 'Sunflower',
    artist: 'Post Malone, Swae Lee',
    genre: 'hip-hop',
    mood: 'chill',
    tempo: 90,
    album: 'https://i.scdn.co/image/ab67616d0000b27376e645c4a40c8f7a7f79a9d1',
    id: '3KkXRkHbMCARz0aVfEt68P',
    preview: 'https://p.scdn.co/mp3-preview/2d02ca67a49fa07b8b47419a86c09ed0c4b2af0d?cid=774b29d4f13844c495f206cafdad9c86'
  },
  {
    title: 'drivers license',
    artist: 'Olivia Rodrigo',
    genre: 'pop',
    mood: 'dramatic',
    tempo: 143,
    album: 'https://i.scdn.co/image/ab67616d0000b273a89a1a6e6ca5b8467e815f24',
    id: '5wANPM4fQCJwkGd4rN57mH',
    preview: 'https://p.scdn.co/mp3-preview/6ce050f9824ab7f558d653c2a1b99e35678c8302?cid=774b29d4f13844c495f206cafdad9c86'
  }
];

let audio = null;
let lyricLines = [];
let progressTimer = null;

function getToken() {
  const token = tokenInput.value.trim();
  if (!token) {
    setStatus('Paste a Spotify access token to enable live lyrics and search.');
  }
  return token;
}

function setStatus(message) {
  statusEl.textContent = message;
}

function renderSuggestions() {
  const genre = genreSelect.value;
  const mood = moodSelect.value;
  const tempo = parseInt(tempoInput.value, 10);
  const filtered = suggestions.filter((s) => {
    return (
      (!genre || s.genre === genre) &&
      (!mood || s.mood === mood) &&
      s.tempo <= tempo
    );
  });

  suggestionsContainer.innerHTML = '';

  filtered.forEach((s) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${s.album}" alt="${s.title}" />
      <div>
        <p class="title">${s.title}</p>
        <p class="subtitle">${s.artist}</p>
        <div class="badges">
          <span class="badge">${s.genre}</span>
          <span class="badge">${s.mood}</span>
          <span class="badge">${s.tempo} BPM</span>
        </div>
      </div>
      <span class="badge">Suggestion</span>
    `;
    card.addEventListener('click', () => loadTrackFromSuggestion(s));
    suggestionsContainer.appendChild(card);
  });
}

function renderResults(items) {
  resultsContainer.innerHTML = '';
  if (!items.length) {
    resultsContainer.innerHTML = '<p class="hint">No matches found.</p>';
    return;
  }

  items.forEach((item) => {
    const img = item.album?.images?.[1]?.url || '';
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${img}" alt="${item.name}" />
      <div>
        <p class="title">${item.name}</p>
        <p class="subtitle">${item.artists.map((a) => a.name).join(', ')}</p>
      </div>
      <span class="badge">Search</span>
    `;
    card.addEventListener('click', () => loadTrack(item));
    resultsContainer.appendChild(card);
  });
}

async function searchTracks(query) {
  const token = getToken();
  if (!token) return;
  setStatus('Searching...');
  try {
    const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=6`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Search failed');
    const data = await res.json();
    renderResults(data.tracks.items);
    setStatus('Pick a track to start.');
  } catch (err) {
    console.error(err);
    setStatus('Unable to search. Check your token and try again.');
  }
}

async function fetchLyrics(trackId) {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackId}?format=json&vocalRemoval=false`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Lyrics request failed');
    const data = await res.json();
    const lines = data?.lyrics?.lines || [];
    return lines.map((line) => ({
      time: Number(line.startTimeMs),
      text: line.words || line.text
    }));
  } catch (err) {
    console.error(err);
    setStatus('Could not fetch synced lyrics. Showing a fallback instead.');
    return null;
  }
}

function renderLyrics(lines) {
  lyricsContainer.innerHTML = '';
  lines.forEach((line, idx) => {
    const div = document.createElement('div');
    div.className = 'lyric-line';
    div.dataset.time = line.time;
    div.id = `lyric-${idx}`;
    div.textContent = line.text;
    lyricsContainer.appendChild(div);
  });
}

function highlightLine(currentTimeMs) {
  if (!lyricLines.length) return;
  let activeIndex = lyricLines.findIndex((line, idx) => {
    const nextTime = lyricLines[idx + 1]?.time ?? Number.MAX_SAFE_INTEGER;
    return currentTimeMs >= line.time && currentTimeMs < nextTime;
  });
  if (activeIndex === -1) activeIndex = lyricLines.length - 1;

  document.querySelectorAll('.lyric-line').forEach((line) => line.classList.remove('active'));
  const activeEl = document.getElementById(`lyric-${activeIndex}`);
  if (activeEl) {
    activeEl.classList.add('active');
    activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function startProgressWatcher() {
  stopProgressWatcher();
  progressTimer = setInterval(() => {
    if (audio && !audio.paused) {
      highlightLine(audio.currentTime * 1000);
    }
  }, 150);
}

function stopProgressWatcher() {
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
}

function attachAudio(url) {
  if (audio) {
    audio.pause();
  }
  audio = new Audio(url);
  audio.addEventListener('play', startProgressWatcher);
  audio.addEventListener('pause', stopProgressWatcher);
  audio.addEventListener('ended', stopProgressWatcher);
}

async function loadTrackFromSuggestion(s) {
  const token = getToken();
  const meta = token ? await fetchTrack(s.id, token) : null;
  const track = meta || { name: s.title, artists: [{ name: s.artist }], album: { images: [{}, { url: s.album }] }, id: s.id, preview_url: s.preview };
  loadTrack(track);
}

async function fetchTrack(id, token) {
  try {
    const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Track lookup failed');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function loadTrack(track) {
  trackTitle.textContent = track.name;
  trackArtist.textContent = track.artists.map((a) => a.name).join(', ');
  const art = track.album?.images?.[1]?.url || track.album?.images?.[0]?.url || '';
  coverEl.src = art;

  setStatus('Loading lyrics...');
  lyricLines = (await fetchLyrics(track.id)) || fallbackLyrics(track.name, trackArtist.textContent);
  renderLyrics(lyricLines);
  setStatus('Ready to sing! Use Play/Pause to control the preview.');

  if (track.preview_url) {
    attachAudio(track.preview_url);
  } else {
    setStatus('This track has no preview. You can still follow the lyrics.');
  }
}

function fallbackLyrics(title, artist) {
  const baseline = [
    `${title} — ${artist}`,
    'Sing along and bring the room to life!',
    'Add your access token for real-time synced lyrics.',
    'Search or use the suggestions to find your next track.',
    'Keep the beat and watch the highlighted line.'
  ];
  return baseline.map((text, idx) => ({ time: idx * 3000, text }));
}

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;
  searchTracks(query);
});

playBtn.addEventListener('click', () => {
  if (!audio) return;
  audio.play();
});

pauseBtn.addEventListener('click', () => {
  if (!audio) return;
  audio.pause();
});

renderSuggestions();
setStatus('Paste a Spotify token, pick a song, and press Play.');
