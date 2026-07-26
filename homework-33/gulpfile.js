const gulp        = require('gulp');
const sass        = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS    = require('gulp-clean-css');
const prettier    = require('gulp-prettier');
const rename      = require('gulp-rename');
const browserSync = require('browser-sync').create();

// --- Шляхи ---
const paths = {
  scss: {
    src:   'src/scss/**/*.scss',
    dest:  'dist/css',
  },
  html: {
    src: '*.html',
  },
};

// =============================================
// 1. SCSS → CSS (з форматуванням та префіксами)
// =============================================
function styles() {
  return gulp
    .src('src/scss/style.scss')                  // вхідний файл SCSS

    // Компіляція SCSS → CSS
    .pipe(sass({ outputStyle: 'expanded' })
      .on('error', sass.logError))

    // Вендорні префікси (підтримка останніх 2 версій браузерів)
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions'],
      cascade: false,
    }))

    // Форматування (стайлінг базового коду)
    .pipe(prettier({
      singleQuote: true,
      tabWidth: 2,
    }))

    // Зберігаємо читабельну версію style.css
    .pipe(gulp.dest(paths.scss.dest))

    // Мінімізація
    .pipe(cleanCSS({
      level: 2,                                  // агресивніша оптимізація
      compatibility: 'ie11',
    }))

    // Зберігаємо мінімізовану версію style.min.css
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scss.dest))

    // Оновлення BrowserSync
    .pipe(browserSync.stream());
}

// =============================================
// 2. BrowserSync — локальний сервер
// =============================================
function serve() {
  browserSync.init({
    server: {
      baseDir: './',                             // коренева папка проекту
    },
    notify: false,                               // прибрати спливаюче повідомлення
    open: true,                                  // автовідкрити браузер
  });
}

// =============================================
// 3. Watch — слідкуємо за змінами
// =============================================
function watch() {
  // При зміні SCSS — перекомпілювати
  gulp.watch(paths.scss.src, styles);

  // При зміні HTML — перезавантажити браузер
  gulp.watch(paths.html.src).on('change', browserSync.reload);
}

// =============================================
// Таски
// =============================================

// gulp         — запустити розробку (сервер + слежка)
exports.default = gulp.parallel(styles, serve, watch);

// gulp build   — лише зібрати CSS (без сервера)
exports.build   = styles;

// gulp styles  — окремо запустити компіляцію стилів
exports.styles  = styles;
