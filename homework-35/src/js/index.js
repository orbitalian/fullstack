// CSS
import '../styles/main.css';
// LESS
import '../styles/theme.less';
// SCSS
import '../styles/components.scss';

import _ from 'lodash';
import placeholderImg from '../images/placeholder.svg';

const img = document.querySelector('.hero__img');
if (img) img.src = placeholderImg;

const features = [
  '✅ DevServer + HMR',
  '✅ CSS',
  '✅ LESS',
  '✅ SCSS',
  '✅ TypeScript',
  '✅ Babel',
  '✅ ESLint',
  '✅ Bundle Analyzer',
];

const badgesEl = document.getElementById('badges');
if (badgesEl) {
  badgesEl.innerHTML = _.map(features, f => `<span class="badge">${f}</span>`).join('');
}
