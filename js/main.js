'use strict';
/* ================================================================
   ACCESS SPEC TELECOMMUNICATIONS INC. — main.js
   ================================================================ */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ── HAMBURGER MENU ─────────────────────────────────────────── */
function initHamburger() {
  const btn  = $('#hamburger');
  const menu = $('#nav-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  $$('.nav-link', menu).forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    });
  });

  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    }
  });
}

/* ── ACTIVE NAV LINK ────────────────────────────────────────── */
function initActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ── INTERSECTION OBSERVER (fade-in) ────────────────────────── */
function initFadeIn() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  $$('.fade-in').forEach(el => obs.observe(el));
}

/* ── ANIMATED COUNTERS ──────────────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const suffix   = el.dataset.suffix || '';
  const prefix   = el.dataset.prefix || '';
  const frames   = 120;
  let   frame    = 0;

  const id = setInterval(() => {
    frame++;
    const eased = 1 - Math.pow(1 - frame / frames, 3);
    el.textContent = prefix + Math.round(eased * target) + suffix;
    if (frame >= frames) { clearInterval(id); el.textContent = prefix + target + suffix; }
  }, 1000 / 60);
}

function initCounters() {
  const els = $$('[data-counter]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
}

/* ── ROTATING HERO SUBTITLE ─────────────────────────────────── */
function initRotatingSubtitle() {
  const el = $('#rotating-subtitle');
  if (!el) return;

  const PHRASES = {
    fr: [
      "Réparation de caméras d'inspection de drain",
      "Réparation de caméras robotisées",
      "Réparation d'appareils de radiodétection",
      "Réparation de corrélateurs"
    ],
    en: [
      "Drain inspection camera repair",
      "Robotic camera repair",
      "Radio detection equipment repair",
      "correlator equipment repair"
    ]
  };

  let idx = 0;
  el.style.transition = 'opacity .4s ease, transform .4s ease';
  el.textContent = PHRASES.fr[0];

  setInterval(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    setTimeout(() => {
      const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
      idx = (idx + 1) % PHRASES.fr.length;
      el.textContent = PHRASES[lang][idx];
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 420);
  }, 3600);
}

/* ── BRAND CAROUSEL ─────────────────────────────────────────── */
function initCarousel() {
  const track = $('#carousel-track');
  if (!track) return;
  track.innerHTML += track.innerHTML; // duplicate for infinite loop
}

/* ── GALLERY LIGHTBOX ───────────────────────────────────────── */
function initLightbox() {
  const box     = $('#lightbox');
  if (!box) return;
  const img     = $('#lightbox-img');
  const caption = $('#lightbox-caption');
  const items   = $$('.gallery-item');
  let cur = 0;

  function open(i) {
    cur = i;
    const src = items[i].querySelector('img');
    img.src = src.src; img.alt = src.alt;
    caption.textContent = src.alt;
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    box.classList.remove('open');
    document.body.style.overflow = '';
    img.src = '';
  }
  function nav(dir) {
    cur = (cur + dir + items.length) % items.length;
    const src = items[cur].querySelector('img');
    img.style.opacity = '0';
    setTimeout(() => {
      img.src = src.src; img.alt = src.alt;
      caption.textContent = src.alt;
      img.style.opacity = '1';
    }, 160);
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
  });

  $('#lightbox-close')?.addEventListener('click', close);
  $('#lightbox-prev')?.addEventListener('click', () => nav(-1));
  $('#lightbox-next')?.addEventListener('click', () => nav(1));
  box.addEventListener('click', e => { if (e.target === box) close(); });
  document.addEventListener('keydown', e => {
    if (!box.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft')  nav(-1);
    if (e.key === 'ArrowRight') nav(1);
  });
}

