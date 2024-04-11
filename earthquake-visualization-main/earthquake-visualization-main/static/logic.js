//SETTING UP GLOBAL VARIABLES

//VARIABLE USED FOR D3 JSON REQUEST FUNCTION
// const url =
//   "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// D3 REQUEST TO GET DATA
d3.json("./static/first_month_2024.json").then(function (data) {
  console.log(data.features);
  createFeatures(data.features);
});

// SET THE PAREMETERS THAT WILL DETERMINE THE COLOR OF EACH CIRCLE MARKER
function getColor(depth) {
  return depth >= 8.0
    ? "rgb(150, 20, 20)"
    : depth >= 7.0 && depth < 7.9
    ? "rgb(207, 51, 4)"
    : depth >= 6.1 && depth < 6.9
    ? "rgb(227, 107, 9)"
    : depth >= 5.5 && depth < 6.0
    ? "rgb(242, 144, 15)"
    : depth >= 2.5 && depth < 5.4
    ? "rgb(242, 211, 5)"
    : "rgb(126, 176, 11)";
}

// FUNCTION TO RENDER MAP TILES STYLES AND CONTROLS TO TOGGLE BETWEEN EACH VIEW--//
function createMap(earthquakes) {
  // STREET VIEW MAP    .
  let street = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  // OVERLAY VIEW LIST FOR THE CONTROL FUCNTION
  let baseMaps = {
    "Street View": street,
    // "Topographic View": topo
  };

  // CREATE THE LEAFLET MAP PASSING THE DATA TO BE DISPLAYED WHEN FIRST LOADED.
  var myMap = L.map("map", {
    center: [40, -107],
    zoom: 4,
    layers: [street, earthquakes],
  });

  // OVERLAY OBJECTS TO STORE AND DISPLAY DATA ON THE MAP
  let overlayMaps = {
    Earthquakes: earthquakes,
  };

  // CONTROL THAT TOGGLES THE MAP VIEWS AND EARTHQUAKE OBJECTS
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(myMap);

  //LEGEND ON THE BOTTOM RIGHT EXPLAINING DEPTH COLOR CODES
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend"),
      depth = [0, 2.5, 5.5, 6.1, 7.0, 8.0];
    div.innerHTML += "<h2 style='text-align: center'>Magnitude</h2>";
    for (var i = 0; i < depth.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        getColor(depth[i] + 1) +
        '"></i> ' +
        depth[i] +
        (depth[i + 1] ? "&ndash;" + depth[i + 1] + "<br>" : "+");
    }
    return div;
  };
  legend.addTo(myMap);
}

// FUNCTION THAT WILL POPULATE EARTHQUAKE DATA ONTO THE MAP
function createFeatures(earthquakeData) {
  // FUNCTION THAT ADDS POPUP TO DISPLAY DATA FOR EACH EARTHQUAKE
  function onEachFeature(feature, layer) {
    layer.bindPopup(
      `<h2>Magnitude ${feature.properties.mag} Earthquake</h2>
            <h3>Depth: ${feature.geometry.coordinates[2]}</h3>
            <hr>
            <h3>${feature.properties.place}</h3>
            <hr>
            <p>${new Date(feature.properties.time)}</p>`
    );
  }

  //CREATE CIRCLE MARKERS THAT WILL HAVE A RADIUS BASED ON THE MAG (circles magnified by 3 for better visuals) AND COLOR BASED ON THE DEPTH
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: function (feature, latlng) {
      return new L.CircleMarker(latlng, {
        radius: feature.properties.mag * 3,
        color: getColor(feature.properties.mag),
      });
    },
    onEachFeature: onEachFeature,
  });

  // CALLING THE FUNCTION TO DISPLAY THE MAPS
  createMap(earthquakes);
}
