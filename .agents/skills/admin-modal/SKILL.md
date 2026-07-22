---
name: admin-modal
description: Use for SmartElec admin detail modal, dialog, drawer, confirmation dialog, viewport fit, internal scroll, compact field layout, modal header/actions, and modal responsive behavior. Do not use for tiny one-line edits; use patch-only instead.
---

# SmartElec Admin Modal Skill

Use this skill when the task involves admin modals, dialogs, drawers, or detail panels.

This skill is for:

* detail modals;
* action dialogs;
* confirmation dialogs;
* drawers;
* viewport-fit issues;
* internal modal scroll;
* compact detail layout;
* modal header/footer actions;
* modal responsive behavior.

Do not use this skill for:

* deleting one tag;
* changing one label;
* table column layout;
* full page layout;
* service/API logic.

For micro edits, use `$patch-only`.

For admin page layout, use `$admin-layout`.

For table-specific tasks, use `$admin-table`.

---

## 1. Core modal direction

SmartElec admin modals should feel like production SaaS operation tools.

A modal should help the admin inspect, confirm, or act quickly.

The modal should be:

* compact;
* readable;
* viewport-safe;
* action-focused;
* theme-aware;
* easy to close;
* easy to scan.

Avoid:

* dashboard pages inside modals;
* huge nested cards;
* oversized headers;
* duplicated information;
* unnecessary vertical whitespace;
* internal scroll when content can fit normally;
* clipping close buttons or action buttons.

---

## 2. Viewport fit rule

A normal detail modal should fit inside common desktop viewports.

Preferred shell:

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4">
  <div className="flex w-[min(1120px,calc(100vw-32px))] max-h-[calc(100dvh-32px)] flex-col overflow-hidden rounded-2xl">
    <header className="shrink-0">
      {/* title, summary, close button */}
    </header>

    <div className="min-h-0 flex-1 overflow-y-auto">
      {/* content */}
    </div>

    <footer className="shrink-0">
      {/* actions if needed */}
    </footer>
  </div>
</div>
```

Rules:

* use `max-h-[calc(100dvh-32px)]`;
* use `min-h-0` before internal scroll areas;
* header and footer should stay reachable;
* close button must never be clipped;
* modal should not force the whole page body to scroll behind it.

---

## 3. Detail modal layout

For account/user/technician/session detail modals, prefer compact information groups.

Good pattern:

```tsx
<section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
  <div className="rounded-2xl border p-4">
    {/* compact field rows */}
  </div>

  <div className="rounded-2xl border p-4">
    {/* compact field rows */}
  </div>

  <div className="rounded-2xl border p-4">
    {/* compact field rows */}
  </div>
</section>
```

Avoid:

```tsx
<div className="space-y-6">
  <Card>
    <Card>
      <Card>
        <Field />
      </Card>
    </Card>
  </Card>
</div>
```

Rules:

* one visual surface per logical section;
* use compact info rows;
* do not create one large card for every tiny field;
* do not duplicate contact/status/location fields across multiple sections;
* long descriptions can have their own section only if genuinely useful.

---

## 4. Header rule

Modal headers should be compact and useful.

Good modal header should include:

* title;
* short context line;
* important badge/status if needed;
* close button.

Avoid:

* giant title blocks;
* repeated page title;
* decorative hero header;
* too many badges in the header.

Example:

```tsx
<header className="flex shrink-0 items-start justify-between gap-4 border-b p-4">
  <div className="min-w-0">
    <h2 className="truncate text-base font-semibold">
      Chi tiÃ¡ÂºÂ¿t tÃƒÂ i khoÃ¡ÂºÂ£n
    </h2>
    <p className="mt-1 text-sm">
      ThÃƒÂ´ng tin Ã„â€˜Ã¡Â»â€¹nh danh, trÃ¡ÂºÂ¡ng thÃƒÂ¡i vÃƒÂ  lÃ¡Â»â€¹ch sÃ¡Â»Â­ liÃƒÂªn quan.
    </p>
  </div>

  <button type="button" aria-label="Ã„ÂÃƒÂ³ng">
    {/* icon */}
  </button>
