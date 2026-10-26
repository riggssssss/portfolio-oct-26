/**
 * Day: a round plate, the day, broken into three wedges that lie apart on the
 * table. Each holds one piece of it: a list of three ticks, a note of a few
 * lines, a routine's week of dots. The wedge under the pointer slides back to
 * the centre and lifts, the other two follow, staggered by distance, but a
 * crack always stays: the plate never closes. The slider is that crack.
 *
 * Picking reads the pointer's angle on the plate's plane around the resting
 * centre, so a wedge sliding under the pointer cannot change the choice.
 */
const {
  Cam, clamp, facing, fillet, fit, poly, proj, prism, rad, seg, solid, put, unproj,
  tdone, tset, tval, tween, disposer, mk, place, pointer, register,
} = HL;

const R = 58, H = 7, B = 1.4, LIFT = 6, LIT = 1;
const SPAN = 120, START = [-150, -30, 90];          // each wedge's first edge, in degrees
const REST = [{ off: 22, turn: -4 }, { off: 30, turn: 5 }, { off: 18, turn: -2 }];
const NAMES = ["list", "note", "routine"];

/** A wedge's outline, filleted, as ring samples with outward normals, in its own plan (tip at the origin). */
function wedge(a0, r, inset) {
  const pts = [[inset * 1.8 * Math.cos(rad(a0 + SPAN / 2)), inset * 1.8 * Math.sin(rad(a0 + SPAN / 2))]];
  for (let k = 0; k <= 16; k++) { const a = rad(a0 + 2 + ((SPAN - 4) * k) / 16); pts.push([(r - inset) * Math.cos(a), (r - inset) * Math.sin(a)]); }
  // Only the three corners are rounded; fillet repeats the arc's points, so drop the repeats.
  const f = fillet(pts, pts.map((_, i) => (i === 0 ? 4 : i === 1 || i === pts.length - 1 ? 5 : 0)), 4)
    .filter((p, i, all) => i === 0 || Math.hypot(p[0] - all[i - 1][0], p[1] - all[i - 1][1]) > 1e-3);
  const n = f.length, area = f.reduce((s, p, i) => s + p[0] * f[(i + 1) % n][1] - f[(i + 1) % n][0] * p[1], 0), sg = area > 0 ? 1 : -1;
  return f.map((p, i) => {
    const a = f[(i + n - 1) % n], b = f[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    return { u: p[0], v: p[1], nu: (sg * dy) / l, nv: (-sg * dx) / l };
  });
}

/** What wedge i holds on its top, in polar marks (radius, degrees from its middle). */
function marks(i) {
  const segs = [], boxes = [], dots = [];
  if (i === 0) for (let k = 0; k < 3; k++) { boxes.push([24 + k * 10, -20]); segs.push([24 + k * 10, -12, 22 - k * 6]); }
  if (i === 1) [[22, 14], [30, 26], [38, 30], [46, 18]].forEach(([r, w]) => segs.push([r, -w, w]));
  if (i === 2) for (let k = 0; k < 7; k++) dots.push([40, -36 + k * 12, k < 4]);
  return { segs, boxes, dots };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let crack = value;

  const C = Cam(45, 0.5, 1.84);
  const far = R + 34;
  fit(C, [[-far, -far, 0], [far, far, -6], [far, -far, 0], [-far, far, 0], [0, 0, H + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);

  // Back to front: the wedge whose middle points away from the viewer first.
  const order = [0, 1, 2].sort((a, b) => {
    const m = (i) => rad(START[i] + SPAN / 2);
    return Math.cos(m(a)) + Math.sin(m(a)) - (Math.cos(m(b)) + Math.sin(m(b)));
  });
  const g = mk("g", {}, svg);
  const parts = [];
  for (const i of order) {
    const grp = mk("g", {}, g), body = solid(grp);
    const ink = mk("path", { class: "nf lo" }, grp), box = mk("path", { class: "nf" }, grp), c = marks(i);
    const dots = c.dots.map(([, , on]) => mk("circle", { r: 1.25, class: on ? "dot m" : "dot off" }, grp));
    parts[i] = { i, body, ink, box, c, dots, ring: wedge(START[i], R, 0), inner: wedge(START[i], R, B), off: tween(REST[i].off), turn: tween(REST[i].turn), z: tween(0), drawn: "" };
  }

  function draw(p, off, turn, z) {
    const key = [off, turn, z].map((n) => n.toFixed(2)).join();
    if (key === p.drawn) return;
    p.drawn = key;
    const mid = rad(START[p.i] + SPAN / 2), ox = off * Math.cos(mid), oy = off * Math.sin(mid);
    const c = Math.cos(rad(turn)), s = Math.sin(rad(turn));
    const tf = (q) => ({ u: ox + q.u * c - q.v * s, v: oy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c });
    const top = z + H;
    put(p.body, prism(P, front, p.ring.map(tf), p.inner.map(tf), z, top));
    const at = (r, t) => { const a = mid + rad(t), q = tf({ u: r * Math.cos(a), v: r * Math.sin(a), nu: 0, nv: 0 }); return P(q.u, q.v, top); };
    p.ink.setAttribute("d", p.c.segs.map(([r, t0, t1]) => seg(at(r, t0), at(r, t1))).join(""));
    p.box.setAttribute("d", p.c.boxes.map(([r, t]) => poly([at(r - 2.2, t - 3.4), at(r - 2.2, t + 3.4), at(r + 2.2, t + 3.4), at(r + 2.2, t - 3.4)])).join(""));
    p.dots.forEach((el, k) => place(el, at(p.c.dots[k][0], p.c.dots[k][1])));
  }

  const L = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of parts) {
      draw(p, tval(p.off, now), tval(p.turn, now), tval(p.z, now));
      if (!tdone(p.off, now) || !tdone(p.turn, now) || !tdone(p.z, now)) moving = true;
    }
    return moving;
  });
  bag.add(L.unregister);

  /** The wedge whose resting arc holds the pointer's angle, on the plate's plane; -1 off the plate. */
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H), d = Math.hypot(x, y);
    if (d > R + 40) return -1;
    const a = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
    return [0, 1, 2].find((i) => ((a - START[i] + 720) % 360) < SPAN);
  }

  let act = null;
  /** Draws wedge a in to the centre and the others after it, `crack` apart; -1 lets them lie apart again. */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act ?? LIT;
    act = a;
    parts.forEach((p) => {
      const delay = Math.abs(p.i - from) * 45;
      tset(p.off, a < 0 ? REST[p.i].off : p.i === a ? crack * 0.5 : crack, now, delay);
      tset(p.turn, a < 0 ? REST[p.i].turn : 0, now, delay);
      tset(p.z, p.i === a ? LIFT : 0, now, delay);
      p.body.sil.classList.toggle("hi", a < 0 ? p.i === LIT : p.i === a);
    });
    read.textContent = a < 0 ? "rest" : NAMES[a];
    L.wake();
  }
  setActive(-1);

  bag.add(pointer(stage, { move: (pt) => setActive(hit(pt)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { crack = clamp(v, 2, 16); const a = act; act = null; setActive(a); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "day",
  means: "A day broken into three pieces, a list, a note and a routine: push them together and a crack always stays.",
  rules: [1, 2, 4, 5],
  range: [12, 7, 3],
  tour: [[106, 137], [274, 113], [231, 207], null],
  mount,
});
