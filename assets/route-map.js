// Carte du trajet (page trajet.html) — construite à partir des data-lat/data-lng
// posés sur les <li> de la liste .waypoints, pour ne garder qu'une seule source
// de vérité pour les étapes.
document.addEventListener('DOMContentLoaded', function () {
  var mapEl = document.getElementById('route-map');
  if (!mapEl || typeof L === 'undefined') return;

  var items = document.querySelectorAll('.waypoints li[data-lat]');
  var stops = Array.prototype.map.call(items, function (li) {
    var legNum = li.querySelector('.leg-num').textContent.trim();
    return {
      el: li,
      lat: parseFloat(li.dataset.lat),
      lng: parseFloat(li.dataset.lng),
      legNum: legNum,
      label: li.textContent.replace(legNum, '').trim()
    };
  });
  if (!stops.length) return;

  var map = L.map(mapEl, { scrollWheelZoom: false });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
      '&copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 18,
    subdomains: 'abcd'
  }).addTo(map);

  var latlngs = stops.map(function (s) { return [s.lat, s.lng]; });

  L.polyline(latlngs, {
    color: '#B4813F', weight: 2.5, opacity: 0.85, dashArray: '6 10', lineCap: 'round'
  }).addTo(map);

  stops.forEach(function (s) {
    var isEnd = s.el.classList.contains('leg-end');
    var marker = L.circleMarker([s.lat, s.lng], {
      radius: isEnd ? 7 : 5,
      color: '#B4813F',
      weight: 2,
      fillColor: isEnd ? '#B4813F' : '#0B2436',
      fillOpacity: 1
    }).addTo(map);
    marker.bindPopup('<strong>' + s.legNum + '</strong><br>' + s.label);

    function focusStop() {
      map.panTo([s.lat, s.lng]);
      marker.openPopup();
    }
    s.el.addEventListener('click', focusStop);
    s.el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        focusStop();
      }
    });
    marker.on('click', function () {
      s.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  map.fitBounds(L.latLngBounds(latlngs), { padding: [24, 24] });
});
