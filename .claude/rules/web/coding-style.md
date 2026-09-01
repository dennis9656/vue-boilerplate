> This file extends [common/coding-style.md](../common/coding-style.md) with web-specific frontend content.
> Directory layout and Vue-specific naming are in [vue-spa/coding-style.md](../vue-spa/coding-style.md).

# Web Coding Style

## File Organization

Organize by domain, not by file type. The concrete directory tree and the placement table are in
[vue-spa/coding-style.md](../vue-spa/coding-style.md).

Relative imports are for siblings inside one domain only. Anything crossing a directory uses the
project's source alias (`@/` by convention); three or more `../` levels is a violation.

### When to split a file

**Line count is not the criterion.** Code serving one concern stays in one file however long it gets. Split on one of three signals:

| Signal | Move what, where |
|---|---|
| Another module needs only this piece | that piece to its own file — types are the common case |
| It owns its own state and lifecycle | extract a composable (timers, retry queues, state machines) |
| It is another domain's concern | into that `features/{domain}/`, then call it |

The first is the strongest signal.

A file being long, a function that might be reused later, or a structure that "looks cleaner" are not reasons to split. The practical test is **"are there two different reasons to edit this file?"**

## CSS Custom Properties

On a Tailwind v4 project there is no `tailwind.config.js` — tokens live in CSS. Reach for a custom property when Tailwind's utilities cannot express the value (fluid `clamp()` scales, easing curves, keyframes); do not mirror the utility scale into variables just to have variables.

Define design tokens as variables. Do not hardcode palette, typography, or spacing repeatedly:

```css
:root {
  --color-surface: oklch(98% 0 0);
  --color-text: oklch(18% 0 0);
  --color-accent: oklch(68% 0.21 250);

  --text-base: clamp(1rem, 0.92rem + 0.4vw, 1.125rem);
  --text-hero: clamp(3rem, 1rem + 7vw, 8rem);

  --space-section: clamp(4rem, 3rem + 5vw, 10rem);

  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}
```

## Animation-Only Properties

Prefer compositor-friendly motion:
- `transform`
- `opacity`
- `clip-path`
- `filter` (sparingly)

Avoid animating layout-bound properties:
- `width`
- `height`
- `top`
- `left`
- `margin`
- `padding`
- `border`
- `font-size`

## Semantic HTML First

```html
<header>
  <nav aria-label="Main navigation">...</nav>
</header>
<main>
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">...</h1>
  </section>
</main>
<footer>...</footer>
```

Do not reach for generic wrapper `div` stacks when a semantic element exists.

## Naming

Examples use `sample` as the domain name — read it as yours. The casing rule is what this table
fixes; the extension (`.vue`, `.ts`) follows from what the file is.

| Target | Rule | Example |
|---|---|---|
| Component files | PascalCase | `SampleCard` |
| `components/icons/{group}/` | PascalCase + `Icon` suffix, under a usage folder | `shell/HomeIcon` |
| `public/icons/{group}/` | kebab-case, under a group folder | `shell/nav-home.svg` |
| Composables | `use` + camelCase | `useSampleList` |
| API functions | verb + noun | `getSamples()`, `createSample()` |
| Types | PascalCase | `Sample`, `SampleListResponse` |
| Global constants | UPPER_SNAKE_CASE | `COOKIE_ACCESS_TOKEN` |
| Component-local constants | camelCase | `statusOptions` |
| CSS classes | kebab-case or utility classes | |
| Animation timelines | camelCase with intent | `heroRevealTl` |

Vue-specific rows (single-file components, views, stores) are in [vue-spa/coding-style.md](../vue-spa/coding-style.md).

### Icons: components by default

**Icons are components under `components/icons/`.** Do not point at `public/` with a filename string — a typo passes the build and the icon silently disappears at runtime. With a component the broken import fails the build.

What that buys you:

- `fill="currentColor"` makes the caller's `text-*` apply directly. No separate `opacity` layer for state, and the label and the icon end up with one color source instead of two that can drift apart.
- Size comes from the class attribute. Drop the `width`/`height` attributes.
- Icons are decorative: `aria-hidden="true"` + `focusable="false"`. The accessible name belongs to the wrapping button or link.

**Group them by where they are used** — do not pile files directly under `components/icons/`. Past twenty, the name alone no longer tells you where an icon is used, or whether it is safe to delete.

```text
components/icons/
├── shell/      # sidebar and header — what the app shell always draws
├── content/    # overlaid on content cards and thumbnails
├── state/      # loading and error indicators (spinners, error illustrations)
└── control/    # generic controls, independent of any screen (close, back, expand)
```

Split by **where it is used**, not by what it depicts. If a new icon fits nowhere, add a folder — forcing it into an existing one blurs what that folder means.

**Keep it as an asset (`public/icons/{group}/`) only when both hold:**

1. it is larger than roughly 10KB gzipped, and
2. it is not rendered on every screen — error and empty-state illustrations, used occasionally.

Both are required. An always-rendered icon is fetched every time anyway, so moving it out of the bundle buys nothing; and splitting on size alone pushes things like header icons into `public/` for no reason. When it is a close call, **measure** (`gzip -c file.svg | wc -c`).

**Never retype path data by hand.** Take the Figma export as-is — hand-edited coordinates drift from the source, and nobody notices the drift. Convert assets to components with a script, and when the source changes, replace the whole file.

**Sizing**: an icon set is drawn inside a frame with padding, so the glyph is smaller than its slot by a fixed ratio. Record that ratio in the project's `AGENTS.md` and apply it everywhere — an icon that fills its slot looks oversized next to every other icon that does not.

```yaml
# AGENTS.md
icon-glyph-ratio: 0.72   # e.g. a 100×100 frame with a 72px maximum → 34.56px in a 48px slot
```

The ratio comes from the design system, not from this file. An unrecorded ratio means each icon is sized by whoever added it, and the set drifts.
