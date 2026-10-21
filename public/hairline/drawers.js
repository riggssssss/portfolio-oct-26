/**
 * Drawers: a cabinet of three drawers, each holding finished mockups. The
 * drawer under the pointer slides out and shows its stack of sheets, the top
 * one a phone mockup ready to use; the drawers beside it ease out a little,
 * staggered from it. At rest the middle drawer stands half open. The slider
 * is how far a drawer comes out.
 *
 * Picking tests the drawers' fronts where they rest, never where they are,
 * so a drawer moving out cannot change which one is chosen.
 */
const { Cam, clamp, facing, fit, poly, prism, proj, ringAt, rings, rrect, seg, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 84, D = 64, N = 3, DH = 30, H = N * DH + 4, IN = 4, REST = 1, REST_OPEN = 0.42;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let OUT = value;
  const C = Cam(45, 0.5, 1.48);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D + 64, 0], [0, 0, H], [W, 0, H], [W, D + 64, H - DH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // The cabinet: a tall box with a crease round its top.
  const [cr, ci] = rings(0, 0, W, D, 4, 1.6);
  put(solid(g), prism(P, front, cr, ci, 0, H));

  // A drawer, i = 0 at the bottom: its box when out, its stack of sheets, and its front with a pull.
  const face = (y, x0, x1, z0, z1, r) => poly(rrect(x0, z0, x1, z1, r, 3).map((q) => P(q.u, y, q.v)));
  const drawers = [];
  for (let i = 0; i < N; i++) {
    const zb = 2 + i * DH + 2, zt = 2 + (i + 1) * DH - 2;
    const grp = mk("g", {}, g);
    const box = solid(grp);
    const sheets = mk("path", { class: "nf" }, grp);
    const top = mk("path", { class: "nf" }, grp);
    const dev = mk("path", { class: "nf" }, grp);
    const plate = mk("path", { class: "sil" }, grp);
    const pull = mk("path", { class: "nf lo" }, grp);
    drawers.push({ zb, zt, box, sheets, top, dev, plate, pull, o: tween(i === REST ? REST_OPEN : 0), drawn: NaN });
  }

  function draw(d, k) {
    if (k === d.drawn) return;
    d.drawn = k;
    const o = k * OUT, y = D + o, zs = d.zt - 3;
    if (o > 1.5) {
      const [br, bi] = rings(IN, D, W - IN, y, 2.5, 1.4);
      put(d.box, prism(P, front, br, bi, d.zb, d.zt));
      // Three finished sheets, stacked; the top one is a phone mockup.
      const y1 = Math.max(D + 2, y - 4);
      d.sheets.setAttribute("d", [0, 1].map((s) => poly(ringAt(P, rrect(IN + 6 + s * 2, D + 2, W - IN - 6 - s * 2, y1, 2, 3), zs - 1.2 - s * 1.2))).join(""));
      d.top.setAttribute("d", poly(ringAt(P, rrect(IN + 5, D + 2, W - IN - 5, y1, 2, 3), zs)));
      const mid = (D + 2 + y1) / 2, half = Math.min(14, (y1 - D - 2) / 2 - 3);
      d.dev.setAttribute("d", half > 3 ? poly(ringAt(P, rrect(W / 2 - 18, mid - half, W / 2 + 18, mid + half, 3, 3), zs)) : "");
    } else {
      d.box.sil.setAttribute("d", ""); d.box.cr.setAttribute("d", "");
      d.sheets.setAttribute("d", ""); d.top.setAttribute("d", ""); d.dev.setAttribute("d", "");
    }
    d.plate.setAttribute("d", face(y, IN - 1, W - IN + 1, d.zb - 1, d.zt + 1, 3));
    d.pull.setAttribute("d", face(y, W / 2 - 12, W / 2 + 12, (d.zb + d.zt) / 2 - 1.6, (d.zb + d.zt) / 2 + 1.6, 1.6));
  }

  const B = register(stage, (_dt, now) => {
    let m = false;
    drawers.forEach((d) => { draw(d, tval(d.o, now)); if (!tdone(d.o, now)) m = true; });
    return m;
  });
  bag.add(B.unregister);

  // Hit test: the fronts where they rest, in screen space. Nearest centre in height, within the cabinet's width.
  const centres = drawers.map((d) => P(W / 2, D, (d.zb + d.zt) / 2));
  const left = P(0, D, 0)[0] - 8, right = P(W, 0, 0)[0] + 8;
  function hit([x, y]) {
    if (x < left || x > right) return -1;
    let best = -1, bd = Infinity;
    centres.forEach((c, i) => { const dd = Math.abs(c[1] - y); if (dd < bd) { bd = dd; best = i; } });
    return bd < DH * 1.4 ? best : -1;
  }

  let act = null;
  /** Opens drawer a, and its neighbours a little, staggered outwards; -1 returns to rest. */
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now(), from = a >= 0 ? a : REST;
    drawers.forEach((d, i) => {
      const k = a < 0 ? (i === REST ? REST_OPEN : 0) : i === a ? 1 : 0.12;
      tset(d.o, k, now, Math.abs(i - from) * 45);
      const lit = a < 0 ? i === REST : i === a;
      d.dev.classList.toggle("hi", lit);
      d.plate.classList.toggle("hi", a >= 0 && i === a);
    });
    read.textContent = a < 0 ? "rest" : "drawer " + (a + 1);
    B.wake();
  }
  setActive(-1);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { OUT = v; drawers.forEach((d) => (d.drawn = NaN)); B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "drawers",
  means: "A cabinet of drawers full of finished mockups: the one under the pointer slides out, ready to use.",
  rules: [1, 2, 5, 8],
  range: [44, 58, 70],
  tour: [[200, 230], [200, 170], [200, 110], null],
  mount,
});
