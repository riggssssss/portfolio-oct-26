/**
 * Pipeline: Mockp's editor from the front, drawn after the real one: a portrait
 * photo of a laptop on the canvas, a toolbar with Crop and Download at its top
 * right, a sidebar of fill-bar settings. A cursor does the job. It drops your design
 * on the canvas and a bar scans the photo: only the laptop's screen, the chroma area,
 * lights up, the design seats into it and a toast says it is placed. It drags two
 * settings: glare sweeps the screen, the shadow stretches. It presses Download and
 * the 4K file, four tiles, comes out toward you. Played by the steps beside it, on a
 * loop while on screen; the pointer across the window scrubs it on a spring.
 * The slider is how wide the glare is.
 */
const { Cam, clamp, fillet, fit, lerp, mk, poly, pointer, proj, rrect, seg, spring, stepS, tween, tset, tval, tdone, disposer, register, reducedMotion } = HL;

const W = 150, H = 100, TH = 4;
const IMG = [30, 10, 76, 86], SCR = [37, 41, 69, 63], BASE = [[31, 36], [75, 36], [72, 40.5], [34, 40.5]];
const DL = [92, 84, 106, 89], CROP = [82, 84, 90, 89], TOAST = [41, 2.6, 65, 7.4];
const ROW = (z) => [112, z - 2.5, 144, z + 2.5], RA = 67.5, RB = 59.5, RC = 51.5;
const PHASES = [[0, 0.34], [0.34, 0.67], [0.67, 1]];
const KEYS = [[0, 14, 28], [0.1, 53, 52], [0.13, 53, 52], [0.24, 90, 30], [0.36, 90, 30], [0.4, 123, RA], [0.49, 137.6, RA],
  [0.53, 134.4, RB], [0.63, 123.2, RB], [0.68, 123.2, RB], [0.73, 99, 86.5], [0.79, 99, 86.5], [0.9, 103, 72], [1, 103, 72]];
const ARROW = fillet([[0, 0], [0, 17], [4.2, 13.2], [7, 19.4], [9.8, 18.2], [7, 12.2], [12.2, 12.2]], [0.4, 0.8, 0.6, 0.8, 0.8, 0.6, 0.8], 3);
const CELLS = [];
for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) CELLS.push([42 + c * 7.4, 46 + r * 6]);
const sm = (t) => t * t * (3 - 2 * t);
const span = (p, a, b) => sm(clamp((p - a) / (b - a), 0, 1));

