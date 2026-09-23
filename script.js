/* ══════════════════════════════════════════════
   ДЮНА — лендинг. Данные и интерактив.
   Все данные собраны с карточки заведения
   на Яндекс Картах (org/dyuna/95789220678).
   ══════════════════════════════════════════════ */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

/* Блокировка прокрутки со счётчиком: лайтбокс открывается поверх
   модалки, и его закрытие не должно вернуть скролл раньше времени */
let locks = 0;
const lockScroll = on => {
  locks = Math.max(0, locks + (on ? 1 : -1));
  const locked = locks > 0;
  document.body.style.overflow = locked ? 'hidden' : '';
  locked ? window.__lenis?.stop() : window.__lenis?.start();
};

/* ══ ДАННЫЕ: ФОТО ══════════════════════════ */
/* preview — попадает в короткую секцию на странице (8 шт) */
const PHOTOS = [
  { f:'duna-05.jpg', cat:'interior', alt:'Зал с волнистыми стенами и мягкой подсветкой',    span:'w2 h2', preview:1 },
  { f:'duna-26.jpg', cat:'drinks',   alt:'Капучино с плотной молочной пенкой',                            preview:1 },
  { f:'duna-01.jpg', cat:'interior', alt:'Барная стойка и столики в зале',                                preview:1 },
  { f:'duna-08.jpg', cat:'food',     alt:'Меренговый рулет с ягодами',                                    preview:1 },
  { f:'duna-30.jpg', cat:'interior', alt:'Кофейная зона с тёплыми лампами',                 span:'h2',    preview:1 },
  { f:'duna-03.jpg', cat:'drinks',   alt:'Латте с рисунком на пенке',                                     preview:1 },
  { f:'duna-27.jpg', cat:'interior', alt:'Вид на бар и витрину с десертами',                span:'w2',    preview:1 },
  { f:'duna-24.jpg', cat:'food',     alt:'Лимонный тарт с меренгой и чашка кофе',                         preview:1 },

  { f:'duna-07.jpg', cat:'drinks',   alt:'Стакан кофе с собой с логотипом Дюна' },
  { f:'duna-25.jpg', cat:'interior', alt:'Светлый зал с нишами в стене и мягкими диванами' },
  { f:'duna-10.jpg', cat:'drinks',   alt:'Капучино с посыпкой и пирожное' },
  { f:'duna-04.jpg', cat:'food',     alt:'Витрина кондитерской со свежими десертами' },
  { f:'duna-28.jpg', cat:'interior', alt:'Диваны и столики у стены песочного цвета' },
  { f:'duna-16.jpg', cat:'food',     alt:'Сэндвич и напиток на деревянном столе' },
  { f:'duna-12.jpg', cat:'drinks',   alt:'Какао с маршмеллоу' },
  { f:'duna-17.jpg', cat:'interior', alt:'Зал у окна с мягкой мебелью' },
  { f:'duna-14.jpg', cat:'drinks',   alt:'Холодный напиток в фирменном стакане' },
  { f:'duna-06.jpg', cat:'interior', alt:'Декоративные ниши с вазами' },
  { f:'duna-22.jpg', cat:'drinks',   alt:'Стакан кофе с собой в руке у стены с логотипом' },
  { f:'duna-29.jpg', cat:'interior', alt:'Общий вид зала с подвесными лампами' },
  { f:'duna-20.jpg', cat:'interior', alt:'Столики у панорамного окна' },
  { f:'duna-31.jpg', cat:'interior', alt:'Зона с зеркалом и каменной раковиной' },
  { f:'duna-33.jpg', cat:'interior', alt:'Арочные ниши и неоновая подсветка' },
  { f:'duna-02.jpg', cat:'interior', alt:'Фасад кофейни Дюна с вывеской' },
];