/* ── FAQ ACCORDION ──────────────────────────────────────────── */
function initFAQ() {
  $$('.faq-item').forEach(item => {
    item.querySelector('.faq-q')?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      $$('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── CONTACT FORM → MAILTO ──────────────────────────────────── */
function initContactForm() {
  const form = $('#contact-form');
  if (!form) return;

  // Pré-cocher selon le paramètre URL (?type=estimation ou ?type=reparabilite)
  const urlType = new URLSearchParams(window.location.search).get('type');
  if (urlType === 'estimation') {
    const radio = form.querySelector('#type-estimation');
    if (radio) radio.checked = true;
  } else {
    const radio = form.querySelector('#type-reparabilite');
    if (radio) radio.checked = true;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const v  = name => (form.querySelector(`[name="${name}"]`)?.value || '').trim();
    const prenom    = v('prenom');
    const nom       = v('nom');
    const entreprise= v('entreprise') || 'N/A';
    const telephone = v('telephone');
    const email     = v('email');
    const type      = v('type_appareil');
    const marque    = v('marque');
    const desc      = v('description');

    const typeDemande = form.querySelector('[name="type_demande"]:checked')?.value || 'reparabilite';
    const typeLabel   = typeDemande === 'estimation'
      ? 'Estimation officielle du coût'
      : 'Évaluation de réparabilité';

    const subject = encodeURIComponent(`[${typeLabel}] ${type} ${marque}`);
    const body    = encodeURIComponent(
      `Bonjour,\n\n` +
      `Type de demande : ${typeLabel}\n\n` +
      `─── COORDONNÉES ───\n` +
      `Nom : ${prenom} ${nom}\n` +
      `Entreprise : ${entreprise}\n` +
      `Téléphone : ${telephone}\n` +
      `Courriel : ${email}\n\n` +
      `─── ÉQUIPEMENT ───\n` +
      `Type : ${type}\n` +
      `Marque : ${marque}\n\n` +
      `─── DESCRIPTION ───\n` +
      `${desc}\n\n` +
      `NOTE : Veuillez ajouter vos photos dans ce courriel.\n\n` +
      `Merci,\n${prenom} ${nom}`
    );
    window.location.href = `mailto:service@accessspec.com?subject=${subject}&body=${body}`;
  });
}

/* ── LANGUAGE SWITCH (FR ↔ EN) ──────────────────────────────── */
const I18N = {
  fr: {
    // Navigation
    'nav-accueil':  'Accueil',
    'nav-services': 'Services',
    'nav-marques':  'Marques',
    'nav-proc':     'Procédure',
    'nav-faq':      'FAQ',
    'nav-contact':  'Obtenir un devis',
    // Hero
    'hero-badge':   'Service partout au Québec',
    'hero-h1':      "Réparation de caméras d'inspection<br>de drain, et robotisées<br> — <span class=\"hero-h1-accent\">Service partout au Québec</span>",
    'hero-btn-tel': '📞 Appeler maintenant : 450-581-7009',
    'hero-btn-cta': 'Demander un devis →',
    // Section titles
    'prob-title':   'Votre équipement a un problème ?',
    'prob-sub':     "Nous diagnostiquons et réparons tous types d'équipements d'inspection de drain et de localisation.",
    'svc-title':    'Nos services de réparation',
    'proc-title':   'Comment ça fonctionne',
    'adv-title':    'Pourquoi choisir Access Spec ?',
    'brands-title': 'Nous réparons toutes les grandes marques',
    'testi-title':  'Ce que disent nos clients',
    'cert-title':   'Certifications & accréditations',
    'gallery-title':'Notre atelier',
    'cta-title':    'Prêt à faire réparer votre équipement ?',
    'cta-sub':      "Contactez-nous aujourd'hui pour un devis rapide et gratuit.",
    'cta-btn-tel':  '📞 450-581-7009',
    'cta-btn-form': 'Envoyer une demande →',
    // Footer
    'ft-tagline':   "Experts en réparation de caméras d'inspection de drain, caméras robotisées et localisateurs au Québec depuis plus de 30 ans.",
  },
  en: {
    'nav-accueil':  'Home',
    'nav-services': 'Services',
    'nav-marques':  'Brands',
    'nav-proc':     'Process',
    'nav-faq':      'FAQ',
    'nav-contact':  'Get a Quote',
    'hero-badge':   'Service across all of Québec',
    'hero-h1':      'Inspection Camera Repair<br> — <span class="hero-h1-accent">Québec Experts</span>',
    'hero-btn-tel': '📞 Call now: 450-581-7009',
    'hero-btn-cta': 'Request a quote →',
    'prob-title':   'Is your equipment having issues?',
    'prob-sub':     'We diagnose and repair all types of drain inspection and location equipment.',
    'svc-title':    'Our repair services',
    'proc-title':   'How it works',
    'adv-title':    'Why choose Access Spec?',
    'brands-title': 'We repair all major brands',
    'testi-title':  'What our clients say',
    'cert-title':   'Certifications & accreditations',
    'gallery-title':'Our workshop',
    'cta-title':    'Ready to have your equipment repaired?',
    'cta-sub':      'Contact us today for a fast, free quote.',
    'cta-btn-tel':  '📞 450-581-7009',
    'cta-btn-form': 'Send a request →',
    'ft-tagline':   'Québec experts in drain inspection camera, robotic camera, and radio detection equipment repair for over 30 years.',
  }
};

function applyLang(lang) {
  document.documentElement.lang = lang;
  localStorage.setItem('as-lang', lang);
  // data-i18n elements
  $$('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (I18N[lang]?.[key] !== undefined) el.innerHTML = I18N[lang][key];
  });
  // href elements keep their href; only text updates via data-i18n
  const btn = $('#lang-btn');
  if (btn) {
    btn.textContent = lang === 'fr' ? 'EN' : 'FR';
    btn.setAttribute('aria-label', lang === 'fr' ? 'Switch to English' : 'Passer en français');
  }
}

function initLangSwitch() {
  const btn = $('#lang-btn');
  if (!btn) return;
  const saved = localStorage.getItem('as-lang') || 'fr';
  if (saved !== 'fr') applyLang(saved);
  btn.addEventListener('click', () => applyLang(document.documentElement.lang === 'fr' ? 'en' : 'fr'));
}

/* ── BOOT ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initActiveNav();
  initFadeIn();
  initCounters();
  initRotatingSubtitle();
  initCarousel();
  initLightbox();
  initFAQ();
  initContactForm();
  initLangSwitch();
});
