/**
 * Photoshop: an editor's window seen from the front, with its title bar, its tool
 * column, its canvas and its layers panel. On the canvas a phone waits for a
 * screen; a cursor pulls the design out of the canvas, carries it over and
 * presses it in, and the layers panel fills one row at a time: scene, shadow,
 * device, screen, glare, all by hand. The pointer's place across the window is
 * how far the job has got, through a spring. At rest the design is halfway,
 * lifted in the cursor's grip. The slider is how high the cursor lifts it.
 *
 * The window never moves: the pointer is read against its resting face on screen.
 */
const { Cam, clamp, fillet, fit, mk, pointer, poly, proj, rrect, seg, spring, stepS, disposer, register } = HL;

const W = 150, H = 100, TH = 4, ROWS = 5, REST = 0.45;
const PH = [72, 12, 98, 80], SC = [75, 17, 95, 75]; // the phone on the canvas, and its screen, as x0 z0 x1 z1
const SW = SC[2] - SC[0], SH = SC[3] - SC[1], START = [38, 44], END = [(SC[0] + SC[2]) / 2, (SC[1] + SC[3]) / 2];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let OUT = value;
  const C = Cam(0, 0.14, 1.9); // front on, a touch from above so the slab still has a top
  fit(C, [[0, 0, 0], [W, 0, 0], [W, TH, 0], [0, TH + 30, 0], [0, 0, H], [W, TH, H], [START[0], TH, H]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  // A rounded rectangle on a plane parallel to the window's face, y out from the wall.
  const face = (x0, z0, x1, z1, r, y = TH) => poly(rrect(x0, z0, x1, z1, r, 8).map((q) => P(q.u, y, q.v)));
  const flat = (x0, z0, x1, z1, r, cls) => mk("path", { d: face(x0, z0, x1, z1, r), class: cls }, g);

  // The window: a thin slab standing up, its face the interface.
  // Seen from the front, a slab is its face and, just above it, the edge of its back.
  mk("path", { d: face(0, 0, W, H, 6, 0), class: "sil" }, g);
  mk("path", { d: face(0, 0, W, H, 6), class: "sil" }, g);
  mk("path", { d: seg(P(3, TH, H - 10), P(W - 3, TH, H - 10)), class: "nf lo" }, g);
  [6, 11, 16].forEach((x) => flat(x - 1.3, H - 6.3, x + 1.3, H - 3.7, 1.3, "nf lo"));
  flat(5, 5, 14, H - 15, 2, "nf lo");
  for (let k = 0; k < 6; k++) flat(7, H - 26 - k * 10, 12, H - 21 - k * 10, 1, "nf lo");
  flat(18, 5, 108, H - 15, 2, "nf");
  flat(112, 5, W - 5, H - 15, 2, "nf lo");
  const rows = [];
  for (let k = 0; k < ROWS; k++) rows.push(flat(115, H - 28 - k * 12, W - 8, H - 20 - k * 12, 1.5, "nf lo"));

  // The phone on the canvas, its screen an empty well.
  flat(...PH, 5, "nf");
  flat(...SC, 3, "nf lo");

  // The design: a thin sheet with a block of content, then the cursor that holds it.
  const under = mk("path", { class: "sil" }, g), sheet = mk("path", { class: "sil" }, g), marks = mk("path", { class: "nf lo" }, g);
  const cursor = mk("path", { class: "sil" }, g);
  const ARROW = fillet([[0, 0], [0, 17], [4.2, 13.2], [7, 19.4], [9.8, 18.2], [7, 12.2], [12.2, 12.2]], [0.4, 0.8, 0.6, 0.8, 0.8, 0.6, 0.8], 3);

  const job = spring(REST);
  let drawn = NaN;
  function draw(p) {
    if (Math.abs(p - drawn) < 1e-4) return;
    drawn = p;
    const s = clamp(p / 0.85, 0, 1); // the drag is done by 85%; the rest is the glare row
    // Lifted off the canvas in an arc and pressed back in, like a drag by hand.
    const arc = Math.sin(Math.PI * s);
    const cx = START[0] + (END[0] - START[0]) * s, cz = START[1] + (END[1] - START[1]) * s + OUT * arc;
    const y = TH + 0.5 + 6 * arc;
    const b = [cx - SW / 2, cz - SH / 2, cx + SW / 2, cz + SH / 2];
    under.setAttribute("d", face(...b, 3, y));
    sheet.setAttribute("d", face(...b, 3, y + 1.2));
    const m = [];
    for (let k = 0; k < 3; k++) m.push(seg(P(b[0] + 3.5, y + 1.2, b[3] - 7 - k * 5), P(b[2] - 3.5 - k * 3, y + 1.2, b[3] - 7 - k * 5)));
    m.push(face(b[0] + 3.5, b[1] + 5, b[2] - 3.5, b[1] + 30, 2, y + 1.2));
    marks.setAttribute("d", m.join(""));
    // The cursor grips the sheet near its top corner, then lets go and moves off.
    const off = clamp((p - 0.85) / 0.15, 0, 1);
    const [tx, ty] = P(b[2] - 5 + off * 12, y + 1.2 + off * 4, b[3] - 9 - off * 4);
    cursor.setAttribute("d", poly(ARROW.map(([x, yy]) => [tx + x, ty + yy])));
    // A row of the layers panel for each step done. The bright edge is on the sheet
    // while it travels, and on the last row once it has landed.
    const done = Math.min(ROWS, 1 + Math.floor(p * ROWS));
    rows.forEach((r, k) => r.setAttribute("class", k >= done ? "nf lo" : s >= 1 && k === done - 1 ? "nf hi" : "nf"));
    sheet.classList.toggle("hi", s < 1);
  }

  const B = register(stage, (dt) => {
    const m = stepS(job, dt);
    draw(clamp(job.x, 0, 1));
    return m;
  });
  bag.add(B.unregister);

  // Where the pointer is across the window's resting face, on screen.
  const L0 = P(22, TH, H / 2), L1 = P(W - 22, TH, H / 2);
  const top = P(0, TH, H)[1] - 20, bottom = P(W, TH, 0)[1] + 20, left = P(0, TH, 0)[0] - 15, right = P(W, 0, 0)[0] + 15;
  function move([sx, sy]) {
    if (sx < left || sx > right || sy < top || sy > bottom) return leave();
    job.t = clamp((sx - L0[0]) / (L1[0] - L0[0]), 0, 1);
    read.textContent = "layer " + Math.min(ROWS, 1 + Math.floor(job.t * ROWS)) + "/" + ROWS;
    B.wake();
  }
  function leave() {
    job.t = REST;
    read.textContent = "rest";
    B.wake();
  }
  leave();

  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { OUT = v; drawn = NaN; B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "photoshop",
  means: "An editor's window: the cursor carries the design onto the phone while the layers panel fills, one row at a time, by hand.",
  rules: [1, 4, 5, 8],
  range: [4, 9, 14],
  tour: [[110, 165], [200, 165], [300, 165], null],
  mount,
});
