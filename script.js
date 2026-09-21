const menuButton = document.querySelector('.menu-button');
const menuOverlay = document.querySelector('.menu-overlay');
const header = document.querySelector('.site-header');
const languageButton = document.querySelector('.language-toggle');

const translatedText = [
  ['.site-header .brand > span:last-child', 'Evel\'s HP<span class="brand-dot">.</span>', true],
  ['.footer .brand > span:last-child', 'Evel\'s HP<span class="brand-dot">.</span>', true],
  ['#hero-title .hero-subtitle', 'Illustration & Art'],
  ['.hero-rights-note', 'I accept commissions involving existing IP only within the scope permitted by each rights holder\'s fan creation guidelines.', true],
  ['.intro .display', 'From cool art,<br /><em>to sexy art.</em>', true],
  ['.intro .body-copy', 'With simple lines and expressive characters, I create illustrations that stay with you.'],
  ['.intro .text-link', 'View works <span aria-hidden="true">↗</span>', true],
  ['.intro-aside p', 'Commissions welcome!'],
  ['.contact-lead', 'Let’s create the next piece together.'],
  ['.contact-image-caption', 'Jade, my original character'],
  ['#contact .display', 'Questions about work<br /><em>or commissions</em>', true],
  ['#contact .body-copy', 'For new artwork and commission inquiries, find me through the links below.']
].map(([selector, english, html]) => {
  const element = document.querySelector(selector);
  return { element, english, html, japanese: html ? element.innerHTML : element.textContent };
});
const japaneseTitle = document.title;
const description = document.querySelector('meta[name="description"]');
const japaneseDescription = description.content;
let currentLanguage = 'ja';

function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  translatedText.forEach(({ element, english, japanese, html }) => {
    if (html) element.innerHTML = language === 'en' ? english : japanese;
    else element.textContent = language === 'en' ? english : japanese;
  });
  document.title = language === 'en' ? 'Evel\'s HP' : japaneseTitle;
  description.content = language === 'en'
    ? 'Evel’s illustration portfolio, contact links, and selected artwork.'
    : japaneseDescription;
  languageButton.textContent = language === 'en' ? '日本語' : 'English';
  languageButton.setAttribute('aria-label', language === 'en' ? '日本語に切り替える' : 'Switch to English');
  document.querySelector('.site-header .brand').setAttribute('aria-label', language === 'en' ? 'Back to Evel\'s HP home' : 'EvelのHP トップへ');
  document.querySelector('.desktop-nav').setAttribute('aria-label', language === 'en' ? 'Main navigation' : 'メインナビゲーション');
  document.querySelector('.menu-overlay nav').setAttribute('aria-label', language === 'en' ? 'Mobile navigation' : 'モバイルナビゲーション');
  document.querySelector('.gallery-section').setAttribute('aria-label', language === 'en' ? 'Illustration gallery: scroll to turn pages' : 'イラスト作品のスクロールギャラリー');
  document.querySelector('.contact-links').setAttribute('aria-label', language === 'en' ? 'External services' : '外部サービス');
  document.querySelector('.feature-image img').alt = language === 'en' ? 'Jade, my original character' : 'オリジナルキャラクターのジェイド';
  document.querySelectorAll('.book-cover-title').forEach(title => { title.textContent = language === 'en' ? 'Introduction' : '紹介'; });
  document.querySelectorAll('.art-card .page-front img').forEach((img, index) => { img.alt = language === 'en' ? `Illustration ${index + 1}` : `イラスト作品 ${index + 1}`; });
  try { localStorage.setItem('site-language', language); } catch { /* Storage may be unavailable for local files. */ }
}

languageButton.addEventListener('click', () => setLanguage(currentLanguage === 'ja' ? 'en' : 'ja'));
try { if (localStorage.getItem('site-language') === 'en') setLanguage('en'); } catch { /* Keep Japanese. */ }

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
const galleryStage = document.querySelector('.gallery-stage');
let cards = [];
const counter = document.querySelector('#gallery-index');
const progressBar = document.querySelector('#gallery-progress');
const heroTrack = document.querySelector('.hero-marquee-track');
let ticking = false;

// Illustration の5枚と、その順番に対応する権利元。
const illustrationFiles = ['1.webp', '2.webp', '3.png', '4.png', '5.png'];
const illustrationCredits = {
  '1.webp': '© COGNOSPHERE',
  '2.webp': '© CAPCOM',
  '3.png': '© CAPCOM',
  '4.png': '© NEXON Games & Yostar',
  '5.png': '© COGNOSPHERE'
};
const imageUrl = name => `./assets/${encodeURIComponent(name)}`;
const thumbnailUrl = name => `./assets/thumbs/${encodeURIComponent(name.replace(/\.[^.]+$/, '.webp'))}`;

