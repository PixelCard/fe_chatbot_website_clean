---
name: vietnamese-encoding
description: Use when editing Vietnamese UI text, labels, messages, route descriptions, comments, UTF-8 encoding, mojibake, corrupted Vietnamese accents, or broken labels.
---

# Vietnamese Encoding Skill

Use this skill when the task involves Vietnamese text or encoding.

This skill is for:

* Vietnamese UI labels;
* Vietnamese validation messages;
* Vietnamese button text;
* Vietnamese status text;
* Vietnamese admin descriptions;
* corrupted Vietnamese accents;
* mojibake;
* UTF-8 preservation;
* text display issues.

Use this skill when you see broken text such as:

```txt
Ã¯Â¿Â½
ÃƒÆ’
Ãƒâ€š
ÃƒÂ¡Ã‚Âº
ÃƒÂ¡Ã‚Â»
Qu?n
S?a
B?o
Kh?ch
TÃƒÆ’ i khoÃƒÂ¡Ã‚ÂºÃ‚Â£n
```

Do not use this skill for unrelated layout-only or logic-only tasks.

---

## 1. Core rule

SmartElec product language is Vietnamese.

Preserve Vietnamese accents.

Correct:

```txt
QuÃ¡ÂºÂ£n lÃƒÂ½ tÃƒÂ i khoÃ¡ÂºÂ£n
SÃ¡Â»Â­a chÃ¡Â»Â¯a thiÃ¡ÂºÂ¿t bÃ¡Â»â€¹
BÃƒÂ¡o giÃƒÂ¡
KhÃƒÂ¡ch hÃƒÂ ng
KÃ¡Â»Â¹ thuÃ¡ÂºÂ­t viÃƒÂªn
Ã„ÂÃƒÂ£ hoÃƒÂ n tÃ¡ÂºÂ¥t
ChÃ†Â°a xÃƒÂ¡c minh
Ã„Âang xÃ¡Â»Â­ lÃƒÂ½
PhiÃƒÂªn sÃ¡Â»Â­a chÃ¡Â»Â¯a
Kho tri thÃ¡Â»Â©c RAG
KiÃ¡Â»Æ’m duyÃ¡Â»â€¡t
```

Wrong:

```txt
Quan ly tai khoan
Sua chua thiet bi
Bao gia
Khach hang
Ky thuat vien
Da hoan tat
Chua xac minh
Dang xu ly
Phien sua chua
Kho tri thuc RAG
Kiem duyet
```

Do not remove accents to Ã¢â‚¬Å“simplifyÃ¢â‚¬Â text.

---

## 2. Encoding safety

Files containing Vietnamese text must remain UTF-8.

Do not:

* change file encoding;
* normalize line endings unnecessarily;
* paste broken encoded text;
* replace Vietnamese accents with ASCII;
* use full-file replacement to fix one label;
* reformat unrelated content while fixing text.

For one broken label, patch only that label.

Use `$patch-only` together with this skill for tiny text fixes.

Example:

```txt
Use $patch-only and $vietnamese-encoding. Fix only the broken label "TÃƒÆ’ i khoÃƒÂ¡Ã‚ÂºÃ‚Â£n".
```

---

## 3. Mojibake repair guide

Common broken text patterns:

```txt
TÃƒÆ’ i khoÃƒÂ¡Ã‚ÂºÃ‚Â£n        -> TÃƒÂ i khoÃ¡ÂºÂ£n
QuÃƒÂ¡Ã‚ÂºÃ‚Â£n lÃƒÆ’Ã‚Â½          -> QuÃ¡ÂºÂ£n lÃƒÂ½
SÃƒÂ¡Ã‚Â»Ã‚Â­a chÃƒÂ¡Ã‚Â»Ã‚Â¯a        -> SÃ¡Â»Â­a chÃ¡Â»Â¯a
KhÃƒÆ’Ã‚Â¡ch hÃƒÆ’ ng        -> KhÃƒÂ¡ch hÃƒÂ ng
KÃƒÂ¡Ã‚Â»Ã‚Â¹ thuÃƒÂ¡Ã‚ÂºÃ‚Â­t viÃƒÆ’Ã‚Âªn  -> KÃ¡Â»Â¹ thuÃ¡ÂºÂ­t viÃƒÂªn
BÃƒÆ’Ã‚Â¡o giÃƒÆ’Ã‚Â¡           -> BÃƒÂ¡o giÃƒÂ¡
Ãƒâ€žÃ‚Âang xÃƒÂ¡Ã‚Â»Ã‚Â­ lÃƒÆ’Ã‚Â½      -> Ã„Âang xÃ¡Â»Â­ lÃƒÂ½
Ãƒâ€žÃ‚ÂÃƒÆ’Ã‚Â£ hoÃƒÆ’ n tÃƒÂ¡Ã‚ÂºÃ‚Â¥t    -> Ã„ÂÃƒÂ£ hoÃƒÂ n tÃ¡ÂºÂ¥t
ChÃƒâ€ Ã‚Â°a xÃƒÆ’Ã‚Â¡c minh    -> ChÃ†Â°a xÃƒÂ¡c minh
```

