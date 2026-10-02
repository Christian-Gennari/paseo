# Research: Claude.ai Design Tokens & Visual Architecture

**Date**: 2026-10-02  
**Target**: Anthropic Claude.ai (Web & Native Mobile App)  
**Objective**: Extract the design system primitives, color scales, typography rules, and spatial layout specs governing Claude.ai.

---

## 1. Color System: The Warm-Stone Elevation Hierarchy

Claude.ai avoids standard cold monochromatic gray or OLED pure-black. Instead, it is built on an earthy warm-stone scale (Stone / Clay undertones) with low-saturation surfaces and a signature terracotta accent.

| Token Role | Claude.ai Hex | Purpose / Placement | Paseo `claudeDark` Equivalent |
|---|---|---|---|
| **App Canvas / Page BG** | `#1e1e1e` / `#1f1f1e` | Base viewport background | `theme.colors.surface0` (`#1f1f1e`) |
| **Sidebar / Rail BG** | `#181817` / `#1a1918` | Darker, receded navigation surface | `theme.colors.surfaceSidebar` (`#1a1918`) |
| **Raised Card / Sheet** | `#262523` | Floating composer, modals, dropdowns | `theme.colors.surface1` (`#262523`) |
| **User Message Bubble** | `#2b2b2b` / `#2f2d2b` | Softly contrasting user speech card | `theme.colors.surface2` (`#2f2d2b`) |
| **Hover / Highlight Surface** | `#383532` | Interactive element hover | `theme.colors.surface3` (`#4a4745`) |
| **Primary Text (Prose)** | `#e5e3de` | Off-white, soft paper-like reading tone | `theme.colors.foreground` (`#fafafa` -> `#e5e3de`) |
| **Muted Text (Meta)** | `#ada9a5` | Timestamps, status pills, model names | `theme.colors.foregroundMuted` (`#ada9a5`) |
| **Hairline Borders** | `#36332f` / `#2c2a27` | Subtle card outlines, divider lines | `theme.colors.border` (`#2c2a27`) |
| **Terracotta Accent** | `#d97757` / `#cc785c` | Send button, focus ring, active highlights | `theme.colors.accent` (`#d97757`) |
| **Terracotta Glow** | `rgba(217, 119, 87, 0.18)` | Input focus glow / selection highlight | Custom focus ring box-shadow |

---

## 2. Typography Pairing System

Claude's identity is defined by a deliberate pairing:

1. **Anthropic Serif (Copernicus / Tiempos Text)**:
   - Reserved strictly for **Assistant Prose Responses**.
   - Body font-size: `16.5px` (1.03rem).
   - Line-height: `1.62` (looser, book-like leading).
   - Letter-spacing: `-0.005em`.
   - Paragraph spacing: `14px` bottom margin.

2. **Anthropic Sans (Styrene A)**:
   - Used for **User Messages, Headings, Navigation, Buttons, Inputs**.
   - Headings (H1–H4): Crisp geometric sans with `-0.015em` tracking and bold weight (600–700).
   - User Prompts: Rendered inside a compact, 20px-rounded pill.

3. **Anthropic Mono**:
   - Used for **Inline Code Chips, Code Fences, Diffs, and Terminal Panes**.
   - Inline code chips: `13.5px`, line-height `1.35`, background `rgba(255, 255, 255, 0.08)`, border-radius `5px`, padding `1.5px 5.5px`.
   - Code blocks: `#171716` background, `#2d2b28` hairline border, `8px` corner radius.

---

## 3. Spatial Geometry & Measure

- **Max Column Measure**: Desktop chat streams must not stretch beyond `780px` (`max-width: 780px; margin: 0 auto;`).
- **Composer Floating Pill**:
  - The composer sits detached from the bottom window edge with an `18px` bottom margin.
  - Border-radius: `20px` to `24px`.
  - Padded with `12px 18px`.
  - Subtle drop shadow: `0 4px 20px rgba(0, 0, 0, 0.28)`.
  - Focus state: Border transitions to `#d97757` with an ambient terracotta outer glow.

---

## 4. Agent Tool & Thinking Activity Deck

In contrast to raw developer logs, Claude presents tool execution as quiet, collapsible rows:
- Left-aligned icon + concise verb/noun (`Searching web...`, `Reading file.ts`).
- Small spinner during execution.
- Collapse/expand chevron to audit raw tool payloads.
- Completed tools dim slightly (`#ada9a5`) to let the assistant's prose remain the dominant visual anchor.