function renderHero(files) {
  const screenWidth = window.screen?.availWidth || window.innerWidth;
  const cardWidth = Math.min(320, Math.max(220, (screenWidth - 7 * 18) / 6));
  heroTrack.parentElement.style.setProperty('--card-width', `${Math.round(cardWidth)}px`);
  const makeSet = () => {
    const set = document.createElement('div');
    set.className = 'hero-marquee-set';
    files.forEach(name => {
      const frame = document.createElement('div');
      frame.className = 'hero-marquee-item';
      const img = document.createElement('img');
      img.src = thumbnailUrl(name);
      img.alt = '';
      img.decoding = 'async';
      img.onerror = () => { img.onerror = null; img.src = imageUrl(name); };
      frame.append(img);
      set.append(frame);
    });
    return set;
  };
  heroTrack.replaceChildren(makeSet(), makeSet());
  heroTrack.style.setProperty('--marquee-duration', `${Math.max(18, files.length * 2.5)}s`);
}

async function loadImages() {
  try {
    let files = window.assetFiles || [];
    if (location.protocol !== 'file:') {
      try {
        const response = await fetch('./api/assets', { cache: 'no-store' });
        if (response.ok) files = await response.json();
      } catch (error) {
        console.warn('画像一覧APIを利用できないため保存済みの一覧を使用します', error);
      }
    }
    if (!files.length) return;

    renderHero(files);

    const selected = illustrationFiles.length
      ? illustrationFiles.filter(name => files.includes(name)).slice(0, 5)
      : files.slice(0, 5);
    document.querySelector('.gallery-counter').lastChild.textContent = ` / ${String(selected.length).padStart(2, '0')}`;
    galleryStage.replaceChildren();
    [null, ...selected].forEach((name, index) => {
      const card = document.createElement('figure');
      card.className = index === 0 ? 'art-card book-cover' : 'art-card';
      const front = document.createElement('div');
      front.className = 'page-face page-front';
      if (index === 0) {
        const title = document.createElement('span');
        title.className = 'book-cover-title';
        title.textContent = currentLanguage === 'en' ? 'Introduction' : '紹介';
        front.append(title);
      } else {
        const img = document.createElement('img');
        img.src = imageUrl(name);
        img.alt = currentLanguage === 'en' ? `Illustration ${index}` : `イラスト作品 ${index}`;
        const caption = document.createElement('div');
        caption.className = 'page-caption';
        const credit = document.createElement('span');
        credit.className = 'page-credit';
        credit.textContent = illustrationCredits[name] || '';
        const number = document.createElement('span');
        number.textContent = `${String(index).padStart(2, '0')} / ${String(selected.length).padStart(2, '0')}`;
        caption.append(credit, number);
        front.append(img, caption);
      }
      const back = document.createElement('div');
      back.className = 'page-face page-back';
      card.append(front, back);
      galleryStage.append(card);
    });
    cards = [...galleryStage.children];
    gallery.style.height = `${Math.max(3, cards.length + .6) * 100}vh`;
    scheduleScroll();
  } catch (error) {
    console.error(error);
  }
}
loadImages();

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
function updateScroll() {
  ticking = false;
  header.classList.toggle('is-scrolled', window.scrollY > 36);
  const rect = gallery.getBoundingClientRect();
  const distance = Math.max(1, rect.height - window.innerHeight);
  const progress = clamp(-rect.top / distance, 0, 1);
  progressBar.style.width = `${progress * 100}%`;
  const count = cards.length;
  if (!count) return;
  const active = clamp(Math.floor(progress * count + .5), 0, count - 1);
  counter.textContent = String(active).padStart(2, '0');
  galleryStage.classList.toggle('is-closed', progress <= .001);

  cards.forEach((card, index) => {
    if (reducedMotion.matches) {
      card.style.zIndex = String(index === active ? count + 1 : count - index);
      card.style.transform = 'rotateY(0deg)';
      card.style.opacity = String(index === active ? 1 : 0);
      return;
    }
    const turn = index === count - 1 ? 0 : clamp(progress * count - index, 0, 1);
    card.style.zIndex = String(turn > 0 ? count + index : count - index);
    card.style.transform = `rotateY(${-180 * turn}deg)`;
    card.style.opacity = '1';
  });

}
function scheduleScroll() { if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); } }
window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', scheduleScroll);
reducedMotion.addEventListener('change', scheduleScroll);
updateScroll();
