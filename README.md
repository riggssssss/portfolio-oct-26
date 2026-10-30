# Adrián García · Portfolio

Hi! 👋 This is the code behind my personal portfolio. I'm a product designer, and I design digital products people understand at first glance and use without thinking.

The site is deliberately quiet: a single feed, generous white space and one case study told in depth, [Mockp](https://mockp.com), a free gallery of mockups with an editor that places your design in seconds.

## What's inside

- **A feed and a case study.** The landing reads like a social profile, with me on the left and the work in the centre. The case study has a sticky section index, staged screen recordings and simulated before/after charts.
- **English and Spanish.** The language switch re-renders the page on the server, so there's no flash of the wrong language. The change itself is a soft crossfade on the texts that actually change.
- **Hairline figures.** The little isometric line drawings that react to your pointer (the matchbox, the drawers, the scanner…) are built on [Hairline](https://github.com/lucasmarkes/hairline).
- **Small details.** Smooth scrolling with Lenis, a page curtain between routes, a cursor that turns into "Copy" over my email, and support for reduced motion throughout.

## Built with

- [Next.js 16](https://nextjs.org) (App Router) and React 19
- TypeScript
- [Lenis](https://github.com/darkroomengineering/lenis) for smooth scrolling
- [Figtree](https://fonts.google.com/specimen/Figtree) for all the type
- Plain CSS: one global stylesheet, plus CSS Modules where a component needs its own styles

## Whatch it live

Open [http://adriangarcia.space](http://adriangarcia.space).

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server with hot reload |
| `npm run build` | Makes a production build |
| `npm run start` | Serves the production build |

## Where things live

```
app/                 routes: the feed, /posts/[slug], not-found, global styles
components/          UI pieces: shell, media stages, charts, language switch…
lib/posts.ts         the case studies' content, in English
lib/posts.es.ts      English → Spanish table for that content
lib/i18n.ts          interface strings in both languages
lib/site.ts          name, email, links and tools
public/hairline/     the Hairline engine and each figure
public/img/          images, recordings and stage backgrounds
DESIGN.md            the design system: tokens, layout rules and the reasoning behind them
```

To add or edit a case study, start with `lib/posts.ts`, then add the translations to `lib/posts.es.ts`. Any string missing from the table simply stays in English.

## Credits

- Interactive figures: [Hairline](https://github.com/lucasmarkes/hairline) by Lucas Markes, under the MIT licence (see `public/hairline/LICENSE.txt`).
- Stage background photos: [Unsplash](https://unsplash.com), by Tom Frances Palattao and Kevin Grieve.

## Say hi

I'm always happy to chat about product, design or a role you have in mind: **hello.adrian.gar@gmail.com**

---

The code is here for anyone curious to look around. The content (texts, images and the Mockp case study) is mine, so please don't reuse it as your own. 🙏
