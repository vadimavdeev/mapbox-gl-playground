import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import CameraControl from "./camera-control";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
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

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl,
});

const camera = new CameraControl();

map.addControl(geocoder, "top-left");
map.addControl(scale, "bottom-left");
map.addControl(camera, "bottom-right");

window.map = map;
