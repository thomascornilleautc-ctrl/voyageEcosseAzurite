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

// Visionneuse photo : tout lien dans un [data-gallery] s'ouvre en grand,
// avec flèches (clavier ←/→) pour passer d'une photo à l'autre.
document.addEventListener('DOMContentLoaded', function () {
  var box = document.querySelector('dialog.lightbox');
  if (!box || typeof box.showModal !== 'function') return;
  var img = box.querySelector('img');
  var current = [], index = 0;

  function show(i) {
    index = (i + current.length) % current.length;
    var link = current[index];
    var thumb = link.querySelector('img');
    img.src = link.getAttribute('href');
    img.alt = thumb ? thumb.alt : '';
  }

  document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
    var links = Array.prototype.slice.call(gallery.querySelectorAll('a'));
    links.forEach(function (link, i) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        current = links;
        show(i);
        box.showModal();
      });
    });
  });

  box.querySelector('.lightbox-close').addEventListener('click', function () { box.close(); });
  box.querySelector('.prev').addEventListener('click', function () { show(index - 1); });
  box.querySelector('.next').addEventListener('click', function () { show(index + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
  box.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
});
