/* ══════════════════════════════════════════════
   MOTION — система движения, перенесённая
   один-в-один с референса yakkachinar:

   ease          cubic-bezier(.16, 1, .3, 1)
   smooth scroll Lenis { lerp .09, wheelMultiplier .95 }
   fade-up       opacity 0 / y 32  → 1.1s,  порог 0.2
   line reveal   y 110% → 0        → 1.25s, stagger .09s, порог 0.35
   eyebrow       индекс .9s → линия scaleX 1.1s (+.1s) → текст (+.25s)
   image reveal  clip-path inset(100%→0) 1.6s + scale 1.24→1 2.3s
   parallax      слой ±9%, секции −5%→5% и 22%→−22%
   marquee       52s linear · grain .9s steps(4)
   ══════════════════════════════════════════════ */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reduce) document.documentElement.dataset.motion = 'reduce';

/* ── 1. SMOOTH SCROLL (Lenis, параметры референса) ───────── */
let lenis = null;
if (!reduce && typeof Lenis === 'function') {
  lenis = new Lenis({ autoRaf:true, lerp:.09, wheelMultiplier:.95, allowNestedScroll:true });
  window.__lenis = lenis;

  // якорные ссылки едут через Lenis
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -Math.round(parseFloat(getComputedStyle(document.documentElement).fontSize) * 5) });
  });
}

/* ── 2. LINE REVEAL заголовков ───────────────────────────── */
/* h1/h2 делятся по <br> на строки; каждая строка — маска,
   внутренний span выезжает снизу со сдвигом .09s          */
function splitLines(el) {
  const lines = [[]];
  el.childNodes.forEach(n => {
    if (n.nodeName === 'BR') lines.push([]);
    else lines[lines.length - 1].push(n);
  });
  el.innerHTML = '';
  lines.forEach((nodes, i) => {
    const line  = document.createElement('span');
    const inner = document.createElement('span');
    line.className  = 'reveal-lines__line';
    inner.className = 'reveal-lines__inner';
    inner.style.transitionDelay = `${(i * 0.09).toFixed(2)}s`;
    nodes.forEach(n => inner.appendChild(n));
    line.appendChild(inner);
    el.appendChild(line);
  });
  el.classList.add('reveal-lines');
  el.classList.remove('reveal');
}
$$('.hero__title, .h2, .cta__title').forEach(splitLines);

/* ── 3. EYEBROW: индекс → линия → подпись ────────────────── */
$$('.sect-tag').forEach(tag => {
  tag.childNodes.forEach(n => {
    if (n.nodeType === 3 && n.textContent.trim()) {
      const em = document.createElement('em');
      em.textContent = n.textContent.trim();
      n.replaceWith(em);
    }
  });
  tag.classList.remove('reveal');
});

/* ── 4. IMAGE REVEAL: маска + зум + параллакс ────────────── */
/* Оригинальный <img> остаётся в потоке как невидимый sizer —
   так исходная раскладка и высоты не меняются.             */
const PARALLAX = [];

function wrapImage(fig, { parallax = 0 } = {}) {
  const img = $('img', fig);
  if (!img || fig.classList.contains('image-reveal')) return;

  img.classList.add('sizer');
  fig.classList.add('image-reveal');

  const mask  = document.createElement('div');
  const plx   = document.createElement('div');
  const zoom  = document.createElement('div');
  mask.className = 'image-reveal__mask';
  plx.className  = 'image-reveal__parallax';
  zoom.className = 'image-reveal__zoom';

  const clone = img.cloneNode();
  clone.classList.remove('sizer');
  clone.removeAttribute('width');
  clone.removeAttribute('height');
  clone.alt = '';
  clone.setAttribute('aria-hidden', 'true');

  zoom.appendChild(clone);
  plx.appendChild(zoom);
  mask.appendChild(plx);
  fig.appendChild(mask);

  if (parallax && !reduce) PARALLAX.push({ el: plx, range: parallax });
}

