# Eastman Film Lab — Sign Design Reference

Source assets: `assets/reference/` (originals as supplied). Crops and swatches: `assets/exports/`.
Colors below were **sampled from pixels** in the originals. Fonts were **identified by eye**, not taken from source files, so confirm them against the original design files if you have them.

## Colors

The system has one accent color (orange) and one ink (black). Every secondary tone is an opacity tint of those two, so don't add new hues.

| Token | Hex | Use |
|---|---|---|
| `--eastman-orange` | `#F6853D` | Brand color. Full-bleed orange panels; all text on black panels |
| `--ink` | `#000000` | Full-bleed black panels; all text on orange panels |
| `--paper` | `#F5F5F5` | Light panel background (the "first visit" / QR panel) |
| `--white` | `#FFFFFF` | QR code card background |

**Tints on black** (orange text or rules drawn at reduced opacity):
| Hex | ≈ Opacity | Use |
|---|---|---|
| `#B1602C` | orange 72% | Sub-lines (`JPEG, 3000 x 2000 px`), footer notes |
| `#985225` | orange 60% | Section labels (`C-41 컬러 현상/스캔`) |
| `#452511` | orange 28% | Hairline dividers |

**Tints on orange** (black text or rules drawn at reduced opacity):
| Hex | ≈ Opacity | Use |
|---|---|---|
| `#492712` | black 70% | Section labels (`FILM PROCESS 현상 · 스캔 · 인화`) |
| `#6E3B1B` | black 55% | Secondary / dimmed terms (`미노광 Unexposed`) |
| `#A75A29` | black 32% | Hairline dividers |

**On paper:** black for headlines; `#484848` (black 72%) for secondary text.

The webp price list has `#F6843E`, which is the same orange with compression drift. Use `#F6853D`.

## Typography

| Role | Look in the reference | Recommended font |
|---|---|---|
| Wordmark "Eastman Film Lab" | Neo-grotesque bold with tight negative tracking, double-story `a` | **Helvetica Neue Bold** (fallback: Inter Bold / Arial Bold), letter-spacing ≈ −0.03em |
| Tagline "film develop service" | Same family, much smaller, set tight just under the wordmark | Helvetica Neue Bold / Medium, ≈ 32–35% of the wordmark size |
| Item names / prices (`Basic 일반화질`, `6.0`) | Bold sans with Latin and Hangul mixed | **Pretendard Bold** (fallback: Apple SD Gothic Neo Bold / Noto Sans KR Bold) |
| Sub-lines (`JPEG, 6700 x 4400 px`) | Regular weight, about 60% of the item size | Pretendard Regular |
| Section labels (`C-41 컬러 현상/스캔`, `PRINT 인화`) | Small bold uppercase with wide tracking | Pretendard SemiBold, letter-spacing ≈ +0.15–0.2em, ≈ 45% of the item size |
| Body / footnotes | Regular Korean text, slightly wide | Noto Sans KR / Pretendard Regular, with `*` prefix for notes |
| Big Korean headline (`첫방문이신가요?`) | Heavy Hangul display | Pretendard ExtraBold / Black, tight leading (≈ 1.1) |
| Handle `@EASTMAN_LAB` | Bold uppercase, widely tracked | Pretendard Bold, letter-spacing ≈ +0.2em |

## Layout conventions

- Left-aligned wordmark block at top-left, followed by a full-width hairline divider.
- Price rows: name on the left, price right-aligned (flush right), same size and weight. Prices use one decimal (`6.0`, `0.5`) and no currency symbol, since the unit is implied as ₩10,000.
- Sub-line directly under the item name in a tint color. Sections are separated by generous vertical space rather than boxes.
- Numbered steps (`01`, `02`, `03`) in the label style, with outlined line icons (film canister → film strip → JPG → print) drawn in ink at a consistent stroke weight.
- A hairline divider comes before the footer notes. Footnotes start with `*`.
- Panels are flat solid color: no gradients, shadows or textures. Only the white QR card has rounded corners.
- Tone of copy: polite Korean with a friendly `:)` at the end of some notes.

## Current content (for reuse)

- **C-41 컬러 현상/스캔** — Basic 일반화질 6.0 (JPEG 3000×2000) · High 고화질 12.0 (JPEG 6700×4400) · 120 Medium Format 중형필름 10.0
- **B&W 흑백 현상/스캔** — Basic 10.0 · High 15.0 · 120 Medium Format 12.0 — *흑백필름은 수작업으로 시간이 하루 이상 소요됩니다.*
- **E-6 Slide 포지티브 필름** 15.0
- **PRINT 인화** — 4×6 0.5 · 3×5 0.4 · 5×7 0.7
- Kakao channel: 이스트만랩 (QR in `assets/exports/kakao-channel-qr.png`) · Instagram `@EASTMAN_LAB`

Machine-readable tokens: `assets/brand/tokens.css`, `assets/brand/tokens.json`.
