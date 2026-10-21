/**
 * Scan: a phone lying on a desk, its screen a matrix of dots: the chroma
 * area. A scanning bar hovers over the desk and follows the pointer; the
 * screen's dots light up once the bar has passed them, and the desk's dots
 * never do. Only the area to replace is found, with nothing selected by hand.
 * The slider is how many rows ahead of the bar are already being read.
 *
 * The pointer is put on the ground plane, which never moves, and the bar
 * follows it on a spring.
 */
const { Cam, clamp, facing, fit, prism, proj, rings, seg, spring, stepS, unproj, disposer, flatDot, mk, place, pointer, put, register, solid } = HL;

const PW = 64, PL = 124, ZB = 7;
const SX0 = 7, SY0 = 14, SX1 = 57, SY1 = 110, COLS = 7, ROWS = 12;
const DX0 = -34, DY0 = -22, DX1 = PW + 34, DY1 = PL + 22;
const RX0 = DX0 + 4, RX1 = DX1 - 4, RZ = 22, REST_Y = 66;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let band = value, over = null;
  const sp = spring(REST_Y, { eps: 0.05 });
  const C = Cam(45, 0.5, 1.46);
  fit(C, [[DX0, DY0, -5], [DX1, DY1, -5], [DX1, DY0, -5], [DX0, DY1, -5], [RX0, DY0, RZ + 3], [RX1, DY0, RZ + 3]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // The desk, and its dots, which are never read.
  const [dr, di] = rings(DX0, DY0, DX1, DY1, 10, 2);
  put(solid(g), prism(P, front, dr, di, -5, 0));
  for (let x = DX0 + 8; x < DX1 - 4; x += 10) for (let y = DY0 + 8; y < DY1 - 4; y += 10) {
    if (x > -6 && x < PW + 6 && y > -6 && y < PL + 6) continue;
    place(flatDot(g, C, 0.5, "dot off"), P(x, y, 0));
  }
  // The far guide drops behind the phone, so it is painted before it.
  const guideFar = mk("path", { class: "nf dash" }, g);
  // The phone, lying flat, and the outline of its screen.
  const [pr, pi] = rings(0, 0, PW, PL, 11, 1.8);
  put(solid(g), prism(P, front, pr, pi, 0, ZB));
  const [sr] = rings(SX0, SY0, SX1, SY1, 6, 1);
  mk("path", { d: "M" + sr.map((q) => P(q.u, q.v, ZB).join(" ")).join("L") + "Z", class: "nf" }, g);
  mk("path", { d: seg(P(PW / 2 - 7, 7, ZB), P(PW / 2 + 7, 7, ZB)), class: "nf lo" }, g);
  // The chroma area, as a matrix of dots.
  const dots = [];
  const rowH = (SY1 - SY0) / ROWS;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const x = SX0 + ((c + 0.5) * (SX1 - SX0)) / COLS, y = SY0 + (r + 0.5) * rowH;
    const el = flatDot(g, C, 0.9, "dot off");
    place(el, P(x, y, ZB));
    dots.push({ y, el, cls: "dot off" });
  }
  // The bar: its near guide, then the bar itself, which is above everything.
  const guideNear = mk("path", { class: "nf dash" }, g);
  const bar = solid(g);

  let drawn = NaN;
  function draw(y) {
    if (y === drawn) return;
    drawn = y;
    const [br, bi] = rings(RX0, y - 2.2, RX1, y + 2.2, 2, 0.7);
    put(bar, prism(P, front, br, bi, RZ, RZ + 3));
    guideFar.setAttribute("d", seg(P(RX0, y, RZ), P(RX0, y, 0)));
    guideNear.setAttribute("d", seg(P(RX1, y, RZ), P(RX1, y, 0)));
    for (const d of dots) {
      const cls = d.y <= y ? "dot" : d.y - y <= band * rowH ? "dot m" : "dot off";
      if (cls !== d.cls) { d.cls = cls; d.el.setAttribute("class", cls); }
    }
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function retarget() {
    sp.t = over === null ? REST_Y : clamp(over, SY0 - 12, SY1 + 12);
    const rows = clamp(Math.floor((sp.t - SY0) / rowH + 0.5), 0, ROWS);
    read.textContent = over === null ? "rest" : "area " + Math.round((rows / ROWS) * 100) + "%";
    B.wake();
  }
  retarget();

  bag.add(pointer(stage, { move: (p) => { over = unproj(C, p[0], p[1], 0)[1]; retarget(); }, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { band = v; drawn = NaN; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "scan",
  means: "A bar scans a phone on a desk: its screen, the chroma area, lights up as the bar passes; the desk around it never does.",
  rules: [1, 4, 5, 8],
  range: [0, 1.5, 3],
  tour: [[150, 130], [210, 175], [260, 220], null],
  mount,
});
