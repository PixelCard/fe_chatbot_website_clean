# AGENTS.md — SmartElec Core Rules

## Core safety

- For small edits, use patch-only behavior.
- Do not rewrite a file, function, component, hook, service, or page unless the user explicitly asks for rewrite/refactor.
- Do not reformat unrelated code.
- Do not change line endings.
- Do not change API contracts, route paths, types, enums, auth/session logic, pagination, filtering, sorting, or business rules unless requested.
- Do not add dependencies unless the user explicitly asks or the task cannot be completed safely without them.
- Inspect git diff before finishing.
- If a micro edit changes more than 20 lines, revert and redo smaller.
## Response language

The default response language for this repository is Vietnamese.

Codex must respond in Vietnamese with proper Vietnamese accents when the user writes in Vietnamese.

Use Vietnamese for:

* explanations;
* summaries;
* plans;
* bug analysis;
* final reports;
* verification reports;
* questions asking for clarification;
* screenshot-to-code location reports.

Do not answer in English unless:

* the user explicitly asks for English;
* the content is a code identifier, API name, package name, command, file path, route path, enum value, status key, or technical keyword that should stay unchanged;
* the quoted source text is originally English and must be preserved.

Preserve Vietnamese accents.

Correct:

```txt
Tôi đã đọc các file hướng dẫn và hiểu các quy tắc chính.
Không chỉnh sửa file khi chỉ đang giải thích code.
Đối với ảnh chụp màn hình, tôi sẽ chỉ xác định file/component liên quan nếu chưa được yêu cầu sửa.
```

Wrong:

```txt
I have read the instruction files.
Toi da doc cac file huong dan.
Khong chinh sua file khi chi dang giai thich code.
```

For final reports, use Vietnamese labels:

```txt
Tóm tắt:
- ...

Đã chỉnh sửa:
- ...

Kiểm tra:
- git diff --stat: đã kiểm tra / chưa chạy
- git diff --check: đạt / lỗi / chưa chạy
- typecheck: đạt / lỗi / chưa chạy
- lint: đạt / lỗi / chưa chạy
- build: đạt / lỗi / chưa chạy
- kiểm tra giao diện: đã kiểm tra / chưa chạy

Chưa xác minh:
- ...
```

When reporting discovered skills or task modes, keep skill names unchanged but explain them in Vietnamese.

Example:

```txt
Kỹ năng đã phát hiện:
- patch-only: dùng cho chỉnh sửa nhỏ, chỉ sửa đúng dòng/block cần thiết.
- admin-layout: dùng cho layout trang admin.
- screenshot-locate: dùng để tìm UI trong code từ ảnh chụp màn hình.
```

Do not remove Vietnamese accents to avoid encoding issues. If Vietnamese text appears corrupted, report it as an encoding/mojibake issue instead of converting it to ASCII.

## Project orientation

This workspace contains both Backend and FrontEnd code.

Before a code-changing task, determine whether the task is:

- frontend-only;
- backend-only;
- cross-stack between FrontEnd and Backend;
- documentation/configuration only.

If working from the workspace root, inspect `README.md` only when the project structure or BE/FE boundary is unclear.

If working inside `FrontEnd/fe_chatbot_website`, the workspace-level README is located at:

```txt
../../README.md
```

Inspect the README when:

- this is the first code-changing task in a new session and structure is unclear;
- the task involves both FrontEnd and Backend;
- the task mentions API integration, DTOs, authentication, routes, database, deployment, or project structure;
- Codex is unsure whether a responsibility belongs to FrontEnd or Backend.

Do not re-read README for tiny local frontend edits such as deleting one tag, changing one className, fixing one label, or removing one line.

If README is missing or inaccessible, state:

```txt
README orientation not available.
```

Then continue with the smallest safe inspection needed.

## Skill usage

Use repo skills only when relevant.

Available repo skills:

- `$patch-only` for micro edits: delete one tag, change one className, fix one label, remove one line, tiny local bug fix.
- `$admin-layout` for SmartElec admin page layout, spacing, full-width layout, responsive layout, dashboard/workspace/form layout.
- `$admin-table` for admin tables, table columns, overflow, row density, badges, pagination, action buttons.
- `$admin-modal` for detail modal/dialog/drawer viewport fit, internal scroll, compact fields, modal actions.
- `$vietnamese-encoding` for Vietnamese UI text, mojibake, UTF-8, corrupted accents, or broken labels.
- `$screenshot-locate` for screenshot-to-code location tasks. Use when the user uploads a screenshot and asks where a UI element is located. Locate only; do not edit unless explicitly requested.

Do not read all skills by default.

Load a skill only when:

- the user explicitly mentions it, such as `Use $patch-only`;
- the task clearly matches the skill description;
- the skill is needed to avoid repeating long rules in the prompt.

If no skill is relevant, use only this `AGENTS.md`.
## Task mode router

Before doing any task, Codex must classify the request into one task mode.

