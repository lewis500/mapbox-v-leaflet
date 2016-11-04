var center = [-0.118, 51.511];
var accessToken = 'pk.eyJ1IjoibGV3aXM1MDAiLCJhIjoiY2l0Z2V3ZWRhMDBsbjJvbWs4cHVvNzdrdSJ9.7d92mc2FzeKfYeraoLIljg';

let data = (function() {

  function randomer(x, scale) {
    return x + (Math.random() - 0.5) * scale
  }

  let n = 10000;
  let data = Array(n);
  for (let i = 0; i < n; i++) {
    data[i] = [randomer(center[0], 0.5), randomer(center[1], 0.4)];
  }
  return data;
})();

let features = data.map(d => {
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: d
    },
    properties: {
      hello: 'hello'
    }
  };
});

let geojson = {
  type: 'FeatureCollection',
  features: features
};

function setupMapBox() {

  mapboxgl.accessToken = accessToken;


  var map = new mapboxgl.Map({
    style: 'mapbox://styles/lewis500/civ00jva200m82irrxrhqyqiv',
    center: center,
    zoom: 13,
    interactive: true,
    container: 'mapbox'
  });

  map.on("load", () => {

    map.addSource('data', {
      type: 'geojson',
      data: geojson
    });

    map.addLayer({
      id: 'points',
      source: 'data',
      type: 'circle',
      paint: {
        'circle-radius': 3,
        'circle-color': '#03A9F4'
      }
    })

  });

  // Create a popup, but don't add it to the map yet.
  var popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false
  });

  map.on('mousemove', e => {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ['points']
    });
    // Change the cursor style as a UI indicator.
    map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';

    if (!features.length) {
      popup.remove();
      return;
    }

    var feature = features[0];

    // Populate the popup and set its coordinates
    // based on the feature found.
    popup.setLngLat(feature.geometry.coordinates)
      .setHTML(feature.properties.hello)
      .addTo(map);
  });

}

setupMapBox();

function setupLeaflet() {
  var map = L.map('leaflet')
    .setView(center.reverse(), 13);

  https: //api.mapbox.com/styles/v1/lewis500/civ00jva200m82irrxrhqyqiv/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGV3aXM1MDAiLCJhIjoiY2l0Z2V3ZWRhMDBsbjJvbWs4cHVvNzdrdSJ9.7d92mc2FzeKfYeraoLIljg

    L.tileLayer('https://api.mapbox.com/styles/v1/lewis500/civ00jva200m82irrxrhqyqiv/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGV3aXM1MDAiLCJhIjoiY2l0Z2V3ZWRhMDBsbjJvbWs4cHVvNzdrdSJ9.7d92mc2FzeKfYeraoLIljg', {
      markerZoomAnimation: false
    }).addTo(map);

  var geojsonMarkerOptions = {
    radius: 3,
    fillColor: "#03A9F4",
    // color: "#fff",
    weight: 0,
    opacity: 1,
    fillOpacity: 0.8
  };


  L.geoJSON(geojson, {
    pointToLayer: (feature, latlng) => {
      var marker = L.circleMarker(latlng, geojsonMarkerOptions);
      marker.bindPopup(feature.properties.hello);
      marker.on('mouseover', function(e) {
        this.openPopup();
      });
      marker.on('mouseout', function(e) {
        this.closePopup();
      });
      return marker;
    }
  }).addTo(map);

}

setupLeaflet();