$$('.about__fig').forEach(f => wrapImage(f, { parallax: 5 }));
$$('.sig__media').forEach(f => wrapImage(f, { parallax: 4 }));
$$('.desserts__media figure').forEach(f => wrapImage(f, { parallax: 5 }));
$$('.location__media').forEach(f => wrapImage(f, { parallax: 6 }));
$$('.gtile').forEach(f => wrapImage(f));

/* фоновое фото секции десертов: −5% → 5% */
const dbg = $('.desserts__bg img');
if (dbg && !reduce) { dbg.classList.add('parallax-layer'); PARALLAX.push({ el: dbg, range: 5 }); }

/* ── 5. БЛИК ПО ЛОГОТИПУ (brand-sheen-loop 9s) ───────────── */
const word = $('.hero__wordmark span');
if (word && !reduce) {
  const sheen = document.createElement('span');
  sheen.className = 'sheen';
  sheen.setAttribute('aria-hidden', 'true');
  sheen.textContent = word.textContent;
  word.appendChild(sheen);
}

/* ── 6. ТРИГГЕРЫ ПОЯВЛЕНИЯ ───────────────────────────────── */
/* пороги как в референсе: fade-up .2 · строки .35 · eyebrow .6 */
function observe(selector, amount) {
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(({ isIntersecting, target, intersectionRatio }) => {
      if (!isIntersecting && intersectionRatio < amount) return;
      target.classList.add('is-in');
      obs.unobserve(target);
      $$('.bar i', target).forEach(b => b.style.width = b.dataset.pct + '%');
      const num = target.matches('[data-count]') ? target : $('[data-count]', target);
      if (num && !num.dataset.done) countUp(num);
    });
  }, { threshold: [0, amount], rootMargin: '0px 0px -5% 0px' });
  $$(selector).forEach(el => io.observe(el));
}

if (reduce) {
  $$('.reveal, .reveal-lines, .sect-tag, .image-reveal').forEach(el => el.classList.add('is-in'));
  $$('.bar i').forEach(b => b.style.width = b.dataset.pct + '%');
} else {
  observe('.reveal', .2);
  observe('.reveal-lines', .35);
  observe('.sect-tag', .6);
  observe('.image-reveal', .2);
  observe('.stat, .score', .2);

  /* галерея: плитки раскрываются волной по .06s */
  $$('.gtile').forEach((t, i) => $('.image-reveal__mask', t)?.style.setProperty('transition-delay', `${(i % 4) * 0.06}s`));
}