/* ══ ДАННЫЕ: ОТЗЫВЫ (Яндекс Карты) ═════════ */
/* preview — 4 самых содержательных на страницу */
const REVIEWS = [
  { n:'Алина Кумановская', m:'Знаток города 6 уровня · 23 февраля', s:5, preview:1,
    t:'Прекрасное место с очень продуманным интерьером. «Дюна» полностью оправдывает своё название: песочные тона, пластичные линии стен и потолка успокаивают и расслабляют. Потолок — просто космос: волны света создают магию. Владелец обыграл всё до мелочей — даже полки здесь похожи на высеченные в скале.' },
  { n:'София Авдиева', m:'Знаток города 5 уровня · 7 июля', s:5, preview:1,
    t:'Очень классная кофейня, вчера брали невероятно вкусную айс матчу, сегодня лимонад — и всё было ооочень вкусно. Дизайн кофейни очень нежный, приятно находиться, везде всё чисто. Прекрасная девушка бариста, заряжает настроением и позитивом на весь день.' },
  { n:'Март Филонов', m:'Знаток города 4 уровня · 13 июля', s:5, preview:1,
    t:'Честно говоря, лучше кофе я не пил. Если не верите — просто попробуйте флэт.' },
  { n:'Татьяна Балабан', m:'Знаток города 8 уровня · 17 августа', s:5, preview:1,
    t:'Тихое уютное место рядом с домом. Много вариантов кофе, ПП-сладости. Рекомендую попробовать авторский чай — смородина, лаванда, мёд и гвоздика на базе ассама. «Бежевые» мамы будут в восторге, интерьер в соответствующих оттенках.' },

  { n:'Алиса', m:'Знаток города 5 уровня · 27 декабря 2025', s:5,
    t:'Интерьер — это отдельная история: стильный, продуманный до мелочей, с какой-то особенной, тёплой атмосферой. Кофе здесь варят отменный — ароматный, бодрящий. А десерты… это просто произведение искусства, которое тает во рту! И при таком высоком качестве цены очень радуют.' },
  { n:'Юлия Боголюбова', m:'Знаток города 6 уровня · 18 ноября 2025', s:5,
    t:'Чудесная кофейня с доступными ценами, классной атмосферой и очень вкусным кофе! Приятно удивил выбор сиропов и альтернатив, интересные десерты и дружелюбный, отзывчивый персонал.' },
  { n:'Оксана', m:'Кофеман 3 уровня · 3 февраля', s:5,
    t:'Отличная уютная кофейня-кондитерская. Мягкие цвета, аккуратные декоративные элементы и удобные места для сидения создают тёплую, спокойную атмосферу. Персонал дружелюбный и отзывчивый, цены вполне адекватные за такой уровень качества.' },
  { n:'Владислав', m:'Знаток города 6 уровня · 1 января', s:5,
    t:'Красивая и уютная кофейня! Пробовал у них смородиновый чай и капучино без добавок — вкусно! Также обратил внимание на большой выбор десертов. Рекомендую данное заведение!' },
  { n:'Дарья Луганская', m:'Знаток города 4 уровня · 18 января', s:5,
    t:'Не раз заходила в кофейню, очень приятное место. Красивый интерьер, приятная музыка, очень вежливые и приветливые девушки бариста и вкусный латте. Не могу не отметить красивейшие стаканчики.' },
  { n:'Карина Текуева', m:'Кофеман 3 уровня · 30 июля', s:5,
    t:'Отличная, уютная кофейня прямо в ЖК. Спокойная обстановка и интерьер. Одна из девушек-бариста мега коммуникабельная и клиентоориентированная, знает предпочтения всех, кто заходит часто.' },
  { n:'Татьяна Багрянцева', m:'Знаток города 10 уровня · 12 декабря 2025', s:5,
    t:'Очень вкусный кофе и какао. Атмосферное место. Нам всё понравилось! Первый раз кофе бамбл вызвал восторг, спасибо девушке! И авторский кофе с белым шоколадом — огонь.' },
  { n:'Валерия Одайник', m:'Кофеман 3 уровня · 17 апреля', s:5,
    t:'Прекрасная кофейня, моя большая рекомендация. Начиная от внимания и доброжелательности до очень вкусного кофе и интерьера! Всё продумано до мелочей, чувствуется душа и забота о гостях.' },
  { n:'Полина Маковецкая', m:'Кофеман 3 уровня · 6 ноября 2025', s:5,
    t:'Как не хватало подобного места в данной локации! Вкусно, красиво, персонал — 5 звёзд. Пустили даже с собакой, очень приятно!' },
  { n:'Ланна Лейн', m:'Знаток города 4 уровня · 13 июля', s:5,
    t:'Прекрасный кофе, идеальная температура, любой напиток подстраивают под вас. Отдельная благодарность бариста — клиентоориентированность на высшем уровне.' },
  { n:'Рыжик', m:'Кофеман 10 уровня · 10 ноября 2025', s:4,
    t:'Очень вкусный капучино! Милая приветливая бариста, тишина и умиротворение вокруг, красивый интерьер, есть Wi-Fi. Единственное — не хватало музыки фоном. Желаю новому месту процветания.' },
  { n:'Елена Мельникова', m:'Знаток города 5 уровня · 20 июля', s:5,
    t:'Побывала в кофейне впервые. С первых же секунд к себе расположила девушка бариста, посоветовала вкусный десерт и кофе, зарядила душевностью. В самом заведении очень уютно. Буду заходить теперь почаще.' },
  { n:'vlmer Roxy', m:'Знаток города 5 уровня · 19 ноября 2025', s:5,
    t:'Побывал я в кофейне «Дюна». Могу отметить хороший персонал: они уделяют максимальное внимание вкусам клиента. Отличный кофе по приятной цене, хорошая атмосфера и интерьер.' },
  { n:'Милена Каспарова', m:'Знаток города 4 уровня · 22 июля', s:5,
    t:'За последнее время это единственная кофейня, в которой готовят реально вкусный кофе. Фрапучино просто восторг.' },
  { n:'Василий Николаевич', m:'Знаток города 3 уровня · 14 ноября 2025', s:5,
    t:'Приятная кофейня во всех смыслах: уютная обстановка, большой выбор десертов, хороший кофе. Хочется возвращаться снова и снова за новой порцией десерта и кофе.' },
  { n:'Ника Б.', m:'Знаток города 4 уровня · 3 ноября 2025', s:5,
    t:'Лучшая кофейня в районе! Напитки вау, десерты вкусные, выбор большой, классный сервис. Обязательно будем сюда ходить.' },
  { n:'Татьяна Аршинова', m:'Знаток города 10 уровня · 5 января', s:5,
    t:'Очень вкусный капучино, а какие свежие пирожные — я в восторге! Всем рекомендую.' },
  { n:'Стелла Зайченко', m:'Знаток города 4 уровня · 25 ноября 2025', s:5,
    t:'Отличный кофе, просто лучший персонал, атмосфера просто огонь. Хожу теперь только сюда, спасибо большое за такую работу.' },
  { n:'Ирина Муштатова', m:'Знаток города 3 уровня · 14 декабря 2025', s:5,
    t:'Всех посетителей встречает с искренней улыбкой и всегда предложит и расскажет о десертах. Очень внимательный бариста, вежливый и чуткий!' },
  { n:'Elen_minutka35', m:'Знаток города 8 уровня · 22 марта', s:5,
    t:'Минусов не нашла. Отличный кофе в отличном ЖК, отличные девочки. Приятно. Комфортно. Красиво. Душевно.' },
];

