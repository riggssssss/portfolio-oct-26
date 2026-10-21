/**
 * Seat: your design, a thin sheet, hovers above a phone's screen. The
 * pointer's height brings it down on a spring; as it falls its shadow on the
 * glass draws in under it, and when it seats, flush with the screen, the
 * glass shows its glare. At rest it hovers and the empty screen holds the
 * bright edge: that is where it goes. The slider is how high it hovers.
 *
 * The pointer is read only as a height in the viewBox, never against what is
 * drawn, so the sheet moving cannot move the answer.
 */
const { Cam, clamp, extremes, facing, fit, poly, prism, proj, ringAt, rings, rrect, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const PW = 66, PL = 128, ZB = 8;
const SX0 = 6, SY0 = 12, SX1 = 60, SY1 = 116, SINK = -1.4, TK = 1.6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let HMAX = value, over = null;
  const h = spring(HMAX * 0.55, { eps: 0.02 });
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, 0, 0], [PW, PL, 0], [PW, 0, 0], [0, PL, 0], [SX0, SY0, ZB + 66 + TK], [SX1, SY0, ZB + 66 + TK]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // The phone, lying flat; its screen; the camera.
  const [pr, pi] = rings(0, 0, PW, PL, 12, 1.8);
  put(solid(g), prism(P, front, pr, pi, 0, ZB));
  const screen = rrect(SX0, SY0, SX1, SY1, 6, 4);
  const recess = mk("path", { d: poly(ringAt(P, screen, ZB)), class: "nf" }, g);
  mk("path", { d: seg(P(PW / 2 - 7, 6, ZB), P(PW / 2 + 7, 6, ZB)), class: "nf lo" }, g);
  // The sheet's shadow on the glass, and the dashed drops from the sheet.
  const shadow = mk("path", { class: "nf lo" }, g);
  const guides = mk("path", { class: "nf dash" }, g);
  // The sheet: your design, with a header, an image and two lines of text.
  const [shr, shi] = rings(SX0, SY0, SX1, SY1, 6, 1);
  const ext = extremes(P, shr);
  const sheet = solid(g);
  const marks = mk("path", { class: "nf" }, sheet.g);
  const glare = mk("path", { class: "nf lo" }, sheet.g);
  const pic = rrect(SX0 + 7, SY0 + 22, SX1 - 7, SY0 + 62, 4, 3);

  let drawn = NaN;
  function draw(z) {
    if (z === drawn) return;
    drawn = z;
    const z0 = ZB + z, zt = z0 + TK, off = Math.min(5, Math.max(0, z) * 0.12);
    put(sheet, prism(P, front, shr, shi, z0, zt));
    marks.setAttribute("d",
      seg(P(SX0 + 7, SY0 + 10, zt), P(SX0 + 30, SY0 + 10, zt)) + poly(ringAt(P, pic, zt)) +
      seg(P(SX0 + 7, SY0 + 72, zt), P(SX1 - 9, SY0 + 72, zt)) + seg(P(SX0 + 7, SY0 + 80, zt), P(SX1 - 20, SY0 + 80, zt)));
    shadow.setAttribute("d", z > 0.5 ? poly(screen.map((q) => P(q.u + off, q.v + off, ZB))) : "");
    guides.setAttribute("d", z > 0.5 ? ext.map((q) => seg(P(q.u, q.v, z0), P(q.u, q.v, ZB))).join("") : "");
    // Seated, flush with the screen: the glass shows its glare.
    glare.setAttribute("d", z < 0.6 ? seg(P(SX0 + 8, SY1 - 30, zt), P(SX1 - 10, SY0 + 34, zt)) + seg(P(SX0 + 18, SY1 - 14, zt), P(SX1 - 8, SY0 + 58, zt)) : "");
  }

  const B = register(stage, (dt) => { const m = stepS(h, dt); draw(h.x); return m; });
  bag.add(B.unregister);

  function retarget() {
    h.t = over === null ? HMAX * 0.55 : SINK + (HMAX - SINK) * clamp((236 - over) / 170, 0, 1);
    // At rest the empty screen holds the bright edge; once the pointer moves the sheet, the sheet does.
    recess.classList.toggle("hi", over === null);
    sheet.sil.classList.toggle("hi", over !== null);
    read.textContent = over === null ? "rest" : h.t < 0.6 ? "seated" : "gap " + Math.round(h.t);
    B.wake();
  }
  retarget();

  bag.add(pointer(stage, { move: (p) => { over = p[1]; retarget(); }, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { HMAX = v; retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "seat",
  means: "Your design hovers over a phone's screen and comes down into it; seated, it takes the glass's light and shadow.",
  rules: [1, 3, 5, 6],
  range: [36, 52, 66],
  tour: [[200, 90], [200, 170], [200, 250], null],
  mount,
});
