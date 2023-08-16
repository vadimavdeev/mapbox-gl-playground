import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./styles.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

var map = new mapboxgl.Map({
  container: "map",
  center: [-123.11206062881513, 49.27700141531375],
  zoom: 15.5,
  pitch: 45,
  bearing: -17.6,
});

const navigation = new mapboxgl.NavigationControl({
  visualizePitch: true,
});

const scale = new mapboxgl.ScaleControl({
  maxWidth: 80,
  unit: "metric",
});

map.addControl(navigation, "bottom-right");
map.addControl(scale, "bottom-right");

window.map = map;
