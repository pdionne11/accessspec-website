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

/* ── CONTACT FORM → WEB3FORMS ───────────────────────────────── */
function initContactForm() {
  const form   = $('#contact-form');
  const status = $('#form-status');
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

  // Afficher les noms de fichiers sélectionnés
  const fileInput = form.querySelector('#photos');
  const fileNames = $('#file-names');
  if (fileInput && fileNames) {
    fileInput.addEventListener('change', () => {
      const files = [...fileInput.files];
      fileNames.textContent = files.length
        ? files.map(f => f.name).join(', ')
        : '';
    });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
    const btn  = form.querySelector('[type="submit"]');
    const originalHTML = btn.innerHTML;

    // Bouton — état envoi
    btn.disabled = true;
    btn.innerHTML = lang === 'en' ? '⏳ Sending…' : '⏳ Envoi en cours…';
    if (status) { status.style.display = 'none'; status.className = 'form-status'; }

    try {
      const data = new FormData(form);
      const res  = await fetch('contact-handler.php', {
        method: 'POST',
        body: data
      });
      const json = await res.json();

      if (json.success) {
        // Succès
        btn.innerHTML = lang === 'en' ? '✅ Message sent!' : '✅ Message envoyé !';
        btn.style.background = 'var(--primary)';
        if (status) {
          status.className = 'form-status form-status--success';
          status.innerHTML = lang === 'en'
            ? '✅ Your message has been sent. We will get back to you shortly.'
            : '✅ Votre message a bien été envoyé. Nous vous répondrons dans les meilleurs délais.';
          status.style.display = 'block';
        }
        form.reset();
        document.getElementById('file-names').textContent = '';
      } else {
        throw new Error(json.message || 'Error');
      }
    } catch {
      // Erreur
      btn.innerHTML = lang === 'en' ? '❌ Error — please retry' : '❌ Erreur — réessayez';
      btn.style.background = 'var(--cta-urgent)';
      if (status) {
        status.className = 'form-status form-status--error';
        status.innerHTML = lang === 'en'
          ? '❌ Sending failed. Please try again or call <a href="tel:4505817009">450-581-7009</a>.'
          : '❌ Échec de l\'envoi. Veuillez réessayer ou appeler le <a href="tel:4505817009">450-581-7009</a>.';
        status.style.display = 'block';
      }
    } finally {
      // Rétablir le bouton après 5 s
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
        btn.style.background = '';
      }, 5000);
    }
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
    'nav-contact-simple': 'Contact',
    'nav-contact':  'Obtenir un estimé',
    // Hero
    'hero-badge':   'Service partout au Québec',
    'hero-h1':      "Réparation de caméras d'inspection<br>de drain, et robotisées<br><span class=\"hero-h1-accent\">Service partout au Québec</span>",
    'hero-btn-tel': '📞 Appeler maintenant : 450-581-7009',
    'hero-btn-cta': 'Demander une évaluation →',
    // Section titles
    'prob-title':   'Votre équipement a un problème ?',
    'prob-sub':     "Nous diagnostiquons et réparons tous types d'équipements d'inspection de drain et de localisation.",
    'svc-title':    'Nos services de réparation',
    'proc-title':   'Comment ça fonctionne',
    'adv-title':    'Pourquoi choisir Access Spec ?',
    'brands-title': 'Nous réparons toutes les grandes marques',
    'testi-title':  'Ce que disent nos clients',
    'cert-title':   'Certifications &amp; accréditations',
    'gallery-title':'Notre atelier',
    'cta-title':    'Prêt à faire réparer votre équipement ?',
    'cta-sub':      "Contactez-nous aujourd'hui pour un estimé rapide. Service partout au Québec.",
    'cta-btn-tel':  '📞 450-581-7009',
    'cta-btn-form': 'Envoyer une demande →',
    // Problem cards
    'prob-1': 'Caméra ne fonctionne plus',
    'prob-2': 'Câble brisé ou endommagé',
    'prob-3': 'Image instable ou absente',
    'prob-4': 'Localisateur défectueux',
    'prob-5': "Robot d'inspection défaillant",
    // Services cards
    'svc-sub':        'Une expertise complète pour remettre votre équipement en parfait état de fonctionnement.',
    'svc-diag-title': 'Diagnostic',
    'svc-diag-desc':  'Évaluation complète de votre équipement par nos techniciens certifiés. Rapport détaillé avec recommandations.',
    'svc-diag-b1':    '✓ Rapport écrit inclus',
    'svc-diag-b2':    '✓ Estimé détaillé',
    'svc-diag-b3':    '⚡ Résultat en 48-72h',
    'svc-rep-title':  'Réparation',
    'svc-rep-desc':   "Réparation experte de tous les composants : câbles, têtes de caméra, électronique, enrouleurs, moniteurs.",
    'svc-rep-b1':     "✓ Pièces d'origine",
    'svc-rep-b2':     '✓ Garantie incluse',
    'svc-rep-b3':     '📅 Standard : 10-15 jours',
    'svc-rep-b4':     '⚡ Urgence : Appelez-nous',
    'svc-maint-title':'Entretien préventif',
    'svc-maint-desc': "Programme d'entretien régulier pour prolonger la durée de vie de vos équipements et éviter les pannes coûteuses.",
    'svc-maint-b1':   '✓ Nettoyage complet',
    'svc-maint-b2':   '✓ Vérification systèmes',
    'svc-maint-b3':   '✓ Lubrification câbles',
    'svc-maint-b4':   '✓ Tests de performance',
    'svc-btn':        'Voir tous nos services →',
    // Timeline
    'proc-sub': 'Un processus simple et transparent.',
    'tl-1-h': 'Appel',        'tl-1-p': 'Contactez-nous par téléphone ou courriel pour décrire le problème.',
    'tl-2-h': 'Validation',   'tl-2-p': 'Nous confirmons que nous pouvons réparer votre équipement.',
    'tl-3-h': 'Envoi',        'tl-3-p': "Apportez l'appareil vous même ou par système de livraison.",
    'tl-4-h': 'Diagnostic',   'tl-4-p': "Nos techniciens évaluent l'équipement et vous transmettent un estimé.",
    'tl-5-h': 'Réparation',   'tl-5-p': 'Réparation effectuée avec pièces neuves, garantie incluse.',
    'tl-6-h': 'Retour',       'tl-6-p': "L'équipement est testé, et prêt à l'emploi. Livraison possible.",
    'proc-btn': 'Voir la procédure détaillée →',
    // Advantages
    'adv-1-label': "d'expertise",
    'adv-1-desc':  "Spécialistes en réparation de caméra d'inspection de drain et caméra robotisée et appareil connexe depuis plus de 30 ans au Québec.",
    'adv-2-label': 'moins cher que remplacer',
    'adv-2-desc':  "Économisez jusqu'à 3 à 5 fois le coût d'un équipement neuf grâce à la réparation.",
    'adv-3-label': 'service rapide',
    'adv-3-desc':  "Service standard 10-15 jours. Service d'urgence disponible.",
    'adv-4-label': 'villes desservies',
    'adv-4-desc':  'Partout au Québec — Montréal, Laval, trois-rivières, Québec, Sherbrooke, Gatineau, Saguenay et plus.',
    // Brands
    'brands-sub':  'Techniciens certifiés par les fabricants, pièces d\'origine garanties.',
    'brands-also': 'Nous réparons également : <strong>Pearpoint · ARIES Industries · Envirosight · JD Brule</strong> et d\'autres marques. <a href="marques.html" aria-label="Voir toutes les marques réparées">Voir toutes les marques →</a>',
    // Testimonials
    'testi-sub':    'Des centaines d\'entreprises et professionnels nous font confiance au Québec.',
    'testi-1-text': 'Service rapide et professionnel. Notre caméra RIDGID était réparée en 48h, comme neuve. Je recommande sans hésiter à tous les plombiers.',
    'testi-1-role': 'Plombier, Montréal',
    'testi-2-text': 'Nous envoyons tous nos équipements municipaux chez Access Spec depuis 10 ans. Leur expertise est inégalée et les délais sont toujours respectés.',
    'testi-2-role': 'Ingénieure municipale, Québec',
    'testi-3-text': "Excellent diagnostic, prix honnête. Ma caméra Gen-Eye était irréparable selon le fabricant — Access Spec l'a réparée ! Je recommande sans hésiter.",
    'testi-3-role': 'Entrepreneur, Sherbrooke',
    // Certifications
    'cert-sub': "Reconnus et accrédités par les plus grands fabricants d'équipements d'inspection.",
    'cert-1': 'Réparateur accrédité Hathorn',
    'cert-2': 'Certification Envirosight (ROVVER X)',
    'cert-3': 'Certification ARIES Industries',
    'cert-4': 'Centre de réparation agréé JD Brule',
    'cert-5': 'Centre de réparation acrédité FORBEST',
    // Gallery
    'gallery-sub': 'Un environnement professionnel équipé pour réparer les équipements les plus complexes.',
    // Footer
    'ft-tagline':       "Experts en réparation de caméras d'inspection de drain, caméras robotisées et localisateurs au Québec depuis plus de 30 ans.",
    'ft-nav-title':     'Navigation',
    'ft-nav-home':      'Accueil',
    'ft-nav-services':  'Services',
    'ft-nav-brands':    'Marques',
    'ft-nav-proc':      "Procédure d'envoi",
    'ft-nav-contact':   'Contact',
    'ft-svc-title':     'Services',
    'ft-svc-1':         "Caméras d'inspection",
    'ft-svc-2':         'Caméras robotisées',
    'ft-svc-3':         'Localisateurs radiodétection',
    'ft-svc-4':         'Moniteurs & écrans',
    'ft-svc-5':         'Enrouleurs & dévidoirs',
    'ft-svc-6':         'Électronique & accessoires connexes',
    'ft-contact-title': 'Contact',
    'ft-contact-form':  'Formulaire de contact',
    'ft-sitemap':       'Plan du site',
    'ft-copy':          '© 2025 Access Spec Telecommunications Inc. Tous droits réservés.',
    'ft-bottom':        "Réparation de caméras d'inspection — Service partout au Québec",
    'ft-nav-faq':       'FAQ',
    'ft-location':      "Location d'équipements",
    'ft-brands-col-title': "Marques réparées",
    'ft-faq-col-title': "Réponses rapides",
    'ft-contact-direct-title': "Contact direct",
    'ft-faq-delais':    "Délais de réparation",
    'ft-faq-couts':     "Coût vs appareil neuf",
    'ft-faq-marques':   "Marques supportées",
    'ft-faq-garantie':  "Garantie",
    'ft-faq-location':  "Location d'appareils",
    // Services page
    'svc-page-h1':  "Nos services de réparation",
    'svc-page-sub': "Diagnostic, réparation et entretien de tous types d'appareils d'inspection de drain, caméra robotisée, corrélateurs et de localisateurs<br><span class=\"hero-h1-accent\">Service partout au Québec</span>",
    'sd1-h3': "Caméras d'inspection de drain",
    'sd1-sub': "Réparation complète de toutes marques et modèles de caméras de drain",
    'sd1-body': "Nos techniciens certifiés réparent les caméras d'inspection de drain de toutes marques : têtes de caméra, modules électroniques, connecteurs et circuits imprimés.",
    'sd1-f1': "Remplacement de tête de caméra",
    'sd1-f2': "Réparation des circuits électroniques internes",
    'sd1-f3': "Remplacement des connecteurs et prises étanches",
    'sd1-f4': "Calibration et réglage de l'optique",
    'sd1-f5': "Remplacement des joints de terminaison et d'étanchéité",
    'sd1-f6': "Nettoyage et décontamination complets",
    'sd2-h3': "Caméras robotisées",
    'sd2-sub': "Expertise spécialisée en réparation de robots d'inspection avancés",
    'sd2-body': "Les caméras robotisées (ARIES, CUES, ENVIROSIGHT, etc.) requièrent une expertise très spécialisée. Access Spec est l'un des rares centres au Québec certifiés pour la réparation de ces équipements complexes. Nous intervenons sur tous les systèmes mécaniques, électroniques et optiques.",
    'sd2-f1': "Réparation des moteurs de propulsion et de rotation",
    'sd2-f2': "Réparation des systèmes Pan-Tilt-Zoom (PTZ)",
    'sd2-f3': "Remplacement des modules de caméra haute définition",
    'sd2-f4': "Réparation des systèmes d'éclairage LED",
    'sd2-f5': "Remplacement des joints d'étanchéités",
    'sd2-f6': "Réparation des câbles ombilicaux et connecteurs",
    'sd2-f7': "Tests de fonctionnement complets post-réparation",
    'sd3-h3': "Localisateurs radiodétection",
    'sd3-sub': "Réparation et recalibration de tous modèles de localisateurs",
    'sd3-body': "Les localisateurs de radiodétection sont des instruments de précision qui nécessitent une calibration rigoureuse après toute réparation. Nos techniciens sont formés pour réparer et recalibrer tous les modèles courants utilisés dans l'inspection de conduites souterraine.",
    'sd3-f1': "Réparation des receveurs et transmetteurs",
    'sd3-f2': "Remplacement des sondes et antennes",
    'sd3-f3': "Recalibration complète de précision",
    'sd3-f4': "Réparation des écrans et interfaces utilisateur",
    'sd3-f5': "Remplacement des batteries et chargeurs",
    'sd3-f6': "Remplacement des boîtiers",
    'sd3-f7': "Vérification des émetteurs (sondes/transmetteurs)",
    'sd3-f8': "Tests de profondeur et de localisation",
    'sd4-h3': "Moniteurs &amp; écrans",
    'sd4-sub': "Réparation de tous les modèles de moniteurs portables et fixes",
    'sd4-body': "Nous réparons les moniteurs portables et les unités de contrôle de tous les systèmes d'inspection. Qu'il s'agisse d'un écran LCD défectueux ou d'un problème d'alimentation, nos techniciens ont la solution.",
    'sd4-f1': "Remplacement d'écrans LCD/OLED",
    'sd4-f2': "Réparation des alimentations et batteries",
    'sd4-f3': "Remplacement des cartes d'enregistrement DVR",
    'sd4-f4': "Réparation des ports USB, HDMI et AV",
    'sd4-f5': "Remplacement des boutons et interfaces",
    'sd5-h3': "Enrouleurs &amp; dévidoirs",
    'sd5-sub': "Révision et réparation des systèmes d'enroulement de câble",
    'sd5-body': "L'enrouleur est un composant mécanique critique pour la longévité de vos câbles. Nous révisons et réparons les systèmes d'enroulement manuels et motorisés, et remplaçons les joints tournants (slip rings) qui transmettent le signal électrique tout en permettant la rotation.",
    'sd5-f1': "Remplacement des joints tournants (slip rings)",
    'sd5-f2': "Remplacement des roulements et guides de câble",
    'sd5-f3': "Réparation des compteurs de longueur",
    'sd5-f4': "Révision des freins et systèmes de tension",
    'sd5-f5': "Lubrification et nettoyage complets",
    'sd5-f6': "Remplacement du cadre rigide",
    'sd6-h3': "Électronique &amp; accessoires connexes",
    'sd6-sub': "Réparation de tous les composants électroniques des systèmes d'inspection",
    'sd6-body': "Au-delà des équipements principaux, nous réparons l'ensemble de l'écosystème électronique lié à l'inspection de conduites : unités de génération de signal, émetteurs de sonde, stations d'accueil, chargeurs et accessoires divers.",
    'sd6-f1': "Réparation des générateurs de signal",
    'sd6-f2': "Réparation des émetteurs de sonde auto-nivelants",
    'sd6-f3': "Réparation des stations de charge",
    'sd6-f4': "Soudure de composants SMD de précision",
    'sd6-f5': "Diagnostic et réparation de circuits intégrés",
    'sd6-f6': "Réparation des alimentations 12V/24V DC",
    'svc-clt-h2':   "Qui fait appel à nos services ?",
    'svc-clt-sub':  "Nous servons tous les professionnels qui utilisent des appareils d'inspection de conduites au Québec.",
    'svc-clt-1-h4': "Plombiers &amp; entrepreneurs",
    'svc-clt-1-p':  "Réparation rapide pour minimiser l'immobilisation de votre équipement de travail.",
    'svc-clt-2-h4': "Municipalités",
    'svc-clt-2-p':  "Service de réparation d'appareils municipaux d'inspection de réseaux d'égout.",
    'svc-clt-3-h4': "Entreprises d'inspection",
    'svc-clt-3-p':  "Entretien et réparation d'une flotte complète d'appareils d'inspection vidéo.",
    'svc-clt-4-h4': "Entrepreneurs généraux",
    'svc-clt-4-p':  "Réparation d'appareils de localisation et d'inspection pour les chantiers.",
    'svc-cta-h2':   "Besoin de faire réparer votre équipement ?",
    'svc-cta-p':    "Contactez-nous pour un estimé. Nous vous réponderons rapidement.",
    'svc-cta-form': "Formulaire de contact →",
    // Brands page
    'brands-page-h1':   "Marques de caméras d'inspection que nous réparons au Québec",
    'brands-page-sub':  "Techniciens certifiés par les fabricants — réparation avec pièces d'origine pour toutes les grandes marques du marché.",
    'brands-cert-h2':   "Marques certifiées",
    'brands-cert-sub':  "Nous sommes accrédités et certifiés par ces fabricants pour effectuer des réparations avec garantie officielle.",
    'brand-hathorn-p':  "Réparateur accrédité officiel. Nous réparons toute la gamme Hathorn : têtes de caméra, câbles coaxiaux, enrouleurs, connecteurs et systèmes d'enregistrement.",
    'brand-hathorn-b':  "✅ Réparateur accrédité",
    'brand-ridgid-p':   "Réparation complète des systèmes SeeSnake : caméras, câbles, enrouleurs CS, moniteurs, connecteurs et accessoires. Pièces RIDGID authentiques.",
    'brand-ridgid-b':   "✅ Pièces d'origine",
    'brand-geneye-p':   "Réparation de toute la ligne Gen-Eye de General Pipe Cleaners : Gen-Eye Micro, Gen-Eye Plus, Gen-Eye POD, câbles, têtes de caméra et moniteurs.",
    'brand-geneye-b':   "✅ Toutes gammes",
    'brand-gpc-p':      "Réparation de l'ensemble des équipements General Pipe Cleaners : caméras d'inspection, enrouleurs, systèmes d'enregistrement et accessoires.",
    'brand-gpc-b':      "✅ Gamme complète",
    'brand-milwaukee-p':"Réparation des caméras d'inspection Milwaukee M18 : têtes de caméra, câbles flexibles, enrouleurs et moniteurs. Compatible avec l'écosystème M18.",
    'brand-milwaukee-b':"✅ Système M18",
    'brand-rathtech-p': "Réparation des équipements Rathtech : caméras d'inspection, localisateurs de radiodétection, câbles et systèmes d'enregistrement. Service complet.",
    'brand-rathtech-b': "✅ Localisateurs inclus",
    'brands-other-h2':  "Autres marques réparées",
    'brands-other-sub': "Nous réparons également les équipements de ces fabricants spécialisés.",
    'brand-pearpoint-p':"Réparation des systèmes Pearpoint P350, P400 et gammes professionnelles. Expertise en caméras push et robotisées pour inspection de canalisations.",
    'brand-pearpoint-b1':"Caméras push &amp; robos",
    'brand-pearpoint-b2':"Câbles &amp; têtes de caméra",
    'brand-aries-p':    "Centre de réparation certifié pour les systèmes ARIES. Nous sommes l'un des rares centres au Québec autorisés pour ces robots d'inspection avancés.",
    'brand-aries-b':    "✅ Certification ARIES",
    'brand-enviro-p':   "Réparation certifiée des systèmes Envirosight ROVVER X, ROVVER 45 et QUICKVIEW. Spécialistes en électronique embarquée et systèmes Pan-Tilt-Zoom.",
    'brand-enviro-b1':  "✅ Cert. ROVVER X",
    'brand-enviro-b2':  "✅ Cert. ENVIROSIGHT",
    'brand-enviro-b3':  "Systèmes PTZ",
    'brands-not-listed':"Vous ne voyez pas votre marque ? Contactez-nous — nous réparons la plupart des équipements d'inspection de drain, même les marques rares ou discontinuées.",
    'brands-not-btn':   "Nous contacter pour votre équipement →",
    'brands-cta-h2':    "Votre marque est réparable — demandez une estimation",
    'brands-cta-p':     "Délais rapides, pièces d'origine. Partout au Québec.",
    'brands-cta-btn':   "demandez une évaluation →",
    // Procedure page
    'proc-page-h1':  "Comment envoyer votre équipement pour réparation",
    'proc-page-sub': "Un processus simple et transparent, de votre premier appel au retour de votre équipement réparé.",
    'proc-steps-h2': "Les 6 étapes de réparation",
    'proc-steps-sub':"Suivez ce processus pour une expérience fluide et sans surprise.",
    'proc-s1-h3': "📞 Appelez-nous ou envoyez un courriel",
    'proc-s1-p':  "Contactez-nous au <a href=\"tel:4505817009\" style=\"color:var(--primary)\">450-581-7009</a> ou à <a href=\"mailto:info@accessspec.com\" style=\"color:var(--primary)\">info@accessspec.com</a> pour nous décrire le problème. Ayez en main :",
    'proc-s1-l1': "La marque et le modèle de l'équipement",
    'proc-s1-l2': "Une description précise du problème observé",
    'proc-s1-l3': "Des photos si possible (aidez-nous à évaluer)",
    'proc-s1-l4': "Le niveau d'urgence souhaité (standard ou urgence)",
    'proc-s2-h3': "✅ Validation de la réparabilité",
    'proc-s2-p':  "Nous confirmons rapidement que nous pouvons réparer votre équipement et vous donnons une estimation préliminaire des délais et coûts. Si l'équipement semble irréparable, nous vous le signalons dès cette étape pour vous éviter des frais inutiles de transport.",
    'proc-s3-h3': "📦 Emballage et envoi",
    'proc-s3-p':  "apportez votre appareil directement ou livrez-le à notre atelier. Incluez dans le colis :",
    'proc-s3-l1': "Vos coordonnées complètes (nom, téléphone, courriel)",
    'proc-s3-l2': "Une description écrite du problème",
    'proc-s3-l3': "Tous les accessoires nécessaires au diagnostic (câbles, adaptateurs)",
    'proc-s3-btn':"📦 Voir les conseils d'emballage ↓",
    'proc-s4-h3': "🔍 Diagnostic complet",
    'proc-s4-p1': "À la réception de votre appareil, nos techniciens effectuent un diagnostic approfondi. Vous recevez un rapport détaillé par courriel ou téléphone comprenant :",
    'proc-s4-l1': "La liste complète des problèmes identifiés",
    'proc-s4-l2': "Les pièces de remplacement nécessaires",
    'proc-s4-l3': "Le coût total de la réparation (main-d'œuvre + pièces)",
    'proc-s4-l4': "Les délais de réparation estimés",
    'proc-s4-p2': "Votre approbation est requise avant de procéder à toute réparation.",
    'proc-s5-h3': "🔧 Réparation avec garantie",
    'proc-s5-p':  "Après votre approbation, nos techniciens certifiés effectuent la réparation avec des pièces neuves. Chaque réparation comprend :",
    'proc-s5-l1': "Remplacement des pièces défectueuses par des pièces neuves",
    'proc-s5-l2': "Tests complets de fonctionnement en conditions réelles",
    'proc-s5-l3': "Nettoyage et vérification générale de l'équipement",
    'proc-s5-l4': "Rapport de réparation écrit",
    'proc-s5-l5': "Garantie sur les travaux effectués",
    'proc-s6-h3': "🚚 Retour de votre équipement",
    'proc-s6-p':  "Une fois la réparation terminée et les tests validés, vous pouvez récupérer votre appareil ou nous le livrons par le transporteur de votre choix (à vos frais).",
    'proc-tip-h3':"💡 Conseil : préparez l'étiquette de retour dès l'envoi",
    'proc-tip-p': "Lors de votre dépôt chez <a href=\"https://www.purolator.com/fr/expedition/planifier-et-g%C3%A9rer-une-cueillette\" target=\"_blank\" rel=\"noopener\" class=\"link-external\" style=\"color:#92400E;\">Purolator</a>, ou autre livreur demandez au comptoir de préparer <strong>une étiquette de retour prépayée à notre adresse</strong> en même temps que votre envoi. Conservez-la précieusement : dès que la réparation est terminée, nous n'avons qu'à apposer l'étiquette pour expédier immédiatement votre appareil évitant un délai d'attente.",
    'proc-pack-h3':"📦 Conseils d'emballage pour éviter les dommages en transit",
    'proc-pack-l1':"📦 Utilisez une boîte de carton rigide, suffisamment grande pour ajouter du rembourrage de tous côtés.",
    'proc-pack-l2':"📦 Enveloppez chaque composant individuellement dans du papier bulle (au moins 5 cm de protection).",
    'proc-pack-l3':"📦 Évitez d'enrouler les câbles trop serrés — utilisez des courbes larges pour ne pas fracturer les fils internes.",
    'proc-pack-l4':"📦 Sécurisez la tête de caméra dans une pochette rigide ou un étui de protection séparé.",
    'proc-pack-l5':"📦 Remplissez les espaces vides avec du papier froissé ou des flocons de polystyrène.",
    'proc-pack-l6':"📦 Scellez la boîte avec du ruban adhésif résistant (minimum 3 couches sur toutes les coutures).",
    'proc-pack-l7':"📦 Apposez clairement nos coordonnées et l'étiquette de livraison sur toutes les faces principales.",
    'proc-pack-l8':"📦 Conservez votre numéro de suivi de livraison jusqu'à confirmation de réception de notre part.",
    'proc-loc-h3':"📹 Location de caméras disponible",
    'proc-loc-p': "Pendant la durée de réparation de votre équipement, nous proposons la location de caméras d'inspection de remplacement pour que votre activité ne soit pas interrompue. Demandez-nous les disponibilités et tarifs lors de votre appel initial.",
    'proc-loc-btn':"Demander une location →",
    'proc-cta-h2':"Prêt à envoyer votre équipement ?",
    'proc-cta-p': "Contactez-nous d'abord pour valider la réparabilité — c'est gratuit et sans engagement.",
    'proc-cta-form':"Formulaire de contact →",
    // FAQ page
    'faq-page-h1':  "Questions fréquentes",
    'faq-page-sub': "Toutes les réponses à vos questions sur la réparation de caméras d'inspection de drain, robotisées et localisateurs au Québec.",
    'faq-lbl-delais':    "⏱ Délais &amp; rapidité",
    'faq-lbl-envoi':     "📦 Envoi &amp; logistique",
    'faq-lbl-couts':     "💰 Coûts &amp; estimé",
    'faq-lbl-garantie':  "🛡 Garantie",
    'faq-lbl-marques':   "🏷 Marques &amp; appareils",
    'faq-lbl-territoire':"📍 Territoire &amp; déplacements",
    'faq-lbl-location':  "📹 Location d'appareils",
    'faq-q1': "Quels sont les délais de réparation habituels ?",
    'faq-a1': "<p>Nos délais standards sont de <strong>10 à 15 jours ouvrables</strong> à compter de la réception de votre appareil et de votre approbation d'un estimé. Ce délai inclut le diagnostic, la réparation et les tests de validation.</p><p>Service d'urgence disponible. Des frais supplémentaires s'appliquent pour le service d'urgence. Contactez-nous pour valider la disponibilité.</p>",
    'faq-q2': "Combien de temps dure le diagnostic ?",
    'faq-a2': "<p>Le diagnostic initial est généralement complété dans les <strong>2 à 3 jours ouvrables</strong> suivant la réception de l'appareil. Vous recevrez alors un rapport complet avec les problèmes identifiés, les pièces nécessaires et le coût total estimé.</p><p>Aucune réparation n'est effectuée sans votre approbation préalable.</p>",
    'faq-q3': "Comment dois-je envoyer mon appareil ?",
    'faq-a3': "<p>Nous recommandons d'utiliser <strong>Purolator</strong> pour les envois depuis partout au Québec, car ce transporteur offre une excellente couverture provinciale. Tout autre transporteur fiable (UPS, FedEx, Postes Canada) est également accepté.</p><p>Important : <strong>appelez-nous avant d'envoyer</strong> pour confirmer que nous pouvons réparer votre appareil et obtenir notre adresse complète. Consultez notre <a href=\"procedure.html\" style=\"display:inline-flex;align-items:center;gap:6px;color:var(--white);background:var(--primary);padding:6px 14px;border-radius:var(--radius-full);font-weight:600;font-size:.875rem;text-decoration:none;transition:background .15s ease;\">📦 page Procédure ↓</a> pour les instructions d'emballage détaillées.</p>",
    'faq-q4': "Qui paie les frais de transport aller et retour ?",
    'faq-a4': "<p>Les <strong>frais de transport aller et retour sont à la charge du client et vous en êtes responsable</strong>. Vous serez avertis aussitôt que votre appareil est prêt. Soit que vous venez le cherchez ou nous le retournons par le livreur de votre choix à vos frais.</p>",
    'faq-q5': "Quelle est la différence entre l'évaluation de réparabilité et l'estimation officielle du coût ?",
    'faq-a5': "<p>Nous offrons deux types de demandes distincts :</p><p><strong>Évaluation de réparabilité — Gratuite.</strong> C'est la première étape. Sur la base de vos photos et de votre description, nous vous donnons une opinion sommaire : l'appareil semble-t-il réparable ? Est-il raisonnable d'envisager la réparation ? Cette évaluation est offerte sans frais et sans engagement. Et est fortement conseillé avant d'envoyer votre appareil.</p><p><strong>Estimation officielle du coût — Payante.</strong> Si vous avez besoin d'un estimé formel et documenté — pour vos assurances, un dossier d'indemnisation, ou une décision d'achat — nous produisons un rapport officiel après diagnostic complet de l'appareil en atelier. Des frais s'appliquent pour ce service. Contactez-nous pour connaître les tarifs en vigueur.</p>",
    'faq-q6': "Combien coûte une réparation par rapport à l'achat d'un appareil neuf ?",
    'faq-a6': "<p>Chaque situation est unique — c'est pourquoi nous effectuons un diagnostic complet avant de vous donner un prix précis.</p>",
    'faq-q7': "Quelle est la durée de la garantie sur les réparations ?",
    'faq-a7': "<p>Toutes nos réparations sont couvertes par une <strong>garantie sur la main-d'œuvre et les pièces remplacées</strong>. La durée varie selon le type de réparation effectuée — nous vous précisons la garantie applicable dans votre rapport de réparation.</p><p>Notez que la garantie couvre les défauts liés à notre travail. Elle ne couvre pas les dommages causés par une utilisation inappropriée ou de nouveaux accidents.</p>",
    'faq-q8': "Quelles marques d'appareils pouvez-vous réparer ?",
    'faq-a8': "<p>Nous réparons les appareils des principales marques : <strong>Hathorn, RIDGID SeeSnake, Gen-Eye, Milwaukee, General Pipe Cleaners, Rathtech, Pearpoint, ARIES Industries et Envirosight</strong>. Consultez notre <a href=\"marques.html\">page <strong>Marques</strong></a> pour les détails.</p><p>Nous réparons également d'autres marques non listées. Contactez-nous avec la marque et le modèle de votre appareil pour confirmer.</p>",
    'faq-q9': "Que se passe-t-il si mon appareil est irréparable ?",
    'faq-a9': "<p>Si après diagnostic nous concluons que l'appareil est irréparable (pièces introuvables, dommages structurels trop importants), nous vous en informons immédiatement et en toute transparence. Vous aurez les frais d'évaluation et de retour de l'appareil si vous souhaitez le récupérer.</p><p>Dans ce cas, nous pouvons vous orienter vers des sources d'appareils reconditionnés ou neufs.</p>",
    'faq-q10': "Réparez-vous aussi les câbles de poussoir séparément ?",
    'faq-a10': "<p>Oui, nous réparons les câbles coaxiaux et les câbles de poussoir séparément de la caméra. Que ce soit pour un remplacement de connecteur, une section endommagée ou un câble entier à refaire, nous pouvons intervenir. Nous fabriquons également des câbles sur mesure selon vos spécifications.</p>",
    'faq-q11': "Avez-vous des pièces de rechange en stock ?",
    'faq-a11': "<p>Nous maintenons un stock de pièces détachées pour les marques et modèles les plus courants (Hathorn, RIDGID, Radiodétection, ARIES, HWM, CUES, Envirosight, MetroTech, etc...), ce qui nous permet de réduire considérablement les délais de réparation. Pour les modèles plus rares ou discontinués, nous pouvons commander les pièces auprès de nos fournisseurs spécialisés, ce qui peut allonger légèrement les délais.</p>",
    'faq-q12': "Servez-vous toute la province de Québec ?",
    'faq-a12': "<p>Oui, nous servons <strong>toute la province de Québec</strong> grâce aux services de transport comme Purolator. Nos clients viennent de Montréal, Laval, Longueuil, Québec, Sherbrooke, Gatineau, Trois-Rivières, Saguenay, Drummondville, Saint-Jérôme, Repentigny, Terrebonne, Brossard, et partout ailleurs dans la province.</p>",
    'faq-q13': "Puis-je apporter mon appareil directement en personne ?",
    'faq-a13': "<p>Oui, les visites en personne sont possibles, juste à vous présenter dans les heures d'ouvertures. Veuillez nous appeler au <a href=\"tel:4505817009\" style=\"color:var(--primary)\">450-581-7009</a> ou nous écrire à <a href=\"mailto:info@accessspec.com\" style=\"color:var(--primary)\">info@accessspec.com</a> avant de vous déplacer pour confirmer un créneau.</p>",
    'faq-q14': "Proposez-vous la location de caméras d'inspection pendant la réparation ?",
    'faq-a14': "<p>Oui ! Pour que votre activité ne soit pas interrompue pendant la réparation de votre appareil, nous proposons <strong>la location de caméras d'inspection de remplacement</strong>. Disponibilité limitée — contactez-nous lors de votre premier appel pour réserver un appareil de remplacement si nécessaire.</p>",
    'faq-not-found': "Vous n'avez pas trouvé la réponse à votre question ?",
    'faq-contact-btn': "Nous contacter directement →",
    'faq-cta-h2': "Obtenez votre évaluation gratuite",
    'faq-cta-p':  "Un technicien répond à vos questions et évalue votre appareil sans engagement.",
    'faq-cta-form': "Formulaire de contact →",
    // Contact page
    'ct-page-h1':  "Contactez-nous",
    'ct-page-sub': "Choisissez votre type de demande, décrivez votre appareil — nous vous réponderons rapidement.",
    'ct-form-h2':  "Demande de service",
    'ct-form-sub': "Remplissez le formulaire ci-dessous et joignez vos photos — le message sera envoyé directement à notre équipe.",
    'ct-form-note':"📸 <strong>Ajoutez des photos de l'appareil</strong> (optionnel). Les photos aident grandement notre diagnostic initial.",
    'ct-lbl-photos':"Photos de l'appareil (optionnel)",
    'ct-photos-hint':"JPG, PNG — max 5 fichiers, 5 Mo chacun",
    'ct-type-label':"Type de demande",
    'ct-type-rep-title':"Évaluation de réparabilité",
    'ct-type-rep-badge':"Gratuit",
    'ct-type-rep-desc':"Je veux savoir si mon appareil peut être réparé avant de m'engager.",
    'ct-type-est-title':"Estimation officielle du coût",
    'ct-type-est-badge':"Payant",
    'ct-type-est-desc':"J'ai besoin d'un estimé formel et documenté (assurances, dossier, etc.).",
    'ct-type-est-note':"Nous contacter pour les tarifs.",
    'ct-lbl-prenom':"Prénom",
    'ct-lbl-nom':  "Nom",
    'ct-lbl-co':   "Nom de l'entreprise",
    'ct-lbl-tel':  "Téléphone",
    'ct-lbl-email':"Courriel",
    'ct-lbl-type': "Type d'appareil",
    'ct-lbl-brand':"Marque",
    'ct-lbl-desc': "Description du problème",
    'ct-btn-send': "📧 Envoyer la demande",
    'ct-send-note':"Le message sera envoyé directement à info@accessspec.com sans ouvrir votre application courriel.",
    'ct-info-h3':  "📞 Nous joindre",
    'ct-info-tel': "Téléphone",
    'ct-info-email':"Courriel",
    'ct-info-addr':"Adresse",
    'ct-info-hours-label':"Heures d'ouverture",
    'ct-info-hours':"Lundi – Vendredi, 8h00 – 17h00",
    'ct-urgent-h3':"⚡ Service d'urgence",
    'ct-urgent-p': "Pour les situations urgentes nécessitant une réparation rapide, appelez-nous directement.",
    'ct-zone-h3':  "📍 Zone de service",
    'ct-zone-p':   "Nous servons toute la province de Québec par envoi postal (Purolator recommandé) :",
    'ct-zone-more':"+ toute la province",
    'ct-map-h2':   "Notre localisation",
    'ct-map-load': "Afficher la carte",
    'ct-map-ext':  "Ouvrir dans Google Maps →",
    'ct-map-note': "Visites sur rendez-vous uniquement. Expédition partout au Québec via Purolator.",
    // Sitemap page
    'sm-h1':       "Plan du site",
    'sm-sub':      "Toutes les pages du site Access Spec Telecommunications.",
    'sm-main-h2':  "Pages principales",
    'sm-res-h2':   "Ressources",
    'sm-home':     "Accueil",
    'sm-home-desc':"— Présentation d'Access Spec et de nos services de réparation",
    'sm-svc':      "Services",
    'sm-svc-desc': "— Caméras d'inspection, robotisées, corrélateurs, câbles et localisateurs",
    'sm-brands':   "Marques",
    'sm-brands-desc':"— Toutes les marques réparées (RIDGID, Hathorn, Gen-Eye, CUES, Rausch…)",
    'sm-proc':     "Procédure d'envoi",
    'sm-proc-desc':"— Comment nous expédier votre équipement pour réparation",
    'sm-faq':      "FAQ",
    'sm-faq-desc': "— Questions fréquentes sur nos services et délais",
    'sm-contact':  "Contact / Estimé",
    'sm-contact-desc':"— Formulaire de demande d'estimé et coordonnées",
    'sm-xml':      "Plan du site XML",
    'sm-xml-desc': "— Fichier sitemap pour les moteurs de recherche",
    // Contact form placeholders
    'ct-ph-prenom': "Jean-François",
    'ct-ph-nom':    "Tremblay",
    'ct-ph-co':     "Plomberie Tremblay inc.",
    'ct-ph-tel':    "450-555-0000",
    'ct-ph-email':  "vous@exemple.com",
    'ct-ph-desc':   "Décrivez le problème observé : symptômes, depuis quand, circonstances de la panne, numéro de modèle si connu...",
    // Contact form select defaults
    'ct-opt-default-type':  "— Choisir un type —",
    'ct-opt-default-brand': "— Choisir une marque —",
    // Device type options
    'ct-opt-t1':  "Caméra d'inspection de drain",
    'ct-opt-t2':  "Caméra robotisée",
    'ct-opt-t3':  "Localisateur de cable",
    'ct-opt-t4':  "Câble / Poussoir",
    'ct-opt-t5':  "Moniteur / Écran",
    'ct-opt-t6':  "Enrouleur / Dévidoir",
    'ct-opt-t7':  "Localisateur de métal",
    'ct-opt-t8':  "Corrélateur de fuite d'eau",
    'ct-opt-t9':  "Instrument d'écoute au sol",
    'ct-opt-t10': "Clampe d'induction",
    'ct-opt-t11': "Multimètre",
    'ct-opt-t12': "Autre appareil",
    // Brand options (mostly proper names, only label needs translation)
    'ct-opt-brand-other': "Autre marque",
  },
  en: {
    // Navigation
    'nav-accueil':  'Home',
    'nav-services': 'Services',
    'nav-marques':  'Brands',
    'nav-proc':     'Procedure',
    'nav-faq':      'FAQ',
    'nav-contact-simple': 'Contact',
    'nav-contact':  'Get an Estimate',
    // Hero
    'hero-badge':   'Service throughout Québec',
    'hero-h1':      'Drain & Robotic Inspection<br>Camera Repair<br><span class="hero-h1-accent">Service throughout Québec</span>',
    'hero-btn-tel': '📞 Call now: 450-581-7009',
    'hero-btn-cta': 'Request an evaluation →',
    // Section titles
    'prob-title':   'Is your equipment having issues?',
    'prob-sub':     'We diagnose and repair all types of drain inspection, robotic camera, and locating equipment.',
    'svc-title':    'Our repair services',
    'proc-title':   'How it works',
    'adv-title':    'Why choose Access Spec?',
    'brands-title': 'We repair all major brands',
    'testi-title':  'What our clients say',
    'cert-title':   'Certifications &amp; accreditations',
    'gallery-title':'Our workshop',
    'cta-title':    'Ready to have your equipment repaired?',
    'cta-sub':      'Contact us today for a fast estimate. Service throughout Québec.',
    'cta-btn-tel':  '📞 450-581-7009',
    'cta-btn-form': 'Send a request →',
    // Problem cards
    'prob-1': 'Camera no longer working',
    'prob-2': 'Broken or damaged cable',
    'prob-3': 'Unstable or no image',
    'prob-4': 'Faulty locator',
    'prob-5': 'Inspection robot failure',
    // Services cards
    'svc-sub':        'Complete expertise to restore your equipment to perfect working condition.',
    'svc-diag-title': 'Diagnostic',
    'svc-diag-desc':  'Complete evaluation of your equipment by our certified technicians. Detailed report with recommendations.',
    'svc-diag-b1':    '✓ Written report included',
    'svc-diag-b2':    '✓ Detailed estimate',
    'svc-diag-b3':    '⚡ Results in 48-72h',
    'svc-rep-title':  'Repair',
    'svc-rep-desc':   'Expert repair of all components: cables, camera heads, electronics, reels, monitors.',
    'svc-rep-b1':     '✓ Original parts',
    'svc-rep-b2':     '✓ Warranty included',
    'svc-rep-b3':     '📅 Standard: 10-15 days',
    'svc-rep-b4':     '⚡ Emergency: Call us',
    'svc-maint-title':'Preventive maintenance',
    'svc-maint-desc': 'Regular maintenance program to extend the life of your equipment and avoid costly breakdowns.',
    'svc-maint-b1':   '✓ Complete cleaning',
    'svc-maint-b2':   '✓ Systems check',
    'svc-maint-b3':   '✓ Cable lubrication',
    'svc-maint-b4':   '✓ Performance testing',
    'svc-btn':        'View all our services →',
    // Timeline
    'proc-sub': 'A simple and transparent process.',
    'tl-1-h': 'Call',         'tl-1-p': 'Contact us by phone or email to describe the issue.',
    'tl-2-h': 'Validation',   'tl-2-p': 'We confirm that we can repair your equipment.',
    'tl-3-h': 'Shipping',     'tl-3-p': 'Drop off the device yourself or ship it to us.',
    'tl-4-h': 'Diagnostic',   'tl-4-p': 'Our technicians evaluate the equipment and send you an estimate.',
    'tl-5-h': 'Repair',       'tl-5-p': 'Repair carried out with new parts, warranty included.',
    'tl-6-h': 'Return',       'tl-6-p': 'Equipment is tested and ready to use. Delivery available.',
    'proc-btn': 'View detailed procedure →',
    // Advantages
    'adv-1-label': 'of expertise',
    'adv-1-desc':  'Specialists in drain inspection camera, robotic camera, and related equipment repair for over 30 years in Québec.',
    'adv-2-label': 'cheaper than replacing',
    'adv-2-desc':  'Save up to 3 to 5 times the cost of new equipment through repair.',
    'adv-3-label': 'fast service',
    'adv-3-desc':  'Standard service 10-15 days. Emergency service available.',
    'adv-4-label': 'cities served',
    'adv-4-desc':  'Throughout Québec — Montréal, Laval, Trois-Rivières, Québec City, Sherbrooke, Gatineau, Saguenay and more.',
    // Brands
    'brands-sub':  'Manufacturer-certified technicians, original parts guaranteed.',
    'brands-also': 'We also repair: <strong>Pearpoint · ARIES Industries · Envirosight · JD Brule</strong> and other brands. <a href="marques.html" aria-label="View all repaired brands">View all brands →</a>',
    // Testimonials
    'testi-sub':    'Hundreds of companies and professionals trust us throughout Québec.',
    'testi-1-text': 'Fast and professional service. Our RIDGID camera was repaired in 48h, like new. I recommend without hesitation to all plumbers.',
    'testi-1-role': 'Plumber, Montréal',
    'testi-2-text': 'We have been sending all our municipal equipment to Access Spec for 10 years. Their expertise is unmatched and deadlines are always met.',
    'testi-2-role': 'Municipal Engineer, Québec City',
    'testi-3-text': 'Excellent diagnostic, honest price. My Gen-Eye camera was deemed unrepairable by the manufacturer — Access Spec fixed it! I recommend without hesitation.',
    'testi-3-role': 'Contractor, Sherbrooke',
    // Certifications
    'cert-sub': 'Recognized and accredited by the largest inspection equipment manufacturers.',
    'cert-1': 'Accredited Hathorn repairer',
    'cert-2': 'Envirosight certification (ROVVER X)',
    'cert-3': 'ARIES Industries certification',
    'cert-4': 'JD Brule authorized repair center',
    'cert-5': 'FORBEST accredited repair center',
    // Gallery
    'gallery-sub': 'A professional environment equipped to repair the most complex equipment.',
    // Footer
    'ft-tagline':       'Experts in drain inspection camera, robotic camera, and locator repair throughout Québec for over 30 years.',
    'ft-nav-title':     'Navigation',
    'ft-nav-home':      'Home',
    'ft-nav-services':  'Services',
    'ft-nav-brands':    'Brands',
    'ft-nav-proc':      'Shipping Procedure',
    'ft-nav-contact':   'Contact',
    'ft-svc-title':     'Services',
    'ft-svc-1':         'Inspection Cameras',
    'ft-svc-2':         'Robotic Cameras',
    'ft-svc-3':         'Radio-detection Locators',
    'ft-svc-4':         'Monitors & Screens',
    'ft-svc-5':         'Reels & Carriers',
    'ft-svc-6':         'Electronics & Related Accessories',
    'ft-contact-title': 'Contact',
    'ft-contact-form':  'Contact Form',
    'ft-sitemap':       'Site Map',
    'ft-copy':          '© 2025 Access Spec Telecommunications Inc. All rights reserved.',
    'ft-bottom':        'Inspection Camera Repair — Service throughout Québec',
    'ft-nav-faq':       'FAQ',
    'ft-location':      'Equipment Rental',
    'ft-brands-col-title': 'Repaired Brands',
    'ft-faq-col-title': 'Quick Answers',
    'ft-contact-direct-title': 'Direct Contact',
    'ft-faq-delais':    'Repair Timelines',
    'ft-faq-couts':     'Cost vs New Device',
    'ft-faq-marques':   'Supported Brands',
    'ft-faq-garantie':  'Warranty',
    'ft-faq-location':  'Equipment Rental',
    // Services page
    'svc-page-h1':  'Our Repair Services',
    'svc-page-sub': 'Diagnostic, repair and maintenance of all types of drain inspection equipment, robotic cameras, correlators and locators<br><span class="hero-h1-accent">Service throughout Québec</span>',
    'sd1-h3': 'Drain Inspection Cameras',
    'sd1-sub': 'Complete repair of all brands and models of drain cameras',
    'sd1-body': 'Our certified technicians repair drain inspection cameras of all brands: camera heads, electronic modules, connectors and printed circuit boards.',
    'sd1-f1': 'Camera head replacement',
    'sd1-f2': 'Internal electronic circuit repair',
    'sd1-f3': 'Waterproof connector and socket replacement',
    'sd1-f4': 'Optics calibration and adjustment',
    'sd1-f5': 'Termination and sealing gasket replacement',
    'sd1-f6': 'Complete cleaning and decontamination',
    'sd2-h3': 'Robotic Cameras',
    'sd2-sub': 'Specialized expertise in advanced inspection robot repair',
    'sd2-body': 'Robotic cameras (ARIES, CUES, ENVIROSIGHT, etc.) require highly specialized expertise. Access Spec is one of the few centers in Québec certified for the repair of these complex equipment. We work on all mechanical, electronic and optical systems.',
    'sd2-f1': 'Propulsion and rotation motor repair',
    'sd2-f2': 'Pan-Tilt-Zoom (PTZ) system repair',
    'sd2-f3': 'High-definition camera module replacement',
    'sd2-f4': 'LED lighting system repair',
    'sd2-f5': 'Sealing gasket replacement',
    'sd2-f6': 'Umbilical cable and connector repair',
    'sd2-f7': 'Complete post-repair functional testing',
    'sd3-h3': 'Radio-detection Locators',
    'sd3-sub': 'Repair and recalibration of all locator models',
    'sd3-body': 'Radio-detection locators are precision instruments that require rigorous calibration after any repair. Our technicians are trained to repair and recalibrate all common models used in underground pipe inspection.',
    'sd3-f1': 'Receiver and transmitter repair',
    'sd3-f2': 'Probe and antenna replacement',
    'sd3-f3': 'Complete precision recalibration',
    'sd3-f4': 'Screen and user interface repair',
    'sd3-f5': 'Battery and charger replacement',
    'sd3-f6': 'Housing replacement',
    'sd3-f7': 'Emitter verification (probes/transmitters)',
    'sd3-f8': 'Depth and locating tests',
    'sd4-h3': 'Monitors &amp; Screens',
    'sd4-sub': 'Repair of all portable and fixed monitor models',
    'sd4-body': 'We repair portable monitors and control units for all inspection systems. Whether it is a faulty LCD screen or a power supply issue, our technicians have the solution.',
    'sd4-f1': 'LCD/OLED screen replacement',
    'sd4-f2': 'Power supply and battery repair',
    'sd4-f3': 'DVR recording card replacement',
    'sd4-f4': 'USB, HDMI and AV port repair',
    'sd4-f5': 'Button and interface replacement',
    'sd5-h3': 'Reels &amp; Carriers',
    'sd5-sub': 'Overhaul and repair of cable winding systems',
    'sd5-body': 'The reel is a critical mechanical component for the longevity of your cables. We overhaul and repair manual and motorized winding systems, and replace slip rings that transmit the electrical signal while allowing rotation.',
    'sd5-f1': 'Slip ring replacement',
    'sd5-f2': 'Bearing and cable guide replacement',
    'sd5-f3': 'Length counter repair',
    'sd5-f4': 'Brake and tension system overhaul',
    'sd5-f5': 'Complete lubrication and cleaning',
    'sd5-f6': 'Rigid frame replacement',
    'sd6-h3': 'Electronics &amp; Related Accessories',
    'sd6-sub': 'Repair of all electronic components of inspection systems',
    'sd6-body': 'Beyond the main equipment, we repair the entire electronic ecosystem related to pipe inspection: signal generation units, probe transmitters, docking stations, chargers and various accessories.',
    'sd6-f1': 'Signal generator repair',
    'sd6-f2': 'Self-leveling probe transmitter repair',
    'sd6-f3': 'Charging station repair',
    'sd6-f4': 'Precision SMD component soldering',
    'sd6-f5': 'Integrated circuit diagnostics and repair',
    'sd6-f6': '12V/24V DC power supply repair',
    'svc-clt-h2':   'Who uses our services?',
    'svc-clt-sub':  'We serve all professionals who use pipe inspection equipment in Québec.',
    'svc-clt-1-h4': 'Plumbers &amp; contractors',
    'svc-clt-1-p':  'Fast repair to minimize downtime of your work equipment.',
    'svc-clt-2-h4': 'Municipalities',
    'svc-clt-2-p':  'Repair service for municipal sewer network inspection equipment.',
    'svc-clt-3-h4': 'Inspection companies',
    'svc-clt-3-p':  'Maintenance and repair of a complete fleet of video inspection equipment.',
    'svc-clt-4-h4': 'General contractors',
    'svc-clt-4-p':  'Repair of locating and inspection equipment for job sites.',
    'svc-cta-h2':   'Need to have your equipment repaired?',
    'svc-cta-p':    'Contact us for an estimate. We will respond promptly.',
    'svc-cta-form': 'Contact Form →',
    // Brands page
    'brands-page-h1':   'Inspection Camera Brands We Repair in Québec',
    'brands-page-sub':  'Manufacturer-certified technicians — repair with original parts for all major market brands.',
    'brands-cert-h2':   'Certified Brands',
    'brands-cert-sub':  'We are accredited and certified by these manufacturers to perform repairs with official warranty.',
    'brand-hathorn-p':  'Official accredited repairer. We repair the entire Hathorn range: camera heads, coaxial cables, reels, connectors and recording systems.',
    'brand-hathorn-b':  '✅ Accredited repairer',
    'brand-ridgid-p':   'Complete repair of SeeSnake systems: cameras, cables, CS reels, monitors, connectors and accessories. Genuine RIDGID parts.',
    'brand-ridgid-b':   '✅ Original parts',
    'brand-geneye-p':   'Repair of the entire Gen-Eye line by General Pipe Cleaners: Gen-Eye Micro, Gen-Eye Plus, Gen-Eye POD, cables, camera heads and monitors.',
    'brand-geneye-b':   '✅ All product lines',
    'brand-gpc-p':      'Repair of all General Pipe Cleaners equipment: inspection cameras, reels, recording systems and accessories.',
    'brand-gpc-b':      '✅ Complete range',
    'brand-milwaukee-p':'Repair of Milwaukee M18 inspection cameras: camera heads, flexible cables, reels and monitors. Compatible with the M18 ecosystem.',
    'brand-milwaukee-b':'✅ M18 System',
    'brand-rathtech-p': 'Repair of Rathtech equipment: inspection cameras, radio-detection locators, cables and recording systems. Full service.',
    'brand-rathtech-b': '✅ Locators included',
    'brands-other-h2':  'Other Repaired Brands',
    'brands-other-sub': 'We also repair equipment from these specialized manufacturers.',
    'brand-pearpoint-p':'Repair of Pearpoint P350, P400 and professional range systems. Expertise in push and robotic cameras for pipe inspection.',
    'brand-pearpoint-b1':'Push cameras &amp; robots',
    'brand-pearpoint-b2':'Cables &amp; camera heads',
    'brand-aries-p':    'Certified repair center for ARIES systems. We are one of the few centers in Québec authorized for these advanced inspection robots.',
    'brand-aries-b':    '✅ ARIES Certification',
    'brand-enviro-p':   'Certified repair of Envirosight ROVVER X, ROVVER 45 and QUICKVIEW systems. Specialists in embedded electronics and Pan-Tilt-Zoom systems.',
    'brand-enviro-b1':  '✅ Cert. ROVVER X',
    'brand-enviro-b2':  '✅ Cert. ENVIROSIGHT',
    'brand-enviro-b3':  'PTZ Systems',
    'brands-not-listed':"Don't see your brand? Contact us — we repair most drain inspection equipment, even rare or discontinued brands.",
    'brands-not-btn':   'Contact us for your equipment →',
    'brands-cta-h2':    'Your brand is repairable — request an estimate',
    'brands-cta-p':     'Fast turnaround, original parts. Throughout Québec.',
    'brands-cta-btn':   'request an evaluation →',
    // Procedure page
    'proc-page-h1':  'How to Send Your Equipment for Repair',
    'proc-page-sub': 'A simple and transparent process, from your first call to the return of your repaired equipment.',
    'proc-steps-h2': 'The 6 Repair Steps',
    'proc-steps-sub':'Follow this process for a smooth, hassle-free experience.',
    'proc-s1-h3': '📞 Call us or send an email',
    'proc-s1-p':  'Contact us at <a href="tel:4505817009" style="color:var(--primary)">450-581-7009</a> or at <a href="mailto:info@accessspec.com" style="color:var(--primary)">info@accessspec.com</a> to describe the problem. Have on hand:',
    'proc-s1-l1': 'The brand and model of the equipment',
    'proc-s1-l2': 'A precise description of the problem observed',
    'proc-s1-l3': 'Photos if possible (help us evaluate)',
    'proc-s1-l4': 'The desired urgency level (standard or emergency)',
    'proc-s2-h3': '✅ Repairability validation',
    'proc-s2-p':  'We quickly confirm that we can repair your equipment and give you a preliminary estimate of timelines and costs. If the equipment seems unrepairable, we notify you at this stage to avoid unnecessary shipping costs.',
    'proc-s3-h3': '📦 Packaging and shipping',
    'proc-s3-p':  'Bring your device directly or ship it to our workshop. Include in the package:',
    'proc-s3-l1': 'Your complete contact information (name, phone, email)',
    'proc-s3-l2': 'A written description of the problem',
    'proc-s3-l3': 'All accessories needed for diagnosis (cables, adapters)',
    'proc-s3-btn':'📦 See packaging tips ↓',
    'proc-s4-h3': '🔍 Complete diagnostic',
    'proc-s4-p1': 'Upon receipt of your device, our technicians perform a thorough diagnostic. You receive a detailed report by email or phone including:',
    'proc-s4-l1': 'The complete list of identified problems',
    'proc-s4-l2': 'The necessary replacement parts',
    'proc-s4-l3': 'The total repair cost (labour + parts)',
    'proc-s4-l4': 'Estimated repair timelines',
    'proc-s4-p2': 'Your approval is required before proceeding with any repair.',
    'proc-s5-h3': '🔧 Repair with warranty',
    'proc-s5-p':  'After your approval, our certified technicians perform the repair with new parts. Each repair includes:',
    'proc-s5-l1': 'Replacement of defective parts with new parts',
    'proc-s5-l2': 'Complete functional testing under real conditions',
    'proc-s5-l3': 'Cleaning and general inspection of the equipment',
    'proc-s5-l4': 'Written repair report',
    'proc-s5-l5': 'Warranty on work performed',
    'proc-s6-h3': '🚚 Return of your equipment',
    'proc-s6-p':  'Once the repair is complete and tests are validated, you can pick up your device or we ship it via the carrier of your choice (at your expense).',
    'proc-tip-h3':'💡 Tip: prepare the return label when shipping',
    'proc-tip-p': 'When dropping off at <a href="https://www.purolator.com/fr/expedition/planifier-et-g%C3%A9rer-une-cueillette" target="_blank" rel="noopener" class="link-external" style="color:#92400E;">Purolator</a> or another carrier, ask the counter to prepare <strong>a prepaid return label to our address</strong> at the same time as your shipment. Keep it safe: as soon as the repair is complete, we simply apply the label to ship your device immediately, avoiding any waiting delay.',
    'proc-pack-h3':'📦 Packaging tips to avoid transit damage',
    'proc-pack-l1':'📦 Use a rigid cardboard box, large enough to add padding on all sides.',
    'proc-pack-l2':'📦 Wrap each component individually in bubble wrap (at least 5 cm of protection).',
    'proc-pack-l3':'📦 Avoid coiling cables too tightly — use wide curves to avoid fracturing internal wires.',
    'proc-pack-l4':'📦 Secure the camera head in a rigid pouch or separate protective case.',
    'proc-pack-l5':'📦 Fill empty spaces with crumpled paper or polystyrene beads.',
    'proc-pack-l6':'📦 Seal the box with strong adhesive tape (minimum 3 layers on all seams).',
    'proc-pack-l7':'📦 Clearly affix our contact information and shipping label on all main faces.',
    'proc-pack-l8':'📦 Keep your delivery tracking number until we confirm receipt.',
    'proc-loc-h3':'📹 Camera rental available',
    'proc-loc-p': 'During the repair period, we offer rental of replacement inspection cameras so your operations are not interrupted. Ask us about availability and rates during your initial call.',
    'proc-loc-btn':'Request a rental →',
    'proc-cta-h2':'Ready to ship your equipment?',
    'proc-cta-p': 'Contact us first to validate repairability — it is free and no commitment required.',
    'proc-cta-form':'Contact Form →',
    // FAQ page
    'faq-page-h1':  'Frequently Asked Questions',
    'faq-page-sub': 'All answers to your questions about drain inspection camera, robotic camera, and locator repair in Québec.',
    'faq-lbl-delais':    '⏱ Timelines &amp; speed',
    'faq-lbl-envoi':     '📦 Shipping &amp; logistics',
    'faq-lbl-couts':     '💰 Costs &amp; estimate',
    'faq-lbl-garantie':  '🛡 Warranty',
    'faq-lbl-marques':   '🏷 Brands &amp; devices',
    'faq-lbl-territoire':'📍 Territory &amp; travel',
    'faq-lbl-location':  '📹 Equipment rental',
    'faq-q1': 'What are the usual repair timelines?',
    'faq-a1': '<p>Our standard timelines are <strong>10 to 15 business days</strong> from receipt of your device and your approval of an estimate. This timeline includes diagnosis, repair and validation tests.</p><p>Emergency service available. Additional fees apply for emergency service. Contact us to confirm availability.</p>',
    'faq-q2': 'How long does the diagnostic take?',
    'faq-a2': '<p>The initial diagnostic is generally completed within <strong>2 to 3 business days</strong> of receiving the device. You will then receive a complete report with the identified problems, the necessary parts and the total estimated cost.</p><p>No repair is carried out without your prior approval.</p>',
    'faq-q3': 'How should I send my device?',
    'faq-a3': '<p>We recommend using <strong>Purolator</strong> for shipments from anywhere in Québec, as this carrier offers excellent provincial coverage. Any other reliable carrier (UPS, FedEx, Canada Post) is also accepted.</p><p>Important: <strong>call us before sending</strong> to confirm that we can repair your device and obtain our complete address. See our <a href="procedure.html" style="display:inline-flex;align-items:center;gap:6px;color:var(--white);background:var(--primary);padding:6px 14px;border-radius:var(--radius-full);font-weight:600;font-size:.875rem;text-decoration:none;transition:background .15s ease;">📦 Procedure page ↓</a> for detailed packaging instructions.</p>',
    'faq-q4': 'Who pays for return and outbound shipping?',
    'faq-a4': '<p><strong>Shipping costs both ways are the responsibility of the client</strong>. You will be notified as soon as your device is ready. You may pick it up yourself or we will return it via the carrier of your choice at your expense.</p>',
    'faq-q5': 'What is the difference between a repairability assessment and an official cost estimate?',
    'faq-a5': '<p>We offer two distinct types of requests:</p><p><strong>Repairability assessment — Free.</strong> This is the first step. Based on your photos and description, we give you a summary opinion: does the device seem repairable? Is it reasonable to consider repair? This assessment is offered free of charge and with no commitment. It is strongly recommended before sending your device.</p><p><strong>Official cost estimate — Paid.</strong> If you need a formal, documented estimate — for insurance, a compensation file, or a purchase decision — we produce an official report after a complete in-shop diagnostic. Fees apply for this service. Contact us for current rates.</p>',
    'faq-q6': 'How much does a repair cost compared to buying a new device?',
    'faq-a6': '<p>Every situation is unique — that is why we perform a complete diagnostic before giving you a precise price.</p>',
    'faq-q7': 'What is the warranty duration on repairs?',
    'faq-a7': '<p>All our repairs are covered by a <strong>warranty on labour and replaced parts</strong>. The duration varies depending on the type of repair performed — we specify the applicable warranty in your repair report.</p><p>Note that the warranty covers defects related to our work. It does not cover damage caused by improper use or new accidents.</p>',
    'faq-q8': 'Which device brands can you repair?',
    'faq-a8': '<p>We repair devices from the main brands: <strong>Hathorn, RIDGID SeeSnake, Gen-Eye, Milwaukee, General Pipe Cleaners, Rathtech, Pearpoint, ARIES Industries and Envirosight</strong>. See our <a href="marques.html">page <strong>Brands</strong></a> for details.</p><p>We also repair other unlisted brands. Contact us with the brand and model of your device to confirm.</p>',
    'faq-q9': 'What happens if my device is unrepairable?',
    'faq-a9': '<p>If after diagnostic we conclude that the device is unrepairable (parts unavailable, structural damage too extensive), we inform you immediately and transparently. You will have assessment fees and return shipping costs if you wish to retrieve it.</p><p>In this case, we can direct you to sources of refurbished or new devices.</p>',
    'faq-q10': 'Do you also repair push cables separately?',
    'faq-a10': '<p>Yes, we repair coaxial cables and push cables separately from the camera. Whether for a connector replacement, a damaged section, or an entire cable to be redone, we can help. We also manufacture custom cables to your specifications.</p>',
    'faq-q11': 'Do you keep spare parts in stock?',
    'faq-a11': '<p>We maintain a stock of spare parts for the most common brands and models (Hathorn, RIDGID, Radiodétection, ARIES, HWM, CUES, Envirosight, MetroTech, etc.), which allows us to significantly reduce repair times. For rarer or discontinued models, we can order parts from our specialized suppliers, which may slightly extend timelines.</p>',
    'faq-q12': 'Do you serve the entire province of Québec?',
    'faq-a12': '<p>Yes, we serve <strong>the entire province of Québec</strong> through transport services like Purolator. Our clients come from Montréal, Laval, Longueuil, Québec City, Sherbrooke, Gatineau, Trois-Rivières, Saguenay, Drummondville, Saint-Jérôme, Repentigny, Terrebonne, Brossard, and everywhere else in the province.</p>',
    'faq-q13': 'Can I bring my device in person?',
    'faq-a13': '<p>Yes, in-person visits are possible during business hours. Please call us at <a href="tel:4505817009" style="color:var(--primary)">450-581-7009</a> or write to us at <a href="mailto:info@accessspec.com" style="color:var(--primary)">info@accessspec.com</a> before coming to confirm a time slot.</p>',
    'faq-q14': 'Do you offer inspection camera rental during repairs?',
    'faq-a14': '<p>Yes! To keep your operations running during the repair of your device, we offer <strong>rental of replacement inspection cameras</strong>. Limited availability — contact us during your first call to reserve a replacement device if needed.</p>',
    'faq-not-found': "Didn't find the answer to your question?",
    'faq-contact-btn': 'Contact us directly →',
    'faq-cta-h2': 'Get your free assessment',
    'faq-cta-p':  'A technician answers your questions and evaluates your device with no commitment.',
    'faq-cta-form': 'Contact Form →',
    // Contact page
    'ct-page-h1':  'Contact us',
    'ct-page-sub': 'Choose your request type, describe your device — we will respond promptly.',
    'ct-form-h2':  'Service request',
    'ct-form-sub': 'Fill out the form below and attach your photos — the message will be sent directly to our team.',
    'ct-form-note':'📸 <strong>Add photos of your device</strong> (optional). Photos greatly help our initial diagnostic.',
    'ct-lbl-photos':'Device photos (optional)',
    'ct-photos-hint':'JPG, PNG — max 5 files, 5 MB each',
    'ct-type-label':'Request type',
    'ct-type-rep-title':'Repairability assessment',
    'ct-type-rep-badge':'Free',
    'ct-type-rep-desc':'I want to know if my device can be repaired before committing.',
    'ct-type-est-title':'Official cost estimate',
    'ct-type-est-badge':'Paid',
    'ct-type-est-desc':'I need a formal, documented estimate (insurance, file, etc.).',
    'ct-type-est-note':'Contact us for rates.',
    'ct-lbl-prenom':'First name',
    'ct-lbl-nom':  'Last name',
    'ct-lbl-co':   'Company name',
    'ct-lbl-tel':  'Phone',
    'ct-lbl-email':'Email',
    'ct-lbl-type': 'Device type',
    'ct-lbl-brand':'Brand',
    'ct-lbl-desc': 'Problem description',
    'ct-btn-send': '📧 Send request',
    'ct-send-note':'The message will be sent directly to info@accessspec.com without opening your email application.',
    'ct-info-h3':  '📞 Reach us',
    'ct-info-tel': 'Phone',
    'ct-info-email':'Email',
    'ct-info-addr':'Address',
    'ct-info-hours-label':'Business hours',
    'ct-info-hours':'Monday – Friday, 8:00 AM – 5:00 PM',
    'ct-urgent-h3':'⚡ Emergency service',
    'ct-urgent-p': 'For urgent situations requiring fast repair, call us directly.',
    'ct-zone-h3':  '📍 Service area',
    'ct-zone-p':   'We serve the entire province of Québec by mail (Purolator recommended):',
    'ct-zone-more':'+ entire province',
    'ct-map-h2':   'Our location',
    'ct-map-load': 'Show map',
    'ct-map-ext':  'Open in Google Maps →',
    'ct-map-note': 'Visits by appointment only. Shipping throughout Québec via Purolator.',
    // Sitemap page
    'sm-h1':       'Site Map',
    'sm-sub':      'All pages of the Access Spec Telecommunications website.',
    'sm-main-h2':  'Main pages',
    'sm-res-h2':   'Resources',
    'sm-home':     'Home',
    'sm-home-desc':'— Introduction to Access Spec and our repair services',
    'sm-svc':      'Services',
    'sm-svc-desc': '— Inspection cameras, robotic, correlators, cables and locators',
    'sm-brands':   'Brands',
    'sm-brands-desc':'— All repaired brands (RIDGID, Hathorn, Gen-Eye, CUES, Rausch…)',
    'sm-proc':     'Shipping Procedure',
    'sm-proc-desc':'— How to ship your equipment to us for repair',
    'sm-faq':      'FAQ',
    'sm-faq-desc': '— Frequently asked questions about our services and timelines',
    'sm-contact':  'Contact / Estimate',
    'sm-contact-desc':'— Estimate request form and contact information',
    'sm-xml':      'XML Site Map',
    'sm-xml-desc': '— Sitemap file for search engines',
    // Contact form placeholders
    'ct-ph-prenom': "John",
    'ct-ph-nom':    "Smith",
    'ct-ph-co':     "Smith Plumbing Inc.",
    'ct-ph-tel':    "450-555-0000",
    'ct-ph-email':  "you@example.com",
    'ct-ph-desc':   "Describe the problem observed: symptoms, how long, circumstances of the failure, model number if known...",
    // Contact form select defaults
    'ct-opt-default-type':  "— Choose a type —",
    'ct-opt-default-brand': "— Choose a brand —",
    // Device type options
    'ct-opt-t1':  "Drain inspection camera",
    'ct-opt-t2':  "Robotic camera",
    'ct-opt-t3':  "Cable locator",
    'ct-opt-t4':  "Cable / Push rod",
    'ct-opt-t5':  "Monitor / Screen",
    'ct-opt-t6':  "Reel / Carrier",
    'ct-opt-t7':  "Metal locator",
    'ct-opt-t8':  "Water leak correlator",
    'ct-opt-t9':  "Ground listening instrument",
    'ct-opt-t10': "Induction clamp",
    'ct-opt-t11': "Multimeter",
    'ct-opt-t12': "Other device",
    // Brand options
    'ct-opt-brand-other': "Other brand",
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
  // placeholder translations
  $$('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (I18N[lang]?.[key] !== undefined) el.placeholder = I18N[lang][key];
  });
  // counter suffix translation (e.g. " ans" → " years")
  $$('[data-suffix-fr]').forEach(el => {
    const suffix = lang === 'en' ? el.dataset.suffixEn : el.dataset.suffixFr;
    el.dataset.suffix = suffix;
    el.textContent = (el.dataset.prefix || '') + el.dataset.target + suffix;
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