/* ══ РЕНДЕР ════════════════════════════════ */
const tile = (p, i, big) => {
  const cls = ['gtile', ...(big && p.span ? p.span.split(' ').map(s => `gtile--${s}`) : [])].join(' ');
  return `<button class="${cls}" data-cat="${p.cat}" data-i="${i}" data-cursor="view" aria-label="Открыть фото: ${p.alt}">
    <img src="assets/photos/${p.f}" alt="${p.alt}" loading="lazy" width="1200" height="1200">
  </button>`;
};

const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
const card = r => `
  <article class="rcard">
    <p class="rcard__stars" aria-label="Оценка: ${r.s} из 5">${stars(r.s)}</p>
    <p class="rcard__text">${r.t}</p>
    <footer class="rcard__foot">
      <span class="rcard__name">${r.n}</span>
      <span class="rcard__meta">${r.m}</span>
    </footer>
  </article>`;

const grid      = $('#galleryGrid');
const modalGrid = $('#modalGalleryGrid');

grid.innerHTML       = PHOTOS.map((p, i) => p.preview ? tile(p, i, true) : '').join('');
modalGrid.innerHTML  = PHOTOS.map((p, i) => tile(p, i, false)).join('');
$('#reviewsGrid').innerHTML   = REVIEWS.filter(r => r.preview).map(card).join('');
$('#modalReviewsList').innerHTML = REVIEWS.map(card).join('');

$('#openGallery')?.querySelector('.btn__count')?.replaceChildren(String(PHOTOS.length));
$('#openReviews')?.querySelector('.btn__count')?.replaceChildren(String(REVIEWS.length));

/* ══ МОДАЛКИ ═══════════════════════════════ */
/* backdrop 0.5s · панель y36/scale .985 → 0/1 за 0.8s · выход 0.55s
   focus trap, Escape и возврат фокуса — как в референсе          */
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function createModal(el) {
  let opener = null, timer = null;

  const open = trigger => {
    opener = trigger || document.activeElement;
    clearTimeout(timer);
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add('is-open'));
    lockScroll(true);
    ($('[data-autofocus]', el) || $(FOCUSABLE, el))?.focus({ preventScroll:true });
    stagger(el);
  };

  const close = () => {
    if (el.hidden || !el.classList.contains('is-open')) return;
    el.classList.remove('is-open');
    lockScroll(false);
    timer = setTimeout(() => { el.hidden = true; }, 550);
    opener?.focus({ preventScroll:true });
  };

  $$('[data-close]', el).forEach(b => b.addEventListener('click', close));

  el.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    const f = $$(FOCUSABLE, el).filter(n => n.getClientRects().length);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (!el.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
  });

  return { open, close, el };
}