Codex must not silently guess the mode if the user request is ambiguous.

Available task modes:

### 1. Explanation mode

Use when the user asks:

* what does this code mean;
* explain this function/component/hook;
* compare two snippets;
* why does this error happen;
* what is the flow of this code.

Rules:

* Do not edit files.
* Do not run formatting.
* Do not change code.
* Explain using the existing files only.
* If the code is not available, ask for the file or snippet.
* If unsure, say what is uncertain.

### 2. Bug investigation mode

Use when the user reports a bug but has not approved editing yet.

Use when the user says:

* lỗi này là gì;
* tìm lỗi giúp tôi;
* tại sao bị lỗi;
* nó bị undefined;
* ref bị lỗi;
* UI không chạy đúng;
* build/lint/type error.

Rules:

* Investigate first.
* Do not edit files yet unless the user clearly asks to fix.
* Identify the likely file, component, function, hook, service, or block.
* Explain the likely cause briefly.
* Propose the smallest safe patch.
* Ask for approval if the fix may touch more than 40 lines.

### 3. Bug fix mode

Use when the user explicitly asks Codex to fix a bug.

Rules:

* Use the smallest safe patch.
* Prefer `$patch-only` when the bug is local.
* Do not rewrite the whole file.
* Do not delete and recreate files.
* Do not reformat unrelated code.
* Do not change line endings.
* Do not change unrelated JSX, className, imports, comments, or logic.
* Do not change API contracts, route paths, enum/status values, or business rules unless the bug is exactly there.
* If the fix exceeds 40 changed lines, stop and ask for approval.

### 4. Layout mode

Use when the user asks to render, redesign, improve, or adjust admin UI layout.

Rules:

* Use `$admin-layout`.
* Use `$admin-table` if the task involves admin tables.
* Use `$admin-modal` if the task involves modals, dialogs, drawers, or detail panels.
* Keep data, API, routes, types, and business logic unchanged.
* Focus only on layout, spacing, responsive behavior, theme-aware text, overflow, and admin visual structure.
* Do not redesign unrelated components.

### 5. Screenshot locate mode

Use when the user uploads a screenshot and asks where a UI element is located.

Rules:

* Use `$screenshot-locate` if available.
* Locate only by default.
* Do not edit files unless the user explicitly asks.
* Locate only by default.
* Do not edit files unless the user explicitly asks.
* Identify visible clues from the screenshot.
* Search exact visible text first.
* Report likely route, file, component, matched evidence, and confidence.
* If the exact file cannot be verified, say so.

### 6. Vietnamese encoding mode

Use when the task involves Vietnamese labels, broken accents, mojibake, or corrupted text.

Rules:

* Use `$vietnamese-encoding`.
* Use `$patch-only` for tiny text fixes.
* Preserve Vietnamese accents.
* Keep files UTF-8.
* Do not mass replace unless explicitly requested.
* Do not remove accents to simplify text.

### 7. Feature implementation mode

Use when the user asks to add a new feature.

Rules:

* Inspect existing patterns first.
* Reuse existing services, hooks, components, types, and UI tokens.
* Do not invent API contracts.
* If backend contract is unclear, inspect backend files or ask.
* Keep the implementation scoped to the requested feature.
* Avoid broad refactors.

## Task mode response rule

Before editing files, Codex should briefly state:

```txt
Task mode: ...
Plan:
- ...
```

For tiny patch-only edits, Codex may keep this very short.

If the task mode is ambiguous, Codex must ask one clarifying question instead of guessing.
 
## Patch-only default

Use patch-only behavior for micro edits such as:

- delete one tag;
- remove one line;
- change one `className`;
- fix one label;
- fix one typo;
- remove one unused import;
- adjust one condition;
- change one button text.

Patch-only rules:

1. Locate the exact file and exact line/block.
2. Edit only that line/block.
3. Do not rewrite the whole file.
4. Do not reformat the file.
5. Do not change line endings.
6. Do not change unrelated whitespace.
7. Do not use full-file replacement.
8. After editing, inspect the diff.

Expected diff for micro edits:

```txt
1 file
1–10 changed lines
```

If a micro edit changes more than 20 lines, revert and redo smaller.


## Bug fix mode

For bug-fix requests, default to the smallest safe patch.

Bug fixes must not rewrite whole files by default.

Before editing a bug, Codex must:

1. Identify the suspected file.
2. Identify the suspected function/component/hook/service/block.
3. Explain the likely cause briefly.
4. Patch only the smallest necessary block.
5. Inspect `git diff`.

For bug fixes, Codex must not:

* delete and recreate a file;
* replace the whole file;
* rewrite the whole component;
* rewrite the whole page;
* rewrite the whole hook;
* rewrite the whole service;
* reformat unrelated code;
* change unrelated imports;
* change unrelated JSX;
* change unrelated `className` strings;
* change unrelated UI layout;
* change unrelated comments;
* change API contracts;
* change route paths;
* change enum/status values;
* change pagination/filter/sort behavior unless the bug is exactly there.