</header>
```

---

## 5. Footer/action rule

Modal actions should be reachable without hunting.

For confirmation dialogs:

* primary action must be clear;
* destructive action must be visually distinct;
* cancel action must be available;
* action labels must be specific.

Good labels:

```txt
KhÃƒÂ³a tÃƒÂ i khoÃ¡ÂºÂ£n
XÃƒÂ¡c minh tÃƒÂ i khoÃ¡ÂºÂ£n
Ã„ÂÃ¡ÂºÂ·t lÃ¡ÂºÂ¡i mÃ¡ÂºÂ­t khÃ¡ÂºÂ©u
XÃƒÂ³a tÃƒÂ i khoÃ¡ÂºÂ£n
HÃ¡Â»Â§y
Ã„ÂÃƒÂ³ng
```

Bad labels:

```txt
OK
Yes
Submit
Action
```

For detail modals, use footer actions only when needed. If no action is required, a close button is enough.

---

## 6. Internal scroll rule

Use internal scroll only for genuinely long content.

Correct:

```tsx
<div className="min-h-0 flex-1 overflow-y-auto">
  {/* long content */}
</div>
```

Wrong:

```tsx
<div className="overflow-y-auto">
  <div className="h-screen">
    {/* clipped content */}
  </div>
</div>
```

Rules:

* parent must have bounded height;
* scroll area must have `min-h-0`;
* header/footer should be `shrink-0`;
* do not hide action buttons below the fold unnecessarily;
* do not create nested scroll areas unless truly needed.

---

## 7. Confirmation dialog rule

Confirmation dialogs should be smaller than detail modals.

Preferred size:

```txt
max-w-md or max-w-lg
```

Required structure:

* clear title;
* short explanation;
* consequences if destructive;
* cancel button;
* confirm button.

For destructive actions, mention the target.

Example:

```txt
BÃ¡ÂºÂ¡n sÃ¡ÂºÂ¯p khÃƒÂ³a tÃƒÂ i khoÃ¡ÂºÂ£n NguyÃ¡Â»â€¦n VÃ„Æ’n A. NgÃ†Â°Ã¡Â»Âi dÃƒÂ¹ng nÃƒÂ y sÃ¡ÂºÂ½ khÃƒÂ´ng thÃ¡Â»Æ’ Ã„â€˜Ã„Æ’ng nhÃ¡ÂºÂ­p cho Ã„â€˜Ã¡ÂºÂ¿n khi Ã„â€˜Ã†Â°Ã¡Â»Â£c mÃ¡Â»Å¸ khÃƒÂ³a lÃ¡ÂºÂ¡i.
```

Avoid vague destructive text.

---

## 8. Drawer rule

Use drawers for task workflows or side inspection panels.

Drawer rules:

* right drawer for detail/action;
* width should be bounded;
* use `w-[min(480px,100vw)]` or similar;
* body scrolls internally;
* close button visible;
* actions remain reachable.

Do not use drawer when a small confirmation dialog is enough.

---

## 9. Theme rule

Modals must work in light and dark mode.

Light mode:

* surface should be bright;
* primary text should be dark;
* borders must be visible;
* secondary text must not be too faint.

Dark mode:

* surface should be dark but separated from overlay;
* primary text should be light;
* borders should be subtle but visible;
* overlays should not make text unreadable.

Do not hardcode one-mode colors for important modal text.

Avoid using only:

```txt
text-white
text-black
bg-white
bg-black
text-gray-400
```

for modal elements that must adapt to theme.

---

## 10. Accessibility rule

Modals/dialogs should be accessible.

Required:

* close button has `aria-label`;
* dialog title is visible;
* clickable buttons use `button`;
* destructive actions are clear;
* disabled actions explain why if possible;
* keyboard users can identify actions.

Do not use clickable `div` for modal actions.

Do not remove focus-visible styles without replacing them.

---

## 11. Allowed changes in this skill

Allowed for modal tasks:

* modal shell sizing;
* max height;
* internal scroll structure;
* header/footer layout;
* compact info row layout;
* responsive grid;
* theme-aware className;
* button/action alignment;
* aria labels;
* empty/loading/error state layout inside modal.

Do not change unless requested:

* API calls;
* hook/service logic;
* status transition rules;
* auth/session behavior;
* route paths;
* TypeScript data shape;
* destructive action behavior;
* confirmation business rules.

---

## 12. Verification

After editing a modal, inspect:

```bash
git diff --stat
git diff --check
```

For modal tasks, inspect changed JSX/className diff.

If no browser or screenshot check was run, report:

```txt
Visual QA: not run.
```

Do not claim the modal Ã¢â‚¬Å“fits perfectlyÃ¢â‚¬Â unless viewport/browser verification was actually performed.

---

## 13. Final response format

After an admin modal change, respond with:

```txt
Summary:
- ...

Modified:
- path/to/Modal.tsx Ã¢â‚¬â€ adjusted modal shell/content/actions.

Verification:
- git diff --stat: checked / not run
- git diff --check: passed / failed / not run
- visual QA: passed / not run
```

Keep the response short and factual.