/* волна появления содержимого: .045s на элемент после открытия панели */
function stagger(el) {
  const items = $$('.gtile:not(.is-hidden), .rcard', el);
  items.forEach((n, i) => {
    n.classList.remove('is-shown');
    n.style.transitionDelay = `${(Math.min(i, 14) * 0.045 + 0.2).toFixed(3)}s`;
  });
  requestAnimationFrame(() => requestAnimationFrame(() =>
    items.forEach(n => n.classList.add('is-shown'))));
}

const galleryModal = createModal($('#modalGallery'));
const reviewsModal = createModal($('#modalReviews'));

$('#openGallery').addEventListener('click',  e => galleryModal.open(e.currentTarget));
$('#openGallery2').addEventListener('click', e => galleryModal.open(e.currentTarget));
$('#openReviews').addEventListener('click',  e => reviewsModal.open(e.currentTarget));

/* фильтры внутри модалки галереи */
$$('.chip', galleryModal.el).forEach(chip => {
  chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    $$('.chip', galleryModal.el).forEach(c => {
      c.classList.toggle('is-active', c === chip);
      c.setAttribute('aria-selected', String(c === chip));
    });
    $$('.gtile', modalGrid).forEach(t => t.classList.toggle('is-hidden', f !== 'all' && t.dataset.cat !== f));
    $('.modal__body', galleryModal.el).scrollTo({ top:0, behavior:'smooth' });
    stagger(galleryModal.el);
  });
});

/* ══ ЛАЙТБОКС ══════════════════════════════ */
const lb = $('#lightbox'), lbImg = $('#lbImg');
let scope = grid, lbIndex = 0, lastFocus = null;

const tilesIn = root => $$('.gtile', root).filter(t => !t.classList.contains('is-hidden'));

function openLB(t, root) {
  scope = root;
  lbIndex = tilesIn(root).indexOf(t);
  lastFocus = t;
  render();
  lb.hidden = false;
  requestAnimationFrame(() => lb.classList.add('is-open'));
  lockScroll(true);
  $('#lbClose').focus();
}
function render() {
  const p = PHOTOS[+tilesIn(scope)[lbIndex].dataset.i];
  lbImg.src = `assets/photos/${p.f}`;
  lbImg.alt = p.alt;
}
function step(d) {
  const t = tilesIn(scope);
  lbIndex = (lbIndex + d + t.length) % t.length;
  render();
}
function closeLB() {
  if (lb.hidden) return;
  lb.classList.remove('is-open');
  setTimeout(() => { lb.hidden = true; }, 400);
  lockScroll(false);
  lastFocus?.focus();
}

grid.addEventListener('click',      e => { const t = e.target.closest('.gtile'); if (t) openLB(t, grid); });
modalGrid.addEventListener('click', e => { const t = e.target.closest('.gtile'); if (t) openLB(t, modalGrid); });
$('#lbClose').addEventListener('click', closeLB);
$('#lbPrev').addEventListener('click', () => step(-1));
$('#lbNext').addEventListener('click', () => step(1));
lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });

/* лайтбокс перехватывает клавиши раньше модалки под ним */
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  e.stopPropagation();
  if (e.key === 'Escape')     closeLB();
  if (e.key === 'ArrowLeft')  step(-1);
  if (e.key === 'ArrowRight') step(1);
  if (e.key === 'Tab') {
    e.preventDefault();
    const f = [$('#lbClose'), $('#lbPrev'), $('#lbNext')];
    const i = f.indexOf(document.activeElement);
    f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
  }
}, true);

/* ══ НАВИГАЦИЯ ═════════════════════════════ */
const nav = $('#nav');
const onScroll = () => nav.classList.toggle('is-stuck', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive:true });

const burger = $('#burger'), mobile = $('#mobile-menu');
const setMenu = open => {
  mobile.hidden = !open;
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  lockScroll(open);
};
burger.addEventListener('click', () => setMenu(mobile.hidden));
$$('a', mobile).forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mobile.hidden) setMenu(false); });

/* Появление, счётчики, параллакс, курсор и smooth scroll — в motion.js */

})();