If the correct phrase is obvious, repair it.

If multiple interpretations are possible, stop and ask.

Do not guess business-specific labels if the meaning is unclear.

---

## 4. Admin vocabulary

Prefer consistent Vietnamese terms.

Use:

```txt
TÃƒÂ i khoÃ¡ÂºÂ£n
KhÃƒÂ¡ch hÃƒÂ ng
KÃ¡Â»Â¹ thuÃ¡ÂºÂ­t viÃƒÂªn
QuÃ¡ÂºÂ£n trÃ¡Â»â€¹ viÃƒÂªn
PhiÃƒÂªn chat
PhiÃƒÂªn sÃ¡Â»Â­a chÃ¡Â»Â¯a
BÃƒÂ¡o giÃƒÂ¡
Ã„ÂiÃ¡Â»Âu phÃ¡Â»â€˜i
ThÃ¡Â»Â£ sÃ¡Â»Â­a chÃ¡Â»Â¯a
ThiÃ¡ÂºÂ¿t bÃ¡Â»â€¹
Ã„ÂÃƒÂ¡nh giÃƒÂ¡ dÃ¡Â»â€¹ch vÃ¡Â»Â¥
AI tÃ†Â° vÃ¡ÂºÂ¥n
Log suy luÃ¡ÂºÂ­n AI
Kho tri thÃ¡Â»Â©c RAG
KiÃ¡Â»Æ’m duyÃ¡Â»â€¡t
TrÃ¡ÂºÂ¡ng thÃƒÂ¡i
QuyÃ¡Â»Ân truy cÃ¡ÂºÂ­p
HoÃ¡ÂºÂ¡t Ã„â€˜Ã¡Â»â„¢ng
BÃ¡Â»â€¹ khÃƒÂ³a
Ã„ÂÃƒÂ£ xÃƒÂ¡c minh
ChÃ†Â°a xÃƒÂ¡c minh
TrÃ¡Â»Â±c tuyÃ¡ÂºÂ¿n
NgoÃ¡ÂºÂ¡i tuyÃ¡ÂºÂ¿n
```

Avoid mixing unrelated terms for the same concept.

Example:

```txt
Use "KÃ¡Â»Â¹ thuÃ¡ÂºÂ­t viÃƒÂªn" consistently.
Do not randomly switch between "KTV", "ThÃ¡Â»Â£", "NhÃƒÂ¢n viÃƒÂªn kÃ¡Â»Â¹ thuÃ¡ÂºÂ­t" unless the UI context needs it.
```

---

## 5. Button text

Use clear Vietnamese action labels.

Good:

```txt
ThÃƒÂªm mÃ¡Â»â€ºi
TÃ¡ÂºÂ¡o tÃƒÂ i khoÃ¡ÂºÂ£n
CÃ¡ÂºÂ­p nhÃ¡ÂºÂ­t
LÃ†Â°u thay Ã„â€˜Ã¡Â»â€¢i
XÃƒÂ³a
KhÃƒÂ³a
MÃ¡Â»Å¸ khÃƒÂ³a
XÃƒÂ¡c minh
Ã„ÂÃ¡ÂºÂ·t lÃ¡ÂºÂ¡i mÃ¡ÂºÂ­t khÃ¡ÂºÂ©u
Xem chi tiÃ¡ÂºÂ¿t
ChÃ¡Â»â€°nh sÃ¡Â»Â­a
HÃ¡Â»Â§y
Ã„ÂÃƒÂ³ng
ÃƒÂp dÃ¡Â»Â¥ng
Ã„ÂÃ¡ÂºÂ·t lÃ¡ÂºÂ¡i bÃ¡Â»â„¢ lÃ¡Â»Âc
XuÃ¡ÂºÂ¥t dÃ¡Â»Â¯ liÃ¡Â»â€¡u
```

