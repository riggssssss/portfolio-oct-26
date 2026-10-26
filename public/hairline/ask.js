/**
 * Ask: three open trays in a row, one, two and three dots on their fronts (a
 * task, a note, a list), and a blank card hovering over them. The tray under
 * the pointer lights up and the card glides over it, leaning in and coming
 * down, but it stops short of the rim: it never lands. Before you can write
 * it, you have to choose where it goes. The slider is how close it comes.
 *
 * Picking reads the pointer on the rims' plane, where the trays rest, so the
 * card moving overhead cannot change the choice.
 */
const {
  Cam, fit, hull, open, poly, proj, facing, rad, ringAt, rrect, run, seg, unproj,
  tdone, tset, tval, tween, disposer, mk, place, pointer, reflect, register,
} = HL;

const N = 3, TW = 50, TD = 42, GAP = 14, WH = 13, WR = 6, WT = 2.2;
const CW = 40, CD = 30, CT = 1.4, HOVER = 62, LEAN = 16, RISE = 8;
const X = [0, 1, 2].map((i) => i * (TW + GAP)), MID = X[1] + TW / 2;
const NAMES = ["task?", "note?", "list?"];

const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());

/** Tray i, which never moves: its far body and rim, then its opaque near front. */
function tray(P, front, i) {
  const x0 = X[i], x1 = x0 + TW;
  const outer = rrect(x0, 0, x1, TD, WR, 6), inner = rrect(x0 + WT, WT, x1 - WT, TD - WT, WR - WT, 6);
  const iF = LR(ringAt(P, run(inner, front), WH)), oT = LR(ringAt(P, run(outer, front), WH)), oB = LR(ringAt(P, run(outer, front), 0));
  return {
    outer,
    far: [
      [poly(hull(ringAt(P, outer, 0).concat(ringAt(P, outer, WH)))), "sil"],
      [poly(ringAt(P, inner, WH)), "nf"],
      [open(ringAt(P, run(inner, (q) => !front(q)), 2.5)), "nf lo"],
    ],
    near: [
      [poly([...iF, oT[oT.length - 1], ...oB.slice().reverse(), oT[0]]), "fo"],
      [open(oT), "nf lo"],
      [open(iF), "nf rim"],
      [open([oT[0], ...oB, oT[oT.length - 1]]), "nf sil"],
    ],
    // its kind, as one, two or three dots across its front
    dots: Array.from({ length: i + 1 }, (_, k) => P(x0 + TW / 2 + (k - i / 2) * 5, TD, WH / 2)),
  };
}

/** The card at (cx, cy, cz), leaning th degrees: its back, its face and two ruled lines. */
function pose(P, cx, cy, cz, th) {
  const c = Math.cos(rad(th)), s = Math.sin(rad(th));
  const w = (u, v, dz = 0) => P(cx + u * c, cy + v, cz + u * s + dz);
  const ring = rrect(-CW / 2, -CD / 2, CW / 2, CD / 2, 2.6, 4);
  return {
    back: poly(ring.map((q) => w(q.u, q.v, -CT))),
    face: poly(ring.map((q) => w(q.u, q.v))),
    rules: [-4, 3].map((v) => seg(w(-CW / 2 + 6, v), w(CW / 2 - (v < 0 ? 10 : 16), v))).join(""),
  };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let near = value;

  const C = Cam(45, 0.5, 1.68);
  const x1 = X[2] + TW;
  fit(C, [[0, 0, 0], [x1, TD, -6], [x1, 0, 0], [0, TD, 0], [MID - CW, TD / 2, HOVER + 10], [x1, TD / 2, WH + RISE + 40], [x1, TD, RISE]], 200, 170);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const trays = [];
  for (let i = 0; i < N; i++) {
    // The reflection stays on the table; the tray above it can rise to meet the card.
    const t = tray(P, front, i), grp = mk("g", {}, g);
    reflect(svg, grp, P, front, t.outer, 0, 12);
    const body = mk("g", {}, grp);
    for (const [d, cls] of t.far) mk("path", { d, class: cls }, body);
    const paths = t.near.map(([d, cls]) => mk("path", { d, class: cls.replace(" rim", "") }, body));
    const dots = t.dots.map((pt) => { const el = mk("circle", { r: 1.2, class: "dot off" }, body); place(el, pt); return el; });
    trays.push({ body, rim: paths[2], dots, z: tween(0), drawn: "" });
  }

  const cg = mk("g", {}, g);
  const back = mk("path", { class: "lo" }, cg), face = mk("path", { class: "sil" }, cg), rules = mk("path", { class: "nf lo" }, cg);
  const cx = tween(MID - 6), cy = tween(TD / 2 + 3), cz = tween(HOVER), th = tween(-5);
  let drawn = "";
  function draw(now) {
    const v = [tval(cx, now), tval(cy, now), tval(cz, now), tval(th, now)];
    const key = v.map((n) => n.toFixed(2)).join();
    if (key === drawn) return;
    drawn = key;
    const q = pose(P, ...v);
    back.setAttribute("d", q.back);
    face.setAttribute("d", q.face);
    rules.setAttribute("d", q.rules);
  }

  // A tray's rise is a straight move up the screen: P is linear in z.
  const up = P(0, 0, 1)[1] - P(0, 0, 0)[1];
  const B = register(stage, (_dt, now) => {
    draw(now);
    for (const t of trays) {
      const key = tval(t.z, now).toFixed(2);
      if (key !== t.drawn) { t.drawn = key; t.body.setAttribute("transform", `translate(0 ${(up * key).toFixed(2)})`); }
    }
    return [cx, cy, cz, th].some((t) => !tdone(t, now)) || trays.some((t) => !tdone(t.z, now));
  });
  bag.add(B.unregister);

  /** The tray the pointer is over, on the rims' plane; -1 off the trays. */
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, WH);
    if (y < -8 || y > TD + 8 || x < -GAP / 2 || x > x1 + GAP / 2) return -1;
    return Math.min(N - 1, Math.floor((x + GAP / 2) / (TW + GAP)));
  }

  let act = null;
  /** Floats the card over tray a, leaning towards it and stopping short of its rim (-1 lets it drift back). */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    const tx = a < 0 ? MID - 6 : X[a] + TW / 2, dir = Math.sign(tx - MID);
    tset(cx, tx, now, 0); tset(cy, a < 0 ? TD / 2 + 3 : TD / 2, now, 0);
    tset(cz, a < 0 ? HOVER : WH + RISE + near + CW / 2 * Math.sin(rad(LEAN)), now, 40);
    tset(th, a < 0 ? -5 : dir ? -dir * LEAN : -4, now, 40);
    face.classList.toggle("hi", a < 0);
    trays.forEach((t, i) => {
      tset(t.z, i === a ? RISE : 0, now, a < 0 ? 0 : Math.abs(i - a) * 45);
      t.rim.classList.toggle("hi", i === a);
      t.dots.forEach((d) => d.classList.toggle("off", i !== a));
      t.dots.forEach((d) => d.classList.toggle("m", i === a));
    });
    read.textContent = a < 0 ? "rest" : NAMES[a];
    B.wake();
  }
  setActive(-1);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { near = v; const a = act; act = null; setActive(a); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "ask",
  means: "A blank card over three trays, a task, a note and a list: it leans towards one but never lands until you choose.",
  rules: [1, 4, 5, 8],
  range: [30, 22, 15],
  tour: [[124, 140], [200, 178], [276, 216], null],
  mount,
});
