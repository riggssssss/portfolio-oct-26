/**
 * Matches: a matchbox lying flat, its tray slid out over a row of matches.
 * The match under the pointer comes out of the tray, stands up and lights; the
 * ones beside it stir, staggered outwards. At rest the next match to strike
 * holds the bright edge. The slider is the size of the flame.
 *
 * Picking takes the match whose resting head is nearest the pointer on screen,
 * so a match rising cannot change the choice.
 */
const { Cam, fit, hull, mk, pointer, poly, prism, proj, facing, rad, ringAt, rings, rrect, seg, tdone, tset, tval, tween, disposer, put, register, solid } = HL;

const BX = 56, BY = 44, BZ = 16, OUT = 26, N = 6, L = 32, RISE = 78, NEXT = 3;
const HX = BX + OUT - 5; // where the heads rest, near the tray's open end

/** A match's pose when it is k of the way out: its tail and its head. Lying in
 *  the tray at 0; first it slides out over the tray's lip, then it stands up,
 *  lifted clear, at RISE degrees. */
const SLIDE = 16;
function poseOf(k, y) {
  const s = Math.min(k / 0.45, 1), r = Math.max(0, Math.min((k - 0.3) / 0.7, 1));
  const a = rad(RISE * r), lift = 10 * Math.sin((Math.PI / 2) * r);
  const tail = [HX - L + SLIDE * s, y, BZ - 3 + 1.5 * s + lift];
  return { tail, head: [tail[0] + L * Math.cos(a), y, tail[2] + L * Math.sin(a)] };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let FLAME = value;
  const C = Cam(45, 0.5, 2.6);
  const tip = poseOf(1, 0).head;
  fit(C, [[0, 0, 0], [HX + SLIDE, 0, 0], [HX + SLIDE, BY, 0], [0, BY, 0], [tip[0], 8, tip[2] + 20], [tip[0], BY - 8, tip[2] + 20]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // The sleeve, with its striker down the near side, hatched.
  const [sr, si] = rings(0, 0, BX, BY, 2.5, 1.4);
  put(solid(g), prism(P, front, sr, si, 0, BZ));
  const hatch = [];
  for (let x = 5; x < BX - 4; x += 3.4) hatch.push(seg(P(x, BY, 4), P(x + 2.4, BY, 12)));
  mk("path", { d: hatch.join(""), class: "nf lo" }, g);

  // The tray, slid out past the sleeve's end: an open box.
  const [tr, ti] = rings(BX, 2, BX + OUT, BY - 2, 1.6, 1.4);
  put(solid(g), prism(P, front, tr, ti, 0.5, BZ - 2));

  // The matches, far to near: a stick and a head each, and a flame for the one that lights.
  const matches = [];
  for (let i = 0; i < N; i++) {
    const y = 8 + i * ((BY - 16) / (N - 1)), grp = mk("g", {}, g);
    const stick = mk("path", { class: "sil" }, grp), head = solid(grp);
    const flame = mk("path", { class: "nf hi" }, grp), core = mk("path", { class: "nf lo" }, grp);
    matches.push({ i, y, grp, stick, head, flame, core, out: tween(0), fire: tween(0), drawn: "" });
  }

  function draw(m, k, f) {
    const key = k.toFixed(3) + f.toFixed(3);
    if (key === m.drawn) return;
    m.drawn = key;
    let { tail, head } = poseOf(k, m.y);
    // What is still inside the sleeve is hidden: the stick starts at its mouth.
    if (tail[0] < BX + 1) {
      const t = (BX + 1 - tail[0]) / (head[0] - tail[0]);
      tail = tail.map((v, j) => v + (head[j] - v) * t);
    }
    const ring = (p) => ringAt(P, rrect(p[0] - 1.1, p[1] - 1.1, p[0] + 1.1, p[1] + 1.1, 0.8, 3), p[2]);
    m.stick.setAttribute("d", poly(hull(ring(tail).concat(ring(head)))));
    const top = head[2] + 1.5 + 3 * k;
    const [hr, hi] = rings(head[0] - 2.5, m.y - 1.8, head[0] + 2.5, m.y + 1.8, 1.8, 0.6);
    put(m.head, prism(P, front, hr, hi, head[2] - 2.5, top));
    // The flame: a drop standing on the head, in the screen's plane, as fire has no side.
    if (f > 0.02) {
      const [cx, cy] = P(head[0], m.y, top), R = FLAME * f;
      const drop = (r) => {
        const d = [];
        for (let s = 0; s <= 24; s++) {
          const t = (s / 24) * Math.PI * 2;
          d.push([cx + r * 0.62 * Math.sin(t) * Math.sin(t / 2) ** 1.4, cy + 1 - r * (1 + Math.cos(t)) * 0.9]);
        }
        return poly(d);
      };
      m.flame.setAttribute("d", drop(R));
      m.core.setAttribute("d", drop(R * 0.42));
    } else {
      m.flame.setAttribute("d", "");
      m.core.setAttribute("d", "");
    }
  }

  const B = register(stage, (_dt, now) => {
    let mv = false;
    for (const m of matches) {
      draw(m, tval(m.out, now), tval(m.fire, now));
      if (!tdone(m.out, now) || !tdone(m.fire, now)) mv = true;
    }
    return mv;
  });
  bag.add(B.unregister);

  // Hit test: the heads where they rest, on screen, within reach of the box.
  const heads = matches.map((m) => P(HX, m.y, BZ - 1));
  function hit([x, y]) {
    let best = -1, bd = Infinity;
    heads.forEach(([hx, hy], i) => { const d = Math.hypot(hx - x, hy - y); if (d < bd) { bd = d; best = i; } });
    return bd < 90 ? best : -1;
  }

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    for (const m of matches) {
      const d = a < 0 ? 0 : Math.abs(m.i - a);
      tset(m.out, a < 0 ? 0 : d === 0 ? 1 : d === 1 ? 0.06 : 0, now, d * 45);
      tset(m.fire, a >= 0 && d === 0 ? 1 : 0, now, a >= 0 && d === 0 ? 420 : 0);
      m.head.sil.classList.toggle("hi", a < 0 && m.i === NEXT);
    }
    // The match that rises is drawn last, over the tray and its neighbours.
    if (a >= 0) g.append(matches[a].grp);
    else matches.forEach((m) => g.append(m.grp));
    read.textContent = a < 0 ? "rest" : String(a + 1).padStart(2, "0") + " lit";
    B.wake();
  }
  setActive(-1);

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { FLAME = v; matches.forEach((m) => (m.drawn = "")); B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "matches",
  means: "A matchbox: the match under the pointer comes out of the tray, stands up and lights.",
  rules: [1, 2, 4, 5],
  range: [11, 15, 19],
  tour: [[250, 175], [215, 200], [280, 150], null],
  mount,
});
