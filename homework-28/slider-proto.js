// =============================================
// ВЕРСІЯ НА ПРОТОТИПАХ
// =============================================

// --- Конфігурація за замовчуванням ---
var defaultConfig = {
  interval: 3000,
  showDots: true,
  showControls: true,
  showStatus: true,
};

// =============================================
// BaseSlider — базовий конструктор
// =============================================
function BaseSlider(containerId, config) {
  this.container = document.getElementById(containerId);
  this.config = Object.assign({}, defaultConfig, config);
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

// Ініціалізація
BaseSlider.prototype.init = function () {
  this._buildDOM();
  this._cloneSlides();
  this.total = this.track.querySelectorAll('.slide').length - 2; // без клонів
  if (this.config.showDots) this._createDots();
  this._bindNavButtons();
  this._bindKeyboard();
  this._setPosition(this.current, false);
  if (this.playing) this.startAuto();
};

// Побудова DOM елементів управління
BaseSlider.prototype._buildDOM = function () {
  var viewport = this.container.querySelector('.slider-viewport');
  this.track = this.container.querySelector('.slider-track');

  // Кнопки навігації
  if (this.config.showControls) {
    var prev = document.createElement('button');
    prev.className = 'nav-btn nav-prev';
    prev.id = 'prev';
    prev.setAttribute('aria-label', 'Попередній');
    prev.innerHTML = '&#8249;';

    var next = document.createElement('button');
    next.className = 'nav-btn nav-next';
    next.id = 'next';
    next.setAttribute('aria-label', 'Наступний');
    next.innerHTML = '&#8250;';

    viewport.appendChild(prev);
    viewport.appendChild(next);
  }

  // Dots
  if (this.config.showDots) {
    var dots = document.createElement('div');
    dots.className = 'indicators';
    dots.id = 'dots';
    this.container.appendChild(dots);
    this.dotsWrap = dots;
  }

  // Кнопка play/pause
  var controls = document.createElement('div');
  controls.className = 'controls';
  this.playBtn = document.createElement('button');
  this.playBtn.className = 'ctrl-btn';
  this.playBtn.id = 'playBtn';
  this.playBtn.textContent = '⏸ Пауза';
  controls.appendChild(this.playBtn);
  this.container.appendChild(controls);

  // Статус
  if (this.config.showStatus) {
    this.statusEl = document.createElement('div');
    this.statusEl.className = 'status';
    this.statusEl.textContent = 'Автопрогравання активне · ← → для навігації';
    this.container.appendChild(this.statusEl);
  }
};

// Клонування першого та останнього слайдів
BaseSlider.prototype._cloneSlides = function () {
  var slides = this.track.querySelectorAll('.slide');
  var first = slides[0].cloneNode(true);
  var last = slides[slides.length - 1].cloneNode(true);
  this.track.appendChild(first);
  this.track.insertBefore(last, slides[0]);
};

// Створення крапок-індикаторів
BaseSlider.prototype._createDots = function () {
  var self = this;
  for (var i = 0; i < this.total; i++) {
    (function (index) {
      var dot = document.createElement('button');
      dot.className = 'dot' + (index === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Слайд ' + (index + 1));
      dot.addEventListener('click', function () {
        self.goTo(index + 1);
      });
      self.dotsWrap.appendChild(dot);
    })(i);
  }
};

BaseSlider.prototype._updateDots = function () {
  if (!this.dotsWrap) return;
  var dotIndex = this.current - 1;
  if (dotIndex < 0) dotIndex = this.total - 1;
  if (dotIndex >= this.total) dotIndex = 0;
  this.dotsWrap.querySelectorAll('.dot').forEach(function (dot, i) {
    dot.classList.toggle('active', i === dotIndex);
  });
};

// Позиція без/з анімацією
BaseSlider.prototype._setPosition = function (index, animated) {
  this.track.style.transition = animated
    ? 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    : 'none';
  this.track.style.transform = 'translateX(-' + (index * 100) + '%)';
};

// Перехід до слайду
BaseSlider.prototype.goTo = function (index) {
  if (this.isTransitioning) return;
  this.isTransitioning = true;
  this.current = index;
  this._setPosition(this.current, true);
  this._updateDots();

  var self = this;
  this.track.addEventListener('transitionend', function onEnd() {
    self.track.removeEventListener('transitionend', onEnd);
    self.isTransitioning = false;
    if (self.current === self.total + 1) {
      self.current = 1;
      self._setPosition(self.current, false);
    }
    if (self.current === 0) {
      self.current = self.total;
      self._setPosition(self.current, false);
    }
  });
};

BaseSlider.prototype.goNext = function () { this.goTo(this.current + 1); };
BaseSlider.prototype.goPrev = function () { this.goTo(this.current - 1); };

// Автопрогравання
BaseSlider.prototype.startAuto = function () {
  var self = this;
  clearInterval(this.timer);
  this.timer = setInterval(function () { self.goNext(); }, this.config.interval);
};

BaseSlider.prototype.stopAuto = function () {
  clearInterval(this.timer);
};

// Прив'язка кнопок навігації та play/pause
BaseSlider.prototype._bindNavButtons = function () {
  var self = this;

  var prevBtn = this.container.querySelector('#prev');
  var nextBtn = this.container.querySelector('#next');
  if (prevBtn) prevBtn.addEventListener('click', function () { self.goPrev(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { self.goNext(); });

  if (this.playBtn) {
    this.playBtn.addEventListener('click', function () {
      self.playing = !self.playing;
      if (self.playing) {
        self.startAuto();
        self.playBtn.textContent = '⏸ Пауза';
        if (self.statusEl) self.statusEl.textContent = 'Автопрогравання активне · ← → для навігації';
      } else {
        self.stopAuto();
        self.playBtn.textContent = '▶ Грати';
        if (self.statusEl) self.statusEl.textContent = 'Пауза · ← → для навігації';
      }
    });
  }
};

// Клавіатура
BaseSlider.prototype._bindKeyboard = function () {
  var self = this;
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') self.goPrev();
    if (e.key === 'ArrowRight') self.goNext();
  });
};


// =============================================
// TouchSlider — наслідує BaseSlider
// Додає: тач-жести та перетягування мишею
// =============================================
function TouchSlider(containerId, config) {
  BaseSlider.call(this, containerId, config);
  this.touchStartX = 0;
  this.mouseStartX = 0;
  this.isDragging = false;
}

// Наслідування прототипу
TouchSlider.prototype = Object.create(BaseSlider.prototype);
TouchSlider.prototype.constructor = TouchSlider;

// Перевизначаємо init — додаємо тач і мишу
TouchSlider.prototype.init = function () {
  BaseSlider.prototype.init.call(this);
  this._bindTouch();
  this._bindMouse();
};

TouchSlider.prototype._bindTouch = function () {
  var self = this;
  var viewport = this.container.querySelector('.slider-viewport');

  viewport.addEventListener('touchstart', function (e) {
    self.touchStartX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchend', function (e) {
    var diff = self.touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? self.goNext() : self.goPrev();
    }
  });
};

TouchSlider.prototype._bindMouse = function () {
  var self = this;
  var viewport = this.container.querySelector('.slider-viewport');

  viewport.addEventListener('mousedown', function (e) {
    self.isDragging = true;
    self.mouseStartX = e.clientX;
  });

  viewport.addEventListener('mouseup', function (e) {
    if (!self.isDragging) return;
    self.isDragging = false;
    var diff = self.mouseStartX - e.clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? self.goNext() : self.goPrev();
    }
  });

  viewport.addEventListener('mouseleave', function () {
    self.isDragging = false;
  });
};


// =============================================
// Ініціалізація
// =============================================
var slider = new TouchSlider('slider-proto', {
  interval: 3000,
  showDots: true,
  showControls: true,
  showStatus: true,
});

slider.init();