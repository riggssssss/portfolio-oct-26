/**
 * Copies: a tray of seven cards, and every card is the same mockup: the same
 * tab in the same place, the same phone on its face. The card under the
 * pointer stands up; the ones in front lean forward and the ones behind lean
 * back, staggered outwards from it. Whichever you pull, you get the same one.
 * The slider is the stagger, in ms.
 *
 * Built on Riffle: tweens, a stagger by distance and a hit test on static
 * bands along the resting top edges. What changed is identity: Riffle punches
 * a number on each tab; here nothing tells the cards apart.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, proj, rad, ringAt, rrect, run,
  tdone, tset, tval, tween, disposer, mk, pointer, reflect, register,
} = HL;

const N = 7, W = 84, H = 54, G = 14, TW = 22, TH = 7, T0 = 31, TK = 1.4;
const REST = -12, BACK = -24, FWD = 20, LIFT = 16;
const X0 = -5, X1 = W + 5, Y0 = -9, Y1 = (N - 1) * G + 9, WH = 20, WR = 6, WT = 2.4;
// The mockup on every face: a phone and its screen, in the card's own plane.
const DEV = rrect(33, 7, 51, 47, 4, 4), SCR = rrect(35.5, 10.5, 48.5, 43.5, 2, 4);

const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());

/** The tray, which never moves: `far` is painted before the cards, `near` after them. */
function tray(P, front, outer, inner) {
  const far = [
    [poly(hull(ringAt(P, outer, 0).concat(ringAt(P, outer, WH)))), "sil"],
    [poly(ringAt(P, inner, WH)), "nf"],
    [open(ringAt(P, run(inner, (q) => !front(q)), 2.5)), "nf lo"],
  ];
  const iF = LR(ringAt(P, run(inner, front), WH)), oT = LR(ringAt(P, run(outer, front), WH)), oB = LR(ringAt(P, run(outer, front), 0));
  const near = [
    [poly([...iF, oT[oT.length - 1], ...oB.slice().reverse(), oT[0]]), "fo"],
    [open(oT), "nf lo"],
    [open(iF), "nf"],
    [open([oT[0], ...oB, oT[oT.length - 1]]), "nf sil"],
  ];
  return { far, near };
}

// One outline for every card: the tab sits in the same place on all of them.
const SHAPE = fillet(
  [[0, 0], [W, 0], [W, H], [T0 + TW, H], [T0 + TW, H + TH], [T0, H + TH], [T0, H], [0, H]],
  [1, 1, 3.2, 1.8, 2.4, 2.4, 1.8, 3.2],
);

/** Card i leaning th degrees (negative leans back) and lifted by `lift`. */
function pose(P, i, th, lift) {
  const yb = i * G, s = Math.sin(rad(th)), c = Math.cos(rad(th));
  const w = (u, v) => P(u, yb + v * s, v * c + lift);
  const wb = (u, v) => P(u, yb + v * s - TK * c, v * c + TK * s + lift);
  return {
    back: poly(SHAPE.map((p) => wb(p[0], p[1]))),
    face: poly(SHAPE.map((p) => w(p[0], p[1]))),
    dev: poly(DEV.map((q) => w(q.u, q.v))),
    scr: poly(SCR.map((q) => w(q.u, q.v))),
  };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;

  const C = Cam(45, 0.5, 1.62);
  fit(C, [[X0, Y0, 0], [X1, Y1, -8], [X1, Y0, 0], [X0, Y1, 0], [X0, Y0, H + TH], [X1, Y0, H + TH + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const outer = rrect(X0, Y0, X1, Y1, WR, 6), inner = rrect(X0 + WT, Y0 + WT, X1 - WT, Y1 - WT, WR - WT, 6);
  const paths = tray(P, front, outer, inner);

  const g = mk("g", {}, svg);
  reflect(svg, g, P, front, outer, 0, 14);
  for (const [d, cls] of paths.far) mk("path", { d, class: cls }, g);

  const cards = [];
  for (let i = 0; i < N; i++) {
    const grp = mk("g", {}, g);
    const back = mk("path", { class: "lo" }, grp), face = mk("path", { class: "sil" }, grp);
    const dev = mk("path", { class: "nf" }, grp), scr = mk("path", { class: "nf lo" }, grp);
    cards.push({ back, face, dev, scr, a: tween(REST), z: tween(0), drawn: "" });
  }
  for (const [d, cls] of paths.near) mk("path", { d, class: cls }, g);

  // Hit bands along the RESTING top edges: they never move, and nothing draws them.
  const top = (i) => P(W / 2, i * G + H * Math.sin(rad(REST)), H * Math.cos(rad(REST)));
  const c0 = top(0), c1 = top(1), d = [c1[0] - c0[0], c1[1] - c0[1]];
  const px0 = P(0, 0, 0), px1 = P(1, 0, 0), ex = [px1[0] - px0[0], px1[1] - px0[1]];
  const HALF = W / 2 + 6, det = d[0] * ex[1] - d[1] * ex[0];
  function hit([x, y]) {
    const qx = x - c0[0], qy = y - c0[1];
    const s = (qx * ex[1] - qy * ex[0]) / det, r = (d[0] * qy - d[1] * qx) / det;
    if (Math.abs(r) > HALF || s < -0.5 || s > N + 1) return -1;
    return clamp(Math.round(s), 0, N - 1);
  }

  function draw(i, th, lift) {
    const cd = cards[i], key = th.toFixed(2) + "," + lift.toFixed(2);
    if (key === cd.drawn) return;
    cd.drawn = key;
    const q = pose(P, i, th, lift);
    cd.back.setAttribute("d", q.back);
    cd.face.setAttribute("d", q.face);
    cd.dev.setAttribute("d", q.dev);
    cd.scr.setAttribute("d", q.scr);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    cards.forEach((cd, i) => { draw(i, tval(cd.a, now), tval(cd.z, now)); if (!tdone(cd.a, now) || !tdone(cd.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  let act = null;
  /** Pulls card a (-1 puts them all back). At rest the front card's phone holds the bright. */
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act ?? N - 1;
    act = a;
    cards.forEach((cd, i) => {
      const delay = Math.abs(i - from) * stag;
      const th = a < 0 ? REST : i < a ? BACK : i > a ? FWD : 0;
      tset(cd.a, th, now, delay); tset(cd.z, a === i ? LIFT : 0, now, delay);
      cd.face.classList.toggle("hi", i === a);
      cd.dev.classList.toggle("hi", i === a || (a < 0 && i === N - 1));
    });
    read.textContent = a < 0 ? "rest" : "copy " + (N - a);
    B.wake();
  }
  setActive(-1);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { stag = v; },
    destroy: bag.dispose,
  };
}

hairline({
  name: "copies",
  means: "Seven cards in a tray, and all of them the same mockup: whichever you pull, it is the one everybody has.",
  rules: [1, 2, 5, 10],
  range: [0, 40, 90],
  tour: [[160, 160], [200, 120], [280, 120], null],
  mount,
});
