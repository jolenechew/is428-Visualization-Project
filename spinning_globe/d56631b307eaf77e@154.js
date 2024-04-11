// https://observablehq.com/@tansi/earthquake@154
import define1 from "./450051d7f1174df8@255.js";

function _1(md) {
  return md`

  `;
}

function _globe(
  DOM,
  s,
  d3,
  radius,
  i,
  seaColor,
  landColor,
  world,
  quakeColor,
  quakeRadius,
  quakes
) {
  var c = DOM.context2d(s, s);
  var canvas = c.canvas;

  var projection = d3
    .geoOrthographic()
    .scale(radius)
    .translate([s / 2, s / 2]);
  projection.rotate([i, 0]);
  var path = d3.geoPath(projection, c);

  // Draw the seas.
  c.lineWidth = 1.5;
  c.fillStyle = seaColor;
  c.beginPath(),
    c.arc(s / 2, s / 2, radius, 0, 2 * Math.PI),
    c.fill(),
    c.stroke();

  // Draw the land.
  c.lineWidth = 0.35;
  c.fillStyle = landColor;
  c.beginPath(), path(world), c.fill(), c.stroke();

  // Draw the earthquakes.
  let color = d3.color(quakeColor);
  color.opacity = 0.5;
  c.fillStyle = color;
  path.pointRadius(quakeRadius);
  quakes.features.forEach((quake) => {
    c.beginPath(), path(quake), c.fill();
  });

  return canvas;
}

function _3(html) {
  return html``;
}

function _i(Scrubber, numbers) {
  return Scrubber(numbers);
}

function _5(html) {
  return html`<p>Control Quake size</p>`;
}

function _quakeSize(DOM) {
  return DOM.range(0, 12);
}

function _7(html) {
  return html`<p>Zoom inside</p>`;
}

function _radius(DOM) {
  return DOM.range(80, 480);
}

function _quakeColor(DOM) {
  var input = DOM.input("color");
  input.value = "#FED400";
  return input;
}

function _seaColor(DOM) {
  var input = DOM.input("color");
  input.value = "#EEEEEE";
  return input;
}

function _landColor(DOM) {
  var input = DOM.input("color");
  input.value = "#101010";
  return input;
}

function _s() {
  return 700;
}

function _quakeRadius(d3, quakeSize) {
  const scale = d3
    .scaleSqrt()
    .domain([0, 100])
    .range([0, quakeSize * 2]);
  return function (quake) {
    return scale(Math.exp(quake.properties.mag));
  };
}

function _url() {
  return "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
}

async function _quakes(url) {
  return (await fetch(url)).json();
}

async function _world(topojson) {
  var world = await (
    await fetch("https://unpkg.com/world-atlas@1/world/110m.json")
  ).json();
  return topojson.feature(world, world.objects.countries);
}

function _topojson(require) {
  return require("topojson");
}

function _d3(require) {
  return require("d3");
}

function _numbers() {
  return Array.from({ length: 360 }, (_, i) => i);
}

function _21(html) {
  return html`<p>Rotate the Globe</p>`;
}

function _rotation(DOM) {
  var rotation = DOM.range(0, 360, 1);
  rotation.value = 90;
  return rotation;
}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], _1);
  main
    .variable(observer("globe"))
    .define(
      "globe",
      [
        "DOM",
        "s",
        "d3",
        "radius",
        "i",
        "seaColor",
        "landColor",
        "world",
        "quakeColor",
        "quakeRadius",
        "quakes",
      ],
      _globe
    );
  main;
  // .variable(observer())
  // .define(["html"], _3);
  main
    .variable(observer("viewof i"))
    .define("viewof i", ["Scrubber", "numbers"], _i);
  main.define("i", ["Generators", "viewof i"], (G, _) => G.input(_));
  // main.variable(observer()).define(["html"], _5);
  main
    // .variable(observer("viewof quakeSize"))
    .define("viewof quakeSize", ["DOM"], _quakeSize);
  main
    // .variable(observer("quakeSize"))
    .define("quakeSize", ["Generators", "viewof quakeSize"], (G, _) =>
      G.input(_)
    );
  // main.variable(observer()).define(["html"], _7);
  main
    // .variable(observer("viewof radius"))
    .define("viewof radius", ["DOM"], _radius);
  main
    // .variable(observer("radius"))
    .define("radius", ["Generators", "viewof radius"], (G, _) => G.input(_));
  main
    // .variable(observer("viewof quakeColor"))
    .define("viewof quakeColor", ["DOM"], _quakeColor);
  main
    // .variable(observer("quakeColor"))
    .define("quakeColor", ["Generators", "viewof quakeColor"], (G, _) =>
      G.input(_)
    );
  main
    // .variable(observer("viewof seaColor"))
    .define("viewof seaColor", ["DOM"], _seaColor);
  main
    // .variable(observer("seaColor"))
    .define("seaColor", ["Generators", "viewof seaColor"], (G, _) =>
      G.input(_)
    );
  main
    // .variable(observer("viewof landColor"))
    .define("viewof landColor", ["DOM"], _landColor);
  main
    // .variable(observer("landColor"))
    .define("landColor", ["Generators", "viewof landColor"], (G, _) =>
      G.input(_)
    );
  main.define("s", _s);
  main.define("quakeRadius", ["d3", "quakeSize"], _quakeRadius);
  main.define("url", _url);
  main.define("quakes", ["url"], _quakes);
  main.define("world", ["topojson"], _world);
  main.define("topojson", ["require"], _topojson);
  main.define("d3", ["require"], _d3);
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  main.define("numbers", _numbers);
  main.define(["html"], _21);
  main.define("viewof rotation", ["DOM"], _rotation);
  main.define("rotation", ["Generators", "viewof rotation"], (G, _) =>
    G.input(_)
  );
  return main;
}
