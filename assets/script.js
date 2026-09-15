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
