const menuButton = document.querySelector('.menu-button');
const menuOverlay = document.querySelector('.menu-overlay');
const header = document.querySelector('.site-header');

function setMenu(open) {
  document.body.classList.toggle('menu-open', open);
  menuOverlay.classList.toggle('is-open', open);
  menuOverlay.setAttribute('aria-hidden', String(!open));
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.querySelector('.menu-label').textContent = open ? 'Close' : 'Menu';
}
menuButton.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
menuOverlay.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .12, rootMargin: '0px 0px -35px 0px' });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const gallery = document.querySelector('.gallery-section');
const cards = [...document.querySelectorAll('.art-card')];
const counter = document.querySelector('#gallery-index');
const progressBar = document.querySelector('#gallery-progress');
const heroImage = document.querySelector('.hero-image');
let ticking = false;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
function updateScroll() {
  ticking = false;
  header.classList.toggle('is-scrolled', window.scrollY > 36);
  const rect = gallery.getBoundingClientRect();
  const distance = Math.max(1, rect.height - window.innerHeight);
  const progress = clamp(-rect.top / distance, 0, 1);
  progressBar.style.width = `${progress * 100}%`;
  const active = clamp(Math.floor(progress * 3 - .5), 0, 2);
  counter.textContent = String(active + 1).padStart(2, '0');

  cards.forEach((card, index) => {
    const start = index / 3;
    const local = clamp((progress - start) * 3, 0, 1);
    const entering = index === 0 ? 1 : local;
    const nextStart = (index + 1) / 3;
    const leaving = index === 2 ? 0 : clamp((progress - nextStart) * 3, 0, 1);
    const offset = index === 0 ? 0 : (1 - entering) * 115;
    const scale = 1 - leaving * .12;
    const rotate = [-7, 5, -3][index] + entering * [5, -7, 3][index] - leaving * 8;
    card.style.zIndex = String(index + 1);
    card.style.transform = `translate3d(${(index - 1) * 10}px, ${offset - leaving * 45}vh, 0) rotate(${rotate}deg) scale(${scale})`;
    card.style.opacity = String(index === 0 ? 1 : clamp(entering * 1.5, 0, 1));
    card.style.filter = `brightness(${1 - leaving * .16})`;
  });

  if (!reducedMotion.matches) {
    heroImage.style.transform = `translateY(${Math.min(window.scrollY * .22, 170)}px) scale(1.06)`;
  }
}
function scheduleScroll() { if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); } }
window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', scheduleScroll);
reducedMotion.addEventListener('change', scheduleScroll);
updateScroll();