function countUp(el) {
  el.dataset.done = '1';
  const end = parseFloat(el.dataset.count);
  const dec = +(el.dataset.dec || 0);
  const dur = 1100, t0 = performance.now();
  const fmt = v => dec ? v.toFixed(dec).replace('.', ',') : Math.round(v).toString();
  const tick = t => {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = fmt(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ── 7. ПАРАЛЛАКС ПО СКРОЛЛУ ─────────────────────────────── */
/* прогресс элемента на отрезке [start end → end start],
   как offset у референса                                   */
if (PARALLAX.length && !reduce) {
  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;
    PARALLAX.forEach(({ el, range }) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -vh || r.top > vh * 2) return;
      const progress = (vh - r.top) / (vh + r.height);   // 0 → 1
      const shift = (progress - .5) * 2 * range;          // −range → +range, %
      el.style.transform = `translate3d(0, ${shift.toFixed(2)}%, 0)`;
    });
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  lenis ? lenis.on('scroll', request) : window.addEventListener('scroll', request, { passive:true });
  window.addEventListener('resize', request);
  update();
}

/* ── 8. КАСТОМНЫЙ КУРСОР ─────────────────────────────────── */
/* точка + кольцо 38px; состояния view / magnetic,
   сжатие при нажатии — как в референсе                      */
const finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
if (finePointer && !reduce) {
  document.documentElement.classList.add('has-custom-cursor');

  const root = document.createElement('div');
  root.className = 'cursor cursor--hidden';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML = `
    <div class="cursor__ring"><div class="cursor__halo"></div><span class="cursor__label"></span></div>
    <div class="cursor__dot"></div>`;
  document.body.appendChild(root);

  const ring  = $('.cursor__ring', root);
  const dot   = $('.cursor__dot', root);
  const label = $('.cursor__label', root);

  const target = { x: innerWidth / 2, y: innerHeight / 2 };
  const dotPos = { ...target }, ringPos = { ...target };
  let raf = 0;

  const loop = () => {
    dotPos.x  += (target.x - dotPos.x)  * .38;
    dotPos.y  += (target.y - dotPos.y)  * .38;
    ringPos.x += (target.x - ringPos.x) * .14;
    ringPos.y += (target.y - ringPos.y) * .14;
    dot.style.transform  = `translate3d(${dotPos.x}px,${dotPos.y}px,0)`;
    ring.style.transform = `translate3d(${ringPos.x}px,${ringPos.y}px,0)`;
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  document.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    target.x = e.clientX; target.y = e.clientY;
    root.classList.remove('cursor--hidden');

    const hit = e.target.closest('[data-cursor], a, button');
    const mode = hit?.dataset?.cursor || (hit ? 'magnetic' : '');
    root.classList.toggle('cursor--view', mode === 'view');
    root.classList.toggle('cursor--magnetic', mode === 'magnetic');
    const text = hit?.dataset?.cursorLabel || (mode === 'view' ? 'СМОТРЕТЬ' : '');
    label.textContent = text;
    label.classList.toggle('is-visible', !!text);
  }, { passive:true });

  document.addEventListener('pointerdown', () => ring.classList.add('is-pressed'));
  document.addEventListener('pointerup',   () => ring.classList.remove('is-pressed'));
  document.addEventListener('mouseleave',  () => root.classList.add('cursor--hidden'));
  window.addEventListener('blur',          () => root.classList.add('cursor--hidden'));
}


/* ── 9. АКТИВНЫЙ РАЗДЕЛ В НАВИГАЦИИ ──────────────────────── */
/* Наблюдатель следит за узкой полосой в середине экрана
   (rootMargin -40% / -59% — как в референсе), точка переезжает
   к активному пункту за .7s на той же кривой.                */
const navLinks = $$('.nav__link');
const mobLinks = $$('.mobile-menu__nav a');
const dot      = $('.nav__active');
const sections = $$('[data-nav]');

if (sections.length && navLinks.length) {
  let current = '';

  const moveDot = link => {
    if (!dot) return;
    if (!link) { dot.classList.remove('is-on'); return; }
    const x = link.offsetLeft + link.offsetWidth / 2;
    dot.style.transform = `translate3d(${x}px,0,0)`;
    dot.classList.add('is-on');
  };

  const setActive = name => {
    if (name === current) return;
    current = name;
    const mark = (el, on) => {
      el.classList.toggle('is-active', on);
      on ? el.setAttribute('aria-current', 'true') : el.removeAttribute('aria-current');
    };
    let active = null;
    navLinks.forEach(a => {
      const on = a.getAttribute('href') === `#${name}`;
      mark(a, on);
      if (on) active = a;
    });
    mobLinks.forEach(a => mark(a, a.getAttribute('href') === `#${name}`));
    moveDot(active);              // в шапке нет пункта для hero — точка гаснет
  };

  /* активна секция, пересекающая линию на 45% высоты экрана —
     тот же ориентир, что у полосы -40%/-59% в референсе,
     но без пропусков при быстрых перескоках                */
  const syncNav = () => {
    const line = window.innerHeight * 0.45;
    let name = sections[0].dataset.nav;
    for (const sec of sections) {
      const r = sec.getBoundingClientRect();
      if (r.top <= line) name = sec.dataset.nav;
    }
    setActive(name);
  };

  lenis ? lenis.on('scroll', syncNav) : window.addEventListener('scroll', syncNav, { passive:true });
  window.addEventListener('resize', () => {
    moveDot(navLinks.find(a => a.classList.contains('is-active')));
    syncNav();
  });
  syncNav();
}

})();
