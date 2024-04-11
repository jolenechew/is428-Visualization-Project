// https://observablehq.com/@emiliendupont/earthquake-3d-globe@69
function _1(md) {
  return md`
# Earthquake 3D Globe 🌍

Time lapse visualization of all large earthquakes on the Earth in 2017. Each circle represents a single earthquake of magnitude 5 or more: the larger the radius, the larger the magnitude. You can drag the globe to rotate it.
  `;
}

function _canvas(DOM, d3, earthquakes, versor, topojson, world) {
  var width = 960,
    height = 500;

  const context = DOM.context2d(width, height);

  var then = Date.now(),
    time = 0;

  var colorScale = d3
    .scaleLinear()
    .domain([5, 6.3, 8.3])
    .range(["green", "yellow", "red"]);

  var timeParser = d3.timeParse("%Y-%m-%d-%H-%M"); // Date is stored as year-month-day-hour-minute
  var start_time = +new Date(2017, 0, 1, 0, 1); // Start time on Jan 1st 2017 at 00:01
  var end_time = +new Date(2018, 0, 1, 0, 1); // End Jan 1st 2018 at 00:01
  var period = 60000; // Repeat animation every period (in ms)
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var timePerMag = 0.005;
  var sizePerMag = 2;

  // Returns a date object from time string of dataset
  function parse_time_string(time_string) {
    var year_month_day = time_string.slice(0, 10);
    var hour = time_string.slice(11, 13);
    var minute = time_string.slice(14, 16);
    return (
      (+timeParser(year_month_day + "-" + hour + "-" + minute) - start_time) /
      (end_time - start_time)
    );
  }

  // Convert earthquake time string into date object
  var earthquake_data = [];
  for (var i = 0; i < earthquakes.length; i++) {
    earthquake_data.push({
      mag: earthquakes[i]["mag"],
      latitude: earthquakes[i]["latitude"],
      longitude: earthquakes[i]["longitude"],
      date: parse_time_string(earthquakes[i]["date"]),
    });
  }

  // Set globe projection
  var projection = d3
    .geoOrthographic()
    .scale((height - 60) / 2)
    .translate([width / 2, height / 2 - 20])
    .precision(0.1);

  // Function to draw paths on the globe
  var path = d3.geoPath().projection(projection).context(context);

  // Function to draw circles on the globe
  var geoCircle = d3.geoCircle();

  function drag(projection) {
    let v0, q0, r0;

    function dragstarted() {
      v0 = versor.cartesian(projection.invert(d3.mouse(this)));
      q0 = versor((r0 = projection.rotate()));
    }

    function dragged() {
      const v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(this)));
      const q1 = versor.multiply(q0, versor.delta(v0, v1));
      projection.rotate(versor.rotation(q1));
    }

    return d3.drag().on("start", dragstarted).on("drag", dragged);
  }

  var sphere = { type: "Sphere" },
    land = topojson.feature(world, world.objects.land),
    borders = topojson.mesh(world, world.objects.countries, function (a, b) {
      return a !== b;
    });

  var render = function () {
    context.clearRect(0, 0, width, height);
    context.lineWidth = 1;
    context.globalAlpha = 1;
    context.beginPath(),
      path(sphere),
      (context.fillStyle = "#fff"),
      context.fill();
    context.beginPath(),
      path(land),
      (context.fillStyle = "#d3d3d3"),
      context.fill();
    context.beginPath(),
      path(borders),
      (context.strokeStyle = "#fff"),
      context.stroke();
    context.beginPath(),
      path(sphere),
      (context.strokeStyle = "#000"),
      context.stroke();

    // Add text and time slider
    context.font = "15px Helvetica Neue";
    context.fillStyle = "black";
    context.textAlign = "center";
    for (var i = 0; i < months.length; i++) {
      context.fillText(months[i], (width * (i + 0.5)) / 12, height - 20);
    }
    context.rect((time / period) * (width - 11), height - 11, 10, 10);
    context.stroke();

    // Add earthquakes
    context.lineWidth = 4;
    for (var i = 0; i < earthquake_data.length; i++) {
      var timeElapsed = time / period;
      var mag = earthquake_data[i].mag;
      var earthquakeStart = earthquake_data[i].date;
      var earthquakeEnd = earthquakeStart + mag * timePerMag;
      var earthquakeLength = earthquakeEnd - earthquakeStart;
      // Only draw earthquake if it is currently happening
      if (timeElapsed > earthquakeStart && timeElapsed < earthquakeEnd) {
        var lat = earthquake_data[i].latitude;
        var lon = earthquake_data[i].longitude;
        var size =
          (sizePerMag * mag * (timeElapsed - earthquakeStart)) /
          earthquakeLength;
        context.strokeStyle = colorScale(mag);
        context.globalAlpha =
          1 - (timeElapsed - earthquakeStart) / earthquakeLength;
        context.beginPath();
        path(geoCircle.center([lon, lat]).radius(size)());
        context.stroke();
      }
    }
  };

  d3.timer(function () {
    time = Date.now() - then;
    if (time > period) {
      then = Date.now();
    }
    render();
  });

  return d3
    .select(context.canvas)
    .call(drag(projection).on("drag.render", render))
    .call(render)
    .node();
}

function _world(d3) {
  return d3.json("https://unpkg.com/world-atlas@1/world/110m.json");
}

function _earthquakes(d3) {
  return d3.csv(
    "https://gist.githubusercontent.com/EmilienDupont/4890db56f23847403c8aa077152fd10d/raw/46fc1f5af314925d236741fc7a8b02130fc162da/world_2017_mag5.csv",
    function (d) {
      return {
        mag: +d.mag,
        latitude: +d.latitude,
        longitude: +d.longitude,
        date: d.time,
      };
    }
  );
}

function _versor(require) {
  return require("versor@0.0.3");
}

function _topojson(require) {
  return require("topojson-client@3");
}

function _d3(require) {
  return require("d3@5");
}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main
    .variable(observer("canvas"))
    .define(
      "canvas",
      ["DOM", "d3", "earthquakes", "versor", "topojson", "world"],
      _canvas
    );
  main.define("world", ["d3"], _world);
  main.define("earthquakes", ["d3"], _earthquakes);
  main.define("versor", ["require"], _versor);
  main.define("topojson", ["require"], _topojson);
  main.define("d3", ["require"], _d3);
  return main;
}
