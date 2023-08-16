const DEFAULTS = { pitchChangeStep: 3, bearingChangeStep: 3 };

export default class CameraControl {
  constructor(options) {
    this._options = { ...DEFAULTS, ...options };
  }

  onAdd(map) {
    this._map = map;
    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl camera-ctrl";
    this._container.innerHTML = `<div class="camera-ctrl-knob"></div>`;

    this.init();

    return this._container;
  }

  init() {
    this._knob = this._container.querySelector(".camera-ctrl-knob");
    this._knob.addEventListener("mousedown", (event) =>
      this.onDragStart(event)
    );
  }

  onDragStart(downEvent) {
    downEvent.preventDefault();

    const boundary = this._container.getBoundingClientRect();
    const knobRect = this._knob.getBoundingClientRect();

    const CENTER = boundary.width / 2;
    const MIDDLE = boundary.height / 2;
    // the origin point is the center
    const ORIGIN_X = boundary.left + CENTER;
    const ORIGIN_Y = boundary.top + MIDDLE;
    const RADIUS = Math.min(CENTER, MIDDLE);

    // distance from the cursor to the center of the knob
    const offsetX = downEvent.clientX - (knobRect.left + knobRect.width / 2);
    const offsetY = downEvent.clientY - (knobRect.top + knobRect.height / 2);

    const onDragMove = (moveEvent) => {
      // coordinates of the mouse relative to the origin point
      const mouseX = moveEvent.clientX - ORIGIN_X;
      const mouseY = moveEvent.clientY - ORIGIN_Y;

      const [x, y] = clampToCircle(mouseX - offsetX, mouseY - offsetY, RADIUS);
      this._knob.style.transform = `translate(${x}px, ${y}px)`;

      const deltaX = (x / CENTER) * this._options.bearingChangeStep;
      const deltaY = (y / MIDDLE) * this._options.pitchChangeStep;

      this._map.setBearing(this._map.getBearing() + deltaX);
      this._map.setPitch(this._map.getPitch() - deltaY);
    };

    const onDragEnd = () => {
      this._knob.style.transform = `translate(0, 0)`;
      document.removeEventListener("mousemove", onDragMove);
      document.removeEventListener("mouseup", onDragEnd);
    };

    document.addEventListener("mousemove", onDragMove);
    document.addEventListener("mouseup", onDragEnd);
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

// number number number => [number, number]
// clamps the point at `x`,`y` to a circle with the given `radius`
function clampToCircle(x, y, radius) {
  // distance from point to the center of the circle
  const distance = Math.sqrt(x ** 2 + y ** 2);

  if (distance <= radius) {
    return [x, y];
  }

  const newX = radius * (x / distance);
  const newY = radius * (y / distance);

  return [newX, newY];
}
