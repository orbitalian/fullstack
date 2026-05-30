// =============================================================================
// MAIN.JS
// =============================================================================


// -----------------------------------------------------------------------------
// BURGER MENU
// -----------------------------------------------------------------------------

const burger = document.getElementById('burger');
const nav    = document.getElementById('nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    burger.classList.toggle('is-active', isOpen);
    burger.setAttribute('aria-expanded', isOpen);

    // Блокуємо скрол сторінки коли меню відкрите
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Закриваємо меню по кліку на посилання
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      burger.classList.remove('is-active');
      burger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    });
  });

  // Закриваємо по Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      burger.classList.remove('is-active');
      burger.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    }
  });
}


// -----------------------------------------------------------------------------
// АКТИВНИЙ ПУНКТ НАВІГАЦІЇ
// Автоматично ставить is-active на посилання що відповідає поточній сторінці
// -----------------------------------------------------------------------------

const currentPath = window.location.pathname.split('/').pop() || 'index.html';

document.querySelectorAll('.nav__link').forEach(link => {
  const linkPath = link.getAttribute('href').split('/').pop();
  if (linkPath === currentPath) {
    link.classList.add('is-active');
  }
});
