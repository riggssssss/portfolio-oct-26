/**
 * Puzzle: two ordinary jigsaw pieces on a table, a knob of one facing a hole
 * of the other. They look like they belong together, but the hole sits a
 * little off: the piece under the pointer squares up, lifts and pushes in,
 * and the knob lands on the edge instead of in the hole; the other piece gives
 * way a little, staggered. They never fit. At rest the first piece holds the
 * bright edge. The slider is how hard the piece is pushed.
 *
 * Picking reads the pointer on the table's plane against where the pieces
 * rest, so a piece moving cannot change the choice.
 */
const { Cam, clamp, fillet, fit, mk, pointer, poly, proj, rad, tdone, tset, tval, tween, unproj, disposer, register } = HL;

const S = 40, H = S / 2, G = 22, TH = 3.5, REACH = 12.5, LIT = 0;
const REST = [{ a: -9, dy: 3 }, { a: 7, dy: -4 }];
// Each side, round the piece: bottom, right, top, left. "out" a knob, "in" a hole, slid along the side by u0.
const SIDES = [
  [["in", 0], ["out", 0], ["out", 0], ["flat", 0]],
  [["out", 0], ["in", 0], ["in", 0], ["in", 7]], // its left hole sits 7 off the knob it faces
];

/** The classic tab: a neck 7 wide and a round head of radius 5.5, its centre 7 out. */
function tab() {
  // The head's circle meets the neck 2.76 out; walk it from the neck's left, over the top, to its right.
  const from = Math.atan2(2.76 - 7, -3.5) + 2 * Math.PI, to = Math.atan2(2.76 - 7, 3.5), p = [[-3.5, 0]];
  for (let k = 0; k <= 16; k++) { const t = from + ((to - from) * k) / 16; p.push([5.5 * Math.cos(t), 7 + 5.5 * Math.sin(t)]); }
  return p.concat([[3.5, 0]]);
}
const TAB = tab();

/** A piece's outline in its own plan, centred on the origin. */
function outline(sides) {
  const frame = [
    { s: [-H, -H], t: [1, 0], n: [0, -1], m: [0, -H] },
    { s: [H, -H], t: [0, 1], n: [1, 0], m: [H, 0] },
    { s: [H, H], t: [-1, 0], n: [0, 1], m: [0, H] },
    { s: [-H, H], t: [0, -1], n: [-1, 0], m: [-H, 0] },
  ];
  const pts = [];
  frame.forEach(({ s, t, n, m }, i) => {
    pts.push(s);
    const [kind, u0] = sides[i];
    if (kind === "flat") return;
    const sg = kind === "out" ? 1 : -1;
    for (const [u, d] of TAB) pts.push([m[0] + t[0] * (u + u0) + n[0] * d * sg, m[1] + t[1] * (u + u0) + n[1] * d * sg]);
  });
  return fillet(pts, pts.map(() => 0.7), 2);
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let PUSH = value;
  const C = Cam(45, 0.5, 2.5);
  const X = [0, S + G];
  fit(C, [[-H - 6, -H - 14, 0], [X[1] + H + 14, H + 14, 0], [X[1] + H + 6, -H - 14, 0], [-H - 6, H + 14, 0], [X[0], 0, 8]], 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);

  const pieces = SIDES.map((sides, i) => {
    const grp = mk("g", {}, g);
    const base = mk("path", { class: "sil" }, grp), top = mk("path", { class: "sil" }, grp);
    return { i, grp, base, top, shape: outline(sides), x: tween(0), lift: tween(0), sq: tween(0), drawn: "" };
  });

  function draw(p, dx, lift, sq) {
    const key = dx.toFixed(3) + lift.toFixed(3) + sq.toFixed(3);
    if (key === p.drawn) return;
    p.drawn = key;
    const r = REST[p.i], a = rad(r.a * (1 - sq)), c = Math.cos(a), s = Math.sin(a);
    const cx = X[p.i] + dx, cy = r.dy * (1 - sq);
    const at = (z) => p.shape.map(([u, v]) => P(cx + u * c - v * s, cy + u * s + v * c, z));
    p.base.setAttribute("d", poly(at(lift)));
    p.top.setAttribute("d", poly(at(lift + TH)));
  }

  const B = register(stage, (_dt, now) => {
    let mv = false;
    for (const p of pieces) {
      draw(p, tval(p.x, now), tval(p.lift, now), tval(p.sq, now));
      if (!tdone(p.x, now) || !tdone(p.lift, now) || !tdone(p.sq, now)) mv = true;
    }
    return mv;
  });
  bag.add(B.unregister);

  // Hit test: the table's plane, against where the pieces rest.
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TH);
    if (Math.abs(y) > S || x < X[0] - S || x > X[1] + S) return -1;
    return Math.abs(x - X[0]) < Math.abs(x - X[1]) ? 0 : 1;
  }

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    // The knob's tip reaches the other piece's edge, then presses PUSH into it: it should go in, and doesn't.
    const push = G - REACH + PUSH, dir = a === 0 ? 1 : -1;
    for (const p of pieces) {
      const mine = p.i === a, delay = a < 0 || mine ? 0 : 45;
      tset(p.x, a < 0 ? 0 : mine ? dir * push : dir * 1.5, now, delay);
      tset(p.lift, mine ? 3 : 0, now, delay);
      tset(p.sq, a < 0 ? 0 : 1, now, delay);
      p.top.classList.toggle("hi", a < 0 ? p.i === LIT : mine);
    }
    // The piece being pushed is drawn last, over the edge it lands on.
    if (a >= 0) g.append(pieces[a].grp);
    else pieces.forEach((p) => g.append(p.grp));
    read.textContent = a < 0 ? "rest" : "piece " + (a + 1) + " · no fit";
    B.wake();
  }
  setActive(-1);

  bag.add(pointer(stage, { move: (pt) => setActive(hit(pt)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { PUSH = clamp(v, 0, 10); const a = act; act = null; setActive(a); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "puzzle",
  means: "Two ordinary jigsaw pieces: push one into the other and the knob lands on the edge, never in the hole. They don't fit.",
  rules: [1, 2, 4, 5],
  range: [5, 7, 9],
  tour: [[160, 150], [250, 195], null],
  mount,
});
