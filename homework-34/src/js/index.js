// --- Імпорт CSS (Webpack обробить і винесе в окремий файл) ---
import '../styles/main.css';

// --- Імпорт зображення (Webpack додасть хеш до імені файлу) ---
import placeholderImg from '../images/placeholder.svg';

// --- Зовнішня бібліотека (виноситься у vendors chunk) ---
import _ from 'lodash';

// =============================================
// Демонстрація функціональності
// =============================================

// Оновлюємо src зображення (з хешованим шляхом від Webpack)
const img = document.querySelector('.hero__img');
if (img) img.src = placeholderImg;

// Генеруємо бейджі через lodash
const features = [
  '✅ Хешування файлів',
  '✅ Локальні шрифти',
  '✅ Зображення',
  '✅ CSS стилі',
  '✅ Vendor chunk',
];

const badgesEl = document.getElementById('badges');

if (badgesEl) {
  // _.map — lodash замість нативного map (демонстрація бібліотеки)
  const html = _.map(features, feature => `
    <span class="badge">${feature}</span>
  `).join('');

  badgesEl.innerHTML = html;
}

console.log('Webpack збірка працює!');
console.log('Версія lodash:', _.VERSION);
