// =============================================
// ВЕРСІЯ НА КЛАСАХ
// =============================================

// --- Конфігурація за замовчуванням ---
const defaultConfig = {
  interval: 3000,
  showDots: true,
  showControls: true,
  showStatus: true,
  pauseOnHover: true, 
};

// =============================================
// BaseSlider — базовий клас
// =============================================
class BaseSlider {
  constructor(containerId, config = {}) {
    this.container = document.getElementById(containerId);
    this.config = { ...defaultConfig, ...config };
    this.total = 0;
    this.current = 1;
    this.playing = true;
    this.timer = null;
    this.isTransitioning = false;

    this.track = null;
    this.dotsWrap = null;
    this.playBtn = null;
    this.statusEl = null;
  }

  init() {
    this._buildDOM();
    this._cloneSlides();
    this.total = this.track.querySelectorAll('.slide').length - 2;
    if (this.config.showDots) this._createDots();
    this._bindNavButtons();
    this._bindKeyboard();
    this._setPosition(this.current, false);
    if (this.playing) this.startAuto();
  }

  // Побудова DOM елементів управління
  _buildDOM() {
    const viewport = this.container.querySelector('.slider-viewport');
    this.track = this.container.querySelector('.slider-track');

    if (this.config.showControls) {
      const prev = document.createElement('button');
      prev.className = 'nav-btn nav-prev';
      prev.setAttribute('aria-label', 'Попередній');
      prev.innerHTML = '&#8249;';

      const next = document.createElement('button');
      next.className = 'nav-btn nav-next';
      next.setAttribute('aria-label', 'Наступний');
      next.innerHTML = '&#8250;';

      viewport.appendChild(prev);
      viewport.appendChild(next);
    }

    if (this.config.showDots) {
      this.dotsWrap = document.createElement('div');
      this.dotsWrap.className = 'indicators';
      this.container.appendChild(this.dotsWrap);
    }

    const controls = document.createElement('div');
    controls.className = 'controls';
    this.playBtn = document.createElement('button');
    this.playBtn.className = 'ctrl-btn';
    this.playBtn.textContent = '⏸ Пауза';
    controls.appendChild(this.playBtn);
    this.container.appendChild(controls);

    if (this.config.showStatus) {
      this.statusEl = document.createElement('div');
      this.statusEl.className = 'status';
      this.statusEl.textContent = 'Автопрогравання активне · ← → для навігації';
      this.container.appendChild(this.statusEl);
    }
  }

  _cloneSlides() {
    const slides = this.track.querySelectorAll('.slide');
    const first = slides[0].cloneNode(true);
    const last = slides[slides.length - 1].cloneNode(true);
    this.track.appendChild(first);
    this.track.insertBefore(last, slides[0]);
  }

  _createDots() {
    for (let i = 0; i < this.total; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Слайд ${i + 1}`);
      dot.addEventListener('click', () => this.goTo(i + 1));
      this.dotsWrap.appendChild(dot);
    }
  }

  _updateDots() {
    if (!this.dotsWrap) return;
    let dotIndex = this.current - 1;
    if (dotIndex < 0) dotIndex = this.total - 1;
    if (dotIndex >= this.total) dotIndex = 0;
    this.dotsWrap.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === dotIndex);
    });
  }

  _setPosition(index, animated) {
    this.track.style.transition = animated
      ? 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      : 'none';
    this.track.style.transform = `translateX(-${index * 100}%)`;
  }

  goTo(index) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.current = index;
    this._setPosition(this.current, true);
    this._updateDots();

    const onEnd = () => {
      this.track.removeEventListener('transitionend', onEnd);
      this.isTransitioning = false;
      if (this.current === this.total + 1) {
        this.current = 1;
        this._setPosition(this.current, false);
      }
      if (this.current === 0) {
        this.current = this.total;
        this._setPosition(this.current, false);
      }
    };
    this.track.addEventListener('transitionend', onEnd);
  }

  goNext() { this.goTo(this.current + 1); }
  goPrev() { this.goTo(this.current - 1); }

  startAuto() {
    clearInterval(this.timer);
    this.timer = setInterval(() => this.goNext(), this.config.interval);
  }

  stopAuto() {
    clearInterval(this.timer);
  }

  _bindNavButtons() {
    const prevBtn = this.container.querySelector('.nav-prev');
    const nextBtn = this.container.querySelector('.nav-next');
    if (prevBtn) prevBtn.addEventListener('click', () => this.goPrev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.goNext());

    this.playBtn.addEventListener('click', () => {
      this.playing = !this.playing;
      if (this.playing) {
        this.startAuto();
        this.playBtn.textContent = '⏸ Пауза';
        if (this.statusEl) this.statusEl.textContent = 'Автопрогравання активне · ← → для навігації';
      } else {
        this.stopAuto();
        this.playBtn.textContent = '▶ Грати';
        if (this.statusEl) this.statusEl.textContent = 'Пауза · ← → для навігації';
      }
    });
  }

  _bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.goPrev();
      if (e.key === 'ArrowRight') this.goNext();
    });
  }
}


// =============================================
// TouchSlider — розширює BaseSlider
// Додає: тач, мишу, пауза при наведенні
// =============================================
class TouchSlider extends BaseSlider {
  constructor(containerId, config = {}) {
    super(containerId, config);
    this.touchStartX = 0;
    this.mouseStartX = 0;
    this.isDragging = false;
  }

  init() {
    super.init();
    this._bindTouch();
    this._bindMouse();
    if (this.config.pauseOnHover) this._bindHoverPause();
  }

  _bindTouch() {
    const viewport = this.container.querySelector('.slider-viewport');

    viewport.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      const diff = this.touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? this.goNext() : this.goPrev();
      }
    });
  }

  _bindMouse() {
    const viewport = this.container.querySelector('.slider-viewport');

    viewport.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.mouseStartX = e.clientX;
    });

    viewport.addEventListener('mouseup', (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      const diff = this.mouseStartX - e.clientX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? this.goNext() : this.goPrev();
      }
    });

    viewport.addEventListener('mouseleave', () => {
      this.isDragging = false;
    });
  }

  // Додаткова фіча: пауза при наведенні миші
  _bindHoverPause() {
    const viewport = this.container.querySelector('.slider-viewport');

    viewport.addEventListener('mouseenter', () => {
      if (this.playing) {
        this.stopAuto();
        if (this.statusEl) this.statusEl.textContent = 'Пауза при наведенні · ← → для навігації';
      }
    });

    viewport.addEventListener('mouseleave', () => {
      if (this.playing) {
        this.startAuto();
        if (this.statusEl) this.statusEl.textContent = 'Автопрогравання активне · ← → для навігації';
      }
    });
  }
}


// =============================================
// Ініціалізація
// =============================================
const slider = new TouchSlider('slider-class', {
  interval: 3000,
  showDots: true,
  showControls: true,
  showStatus: true,
  pauseOnHover: true,
});

slider.init();