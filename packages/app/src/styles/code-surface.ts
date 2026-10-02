// Marker for code / diff / monospace surfaces. On web, the app-wide interface-font
// rule (see screens/settings/appearance/apply-root-font.web.ts) targets
// app and overlay roots while excluding `[data-pmono]` subtrees, so tagging a code
// container with this dataSet keeps its monospace font. On native it renders nothing
// and is harmless. Use a shared stable reference so it doesn't trip the react-perf
// "new object as prop" rule.
export const CODE_SURFACE_DATASET = { pmono: "" } as const;

// Marker for assistant prose. The same interface-font rule skips `[data-pprose]`
// subtrees, so text inside takes the font family its own style names: serif for
// narrative, `fontFamily.ui` for headings and tables, mono for code. Text placed
// inside one needs an explicit font family.
export const PROSE_SURFACE_DATASET = { pprose: "" } as const;
