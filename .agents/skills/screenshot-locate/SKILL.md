---
name: screenshot-locate
description: Use when the user provides a screenshot and asks where a UI element, text, button, table, card, modal, sidebar item, route, or layout block is located in the code. Default behavior is locate-only, not editing.
---

# Screenshot Locate Skill

Use this skill when the user provides a screenshot and asks where something is located in the code.

This skill is for:
- finding which page or route matches the screenshot;
- finding which component renders a visible UI area;
- finding labels, buttons, cards, tables, modals, badges, headers, filters, or sidebars;
- mapping screenshot elements to JSX/component files;
- explaining what to search for in the codebase.

Default behavior: locate only.

Do not edit files unless the user explicitly asks to modify the UI.

## Rules

- Identify visible clues from the screenshot.
- Search exact visible text first.
- Find likely route, page, component, and file path.
- Report evidence before suggesting edits.
- Do not modify files by default.
- If multiple files match, list candidates and confidence.
- If the exact file cannot be verified, say so.

## Visible clues to search

Use clues such as:
- route/page title;
- sidebar active item;
- topbar title;
- table headers;
- button text;
- modal title;
- card/KPI labels;
- Vietnamese labels;
- icons;
- unique status text;
- layout structure.

## Final response format

Likely location:
- route: ...
- file: ...
- component: ...

Evidence:
- screenshot shows: "..."
- code match: "..."

Confidence:
- high / medium / low

Next step:
- Tell me what you want changed in this block.
