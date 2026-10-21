---
name: Adrián García · Portfolio
description: A product designer's portfolio built as a profile with a feed; warm graphite ink on white paper, one green dot.
colors:
  ground: "#FFFFFF"
  ink: "#272724"
  ink-2: "#5C5C57"
  ink-3: "#8C8C86"
  line: "#E8E8E5"
  fill: "#F2F2F0"
  raised: "#FFFFFF"
  live: "#2F8A4E"
typography:
  display:
    fontFamily: "Figtree, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(34px, 5vw, 52px)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Figtree, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "26px"
    fontWeight: 500
    lineHeight: 1.15
  post-title:
    fontFamily: "Figtree, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "25px"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Figtree, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.005em"
  lede:
    fontFamily: "Figtree, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.35
  body-long:
    fontFamily: "Figtree, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Figtree, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.45
  name:
    fontFamily: "Figtree, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.45
  label:
    fontFamily: "Figtree, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1
  meta:
    fontFamily: "Figtree, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
  spec:
    fontFamily: "Figtree, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0.01em"
  spec-sm:
    fontFamily: "Figtree, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0.01em"
rounded:
  focus: "4px"
  media: "6px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "48px"
  2xl: "64px"
  3xl: "88px"
  4xl: "120px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "34px"
  button-primary-hover:
    backgroundColor: "#3A3A36"
    textColor: "{colors.ground}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "34px"
  button-ghost-hover:
    backgroundColor: "{colors.fill}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.meta}"
    rounded: "{rounded.pill}"
    padding: "0 12px 0 14px"
    height: "32px"
  icon-action:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.pill}"
    size: "32px"
  icon-action-hover:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.ink}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.meta}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "28px"
  chip-filled:
    backgroundColor: "{colors.fill}"
    textColor: "{colors.ink-2}"
    typography: "{typography.meta}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "28px"
  media:
    backgroundColor: "{colors.fill}"
    rounded: "{rounded.media}"
  avatar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.pill}"
  topbar:
    backgroundColor: "transparent"
    height: "60px"
---

# Design System: Adrián García · Portfolio

## Overview

**Creative North Star: "The Captioned Feed"**

The portfolio is a profile, and the work is its feed. Every case study is a dated post: a date line, a title row that carries its own two actions (share, read), raw media, a one-idea caption and a catalogue line of role, team, duration and platform. Opening a post leads to the full case study: byline, display title, lede, a spec sheet, chapters and a link to the next post. The system exists to make that format feel like a well-made product rather than a brochure.

Everything is drawn in one warm graphite ink on pure white paper. Greys are not a separate palette; they are the same ink thinned toward the ground on the same warm hue (about 107° in OKLCH, near-zero chroma). One family, Figtree, carries the whole hierarchy at two weights: 500 for headings and names, 400 for everything else. Rank comes from size, ink tone and space. Media sits directly on the ground with a 6px corner and no frame; there are no cards and no shadows. The only colour that is not ink is a small green dot that means "available for work".

The page is wide and symmetric: the feed sits in the exact centre of a 1920px page, the profile is pinned to the bottom of the left column like a social profile, and the top bar has no surface at all, floating over the empty side columns. Density is calm and editorial: 88px between posts, tight stacks inside them, measured line lengths (62 to 64ch). Motion is small and physical on one expo-out curve; the signature moment is the media hover, where the image takes a faint veil, zooms slightly and shows a large thin arrow whose colour reads the image beneath it.

