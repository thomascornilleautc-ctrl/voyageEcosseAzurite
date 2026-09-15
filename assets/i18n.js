/* i18n — charge assets/i18n.json et applique la langue choisie.
   Toute page qui veut être traduisible pose des attributs data-i18n(-*)
   sur ses éléments ; ce script se charge du reste et branche les
   boutons .lang-btn (FR / EN) du header. */
(function () {
  var STORAGE_KEY = 'azurite-lang';
  var DEFAULT_LANG = 'fr';
  var SUPPORTED = ['fr', 'en'];

  function getStoredLang() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function setStoredLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* stockage indisponible, tant pis */ }
  }

  function getByPath(obj, path) {
    return path.split('.').reduce(function (acc, key) {
      return (acc && Object.prototype.hasOwnProperty.call(acc, key)) ? acc[key] : undefined;
    }, obj);
  }

  function applyTranslations(dict, lang) {
    document.documentElement.setAttribute('lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var value = getByPath(dict, el.getAttribute('data-i18n'));
      if (value === undefined) return;
      if (el.tagName === 'TITLE') {
        el.textContent = value;
      } else {
        el.innerHTML = value;
      }
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var value = getByPath(dict, el.getAttribute('data-i18n-alt'));
      if (value !== undefined) el.setAttribute('alt', value);
    });

    document.querySelectorAll('[data-i18n-content]').forEach(function (el) {
      var value = getByPath(dict, el.getAttribute('data-i18n-content'));
      if (value !== undefined) el.setAttribute('content', value);
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var value = getByPath(dict, el.getAttribute('data-i18n-aria'));
      if (value !== undefined) el.setAttribute('aria-label', value);
    });

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === lang));
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var lang = getStoredLang();
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT_LANG;

    fetch('assets/i18n.json')
      .then(function (res) {
        if (!res.ok) throw new Error('assets/i18n.json : HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        window.AZURITE_I18N = data;

        function setLang(next) {
          if (SUPPORTED.indexOf(next) === -1 || !data[next] || next === lang) return;
          lang = next;
          setStoredLang(lang);
          applyTranslations(data[lang], lang);
        }

        applyTranslations(data[lang], lang);

        document.querySelectorAll('.lang-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            setLang(btn.getAttribute('data-lang'));
          });
        });
      })
      .catch(function (err) {
        // Pas de traduction dispo (ouverture en file://, JSON introuvable...) :
        // le contenu français déjà présent dans le HTML reste affiché tel quel.
        console.warn('i18n: ' + err.message);
      });
  });
})();
