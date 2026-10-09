# Spike 001: Claude.ai Visual & Interaction Fidelity

**Target Issue**: [#1](https://github.com/Christian-Gennari/paseo/issues/1)  
**Status**: Completed  
**Artifacts**:

- Research Analysis (Tokens & Layout): [`research/tokens-and-layout.md`](research/tokens-and-layout.md)
- Research Analysis (Micro-Interactions & Syntax): [`research/micro-interactions-and-code.md`](research/micro-interactions-and-code.md)
- Interactive Demonstration Prototype: [`prototype/claude-fidelity-demo.html`](prototype/claude-fidelity-demo.html)

---

## 1. Feasibility & Decomposition Analysis

| #        | Question / Sub-Spike                                                                                                               | Validation Method                                                                                                             | Verdict       |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------- |
| **001a** | Can Paseo's built-in Unistyles theme tokens support Claude.ai's exact warm-stone color scale without rewriting core views?         | Inspected `packages/app/src/styles/theme.ts` (`claudeDarkColors`). Compared tokens against scraped Claude.ai CSS.             | **VALIDATED** |
| **001b** | Can Anthropic typography (Sans, Serif, Mono) be served locally and mapped to React Native Web / Unistyles without breaking layout? | Tested local `.woff2` font loading, font-family cascading, and markdown inline chip isolation.                                | **VALIDATED** |
| **001c** | Can the desktop chat measure be constrained to 780px while keeping mobile full-width with safe gutters?                            | Built responsive container constraints in prototype and validated across mobile and desktop viewports.                        | **VALIDATED** |
| **001d** | Can the composer be elevated into a floating pill with terracotta focus cues?                                                      | Verified in prototype; requires styling `[data-testid="message-input-root"]` with `border-radius: 20px` and focus glow.       | **VALIDATED** |
| **001e** | Can code syntax highlighting achieve Claude's restrained, warm, low-contrast palette rather than glaring neon IDE colors?          | Formulated warm-stone syntax tokens (terracotta keywords, sage strings, steel blue functions, muted gold types) in prototype. | **VALIDATED** |
| **001f** | Can code block chrome provide subtle language headers and tactile copy feedback with horizontal scroll preservation?               | Built code header with tactile copy feedback button and verified `overflow-x: auto` preservation.                             | **VALIDATED** |

---

## 2. Key Discoveries & Expert Consultation Takeaways

1. **Syntax Highlighting: "Quieter than an IDE"**:
   Claude avoids high-contrast neon tokens. Tokens use a warm, muted palette (`#e07a5f` terracotta keywords, `#99c794` sage strings, `#82aaff` steel blue functions, `#7c7975` warm earthy comments) on an obsidian `#171716` surface. Fences preserve whitespace with internal horizontal scrolling.
2. **Typography Nuance**:
   - Claude's identity is **not** making all assistant text serif. Headings must remain bold geometric Sans (`Anthropic Sans`).
   - Inline code chips (`data-paseo-markdown-tag="code"`) must use `Anthropic Mono` with subtle `rgba(255, 255, 255, 0.08)` backgrounds, completely isolated from serif inheritance.
   - Long-form prose paragraphs use `Anthropic Serif` with a generous line-height (`1.62`).
3. **Reading Measure & Spatial Rhythm**:
   Constraining the chat scroll container to `max-width: 780px` on desktop gives the signature editorial feel of Claude.ai. Floating composer pill with terracotta focus cues anchors the viewport.
4. **Streaming & Tool State Physics**:
   Avoid character-by-character artificial typing delays; buffer incoming deltas at 60fps frame commits (`requestAnimationFrame`) for silk-smooth rendering. Tool executions stay subdued in compact summary pills.

---

## 3. Verdict: VALIDATED

### Recommendation for Upstream Implementation:

1. In `packages/highlight/src/colors.ts`:
   - Replace default high-contrast dark tokens with Claude-restrained syntax colors.
2. In `packages/app/src/styles/theme.ts`:
   - Set default theme to `"claude"`.
   - Update fallback font stacks to `Anthropic Sans` and `Anthropic Mono`.
3. In `packages/app/src/styles/markdown-styles.ts`:
   - Increase paragraph line-height to `1.62`.
   - Explicitly style inline code tags with rounded corners and mono font family.
4. In web wrapper (`index.html` / web shell):
   - Add max-width 780px media query to the chat viewport container.
