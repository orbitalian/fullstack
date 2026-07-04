const TOTAL = 4;
const INTERVAL = 3000;

let current = 1; // починаємо з 1, бо 0 — це клон останнього
let playing = true;
let timer = null;
let touchStartX = 0;
let mouseStartX = 0;
let isDragging = false;
let isTransitioning = false;

const track = document.getElementById('track');
const dotsWrap = document.getElementById('dots');
const playBtn = document.getElementById('playBtn');
const statusEl = document.getElementById('status');
const viewport = document.getElementById('viewport');

// --- Клонування слайдів ---
// Структура: [клон останнього] [1] [2] [3] [4] [клон першого]
function cloneSlides() {
  const slides = track.querySelectorAll('.slide');
  const first = slides[0].cloneNode(true);
  const last = slides[slides.length - 1].cloneNode(true);
  track.appendChild(first);
  track.insertBefore(last, slides[0]);
}

// --- Dots ---
function createDots() {
  for (let i = 0; i < TOTAL; i++) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Слайд ' + (i + 1));
    dot.addEventListener('click', () => goTo(i + 1));
    dotsWrap.appendChild(dot);
  }
}

function updateDots() {
  // current 1..TOTAL → dot index 0..TOTAL-1
  let dotIndex = current - 1;
  if (dotIndex < 0) dotIndex = TOTAL - 1;
  if (dotIndex >= TOTAL) dotIndex = 0;
  dotsWrap.querySelectorAll('.dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === dotIndex);
  });
}

// --- Navigation ---
function setPosition(index, animated) {
  track.style.transition = animated ? 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
  track.style.transform = `translateX(-${index * 100}%)`;
}

function goTo(index) {
  if (isTransitioning) return;
  isTransitioning = true;
  current = index;
  setPosition(current, true);
  updateDots();
}

function goNext() { goTo(current + 1); }
function goPrev() { goTo(current - 1); }

// Після анімації — непомітно переключаємось на реальний слайд
track.addEventListener('transitionend', () => {
  isTransitioning = false;

  // Якщо дійшли до клону першого (в кінці) — стрибаємо на реальний перший
  if (current === TOTAL + 1) {
    current = 1;
    setPosition(current, false);
  }

  // Якщо дійшли до клону останнього (на початку) — стрибаємо на реальний останній
  if (current === 0) {
    current = TOTAL;
    setPosition(current, false);
  }
});

document.getElementById('next').addEventListener('click', goNext);
document.getElementById('prev').addEventListener('click', goPrev);

// --- Autoplay ---
function startAuto() {
  clearInterval(timer);
  timer = setInterval(goNext, INTERVAL);
}

function stopAuto() {
  clearInterval(timer);
}

playBtn.addEventListener('click', () => {
  playing = !playing;
  if (playing) {
    startAuto();
    playBtn.textContent = '⏸ Пауза';
    statusEl.textContent = 'Автопрогравання активне · ← → для навігації';
  } else {
    stopAuto();
    playBtn.textContent = '▶ Грати';
    statusEl.textContent = 'Пауза · ← → для навігації';
  }
});

// --- Keyboard ---
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') goPrev();
  if (e.key === 'ArrowRight') goNext();
});

// --- Touch swipe ---
viewport.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

viewport.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    diff > 0 ? goNext() : goPrev();
  }
});

// --- Mouse drag ---
viewport.addEventListener('mousedown', (e) => {
  isDragging = true;
  mouseStartX = e.clientX;
});

viewport.addEventListener('mouseup', (e) => {
  if (!isDragging) return;
  isDragging = false;
  const diff = mouseStartX - e.clientX;
  if (Math.abs(diff) > 40) {
    diff > 0 ? goNext() : goPrev();
  }
});

viewport.addEventListener('mouseleave', () => {
  isDragging = false;
});

// --- Init ---
cloneSlides();
createDots();
setPosition(current, false); // стартова позиція без анімації
startAuto();