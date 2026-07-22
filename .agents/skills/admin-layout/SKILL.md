---
name: admin-layout
description: Use for SmartElec admin UI layout tasks, including page spacing, full-width admin screens, responsive layout, dashboard/form/workspace layout, shell alignment, KPI grid layout, section structure, and light/dark visual consistency. Do not use for tiny one-line edits; use patch-only instead.
---

# SmartElec Admin Layout Skill

Use this skill when the task is about SmartElec admin UI layout.

This skill is for:

* admin page layout;
* full-width screen structure;
* dashboard/workspace layout;
* KPI grid layout;
* filter/header/action area layout;
* page spacing;
* responsive layout;
* light/dark theme visual consistency;
* reducing excessive nested cards;
* making admin screens look production-ready.

Do not use this skill for:

* deleting one tag;
* changing one label;
* changing one className only;
* fixing one typo;
* table-specific column/overflow tasks;
* modal-specific viewport tasks.

For micro edits, use `$patch-only`.

For tables, use `$admin-table`.

For modals/dialogs/drawers, use `$admin-modal`.

---

## 1. Core admin direction

SmartElec admin UI should feel like a production SaaS operations dashboard for an electronic device repair platform.

The UI should be:

* clean;
* dense but readable;
* calm;
* operational;
* data-first;
* easy for admins to scan;
* suitable for repair sessions, technicians, accounts, quotes, chats, reviews, AI logs, RAG knowledge, and moderation.

Avoid:

* gaming dashboard style;
* random neon effects;
* oversized landing-page hero sections;
* excessive glassmorphism;
* too many nested cards;
* huge headers that waste vertical space;
* fake decoration that does not help operation.

---

## 2. Full-width admin rule

Admin pages are full-width by default.

Use:

```txt
w-full
max-w-none
min-w-0
px-4 sm:px-5 lg:px-6 xl:px-8
```

Avoid:

```txt
mx-auto max-w-5xl
mx-auto max-w-6xl
mx-auto max-w-7xl
container mx-auto
```

unless the page is a text-heavy document page and readability is more important than operations density.

The main admin content should not leave large unused side gaps on desktop.

---

## 3. Page shell structure

Preferred admin page structure:

```tsx
<section className="w-full min-w-0 space-y-5 px-4 py-4 sm:px-5 lg:px-6 xl:px-8">
  {/* compact page description / actions */}
  {/* KPI grid if needed */}
  {/* filters / toolbar if needed */}
  {/* main content */}
</section>
```

Rules:

* keep page wrapper full-width;
* use `min-w-0` on flex/grid children;
* avoid body horizontal scroll;
* avoid layout that only works at 100% zoom;
* test mentally for 80%, 90%, 100%, 110%, and 120% browser zoom.

---

## 4. Header rule

Admin pages should not use oversized marketing headers.

Avoid giant page titles like:

```txt
TÃƒÂ i khoÃ¡ÂºÂ£n
QuÃ¡ÂºÂ£n lÃƒÂ½ tÃƒÂ i khoÃ¡ÂºÂ£n
Dashboard quÃ¡ÂºÂ£n trÃ¡Â»â€¹ hÃ¡Â»â€¡ thÃ¡Â»â€˜ng
```

when the admin shell/topbar already identifies the route.

Prefer compact descriptions and useful actions.

Good header pattern:

```tsx
<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <p className="max-w-3xl text-sm text-[var(--admin-text-secondary)]">
    MÃƒÂ´ tÃ¡ÂºÂ£ ngÃ¡ÂºÂ¯n vÃ¡Â»Â dÃ¡Â»Â¯ liÃ¡Â»â€¡u vÃƒÂ  hÃƒÂ nh Ã„â€˜Ã¡Â»â„¢ng chÃƒÂ­nh cÃ¡Â»Â§a trang.
  </p>

  <div className="flex flex-wrap items-center gap-2">
    {/* actions */}
  </div>
</div>
```

Rules:

* header should be compact;
* primary action should be visible;
* do not duplicate the topbar title;
* do not make banner-height headers unless explicitly requested.

---

## 5. Spacing scale

Use consistent spacing.

Recommended:

```txt
page vertical gap: space-y-5 or space-y-6
section gap: gap-4 or gap-5
card padding: p-4 or p-5
compact control height: h-9 or h-10
large button height: h-11 only when needed
rounded card: rounded-2xl
small badge: rounded-full px-2.5 py-1
```

Avoid:

```txt
p-8 p-10
gap-8 gap-10
space-y-10
huge empty padding
multiple nested wrappers with their own large padding
```

unless the user explicitly asks for a spacious landing-page style.

---

## 6. Card nesting rule

Avoid unnecessary nested cards.

Bad:

```tsx
<Card>
  <Card>
    <Card>
      <Field />
    </Card>
  </Card>
</Card>
```

Good:

```tsx
<section className="rounded-2xl border p-4">
  <div className="grid gap-3">
    <Field />
    <Field />
  </div>
</section>
```

Rules:

* one visual surface per logical section;
* avoid a card inside a card unless it has a real meaning;
* each block should be readable on its own;
* do not create visual clutter to look Ã¢â‚¬Å“premiumÃ¢â‚¬Â.

---

## 7. Light/dark theme rule

Text must be readable in both light and dark mode.

