/**
 * Layers: a mockup taken apart into the five layers you used to build by hand:
 * the scene, the device's shadow, the device, the screen you replace, and the
 * glare on the glass. The pointer's x opens the stack through a spring; its y
 * picks a layer, which takes the bright edge. At rest the stack is a little
 * open and the screen is bright: it is the layer the whole job was about.
 * The slider is the gap between layers.
 *
 * From the package's Exploded: picking tests the layers where they are going
 * (the spring's target), not where they are, and each layer's dashed drops are
 * painted before its plate so the plate hides the guides behind it.
 */
const { Cam, clamp, extremes, facing, fit, prism, proj, rings, seg, spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid } = HL;

// Footprints in plan, x0 y0 x1 y1, with a corner radius and the marks each layer would really have.
const LAY = [
  // the scene: a backdrop with its horizon, where the device stands
  { name: "scene", r: [0, 0, 132, 100], rad: 7, segs: [[[1.5, 64], [130.5, 64]]] },
  // the shadow: the device's footprint, hatched
  { name: "shadow", r: [50, 14, 96, 98], rad: 11, segs: [[[56, 90], [90, 30]], [[66, 94], [94, 46]], [[54, 74], [80, 24]], [[78, 96], [95, 66]]], lo: true },
  // the device: a phone body, its speaker slot and camera
  { name: "device", r: [44, 6, 88, 92], rad: 11, segs: [[[60, 12], [72, 12]]], dots: [[78, 12]] },
  // the screen: the area to replace, empty on purpose
  { name: "screen", r: [48, 18, 84, 86], rad: 6, segs: [] },
  // the glare: two streaks across the glass
  { name: "glare", r: [48, 18, 84, 86], rad: 6, segs: [[[52, 50], [72, 22]], [[53, 64], [81, 25]]] },
];

const REST = 0.4, TK = 2.2, SCREEN = 3;

function inside(pt, pg) {
  let c = false;
  for (let i = 0, j = pg.length - 1; i < pg.length; j = i++) {
    const [xi, yi] = pg[i], [xj, yj] = pg[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let GAP = value, act = -2, lastP = null;
  const e = spring(REST, { eps: 0.002 });
  const C = Cam(45, 0.5, 1.62);
  const top = (LAY.length - 1) * 30 + TK;
  fit(C, [[0, 0, 0], [132, 100, 0], [132, 0, 0], [0, 100, 0], [44, 6, top], [88, 6, top]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const els = LAY.map((L, i) => {
    const [ring, inner] = rings(...L.r, L.rad, 1.3);
    const ext = extremes(P, ring);
    const guide = i > 0 ? mk("path", { class: "nf dash" }, g) : null;
    const el = solid(g);
    const marks = mk("path", { class: L.lo ? "nf lo" : "nf" }, el.g);
    const dots = (L.dots || []).map(() => flatDot(el.g, C, 1.4, "dot m"));
    return { ring, inner, ext, guide, el, marks, dots, drawn: NaN };
  });

  const corners = ([x0, y0, x1, y1], z) => [P(x0, y0, z), P(x1, y0, z), P(x1, y1, z), P(x0, y1, z)];
  /** The topmost layer under the pointer, where the layers are going (the target gap). */
  function pick(p) {
    if (!p) return -1;
    for (let i = LAY.length - 1; i >= 0; i--) if (inside(p, corners(LAY[i].r, i * GAP * e.t + TK))) return i;
    return -1;
  }
  /** a = -1 is rest: the screen keeps the bright edge. */
  function setAct(a) {
    if (a === act) return;
    act = a;
    const lit = a < 0 ? SCREEN : a;
    els.forEach((E, i) => E.el.sil.classList.toggle("hi", i === lit));
    read.textContent = a < 0 ? (lastP ? "gap " + (GAP * e.t).toFixed(0) : "rest") : "0" + (a + 1) + " " + LAY[a].name;
    B.wake();
  }

  const B = register(stage, (dt) => {
    const m = stepS(e, dt), z = (i) => i * GAP * e.x;
    LAY.forEach((L, i) => {
      const E = els[i], zi = z(i), zt = zi + TK;
      if (zi === E.drawn) return;
      E.drawn = zi;
      put(E.el, prism(P, front, E.ring, E.inner, zi, zt));
      E.marks.setAttribute("d", L.segs.map(([a, b]) => seg(P(a[0], a[1], zt), P(b[0], b[1], zt))).join(""));
      (L.dots || []).forEach(([dx, dy], k) => place(E.dots[k], P(dx, dy, zt)));
      if (E.guide) {
        const zp = z(i - 1) + TK;
        E.guide.setAttribute("d", E.ext.map((q) => seg(P(q.u, q.v, zi), P(q.u, q.v, zp))).join(""));
      }
    });
    return m;
  });
  bag.add(B.unregister);
  setAct(-1);

  bag.add(pointer(stage, {
    move: (p) => { lastP = p; e.t = REST + (1 - REST) * clamp((p[0] - 60) / 280, 0, 1); act = -2; setAct(pick(p)); },
    leave: () => { lastP = null; e.t = REST; act = -2; setAct(-1); },
  }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { GAP = v; for (const E of els) E.drawn = NaN; if (lastP) { act = -2; setAct(pick(lastP)); } B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "layers",
  means: "A mockup taken apart into the five layers it took to build by hand: scene, shadow, device, screen and glare.",
  rules: [1, 4, 6, 8],
  range: [14, 22, 30],
  tour: [[150, 230], [230, 160], [300, 90], null],
  mount,
});