Avoid vague labels:

```txt
OK
Yes
Submit
Action
Click
Done
```

English technical terms are allowed only when they are product/technical concepts:

```txt
API
RAG
AI
JWT
Redis
WebSocket
Dashboard
```

---

## 6. Status text

Use concise status labels.

Examples:

```txt
Ã„Âang chÃ¡Â»Â
Ã„Âang xÃ¡Â»Â­ lÃƒÂ½
Ã„Âang sÃ¡Â»Â­a chÃ¡Â»Â¯a
Ã„ÂÃƒÂ£ hoÃƒÂ n tÃ¡ÂºÂ¥t
Ã„ÂÃƒÂ£ hÃ¡Â»Â§y
QuÃƒÂ¡ hÃ¡ÂºÂ¡n
BÃ¡Â»â€¹ kÃ¡ÂºÂ¹t
Nguy hiÃ¡Â»Æ’m
HoÃ¡ÂºÂ¡t Ã„â€˜Ã¡Â»â„¢ng
BÃ¡Â»â€¹ khÃƒÂ³a
Ã„ÂÃƒÂ£ xÃƒÂ¡c minh
ChÃ†Â°a xÃƒÂ¡c minh
TrÃ¡Â»Â±c tuyÃ¡ÂºÂ¿n
NgoÃ¡ÂºÂ¡i tuyÃ¡ÂºÂ¿n
```

Status labels should be short enough for badges.

Do not write long sentences inside small badges.

---

## 7. Code identifier rule

Vietnamese text is allowed in user-facing strings.

Do not use Vietnamese accents in code identifiers.

Correct:

```ts
const accountStatusLabel = "TrÃ¡ÂºÂ¡ng thÃƒÂ¡i tÃƒÂ i khoÃ¡ÂºÂ£n";
const technicianRoleLabel = "KÃ¡Â»Â¹ thuÃ¡ÂºÂ­t viÃƒÂªn";
```

Wrong:

```ts
const trÃ¡ÂºÂ¡ngThÃƒÂ¡iTÃƒÂ iKhoÃ¡ÂºÂ£n = "TrÃ¡ÂºÂ¡ng thÃƒÂ¡i tÃƒÂ i khoÃ¡ÂºÂ£n";
const kÃ¡Â»Â¹ThuÃ¡ÂºÂ­tViÃƒÂªn = "KÃ¡Â»Â¹ thuÃ¡ÂºÂ­t viÃƒÂªn";
```

Code identifiers should stay English or ASCII-safe.

User-facing strings should remain Vietnamese with accents.

---

## 8. Search before mass replacement

Before doing broad Vietnamese text replacement, search the affected phrase.

Do not mass replace across the repo unless explicitly requested.

For broken encoding:

1. Search exact broken phrase.
2. Patch only matching UI strings.
3. Avoid generated folders.
4. Inspect diff.

Never edit generated/cache/build folders for encoding fixes:

```txt
.next
dist
node_modules
tsconfig.tsbuildinfo
```

unless the task explicitly concerns generated output.

---

## 9. Theme and typography note

Do not fix Vietnamese readability by removing accents.

If Vietnamese text looks cramped or broken visually, inspect:

* font family;
* font weight;
* line height;
* text color contrast;
* container width;
* truncation behavior.

Keep accents intact.

---

## 10. Verification

After editing Vietnamese text, inspect:

```bash
git diff --stat
git diff --check
git diff
```

Check that:

* only intended text changed;
* accents are correct;
* no mojibake remains in changed lines;
* file encoding was not damaged;
* no unrelated formatting happened.

If unsure about the correct Vietnamese phrase, report uncertainty instead of guessing.

---

## 11. Final response format

After a Vietnamese text/encoding change, respond with:

```txt
Summary:
- Fixed corrupted Vietnamese text / updated Vietnamese labels.

Modified:
- path/to/file.tsx Ã¢â‚¬â€ corrected Vietnamese UI text.

Verification:
- git diff --stat: checked / not run
- git diff --check: passed / failed / not run
```

Keep the response short.
