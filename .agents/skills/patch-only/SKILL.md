---
name: patch-only
description: Use for micro edits such as deleting one tag, changing one className, fixing one label, removing one line, removing one import, or making a tiny local bug fix. This skill prevents full-file rewrites and unnecessary formatting.
---

# Patch-only skill

Use this skill when the task is a micro edit.

Micro edits include:

* delete one tag;
* delete one line;
* change one className;
* change one label;
* fix one typo;
* remove one unused import;
* adjust one condition;
* remove one small JSX block;
* change one button text;
* make a tiny local bug fix.

---

## 1. Default behavior

For micro edits, Codex must patch only the exact target line/block.

Correct workflow:

```txt
inspect target file
locate exact line/block
patch exact line/block
inspect git diff
stop
```

Wrong workflow:

```txt
read whole file
rewrite whole file
format file
hope diff is small
```

---

## 2. Hard bans

For patch-only tasks, Codex must not:

* rewrite the whole file;
* delete and recreate the file;
* reformat the file;
* normalize line endings;
* reorder unrelated imports;
* rename unrelated variables;
* change unrelated JSX;
* change unrelated className strings;
* change unrelated comments;
* clean unrelated dead code;
* introduce a helper function;
* introduce a new abstraction;
* move files;
* add dependencies.

Do not use full-file replacement for patch-only tasks.

Do not use commands or editor operations that rewrite the entire file when a local patch is possible.

---

## 3. Diff budget

Expected diff:

```txt
1 file
1Ã¢â‚¬â€œ10 changed lines
```

Maximum allowed diff for a patch-only task:

```txt
20 changed lines
```

If the diff exceeds 20 changed lines, Codex must:

1. Stop.
2. Revert the attempted change.
3. Re-apply a smaller patch.
4. Report that the first diff was too large.

If a one-line edit produces a full-file diff, assume one of these problems happened:

* line endings changed;
* formatter rewrote the file;
* encoding changed;
* full-file replacement was used.

In that case, revert and redo the edit with a smaller patch.

---

## 4. Verification

After editing, inspect:

```bash
git diff --stat
git diff --check
```

For patch-only tasks, inspect the actual diff too:

```bash
git diff
```

A correct patch-only diff should show only the exact target block and directly related imports.

If the task removes a JSX element and that makes an import unused, removing the unused import is allowed.

No other cleanup is allowed.

---

## 5. Response format

After a patch-only edit, keep the response short.

Use:

```txt
Summary:
- Removed the requested <p> tag.

Modified:
- path/to/file.tsx Ã¢â‚¬â€ removed only the target <p> block.

Verification:
- git diff --stat: checked
- git diff --check: passed / not run
```

Do not include a long explanation unless the user asks.

Do not claim visual QA was run unless browser preview or screenshot verification was actually used.

---

## 6. Stop conditions

Stop and ask or report if:

* the target file cannot be found;
* the exact text/tag/class cannot be located;
* multiple matching blocks exist and the correct one is ambiguous;
* the patch would require changing more than 20 lines;
* the local patch conflicts with existing logic;
* the change requires a formatter or large rewrite.

When stopping, say exactly what is missing and what is needed to continue.
