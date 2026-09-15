/* Carte interactive du trajet — Leaflet.
   La liste d'étapes et les marqueurs sont générés à partir du même
   tableau ROUTE (voir route-data.js) : une seule source de vérité. */
document.addEventListener('DOMContentLoaded', function () {
  var mapEl = document.getElementById('route-map');
  var listEl = document.getElementById('route-list');
  if (!mapEl || !listEl || typeof L === 'undefined' || typeof ROUTE === 'undefined') return;

  var map = L.map(mapEl, { scrollWheelZoom: false });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  var latLngs = ROUTE.map(function (p) { return [p.lat, p.lng]; });

  L.polyline(latLngs, {
    color: '#B4813F',
    weight: 2,
    opacity: 0.85,
    dashArray: '6 8'
  }).addTo(map);

  map.fitBounds(latLngs, { padding: [24, 24] });

  function markerIcon(point) {
    var size = point.highlight ? 16 : 11;
    return L.divIcon({
      className: 'route-marker' + (point.highlight ? ' route-marker--end' : ''),
      html: '<span></span>',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
  }

  var markersById = {};

  ROUTE.forEach(function (point) {
    var marker = L.marker([point.lat, point.lng], { icon: markerIcon(point) }).addTo(map);
    var popupHtml = '<strong>' + point.name + '</strong>' + (point.note ? '<br>' + point.note : '');
    marker.bindPopup(popupHtml);
    markersById[point.id] = marker;
  });

  function focusPoint(point) {
    map.flyTo([point.lat, point.lng], Math.max(map.getZoom(), 6), { duration: 0.6 });
    markersById[point.id].openPopup();
  }

  var ol = document.createElement('ol');
  ol.className = 'waypoints';

  ROUTE.forEach(function (point) {
    var li = document.createElement('li');
    if (point.highlight) li.classList.add('leg-end');

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'waypoint-btn';
    button.innerHTML = '<span class="leg-num">Étape ' + point.id + (point.highlight ? ' — point le plus au nord' : '') + '</span><br>' + point.name;
    button.addEventListener('click', function () { focusPoint(point); });

    li.appendChild(button);
    ol.appendChild(li);
  });

  listEl.appendChild(ol);
});
