
mapboxgl.accessToken = 'pk.eyJ1IjoibW9oYW1tYWR2aGIiLCJhIjoiY2ttMzhpeXY3MjNvOTJ4bHlteGVnMWRlZCJ9.8gStJSmxLOlU7E3NCXQUxA';
mapboxgl.setRTLTextPlugin(
'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
null,
true
);

const map = new mapboxgl.Map({
  container: 'map', 
  style: 'mapbox://styles/mohammadvhb/clmam18cg018u01qyafpr6bem', 
  center: [-77.03736, 38.87727], 
  zoom: 12
});

const params = document.getElementById('params');

const urlBase = 'https://api.mapbox.com/isochrone/v1/mapbox/';
let profile = 'cycling';
let minutes = 10;

const marker = new mapboxgl.Marker({
  color: '#314ccd',
  draggable: true 
});

const lngLat = new mapboxgl.LngLat(-77.034, 38.899);

marker.setLngLat(lngLat).addTo(map);

async function getIso() {
  const query = await fetch(
    `${urlBase}${profile}/${lngLat.lng},${lngLat.lat}?contours_minutes=${minutes}&polygons=true&access_token=${mapboxgl.accessToken}&denoise=1&generalize=0`,
    { method: 'GET' }
  );
  const data = await query.json();
  map.getSource('iso').setData(data);
}

marker.on('dragend', () => {
  lngLat.lng = marker.getLngLat().lng;
  lngLat.lat = marker.getLngLat().lat;
  getIso();
});

params.addEventListener('change', (event) => {
  if (event.target.name === 'profile') {
    profile = event.target.value;
  } else if (event.target.name === 'duration') {
    minutes = event.target.value;
  }
  getIso();
});

map.on('load', () => {
  map.addSource('iso', {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  });

  map.addLayer(
    {
      id: 'isoLayer',
      type: 'fill',
      source: 'iso',
      layout: {},
      paint: {
        'fill-color': '#5a3fc0',
        'fill-opacity': 0.3
      }
    },
    'poi-label'
  );

  getIso();
});