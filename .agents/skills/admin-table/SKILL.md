---
name: admin-table
description: Use for SmartElec admin management table tasks, including table columns, row density, overflow, responsive mobile cards, action buttons, badges, pagination, empty states, and scan-friendly admin list design. Do not use for tiny one-line edits; use patch-only instead.
---

# SmartElec Admin Table Skill

Use this skill when the task involves admin tables or management lists.

This skill is for:

* account tables;
* technician tables;
* device tables;
* quote tables;
* review tables;
* chat/session tables;
* AI log tables;
* RAG document tables;
* moderation/report tables;
* table overflow;
* action columns;
* mobile table cards;
* pagination;
* row density;
* badge layout.

Do not use this skill for:

* deleting one tag;
* changing one label;
* full page layout;
* modal viewport layout;
* API/service logic.

For micro edits, use `$patch-only`.

For page layout, use `$admin-layout`.

For modals/dialogs/drawers, use `$admin-modal`.

---

## 1. Core table direction

SmartElec admin tables are for fast scanning and operational decisions.

Tables should be:

* compact;
* readable;
* aligned;
* scan-friendly;
* action-safe;
* theme-aware;
* responsive;
* free from page-level horizontal overflow.

Avoid:

* card rows pretending to be desktop tables;
* oversized row height;
* 4Ã¢â‚¬â€œ5 stacked lines inside one cell;
* too many badges in one column;
* hidden action buttons;
* table body causing full-page horizontal scroll.

---

## 2. Desktop table rule

For desktop management screens, use real table semantics when possible.

Preferred:

```tsx
<table className="w-full table-auto">
  <thead>
    <tr>
      <th>...</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>...</td>
    </tr>
  </tbody>
</table>
```

Do not replace a desktop table with large cards unless the user explicitly asks.

---

## 3. Column priority rule

A table is not a detail page.

Show essential fields only.

Move long or secondary information to:

* detail modal;
* drawer;
* detail page;
* expanded row;
* tooltip only when short.

Good account table columns:

```txt
ID
TÃƒÂ i khoÃ¡ÂºÂ£n
Vai trÃƒÂ²
TrÃ¡ÂºÂ¡ng thÃƒÂ¡i
XÃƒÂ¡c minh
Thao tÃƒÂ¡c
```

Good repair/session table columns:

```txt
MÃƒÂ£ ca
KhÃƒÂ¡ch hÃƒÂ ng
ThiÃ¡ÂºÂ¿t bÃ¡Â»â€¹
TrÃ¡ÂºÂ¡ng thÃƒÂ¡i
KÃ¡Â»Â¹ thuÃ¡ÂºÂ­t viÃƒÂªn
ThÃ¡Â»Âi gian
Thao tÃƒÂ¡c
```

Avoid adding every possible field into the table.

---

## 4. No horizontal page overflow

The whole admin page must not scroll horizontally because of a table.

Use:

```txt
min-w-0
truncate
break-words
overflow-hidden
shrink-0
max-w-*
```

Rules:

* table wrapper may clip or scroll only when intentionally scoped;
* action column must remain visible;
* long email/name/device text should truncate;
* row content should not force the page wider;
* avoid fixed large widths like `min-w-[1200px]` unless explicitly needed.

Bad:

```tsx
<div className="w-screen">
  <table className="min-w-[1400px]">
    ...
  </table>
</div>
```

Better:

```tsx
<div className="min-w-0 overflow-hidden rounded-2xl border">
  <table className="w-full table-auto">
    ...
  </table>
</div>
```

---

## 5. Row density

Rows should be compact but readable.

Recommended:

```txt
row padding: px-4 py-3
header padding: px-4 py-3
primary text: text-sm font-medium
secondary text: text-xs or text-sm
badge: rounded-full px-2.5 py-1 text-xs
actions: h-8 or h-9
```

Avoid:

```txt
py-6
huge avatars
multi-card rows
large vertical gaps inside each td
```

---

## 6. Action column rule

Action buttons must always be reachable.

Preferred action column:

```tsx
<td className="w-0 whitespace-nowrap px-4 py-3 text-right">
  <div className="flex items-center justify-end gap-2">
    {/* action buttons */}
  </div>
</td>
```

Rules:

* action column should not be clipped;
* use concise actions;
* primary action can be Ã¢â‚¬Å“Chi tiÃ¡ÂºÂ¿tÃ¢â‚¬Â;
* destructive actions should be visually distinct;
* avoid putting 5 full-text buttons in one row.

For crowded tables, use:

```txt
Chi tiÃ¡ÂºÂ¿t
...
```

or a compact action menu.

---

## 7. Badge rule

Badges should be short and consistent.

Good:

```txt
HoÃ¡ÂºÂ¡t Ã„â€˜Ã¡Â»â„¢ng
BÃ¡Â»â€¹ khÃƒÂ³a
Ã„ÂÃƒÂ£ xÃƒÂ¡c minh
ChÃ†Â°a xÃƒÂ¡c minh
KhÃƒÂ¡ch hÃƒÂ ng
KÃ¡Â»Â¹ thuÃ¡ÂºÂ­t viÃƒÂªn
Admin
Ã„Âang xÃ¡Â»Â­ lÃƒÂ½
Ã„ÂÃƒÂ£ hoÃƒÂ n tÃ¡ÂºÂ¥t
```

Avoid long badge text.

Badges should not cause row height explosion.

---

## 8. Mobile table rule

On mobile, tables may become cards.

Use desktop table for larger screens and mobile cards for small screens.

Pattern:

```tsx
<div className="block lg:hidden">
  {/* mobile cards */}
</div>

<div className="hidden lg:block">
  {/* desktop table */}
</div>
```

Mobile cards should show:

* primary identity;
* 2Ã¢â‚¬â€œ4 key fields;
* clear status;
* one primary action;
* no dense table columns.

---

## 9. Empty/loading/error states

Tables need clear states.

Empty state should explain:

* no data;
* current filter may be too narrow;
* reset filters if relevant.

Loading state should not shift the layout too much.

Error state should give a retry action if possible.

---

## 10. Pagination rule

Pagination should be simple and close to the table.

Preferred:

```txt
1 2 3
TrÃ†Â°Ã¡Â»â€ºc
Sau
```

Rules:

* keep pagination compact;
* do not create oversized pagination cards;
* show current page clearly;
* do not hide pagination far below large empty space.

---

## 11. Theme rule

Tables must work in light and dark mode.

Light mode:

* text should be dark and readable;
* row border should be visible;
* hover state should be subtle;
* dropdown/action menu surface should be bright enough.

Dark mode:

* text should be light and readable;
* row border should be subtle but visible;
* hover state should not be too bright.

Do not hardcode one-mode text colors for core table content.

---

## 12. Allowed changes in this skill

Allowed for table tasks:

* table wrapper;
* column order;
* column visibility;
* row/cell layout;
* action button layout;
* badge layout;
* truncation;
* responsive desktop/mobile switch;
* empty/loading/error states;
* pagination layout;
* theme-aware className.

Do not change unless requested:

* API calls;
* hook/service logic;
* filter business logic;
* pagination query shape;
* status enum values;
* route paths;
* TypeScript data contracts;
* destructive action behavior.

---

## 13. Verification

After editing a table, inspect:

```bash
git diff --stat
git diff --check
```

For table tasks, inspect changed JSX/className diff.

If no browser or screenshot check was run, report:

```txt
Visual QA: not run.
```

Do not claim Ã¢â‚¬Å“no horizontal scrollÃ¢â‚¬Â unless verified by preview/screenshot or clearly reasoned from the diff.

---

## 14. Final response format

After an admin table change, respond with:

```txt
Summary:
- ...

Modified:
- path/to/Table.tsx Ã¢â‚¬â€ adjusted table columns/layout/actions.

Verification:
- git diff --stat: checked / not run
- git diff --check: passed / failed / not run
- visual QA: passed / not run
```

Keep the response short and factual.