The ground (#FFFFFF), the darkest ink (#272724) and the line, fill and raised neutrals are user-chosen and binding. Figtree was chosen by the user over Instrument Sans, Inter Tight, Urbanist, Open Sans and Coolvetica.

**Key Characteristics:**
- Graphite on white: one ink (#272724) and its thinned tones on a pure white ground.
- One family (Figtree), two weights: 500 for headings and names, 400 for the rest. Never bolder.
- Raw media on the ground, 4:3, 6px corners; no cards, no shadows, no frames.
- Pills for everything you press; 1px hairlines for everything that divides.
- A single accent, the green availability dot.
- Symmetric three-column page (1920px) with the 680px feed centred; two columns under 1200px, one under 900px.
- Chrome without a surface: the top bar floats, the carousel has no controls.

## Colors

A monochrome of one warm graphite ink thinned across a pure white ground, with one functional green.

### Primary
- **Warm Graphite** (`ink`): the darkest ink and the system's only brand colour. All primary text and headings, the filled Contactar pill, avatars, the pinned marker, the 1px rules over the spec sheet and the next-post link, the copied-link tooltip, text selection, the focus outline and the media hover arrow on light images. 15:1 on the ground. Binding.

### Neutral
- **White Paper** (`ground`): the page itself and the text colour on anything ink-filled (the primary pill, avatars, the tooltip, selection). The top bar shows this ground through it, since it has no fill of its own. Binding.
- **Pencil Grey** (`ink-2`): secondary text: dates, the handle, the lede, the catalogue line, spec labels, figure captions, stats, the breadcrumb's current page, the back link, and idle icon buttons. 6.7:1 on the ground, safe for running text.
- **Faded Graphite** (`ink-3`): decoration only: the breadcrumb slash, the middots in the catalogue line, the outline-pill and link-chip hover border. 3.4:1; never readable content.
- **Hairline** (`line`): every ordinary 1px divider: chip and outline-pill borders, table-of-contents rules, the profile stats rule, the resting underline of text links. Binding.
- **Smudge** (`fill`): the quiet filled surface: hover wash on ghost buttons and icon buttons, the filled tool chips, and the empty media slot behind an image. Binding.
- **Raised Paper** (`raised`): kept equal to the ground; it is the link-chip hover background, so a chip's hover reads as a border change only. Binding.

### Tertiary
- **Available Green** (`live`): only the 7px availability dot, with a 3px halo of the same green at 15% alpha. It is a signal, not a palette colour.

### Named Rules
**The Thinned Ink Rule.** Every neutral is the ink diluted toward the ground on the same warm hue. A new grey that drifts cool or picks up chroma does not belong; derive it from `ink` and `ground`.

**The One Dot Rule.** Green appears once per screen, as the availability dot. It never becomes a button, link, highlight or chart colour. The dot is currently unplaced (the user removed the availability pill from the feed, 2026-10-20).

**The Decoration-Only Rule.** `ink-3` never carries text a reader needs. If it must be read, it is `ink-2`.

## Typography

**Font:** Figtree (Google Fonts via `next/font`, exposed as `--font-sans`), falling back to Helvetica Neue, Helvetica, Arial. There is no second family and no condensed cut; the old `--cond` variable now simply aliases the sans.

**Character:** A friendly, open geometric grotesk that keeps the page conversational and social. The 500 weight gives headings and names just enough presence on a white ground without ever turning loud.

### Hierarchy
- **Display** (500, clamp(36px, 3.6vw, 52px), 1.05, -0.03em): the case-study title, set at the exact x of the feed post title so it grows in place on open. One per page.
- **Headline** (500, clamp(26px, 2.2vw, 30px), 1.12, -0.02em): chapter headings inside a case study, and the figures in a results list. The next-post link uses the Post Title size.
- **Post Title** (500, 25px, 1.15, -0.01em): post titles in the feed (22px under 600px). Hover draws a 1px underline from the left over 0.35s.
- **Title** (500, 22px, 1.2, -0.005em): the profile bio, which is the home page's h1 (21px under 900px).
- **Lede** (400, 20px, `ink-2`): the case-study standfirst (the post caption), full column width.
- **Body Long** (400, 20px, 1.5, `ink-2`): case-study chapter paragraphs, at the 680px column measure.
- **Body** (400, 16px, 1.45): post captions (max 62ch) and the base size.
- **Name** (500, 14px): the person's name wherever it appears as an identity: top-bar breadcrumb, profile, byline.
- **Label** (400, 14px): buttons, breadcrumb trail, byline, back link, spec values.
- **Meta** (400, 13px, usually `ink-2`): dates, chips, the outline pill, stats, the table-of-contents title.
- **Spec** (400, 13px, +0.01em, `ink-2`): the catalogue line under each post and figure captions.
- **Spec Small** (400, 12px, +0.01em, `ink-2`): spec-sheet labels (Rol, Equipo, Duración, Plataforma).

Counts use tabular figures. Headings and names balance their wrap; paragraphs use pretty wrapping.

### Named Rules
**The Two Weights Rule.** Weight 500 is for headings and the person's name; 400 is for everything else. Nothing is set heavier than 500, and emphasis inside text comes from `ink` against `ink-2`, not from weight.

**The Catalogue Voice Rule.** Facts about the work (role, team, duration, platform, figure captions) are set small (12 to 13px) in `ink-2` with +0.01em tracking, separated by `ink-3` middots in a line or by a full-ink rule in the spec sheet. That is the only change of voice the type makes.

**The No Measure Cap Rule.** No text block carries its own max-width (user rule, 2026-10-20). Text fills its grid column; its width is set by the column (the centre column: 680px on the feed, up to 1120px on the case study), never by a max-width on the element.

**The Sentence Case Rule.** Labels and headings are sentence case. No uppercase, no tracked-out small labels.

## Layout

A wide, symmetric three-column page: max 1920px, 40px side gutters, the same 40px above the top bar's pill and under the pinned side columns, so the four edges match (the page scrollbar is hidden: its 10px made the right edge read wider; scrolling is unchanged) (2026-10-20, user request; the content reaches toward the screen edges, and 96px was tried and rejected as too much margin), 48px top padding, 48px column gaps. The columns are `minmax(280px, 1fr) | minmax(0, 680px) | minmax(280px, 1fr)`, so the 680px feed sits in the exact centre of the page and the two side columns are equal. The left column holds the aside (max 300px wide). On the feed the right column holds one line, pinned to the bottom like the profile and on the baseline of its last link: "Based in Valencia, Spain" in `faint` at body size (2026-10-20, user request; no local time, at their request). A post index and an availability pill were tried there and removed. Under 1200px, with no right column, the line moves into the profile, above the links.

The aside is sticky. The case study is centred like the feed but much wider (2026-10-20, user choices: centred at 680px, then "more width" twice): its grid is `minmax(160px, 1fr) | minmax(0, 1120px) | minmax(160px, 1fr)`, so the centre column is 944px at 1440 and 1120px from about 1600, with the section index on the left (it just fits in 160px) and an equally wide empty column on the right. Above 1200px the case-study breadcrumb shows only the name, capped at 160px so it never reaches the content; the post title is right below, at display size. Under 1200px it falls back to the feed's 280px | fluid layout. The title no longer opens at exactly the feed post's x; the curtain still carries the move. Text always sits under its heading, never beside it (user decision, 2026-10-20), 24px apart, across the full column; images, the hero (3:2) and figure rows take the same column. Only a gallery strip (when its items are images, not figures) still runs past the right edge of the screen so its last image is cut. In the header the lede comes under the title and the spec under the lede, in a wrapping row, as the feed post stacks caption then catalogue line. The left column holds a sticky aside one block below the bar (level with the title) with an "All posts" back link and a section index. The feed's right column holds only the location line. Feed media is 4:3, and the post foot is always stacked: the caption on the left across the full width, then the catalogue line under it (user decision; no split, no measure cap). On the home feed the aside is a full-height sticky column (viewport height minus the bar) that pushes the profile to the bottom, 40px above the viewport edge (the same as the side gutter, user request), like a social profile anchored under the feed. With content in the centre column on both pages, the top bar stays sticky on both above 1200px. Its breadcrumb is capped at 280px so it never reaches the centre column.

The top bar has no background and no border. Above 1200px it is sticky and floats over the empty top of the side columns (the bar itself ignores pointer events; only its contents take clicks). At 1200px and below, where content reaches the edges, it is no longer sticky and scrolls away with the page.

Vertical rhythm is set by section distance: 96px between posts and between case-study chapters, the contact block and the next-post link (64px under 900px); 48px from a chapter's text to its figure, list or stats, and above the spec and the hero; 24px from title to lede; 16px between paragraphs; 8px from a figure to its caption; 4px label to value. There is no footer (removed 2026-10-21, user request: no copyright line, no "Back to top"): the centre column ends one gutter above the page's bottom edge (40px, 16px on mobile), the same as the sides, and the single-post landing fits the viewport without scrolling.

**Responsive:**
- 1200px and below: two columns, a fixed 280px aside and a fluid main column (the feed and its media grow to fill it); the top bar stops sticking.
- 900px and below: one column, 24px gutters, 24px top padding. The profile breathes (2026-10-21, user request): bio 24px under the name at clamp(26px, 7.4vw, 32px), 1.2 line height, -0.02em, 32px to the tools, 32px to the location, links 12px under it, and 64px from the profile to the feed. The home aside stops sticking and becomes the profile header, stacked (2026-10-21, user request): 24px more air under the top bar, the 64px avatar, the name 16px under it at the bio's size (clamp(26px, 7.4vw, 32px), `faint`), the bio 8px under the name, the tools 24px below, then the links 24px below (no location line here). The case-study aside (back link and index) is hidden; the name in the top bar leads home. Top bar 56px.
- 600px and below: Copiar email and CV leave the top bar, as does the breadcrumb trail, leaving the name and the Contactar pill. Feed cards drop the caption (only the catalogue line stays under the media) and keep the case-study link on the right of the title, on its last line, shortened to "Ver ↗" / "View ↗" so the title keeps two lines (2026-10-21, user request). The spec sheet goes from four columns to two.
- `hover: none` hides the media hover arrow.

Media is 3:2 when it spans the full content width (the case-study hero and figures) and 4:3 elsewhere (feed posts in the 680px column, gallery strips; the narrow stacked layouts keep the same ratios). Carousels are native horizontal scroll-snap tracks.

## Elevation & Depth

The system is flat: there are no shadows anywhere. Depth is conveyed only by tone (the `fill` wash on hover and behind media) and by 1px hairlines. Even the top bar has no surface or divider; it floats. The only box-shadow in the build is the availability dot's 3px halo, which is a glow on a signal, not elevation.

### Named Rules
**The No Shadow Rule.** Posts, media, lists, the top bar and controls sit directly on the ground with no shadow and no card. Separation is a hairline or a change of tone.

## Shapes

Two corner families plus circles. Everything pressable is a full pill (999px): buttons, the outline pill, chips, the skip link. Circles for avatars and icon buttons. Media, carousel tracks and the copied-link tooltip get a soft 6px corner; slides inside a track are square so the track clips them. The focus outline is 2px ink, offset 3px, 4px radius.

Dividers are always 1px: `line` for ordinary separation, full `ink` for the two structural rules (top of the spec sheet, top of the next-post link). Icons are custom line drawings on a 20px grid with round caps and joins in `currentColor`: 1.5px stroke by default, thinned to 1.1px on the share button and 1.25px on the large 44px media arrow.

## Components

### Buttons
Quiet pills; only one is ever filled.
- **Shape:** full pill (999px), 34px tall, 14px horizontal padding, 6px icon gap, Label type.
- **Primary:** Warm Graphite fill with White Paper text. Only Contactar, always visible in the top bar; a click copies the email and the label reads "Copiado" for 1.8s (mailto only if the clipboard is refused). Hover deepens the fill.
- **Ghost:** transparent, ink text; hover washes to `fill` (Copiar email, CV in the top bar).
- **Outline:** 32px, 1px `line` border, Meta type, a trailing right arrow; hover darkens the border to `ink-3` and slides the arrow 2px right. It is the "Leer case study" pill on every feed post.
- **Pressed:** any button scales to 0.97 on the expo curve.
- **Feedback:** Copiar email swaps its icon and label to a check and "Copiado" for 1.8s.

### Icon Button
A 32px circle in `ink-2` holding a thin 20px line icon; hover washes to `fill` and darkens to ink. Currently unplaced: Compartir was removed from the feed posts and from the top of the case study (2026-10-20, user request), so the case-study header opens directly on the title. Click copies the post link (native share sheet on coarse pointers); the icon becomes a check and a small ink tooltip ("Enlace copiado", 12px, 6px corner) rises 4px into place above it for 1.8s.

### Chips
- **Link chip:** transparent with a 1px `line` border, 28px tall, 10px padding, Meta type, trailing up-right arrow in `ink-2`. Hover darkens the border to `ink-3`. The availability chip leads with the green dot.
- **Filled chip:** `fill` background, no border, `ink-2` text, not interactive (the tools list).

### Feed Post
No card: a stack on the ground. A Meta date line in `ink-2` (preceded by an ink "Fijado" with a pin icon on the pinned post); a title row with the Post Title on the left and the icon button plus outline pill on the right; the media; a Body caption (max 62ch); the catalogue line. Posts are ordered pinned first, then newest.

### Media
4:3, 6px corner, `fill` background, image cover-fit, no border or frame. Linked media is the signature hover: an ink veil fades in to 6% over 0.3s, the image zooms to 1.02 over 0.6s, and a 44px thin up-right arrow eases in at the bottom-right corner (16px inset) from a 6px diagonal offset. The arrow is ink on light images and white on dark ones; the image's bottom-right quarter is measured on load and marked `data-bg`, or a post can set it explicitly. Hidden on touch.

Until real work exists, the media slot renders drawn wireframes (phones, flows, a desktop, components) in three warm tones. They are placeholder content, not part of the system.

### Carousel
A native scroll-snap track of full-width 4:3 slides with a 6px corner and a hidden scrollbar. No dots, no arrows, no counter: it is swiped, trackpad-scrolled or keyboard-scrolled (the track is focusable), and each slide carries the same hover as single media in the feed.

### Spec Sheet
The facts under a case-study lede: Role and (when the product is live) Website (Team was removed at the user's request), in a wrapping row, each item as wide as its value, 48px apart (24px under 600px), so a long role never breaks. Each cell is a `faint` label over an ink value at body size, with no rule. The website value takes the post-title underline on hover. In the feed the same data collapses to one `faint` line separated by middots.

### Case-study chapter
One chapter per section: a sentence-long Headline; under it `ink-2` paragraphs, points and results; figures below, all across the centre column. Points and results are hairline lists (1px `line` rows, 16px padding, no cards): a point is an ink title over `ink-2` text; a result is the figure at Headline size on the left third with its `faint` label on the same baseline. Figures are raw media (3:2, full width to the right gutter) with the alt text as a `faint` caption; a gallery is a horizontal strip of 4:3 figures (min(560px, 78%) each, 16px apart) bleeding off the right edge of the viewport, native scroll-snap, focusable, no controls, like the carousel. No centred text, no grid backdrops, no stat tiles.

### Product stage
A media slot can hold a staged scene instead of an image (`media.stage`): a full-bleed background photo in black and white, the product's web recording in a browser window bleeding off the left edge (80% of the scene's height, the same as the phone, ending at 62%, 0.9cqw corners), as the hero's window does and the phone recording in front on the right (80% of the height, just the screen: no bezel, no status bar, which is cropped out of the video, 1.4cqw corners; the user does not want it to read as an iPhone), both vertically centred. The two never touch: a clear gap of about 4.7cqw separates them (user rule). No shadows on either. Everything is sized in `cqw` of the scene so it composes the same at every width. Videos are muted, looping, inline, and only play while the scene is a quarter on screen; with reduced motion they hold their poster frame. Mockp's gallery uses it. A scene can also hold the web recording alone (`phone` omitted, class `solo`): the window is then centred at the same 80% height, with its own aspect ratio from the clip (`ratio`). Mockp's editor chapter uses it with the full 42.7s editor recording (placing a design on a laptop, then recolouring the sofa) over a cloud photo. A solo window is large and low (2026-10-20, user request): 86% of the scene's width, its top at 17%, so the scene's bottom edge cuts it. Every stage background is black and white with whites held near 85%. The gallery's sits in a soft light-grey range with lifted blacks (average luminance about 187 of 255, darkest about 155). The editor's is a touch darker than the gallery's (darkest about 135, median 143, 2026-10-21 user request), still with lifted blacks. The editor's uses the lower part of the cloud photo, so the strip above the window shows the left cloud column and the ragged band rather than the top puff.

### Hairline figures
When a chapter's points have a `figure`, they leave the reading column and become a full-width row of three: each a Hairline figure (github.com/lucasmarkes/hairline, MIT; isometric line drawings that answer the pointer), then the point's ink title and `ink-2` text; one column under 600px. Figures sit on a `fill` panel with the 6px media corner and are recoloured from the ink (`--hairline-plate` = `fill`, `hi` = `ink`, `edge` #a6a6a0, `mid` #c6c6c0, `lo` #d9d9d4, stroke 1). While on screen they walk their own tour; a real pointer takes over. The engine and each figure live untouched in `public/hairline/` as the `hairline-create` skill produced them, and `components/Hairline.tsx` mounts them. The same row carries a chapter's figured `stats` (the figure, the value at Headline size in ink, its label in `ink-2`) and a `gallery` whose items all name a `figure` (the figure, then the step's caption in ink). Mockp uses three rows, so the case study argues in figures from problem to result:
- Problem: `copies` (a tray of identical mockup cards), `photoshop` (an editor window seen from the front, `Cam(0, 0.14)`, at the user's request: title bar, tool column, canvas and layers panel; the pointer across it scrubs the job through a spring: a cursor lifts the design off the canvas in an arc and presses it onto a phone while the layers panel fills row by row; "una simulación de la interfaz de Photoshop y el mouse haciendo un mockup", 2026-10-21), `puzzle` (two ordinary jigsaw pieces, a knob of one facing a hole of the other that sits slightly off; the piece under the pointer squares up, lifts and pushes in, and the knob lands on the edge instead of the hole; "literalmente 2 piezas normales que intenten encajar", 2026-10-21). The cursor in `photoshop` is drawn in the screen's plane, an exception to Hairline's no-icons rule asked for by the user.
- How it works: the recording, then its chapters (2026-10-21, user requests: a new screen recording instead of the Hairline `pipeline` figure; no background; "sin checks, solo los títulos como el nav de la izq", placed below). `chroma-web.mp4` (import a template, its chroma screen detected, settings, Publish) alone across the column: the browser window as recorded minus its tab bar, the black outside its rounded bottom corners painted over with the background in the video itself, and the 6px media corner in CSS; it plays only while a quarter on screen. Under it (24px), the chapter titles one per line (`components/Steps.tsx`), descriptive since they stand alone, set like the section index: Post Title size, weight 500, `faint`, the one playing and hover in ink. Each title seeks the video to its chapter (`at`: 0 s, 17 s, 29.5 s; the first starts at 0 so one is always lit). `public/hairline/pipeline.js`, `scan`, `seat` and `drawers` stay in `public/hairline/` unused.
- Results: no figures and no charts (the simulated before/after line charts and their estimated "before" numbers were removed, 2026-10-21, user request: "las gráficas son feas"). Instead a real-time race (`components/Race.tsx`, styles in `Race.module.css`), the chapter's one authored moment, on the same `fill` panel and 6px corner: a stopwatch at clamp(64px, 9vw, 96px), weight 400, -0.04em, tabular, ink (the one numeral allowed above the display size, because it is the result itself), then two lanes, each a name in ink and a status in `ink-2` over a 2px track (`#d9d9d4`) with a fill bar: Mockp in ink, Photoshop in `#a6a6a0`. Both start when the panel is 60% on screen and pause off screen. Mockp's bar fills in 10 real seconds while its status counts; at 10 s everything stops (2026-10-21, user request): the stopwatch holds 0:10,0, the status dissolves (4px blur, 0.45s) into "Listo en 10 s" and a 20px line check (1.5px, round caps) draws itself in front of it (stroke-dashoffset, 0.6s, 0.2s delay). Photoshop's bar has only crawled to 10/240 of its track (an internal scale that is never shown) under "Varios minutos", the user's own words, so no invented figure appears. A faint "Repetir" text action fades in at the top right once Mockp is done. A `faint` caption under the panel says both clocks run in real time. Reduced motion shows the finished state. Decimal comma in Spanish, point in English.
The six custom figures were drawn with the `hairline-create` skill (installed in `~/.claude/skills/`) and passed its validator and look.

### Navigation
- **Top bar:** feed only (the case study has none since 2026-10-20, user request: it starts one gutter from the top, and on phones "Back" and EN / ES sit in a row at the top so there is always a way home). No fill, no border, content max 1920px. Its height is the gutter plus the 38px button (`--bar`, 78px desktop, 54px mobile), so the Contact pill sits exactly one gutter from the top edge, as it does from the right (2026-10-20, user rule: the same margin on every side). The pinned side columns hang from `--bar`. Left, on the case study only: 26px avatar, the name, an `ink-3` slash and the current page in `ink-2` (truncates; hidden under 600px). The feed's bar carries no breadcrumb (2026-10-20, user request): the profile already says who this is, so only the actions remain, on the right. Right: ghost pills and the primary Contactar pill, always visible. Sticky only above 1200px.
- **Profile:** 64px ink avatar, Name plus `ink-2` handle, the Title-size bio, link chips, filled tool chips, then a hairline and a Meta stats line ("4 publicaciones").
- **Copy email:** the address as plain text (hello.adrian.gar@gmail.com, `faint`, ink on hover). Over it the cursor *is* the action (2026-10-20, user request: "que el cursor sea el copy"; a rolling text and a split-flap board were rejected as basic and as ugly): the system cursor hides and a small ink pill (14px text, 32px tall like every pill in the system, 14px side padding, full round, white text) centred on the pointer says "Copy", growing in from half size over 0.3s; on click the pill dips (scale 0.86, overshoot 1.04, 0.42s), widens smoothly to fit the new word (0.45s, expo-out), "Copy" slides up and out while "Copied" rises from below out of a 2px blur (no check: the user removed it); after 1.8s it reverses to "Copy" (2026-10-20, user request to improve the transition). The pill is portalled to `<body>` so transformed ancestors cannot offset it. Mouse only: on touch the address is simply tapped to copy. Screen readers get "Copy email address, <address>" and a polite "Email address copied". Used in the top bar and the case-study contact section.
- **Language switch (EN / ES):** in the left column of both pages (2026-10-20, user request), set like the location line (body size, `faint`, the active language in ink, hover ink, a `faint` slash between). On the feed it sits in the top-left corner, in the top bar's left slot, one gutter from the top and left edges, mirroring the location line one gutter from the bottom and right. On the case study it sits in the top-right corner of the right column, one gutter from both edges (2026-10-21, user request); under 1200px, with no right column, it moves next to "All posts"/"Volver". The case study's bottom-right corner holds the project's URL ("mockp.com ↗", body size, `faint`, ink on hover) once the reader has scrolled 240px: it rises 8px and fades in over 0.45s, and leaves again near the top (only for posts with a live `site`; hidden under 1200px). The choice is stored in a `lang` cookie and the page re-renders on the server already translated (`router.refresh`), so there is no flash of the other language; `<html lang>` follows. Interface strings live in `lib/i18n.ts` (`ui.en`, `ui.es`); post content is translated through an English → Spanish table in `lib/posts.es.ts`, applied to the text fields of each post (`localize`), and any string missing from the table stays in English. Switching language is a crossfade, a blend of the two languages (2026-10-21, after several user rounds: an ASCII decode, then a fade with an exit, then "sin momento de blanco", "menos movimiento vertical", and finally "demasiado rápido, más como fusión"). Only visible text that differs in the target language takes part (matched against the translation tables by direction, so "Web", "iOS", the name, the tools and the email never move). On click each such element leaves an exact fixed-position copy of itself on a ghost layer (same box, font, colour, wrapping), and the translation is requested at once. When it lands, before paint, the ghost (old text) fades to 0 into a 5px blur while the element (new text) comes from 0 and a 5px blur to sharp, both over 720ms on `cubic-bezier(0.45, 0, 0.2, 1)`: no vertical travel, no gap, the two versions overlap for a moment. Where the translation reflows a block, the old text dissolves where it was and the new one resolves where it now sits. Reduced motion switches instantly (`components/LangTransition.tsx`).
- **Section index (case-study aside):** set like the profile name on the feed (Post Title size, 25px, weight 500, one step above body text, 2026-10-21 user request, 1.15, -0.01em, `faint`): the "All posts" back link with a left arrow at the top, level with the title, and one link per chapter (its short `title`) anchored to the bottom of the viewport, 40px above the edge (the side gutter), as the feed's profile is. The column is a full-height sticky flex column (viewport minus 60px). The chapter being read (top above 40% of the viewport) turns ink and carries `aria-current="location"`; hover also turns ink. Hidden under 900px.
- **Back link:** 14px `ink-2` with a left arrow, hover to ink.
- **Case-study close (contact):** no rule above (the user removed it), "Hablemos" at Post Title size in `faint`, then the email address as the headline, weight 500, -0.035em, sized to fill the column (`min(8.5cqi, 104px)`, the section is an inline-size container), copied on click with the Copy cursor pill and underlined from the left on hover; under it a `faint` row with the sentence on the left and "Enviar un email ↗" (text link) on the right (2026-10-21, user request: "más estético"; the filled pill was removed).
- **Next post:** after the contact block, a `faint` "Next" over the next title at Post Title size; hover draws the post-title underline and slides the arrow 4px.
- **Text links:** underline in `line`, 3px offset, darkening to `currentColor` on hover.
- **Skip link:** an ink pill that slides down from the top-left on focus.

### Motion
One curve: `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out), with one exception below. Colour and background changes 150ms; small transforms 200 to 400ms; media zoom 600ms. Reduced motion collapses all animation and transition durations to near zero and turns off smooth scrolling.

**The Curtain (page transition).** The system's one authored moment. Opening a case study from the feed (title, Case study pill, media, next-post link) runs a View Transition: both pages exist at once and the new one is uncovered by a clean horizontal edge rising from the bottom of the viewport (`clip-path` on `::view-transition-new(root)`, 0.95s). Going back to the feed (the name in the top bar) is the same move reversed, at the same speed: the case study stays on top and its top edge sinks until the feed is uncovered. The edge carries nothing: no line, no shadow, no veil. It is the only place the curve `--ease-curtain: cubic-bezier(0.22, 0.61, 0.36, 1)` is allowed: it moves from the first frame and lands softly (the user rejected a strong in-out and any felt delay).

The whole stack moves one way: up on open, down on close, always by `--reveal-d` (56px; the user asked for less travel at the same timing). On open, the feed's centre column (the only part that scrolls; profile and top bar hold still) lifts into its own layer and rises out under the edge, while the arriving case-study column rises into place (1.15s, expo-out) and every image box in the case study (hero, figures, the stage), frame and all, rises with it from 84px below (1.5 × `--reveal-d`, 1.6s, expo-out, no delay); the photo itself does not move inside its frame (2026-10-20, user request: more travel and the whole container moving, not the picture inside; a 0.18s delay was tried and removed). On close, the hero lifts into its own layer and sinks with the edge, while the arriving feed column comes down into place (1.15s) and each post image settles in its frame from `translateY(-3%) scale(1.06)`, sliding down with the column (1.45s): the drift always follows the curtain's direction. Leaving layers share the curtain's curve and duration, so their clip, measured from their on-screen position at click, is linear in progress and tracks the edge to the pixel. Arriving pages are live views, so their parallax plays inside the wipe; it is keyed to its own `data-reveal` attribute because it outlasts the curtain. Browser back/forward and browsers without View Transitions navigate instantly. Reduced motion swaps all of it for a 200ms crossfade.

## Do's and Don'ts

### Do:
- **Do** build every grey from the ink and ground on the same warm hue (The Thinned Ink Rule); keep `ink-2` as the lightest colour for readable text.
- **Do** set headings and names in Figtree 500 and everything else in 400; rank by size, `ink`/`ink-2` tone and space.
- **Do** keep the feed centred in the 1920px page with equal side columns, and the home profile anchored to the bottom of the viewport.
- **Do** make anything pressable a full pill (999px) or a circle, and anything that divides a 1px hairline.
- **Do** place media raw on the ground at 4:3 with a 6px corner, and give linked media the veil, 1.02 zoom and background-aware arrow on hover.
- **Do** keep the Contactar primary pill visible in the top bar at every width.
- **Do** use the expo-out curve for all motion and respect reduced motion.
- **Do** draw icons as round-capped line drawings on a 20px grid in `currentColor`.

### Don't:
- **Don't** change the ground (#FFFFFF), the darkest ink (#272724) or the line, fill and raised neutrals; they are binding.
- **Don't** wrap posts, media or lists in cards, borders or shadows, and don't give the top bar a fill or a divider.
- **Don't** introduce a second accent. Green is only the availability dot.
- **Don't** set type heavier than 500, in uppercase, or as letter-spaced small labels.
- **Don't** add a second typeface or a condensed cut; Figtree carries everything.
- **Don't** put readable text in `ink-3`.
- **Don't** add dots, arrows or counters to the carousel.
- **Don't** add engagement counts or reaction buttons to posts; a post's only actions are share and read.

## Content

The portfolio shows a single case study, Mockp (2026-10-21, user request): the three placeholder example posts (design system, fleet operations, booking) were removed, so the feed holds one post and the case study has no "next" link.
