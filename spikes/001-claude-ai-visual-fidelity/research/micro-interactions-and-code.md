# Deep-Dive: Claude Micro-Interactions, Syntax Highlighting & Sensory Fidelity

**Date**: 2026-10-02  
**Target Issue**: [#1](https://github.com/Christian-Gennari/paseo/issues/1)  
**Deliverable**: Comprehensive specifications for Claude.ai's code highlighting, chrome, streaming physics, and micro-interactions.

---

## 1. Syntax Highlighting: "Quieter than an IDE"

In consumer IDEs (VS Code, JetBrains), syntax highlighters use highly saturated, high-contrast neon accents to draw the eye to syntax errors. In Claude.ai, syntax highlighting is intentionally **restrained, low-contrast, and warm** so it never competes with conversational prose.

### Claude Dark Syntax Token Palette (Warm-Stone Mapped)

| Syntax Token           | Traditional IDE (GitHub Dark) | Claude.ai Restrained Palette | Rationale                                              |
| ---------------------- | ----------------------------- | ---------------------------- | ------------------------------------------------------ |
| **Background**         | `#0d1117`                     | `#171716` / `#191817`        | Aligns seamlessly with warm-stone surface scale        |
| **Base / Punctuation** | `#c9d1d9`                     | `#d4d1cb`                    | Warm off-white, legible without glare                  |
| **Keyword**            | `#ff7b72` (Harsh Pink/Red)    | `#e07a5f` / `#cf8e6d`        | Soft terracotta / clay tone                            |
| **String / Literal**   | `#a5d6ff` (Bright Blue)       | `#99c794` / `#8abeb7`        | Muted sage / olive green                               |
| **Function / Method**  | `#d2a8ff` (Neon Purple)       | `#82aaff` / `#7ca5b8`        | Soft steel blue                                        |
| **Comment**            | `#8b949e` (Cold Gray)         | `#7c7975`                    | Warm earthy gray (passing 4.5:1 contrast on `#171716`) |
| **Number / Constant**  | `#79c0ff`                     | `#f78c6c`                    | Soft coral                                             |
| **Type / Class**       | `#ffa657`                     | `#e5c07b`                    | Muted gold / ochre                                     |
| **Operator**           | `#79c0ff`                     | `#b0ada8`                    | Muted neutral, not loud blue                           |

### Highlighting Invariants:

1. **Explicit Language Mapping**: Unlabeled or unknown code fences fall back gracefully to neutral plain text (`#d4d1cb`) rather than guessing wrong languages.
2. **Whitespace Preservation & Horizontal Overflow**: Code scrolls horizontally inside the fence body (`overflow-x: auto`) rather than stretching the chat column or wrapping commands awkwardly.
3. **Copy Source String**: Always copy the raw code string without trailing newlines or highlighted DOM tags.

---

## 2. Code Block Chrome: Subtle Boundary, Crisp Utility

- **Header Bar**:
  - Padded `8px 14px` with `#242321` background and `#2c2a27` bottom divider.
  - Displays the lowercase language slug (`ts`, `python`, `bash`) in `11.5px` Anthropic Sans.
  - Houses the **Copy** action on the far right.
- **Copy Button Interaction**:
  - Resting state: Soft icon + label with `opacity: 0.8`.
  - Press state: Transitions immediately to green checkmark (`Check` icon) + "Copied" text with tactile feedback.
  - Auto-resets after `1500ms`.
  - Announced to screen-readers via `accessibilityLabel`.

---

## 3. Streaming Text Smoothing (Physics, Not Typing Animations)

Claude's text stream feels noticeably smoother than OpenAI or standard ChatGPT interfaces:

- **No Character-by-Character Delays**: Claude does **not** artificially slow down output to simulate human typing.
- **Frame-Coalesced Rendering**: Incoming token chunks are batched and committed once per animation frame (`requestAnimationFrame`), eliminating layout thrashing and choppy jumps.
- **Stable Block Boundaries**: Markdown blocks maintain stable React keys to avoid re-rendering entire lists or code blocks as each token arrives.

---

## 4. Tool Invocation & Thinking Deck

- **Honest State Model**:
  - Explicit states: `Running`, `Completed`, `Failed`.
  - Active tool: Displays a miniature animated indicator + concise verb ("Searching...", "Reading auth.ts...").
  - Completed tool: Subdues to `#ada9a5` in a rounded chip (`border-radius: 16px`), leaving assistant prose as the hero.
  - Expansion: Tap/click toggles the full input/output payload. User toggle states are preserved across streaming updates.

---

## 5. Scroll Affordances & Floating Down Button

- **Sticky Auto-Follow**: Auto-scrolls only while the user is already docked at the bottom.
- **Upward Scroll Break**: A manual flick upwards immediately detaches auto-scroll, preserving the user's reading position without fighting their touch input.
- **Floating Pill**: Floating down button (`↓`) appears with a soft fade only when the viewport is > `120px` away from the bottom. Tapping it smoothly restores auto-follow.