Light mode:

* primary text should be dark;
* do not use pale gray for important text;
* inputs and dropdowns need visible background and border.

Dark mode:

* primary text should be light;
* secondary text should still be readable;
* borders should be subtle but visible.

Do not hardcode one-mode colors for important text.

Avoid:

```txt
text-gray-400
text-slate-400
text-white
text-black
bg-white
bg-black
```

as the only styling for theme-aware components.

Prefer project theme tokens, CSS variables, or existing theme-aware utilities.

---

## 8. KPI grid rule

KPI cards should scan quickly.

General admin KPI layout:

```txt
desktop: 3 or 4 cards per row depending on page density
tablet: 2 cards per row
mobile: 1 card per row
```

Use:

```tsx
grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3
```

or:

```tsx
grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4
```

depending on the page.

Rules:

* do not make KPI cards too tall;
* KPI label should be short;
* KPI value should be dominant;
* secondary text should be concise;
* do not use too many large icons;
* do not create 8 oversized cards if 4 compact ones are enough.

---

## 9. Filter/action area rule

Filters should be compact and aligned.

Preferred pattern:

```tsx
<div className="flex flex-col gap-3 rounded-2xl border p-4 lg:flex-row lg:items-center lg:justify-between">
  <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
    {/* search/select filters */}
  </div>

  <div className="flex shrink-0 flex-wrap items-center gap-2">
    {/* reset/add/export buttons */}
  </div>
</div>
```

Rules:

* filters must not force horizontal page scroll;
* reset button should be close to filters;
* primary action should be visually clear;
* dropdown background and border must work in both themes;
* do not spread controls too far apart on desktop.

---

## 10. Form layout rule

Admin forms should be structured and compact.

Preferred:

```tsx
<div className="grid gap-4 lg:grid-cols-2">
  <section className="rounded-2xl border p-4">
    {/* group 1 */}
  </section>

  <section className="rounded-2xl border p-4">
    {/* group 2 */}
  </section>
</div>
```

Rules:

* action buttons should stay inside or directly attached to the form frame;
* required fields should be clear;
* errors should be close to the field;
* avoid huge vertical gaps;
* avoid full-page form width for short fields unless grouped well;
* do not hide important actions below excessive blank space.

---

## 11. Two-panel workspace rule

For operation-heavy pages such as repair sessions, chats, dispatch, or quotes, use two-panel layouts when useful.

Preferred desktop pattern:

```tsx
<div className="grid min-h-0 gap-4 xl:grid-cols-[minmax(360px,420px)_1fr]">
  <aside className="min-w-0">
    {/* list/filter panel */}
  </aside>

  <section className="min-w-0">
    {/* detail/workspace panel */}
  </section>
</div>
```

Rules:

* left panel should remain scannable;
* right panel should show detail/action context;
* do not make both panels scroll horizontally;
* use `min-w-0` on both sides;
* selected state must be visible;
* empty state should explain what to select.

---

## 12. Overflow rule

Admin layout must avoid accidental horizontal scrolling.

Use:

```txt
min-w-0
overflow-hidden
truncate
break-words
flex-wrap
shrink-0
```

where appropriate.

Avoid:

```txt
w-screen inside nested layouts
min-w-[1200px] on page body
large fixed-width cards
unbounded table/action columns
```

Only use horizontal scroll inside a deliberately scoped area when absolutely necessary, not on the whole page body.

---

## 13. Responsive rule

Layout must be usable on:

```txt
mobile
tablet
desktop
80% zoom
90% zoom
100% zoom
110% zoom
120% zoom
```

Rules:

* mobile should stack naturally;
* desktop should use available width;
* controls should wrap instead of overflowing;
* action buttons should remain reachable;
* important text should not disappear;
* do not depend on a single exact viewport width.

---

## 14. Admin shell awareness

When editing page content inside the admin area, do not break the admin shell.

Do not change unless requested:

* sidebar width logic;
* topbar behavior;
* active route detection;
* auth guard;
* route paths;
* global theme provider;
* global layout wrappers.

If page content looks too narrow, fix the page wrapper first before changing the shell.

---

## 15. Allowed changes in this skill

For admin layout tasks, allowed changes include:

* wrapper layout;
* spacing;
* grid/flex structure;
* className;
* responsive classes;
* action alignment;
* empty/loading/error layout;
* visual grouping;
* safe overflow handling;
* accessible labels and semantic containers.

Do not change:

* API calls;
* service logic;
* hooks logic;
* route paths;
* TypeScript data contracts;
* business rules;
* status transitions;
* auth/session logic;
* mock data meaning.

---

## 16. Verification

After editing layout, inspect:

```bash
git diff --stat
git diff --check
```

For layout tasks, inspect the changed JSX/className diff.

If a browser preview is not used, report:

```txt
Visual QA: not run.
```

Do not claim the UI Ã¢â‚¬Å“looks betterÃ¢â‚¬Â unless preview or screenshot verification was actually performed.

---

## 17. Final response format

After an admin layout change, respond with:

```txt
Summary:
- ...

Modified:
- path/to/file.tsx Ã¢â‚¬â€ layout/spacing update

Verification:
- git diff --stat: checked / not run
- git diff --check: passed / failed / not run
- visual QA: passed / not run
```

Keep the final report short and factual.
