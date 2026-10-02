# Spike 001: Claude.ai Visual Fidelity

**Target Issue**: [#1](https://github.com/Christian-Gennari/paseo/issues/1)  
**Status**: Completed  
**Artifacts**:
- Research Analysis: [`research/tokens-and-layout.md`](research/tokens-and-layout.md)
- Interactive Demonstration Prototype: [`prototype/claude-fidelity-demo.html`](prototype/claude-fidelity-demo.html)

---

## 1. Feasibility & Decomposition Analysis

| # | Question / Sub-Spike | Validation Method | Verdict |
|---|---|---|---|
| **001a** | Can Paseo's built-in Unistyles theme tokens support Claude.ai's exact warm-stone color scale without rewriting core views? | Inspected `packages/app/src/styles/theme.ts` (`claudeDarkColors`). Compared tokens against scraped Claude.ai CSS. | **VALIDATED** |
| **001b** | Can Anthropic typography (Sans, Serif, Mono) be served locally and mapped to React Native Web / Unistyles without breaking layout? | Tested local `.woff2` font loading, font-family cascading, and markdown inline chip isolation. | **VALIDATED** |
| **001c** | Can the desktop chat measure be constrained to 780px while keeping mobile full-width with safe gutters? | Built responsive container constraints in prototype and validated across mobile and desktop viewports. | **VALIDATED** |
| **001d** | Can the composer be elevated into a floating pill with terracotta focus cues? | Verified in prototype; requires styling `[data-testid="message-input-root"]` with `border-radius: 20px` and focus glow. | **VALIDATED** |
| **001e** | Can agent activity/tools be compressed into compact summary pills? | Validated layout in `claude-fidelity-demo.html`. | **VALIDATED** |

---

## 2. Key Discoveries & Expert Consultation Takeaways

1. **Paseo Has Built-in Foundations**:
   Paseo already contains `claudeDark` in `theme.ts` with warm stone surfaces (`#1f1f1e`, `#1a1918`, `#262523`) and terracotta accents (`#d97757`). Activating it by default eliminates arbitrary color patching.

2. **Typography Nuance**:
   - Claude's identity is **not** making all assistant text serif. Headings must remain bold geometric Sans (`Anthropic Sans`).
   - Inline code chips (`data-paseo-markdown-tag="code"`) must use `Anthropic Mono` with subtle `rgba(255, 255, 255, 0.08)` backgrounds, completely isolated from serif inheritance.
   - Long-form prose paragraphs use `Anthropic Serif` with a generous line-height (`1.62`).

3. **Reading Measure**:
   Constraining the chat scroll container to `max-width: 780px` on desktop gives the signature editorial feel of Claude.ai, preventing stretched prose on widescreen displays.

---

## 3. Verdict: VALIDATED

### What Worked:
- Full color and token alignment with Anthropic Claude.ai design system.
- Clean typography hierarchy (Sans headers/UI, Serif prose, Mono code).
- Floating pill composer and centered reading geometry.

### Recommendation for Upstream Implementation:
1. In `packages/app/src/styles/theme.ts`:
   - Set default theme to `"claude"`.
   - Update fallback font stacks to `Anthropic Sans` and `Anthropic Mono`.
2. In `packages/app/src/styles/markdown-styles.ts`:
   - Increase paragraph line-height to `1.6`.
   - Explicitly style inline code tags with rounded corners and mono font family.
3. In web wrapper (`index.html` / web shell):
   - Add max-width 780px media query to the chat viewport container.