If the bug fix changes more than 40 lines, Codex must stop and report why the patch became large.

If Codex believes a full-file rewrite is necessary, it must stop and ask for approval first.

Required message before a full rewrite:

```txt
This fix appears to require rewriting a large file or component. I will not proceed without approval.

Reason:
- ...

Proposed files:
- ...

Estimated diff:
- ...
```

If the user does not approve, Codex must find a smaller patch or stop.

## No guessing rule

Do not guess project behavior when the answer can be verified from files.

Before changing behavior, inspect the relevant existing files.

Do not invent:

* API endpoints;
* request payloads;
* response shapes;
* TypeScript types;
* enum values;
* status values;
* route paths;
* auth/session behavior;
* pagination/filter/sort behavior;
* database fields;
* business rules;
* UI state names;
* component props.

If the required information cannot be found, Codex must say:

```txt
I could not verify this from the existing files.
```

Then ask for the missing information or propose a clearly marked assumption.

Assumptions must be written explicitly:

```txt
Assumption:
- ...

Risk:
- ...

Please confirm before I change this behavior.
```

Do not silently implement unverified assumptions.

## Existing pattern first

Before adding new code, inspect and follow the existing project pattern.

Prefer existing:

* services;
* hooks;
* components;
* UI tokens;
* className patterns;
* route conventions;
* type definitions;
* status mappings;
* modal/table/layout patterns.

Do not introduce a new abstraction if an existing pattern can solve the task.

Do not create a new helper, hook, service, or component unless:

1. the task genuinely needs reuse;
2. the existing pattern already separates that concern;
3. the user explicitly asks for refactor/extraction.

For small fixes, edit the existing block.

## Diff guard

Before finishing, inspect `git diff --stat`.

If the diff is larger than the task size, Codex must stop and explain.

For tiny fixes:

```txt
Expected: 1 file, 1–10 changed lines.
Hard limit: 20 changed lines.
```

For normal bug fixes:

```txt
Expected: 1–3 files, focused changed lines.
Hard limit without approval: 40 changed lines.
```

If a small request creates a large diff, Codex must revert and redo smaller.

Large diff warning signs:

* hundreds of inserted/deleted lines;
* entire file shown as changed;
* many unrelated files changed;
* formatting-only changes mixed with logic changes;
* imports reordered across the file;
* line endings changed.

If any warning sign appears, stop and do not finish as if the change is normal.


## Frontend/backend boundary

Do not invent backend contracts.

When a frontend task touches backend integration, inspect the relevant frontend service/hook/type files first.

If the API contract is missing, say:

```txt
Not enough data to verify the API contract.
```

When integrating API data:

- keep HTTP calls in service files if that pattern exists;
- keep loading/error/refetch/mutation state in hooks if that pattern exists;
- keep components mostly presentational;
- do not call raw `fetch` from small presentational components unless the existing project pattern already does so.

## File safety

Do not move, rename, or delete files unless the task requires it.

Before moving or renaming files:

1. Search all imports/usages.
2. Search exported symbol names.
3. Update imports.
4. Update barrel exports if present.
5. Update route references if affected.
6. Verify no old references remain.

Do not edit generated/cache/build folders unless explicitly requested:

```txt
.next
dist
node_modules
tsconfig.tsbuildinfo
```

## Dependency safety

Do not run these commands without explicit approval:

```bash
npm install <package>
npm update
npm audit fix --force
```

Do not add packages for simple layout, formatting, icons, animation, validation, or class merging if existing project tools are sufficient.

## Verification

For code changes, run or inspect:

```bash
git diff --stat
git diff --check
```

For larger changes, also inspect:

```bash
git diff
```

If available and relevant, run project checks only after inspecting `package.json`.

Do not claim a command exists without checking.

Possible checks:

```bash
npm run typecheck
npm run lint
npm run build
```

If verification was not run, report honestly:

```txt
Verification not run — reason.
```

If visual/browser QA is not available, report:

```txt
Visual QA: not run.
```

## Final report

After code changes, report only what matters:

```txt
Summary:
- ...

Modified:
- path/to/file.tsx — what changed

Verification:
- git diff --stat: checked / not run
- git diff --check: passed / failed / not run
- typecheck: passed / failed / not run
- lint: passed / failed / not run
- build: passed / failed / not run
- visual QA: passed / not run

Unverified:
- ...
```

Do not list inspected-only files as modified.

Do not claim visual improvement without browser preview or screenshot verification.

## Anti-damage checklist

Before finishing, ensure:

- the exact user request was solved;
- the diff size matches the task size;
- no unrelated file was changed;
- no unrelated code was reformatted;
- no file/function/component was rewritten without justification;
- no API/type/status/route contract was invented;
- no dependency was added without approval;
- no debug code was left behind;
- imports still resolve after any move/rename;
- verification status is truthful.