function mount({ stage, svg, read, onProgress }, value) {
  const bag = disposer();
  let GW = value;
  const C = Cam(0, 0.14, 2);
  fit(C, [[0, 0, 0], [W, 0, 0], [W, TH, 0], [0, 0, H], [W, TH, H], [86, TH + 20, 30]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const face = (x0, z0, x1, z1, r, y = TH) => poly(rrect(x0, z0, x1, z1, r, 8).map((q) => P(q.u, y, q.v)));
  const path = (cls, d = "") => mk("path", { class: cls, d }, g);

  // The window: a browser with its address pill, the canvas, the sidebar.
  path("sil", face(0, 0, W, H, 6));
  path("nf lo", seg(P(4, TH, H - 8), P(W - 4, TH, H - 8)));
  path("nf lo", face(60, H - 6.2, 90, H - 2.6, 1.8));
  path("nf lo", seg(P(108, TH, 2), P(108, TH, H - 8)));
  path("nf lo", face(...CROP, 2.5));
  const dl = path("nf");
  // Sidebar: a heading and a switch, a heading and three fill-bar settings.
  [86, 73].forEach((z) => path("nf lo", seg(P(112, TH, z), P(124, TH, z))));
  path("nf lo", face(...ROW(80.5), 2.5));
  path("nf", face(136, 79.2, 142.5, 81.8, 1.3));
  path("nf", face(139.8, 79.6, 142, 81.4, 0.9));
  const rows = [RA, RB, RC].map((z) => [path("nf lo", face(...ROW(z), 2.5)), path("nf lo"), path("nf lo")]);

  // The photo: a laptop, its screen the chroma area; the toast under the canvas.
  path("", face(...IMG, 3));
  const shadow = path("nf lo");
  path("", poly(BASE.map(([x, z]) => P(x, TH + 0.5, z))));
  path("", face(...SCR, 2, TH + 0.5));
  const cells = CELLS.map(([x, z]) => path("nf lo", face(x - 2.6, z - 2, x + 2.6, z + 2, 0.8, TH + 0.5)));
  const scan = path("nf");
  const sheet = path(""), marks = path("nf lo"), glare = path("nf lo");
  const toast = path(""), thumb = path("nf lo");
  // In front of everything: the file on its way out, the design in hand, the cursor.
  const file = path(""), tiles = path("nf lo"), carry = path(""), cursor = path("sil");

  let job = tween(reducedMotion() ? 1 : 0.1), drawn = NaN, queue = null, auto = -1, wait = 0, home = NaN, held = false;
  const hand = spring(0.1);
  function draw(p) {
    if (Math.abs(p - drawn) < 1e-4) return;
    drawn = p;
    const sc = span(p, 0.12, 0.26), seat = span(p, 0.26, 0.33), pop = span(p, 0.3, 0.34);
    const A = lerp(0.35, 0.8, span(p, 0.4, 0.49)), B = lerp(0.7, 0.35, span(p, 0.53, 0.63));
    const press = Math.sin(Math.PI * clamp((p - 0.76) / 0.04, 0, 1)), out = span(p, 0.78, 0.92);
    // Where the cursor is: between the two keys around p, eased.
    let k = 1;
    while (k < KEYS.length - 1 && KEYS[k][0] < p) k++;
    const [p0, x0, z0] = KEYS[k - 1], [p1, x1, z1] = KEYS[k], f = sm(clamp((p - p0) / (p1 - p0), 0, 1));
    const cx = lerp(x0, x1, f), cz = lerp(z0, z1, f), [tx, ty] = P(cx, TH + 6, cz);
    cursor.setAttribute("d", poly(ARROW.map(([x, y]) => [tx + x, ty + y])));
    // Detect: the design in hand is dropped; the bar finds the screen; the design seats.
    carry.setAttribute("d", p < 0.1 ? face(cx - 9, cz - 13, cx + 9, cz - 1, 1.5, TH + 5) : "");
    const zb = lerp(IMG[3] - 3, IMG[1] + 3, sc);
    scan.setAttribute("d", sc > 0 && sc < 1 ? seg(P(IMG[0] + 2, TH + 1, zb), P(IMG[2] - 2, TH + 1, zb)) : "");
    CELLS.forEach(([, z], i) => cells[i].setAttribute("class", sc > 0 && zb < z + 2 ? "nf" : "nf lo"));
    const ys = TH + 0.9 + 8 * (1 - seat), d = [SCR[0] + 1, SCR[1] + 1 + 6 * (1 - seat), SCR[2] - 1, SCR[3] - 1 + 6 * (1 - seat)];
    sheet.setAttribute("d", seat > 0 ? face(...d, 1.5, ys) : "");
    const m = [];
    for (let i = 0; i < 4; i++) m.push(face(d[0] + 2 + i * 7.3, d[1] + 2.5, d[0] + 7.6 + i * 7.3, d[3] - 7, 1, ys));
    m.push(seg(P(d[0] + 2, ys, d[3] - 3.5), P(d[0] + 14, ys, d[3] - 3.5)));
    marks.setAttribute("d", seat > 0 ? m.join("") : "");
    toast.setAttribute("d", pop > 0 ? face(53 - 12 * pop, TOAST[1], 53 + 12 * pop, TOAST[3], 2.4, TH + 0.5) : "");
    thumb.setAttribute("d", pop >= 1 ? face(43, 3.6, 47, 6.4, 0.8, TH + 0.5) + seg(P(49, TH + 0.5, 5), P(59, TH + 0.5, 5)) : "");
    // Light and shadow: the two settings' fills, the glare on the screen, the shadow on the seat.
    [A, B, 0.9].forEach((v, i) => {
      const z = [RA, RB, RC][i], x = lerp(112.6, 143.4, v);
      rows[i][1].setAttribute("d", face(112.6, z - 1.9, x, z + 1.9, 1.9));
      rows[i][2].setAttribute("d", seg(P(x - 1.6, TH, z - 1.4), P(x - 1.6, TH, z + 1.4)));
    });
    const xt = lerp(d[0] + 4, d[2] - GW - 3, A);
    glare.setAttribute("d", seat >= 1 ? [0, GW].map((o) => seg(P(xt + o, ys, d[3] - 0.5), P(xt + o - 5, ys, d[1] + 0.5))).join("") : "");
    shadow.setAttribute("d", seg(P(31 - 10 * B, TH + 0.5, 34.5), P(75 + 10 * B, TH + 0.5, 34.5)));
    // Export: Download gives under the click; the file comes out of it toward you.
    dl.setAttribute("d", face(DL[0] + 0.5 * press, DL[1] + 0.5 * press, DL[2] - 0.5 * press, DL[3] - 0.5 * press, 2.5));
    const fs = lerp(0.25, 1, out), fx = lerp(99, 88, out), fz = lerp(86.5, 46, out), fy = TH + 4 + 16 * out;
    const fw = 17 * fs, fh = 12 * fs, fold = 4.5 * fs;
    file.setAttribute("d", out > 0 ? poly([[fx - fw, fz - fh], [fx + fw, fz - fh], [fx + fw, fz + fh - fold], [fx + fw - fold, fz + fh], [fx - fw, fz + fh]].map(([x, z]) => P(x, fy, z))) : "");
    const t = [];
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      const a = fx - fw + 2.2 * fs + i * (fw - 1.2 * fs), b = fz - fh + 2.2 * fs + j * (fh - 1.6 * fs);
      t.push(face(a, b, a + fw - 3.2 * fs, b + fh - 3.2 * fs, 1.1 * fs, fy));
    }
    tiles.setAttribute("d", out > 0 ? t.join("") : "");
    // One bright place: what the cursor is doing now.
    const now = p < 0.1 ? carry : p < 0.26 ? scan : p < 0.36 ? sheet : p < 0.52 ? rows[0][1] : p < 0.67 ? rows[1][1] : p < 0.78 ? dl : file;
    [carry, scan, sheet, rows[0][1], rows[1][1], dl, file].forEach((el) => el.classList.toggle("hi", el === now));
    read.textContent = held ? ["detect", "light", "export 4k"][p < 0.34 ? 0 : p < 0.67 ? 1 : 2] : "rest";
    onProgress?.(p);
  }

  const B = register(stage, (dt, now) => {
    if (queue !== null) {
      // A phase starts where it starts: the ones before it are done, the ones after undone.
      const [a, b] = PHASES[queue];
      job = tween(a, 2600);
      tset(job, b, now, 0);
      queue = null;
    }
    if (held) {
      const mv = stepS(hand, dt);
      draw(clamp(hand.x, 0, 1));
      return mv;
    }
    if (!isNaN(home)) {
      // The pointer let go: back from where the hand left it to where the steps had it.
      job = tween(clamp(hand.x, 0, 1));
      tset(job, home, now, 0);
      home = NaN;
    }
    draw(clamp(tval(job, now), 0, 1));
    if (!tdone(job, now)) return true;
    if (auto < 0) return false;
    // On a loop: a short pause between phases, a longer one on the finished file.
    wait ||= now + (auto === PHASES.length - 1 ? 1800 : 350);
    if (now < wait) return true;
    wait = 0;
    auto = (auto + 1) % PHASES.length;
    queue = auto;
    return true;
  });
  bag.add(B.unregister);
  draw(reducedMotion() ? 1 : 0.1);

  // Where the pointer is across the window's face, on screen, is how far the job has got.
  const L0 = P(12, TH, H / 2), L1 = P(W - 12, TH, H / 2);
  const top = P(0, TH, H)[1], bottom = P(W, TH, 0)[1], left = P(0, TH, 0)[0], right = P(W, TH, 0)[0];
  let was = -1;
  function move([sx, sy]) {
    if (sx < left || sx > right || sy < top || sy > bottom) return leave();
    if (!held) {
      hand.x = drawn;
      hand.v = 0;
      home = NaN;
      was = auto;
      auto = -1;
      held = true;
    }
    hand.t = clamp((sx - L0[0]) / (L1[0] - L0[0]), 0, 1);
    B.wake();
  }
  function leave() {
    if (!held) return;
    held = false;
    read.textContent = "rest";
    home = tval(job, performance.now());
    auto = was;
    B.wake();
  }
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { GW = v; drawn = NaN; B.wake(); },
    /** Plays one phase; with `loop`, carries on through the others, round and round. */
    play: (i, loop = false) => { if (reducedMotion()) return; queue = i; auto = loop ? i : -1; wait = 0; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "pipeline",
  means: "Mockp's editor: a cursor drops your design, the chroma screen is found, it sets glare and shadow, and Download gives a 4K file.",
  rules: [4, 5, 6, 8],
  range: [2, 3, 4],
  tour: [[130, 165], [215, 165], [290, 165], null],
  mount,
});
