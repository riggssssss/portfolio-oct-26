/**
 * Pile: forty cards stacked on a table, none quite square on the one below.
 * The card under the pointer slides out of the pile towards you, and every
 * card above it shifts and twists, less the higher it sits, staggered upwards
 * from it: to start one thing you have to disturb all the others. At rest the
 * top card holds the bright edge. The slider is how far the card comes out.
 *
 * Picking reads the pointer against the cards' resting heights on screen, so
 * a card sliding out from under the pointer cannot change the choice.
 */
const {
  Cam, clamp, facing, fit, proj, prism, rad, rrect, solid, put,
  tdone, tset, tval, tween, disposer, mk, pointer, reflect, register,
} = HL;

const N = 40, W = 78, D = 56, R = 5, T = 1.1, STEP = 1.65, B = 1.1, SHIFT = 8, TWIST = 9;
const BASE = rrect(-W / 2, -D / 2, W / 2, D / 2, R, 4), INNER = rrect(-W / 2 + B, -D / 2 + B, W / 2 - B, D / 2 - B, R - B, 4);

/** A steady scatter in -1..1, the same on every load. */
const jit = (i, k) => { const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return (s - Math.floor(s)) * 2 - 1; };
const REST = Array.from({ length: N }, (_, i) => ({ a: jit(i, 1) * 5, x: jit(i, 2) * 2.4, y: jit(i, 3) * 2.4 }));

/** A ring turned by a degrees about its centre and moved to (cx, cy), normals turned with it. */
function turn(ring, a, cx, cy) {
  const c = Math.cos(rad(a)), s = Math.sin(rad(a));
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let pull = value;

  const C = Cam(45, 0.5, 1.9);
  const top = N * STEP;
  fit(C, [[-W / 2 - 4, -D / 2 - 4, 0], [W / 2 + 38, D / 2 + 4, -10], [W / 2 + 38, -D / 2, 0], [-W / 2, D / 2 + 4, 0], [-W / 2 - 6, -D / 2 - 6, top + 2]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  reflect(svg, g, P, front, turn(BASE, REST[0].a, REST[0].x, REST[0].y), 0, 14);

  // Back to front is bottom to top: each card covers the ones under it.
  const cards = REST.map((r, i) => {
    const s = solid(g);
    return { s, r, z0: i * STEP, dx: tween(0), da: tween(0), drawn: "" };
  });

  function draw(cd, dx, da) {
    const key = dx.toFixed(2) + "," + da.toFixed(2);
    if (key === cd.drawn) return;
    cd.drawn = key;
    const a = cd.r.a + da, x = cd.r.x + dx, y = cd.r.y;
    put(cd.s, prism(P, front, turn(BASE, a, x, y), turn(INNER, a, x, y), cd.z0, cd.z0 + T));
  }

  const L = register(stage, (_dt, now) => {
    let moving = false;
    for (const cd of cards) {
      draw(cd, tval(cd.dx, now), tval(cd.da, now));
      if (!tdone(cd.dx, now) || !tdone(cd.da, now)) moving = true;
    }
    return moving;
  });
  bag.add(L.unregister);

  // Hit test: each card's resting centre on screen, which never moves.
  const centre = REST.map((r, i) => P(r.x, r.y, i * STEP + T));
  const half = (P(W / 2, -D / 2, 0)[0] - P(-W / 2, D / 2, 0)[0]) / 2;
  function hit([sx, sy]) {
    if (Math.abs(sx - centre[0][0]) > half || sy > centre[0][1] + 14 || sy < centre[N - 1][1] - 18) return -1;
    let best = 0;
    centre.forEach((c, i) => { if (Math.abs(c[1] - sy) < Math.abs(centre[best][1] - sy)) best = i; });
    return best;
  }

  let act = null;
  /** Pulls card a out towards the viewer; the cards above it shift back and twist, less the higher they sit. */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act ?? N - 1;
    act = a;
    cards.forEach((cd, i) => {
      const k = i - a, fall = a < 0 || k < 0 ? 0 : k === 0 ? 1 : Math.exp(-k / 9);
      const delay = Math.abs(i - from) * 18;
      tset(cd.dx, a < 0 || k < 0 ? 0 : k === 0 ? pull : -SHIFT * fall, now, delay);
      tset(cd.da, a < 0 || k <= 0 ? 0 : TWIST * fall * (k % 2 ? 1 : -0.6), now, delay);
      cd.s.sil.classList.toggle("hi", a < 0 ? i === N - 1 : i === a);
    });
    read.textContent = a < 0 ? "rest" : N - a + " of " + N;
    L.wake();
  }
  setActive(-1);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { pull = clamp(v, 10, 36); const a = act; act = null; setActive(a); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "pile",
  means: "Forty cards in one pile: pull any one out and every card above it shifts. Starting one thing disturbs all the rest.",
  rules: [1, 2, 3, 5],
  range: [16, 26, 36],
  tour: [[200, 150], [200, 205], [200, 120], null],
  mount,
});
