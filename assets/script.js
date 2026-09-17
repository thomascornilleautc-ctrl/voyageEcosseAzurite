// Menu mobile : ouverture/fermeture, sans dépendance externe.
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
});

// Header : le logo rétrécit une fois qu'on a un peu scrollé.
document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.site-header');
  if (!header) return;

  var threshold = 40;
  var ticking = false;

  function update() {
    header.classList.toggle('is-scrolled', window.scrollY > threshold);
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update(); // état correct si la page est rechargée en cours de scroll
});

// Apparition douce des blocs de contenu au scroll.
//
// La règle générique (dernière ligne du sélecteur) cible chaque enfant direct
// d'un .container, dans n'importe quelle section hors hero et hors toute
// première section de page (déjà visible au chargement, inutile de la faire
// apparaître). Elle s'applique donc automatiquement à tout nouveau contenu,
// même si la mise en page d'une section change plus tard, les groupes
// structurels ci-dessus (colonnes, listes, portraits...) gardent un rendu
// plus fin, item par item.
document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var selector = '.two-col > div, .teaser-list li, .waypoints li, .portrait, ' +
    '.refit-grid > div, .logo-wall, ' +
    'section:not(.hero):not(:first-of-type) > .container > ' +
    '*:not(.two-col):not(.teaser-list):not(.waypoints):not(.refit-grid):not(.logo-wall), ' +
    'body > figure.photo-break';
  var els = document.querySelectorAll(selector);
  if (!els.length || reduceMotion) return;

  var byParent = new Map();
  els.forEach(function (el) {
    el.classList.add('reveal');
    var siblings = byParent.get(el.parentElement) || [];
    siblings.push(el);
    byParent.set(el.parentElement, siblings);
  });
  byParent.forEach(function (siblings) {
    siblings.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i, 5) * 70) + 'ms';
    });
  });

  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

  els.forEach(function (el) { io.observe(el); });
});
