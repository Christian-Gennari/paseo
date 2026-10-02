import { FONT_SIZE, type Theme } from "./theme";
import { isWeb } from "@/constants/platform";

const webSelectableTextStyle = isWeb ? { userSelect: "text" as const } : {};

function contentHeadingSize(contentSize: number, tier: keyof typeof FONT_SIZE): number {
  return Math.round(contentSize * (FONT_SIZE[tier] / FONT_SIZE.base));
}

function contentHeadingLineHeight(contentSize: number, tier: keyof typeof FONT_SIZE): number {
  return Math.round(contentHeadingSize(contentSize, tier) * 1.3);
}

// Tight tracking for the H1-H4 tier. React Native takes letter-spacing in points,
// so the em value is resolved against the heading's own size.
function contentHeadingTracking(contentSize: number, tier: keyof typeof FONT_SIZE): number {
  return contentHeadingSize(contentSize, tier) * -0.015;
}

const PROSE_LINE_HEIGHT = 1.62;

// Inline code sits inside prose, so it scales with the content size rather than
// the code size: 13.5 beside the 15px default. Rounded to the half point.
function inlineCodeSize(contentSize: number): number {
  return Math.round(contentSize * 0.9 * 2) / 2;
}

/**
 * Creates comprehensive markdown styles for react-native-markdown-display.
 *
 * Usage:
 *   const markdownStyles = useMemo(() => createMarkdownStyles(theme), [theme]);
 *   <Markdown style={markdownStyles} markdownit={parser}>{content}</Markdown>
 *
 * Always pass `markdownit` from `@/utils/markdown-parser`. Omit it and
 * react-native-markdown-display builds its own parser with `typographer: true`,
 * which rewrites a literal `(c)` as ©.
 */
export function createMarkdownStyles(theme: Theme) {
  return {
    // =========================================================================
    // BASE STYLES
    // =========================================================================

    body: {
      ...webSelectableTextStyle,
      color: theme.colors.foreground,
      fontSize: theme.fontSize.content,
      // Prose line-height scales with the content size, not the
      // code-size-coupled lineHeight.diff token used by code/diff surfaces.
      lineHeight: Math.round(theme.fontSize.content * 1.4),
      flexShrink: 1,
      minWidth: 0,
      width: "100%" as const,
    },

    text: {
      ...webSelectableTextStyle,
      flexShrink: 1,
      minWidth: 0,
      overflowWrap: "anywhere" as const,
    },

    paragraph: {
      marginTop: 0,
      marginBottom: theme.spacing[3],
      flexWrap: "wrap" as const,
      flexDirection: "row" as const,
      alignItems: "flex-start" as const,
      justifyContent: "flex-start" as const,
      flexShrink: 1,
      minWidth: 0,
      width: "100%" as const,
    },

    // =========================================================================
    // HEADINGS
    // =========================================================================

    heading1: {
      ...webSelectableTextStyle,
      fontSize: contentHeadingSize(theme.fontSize.content, "4xl"),
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.foreground,
      marginTop: theme.spacing[6],
      marginBottom: theme.spacing[3],
      lineHeight: contentHeadingLineHeight(theme.fontSize.content, "4xl"),
      fontFamily: theme.fontFamily.ui,
      letterSpacing: contentHeadingTracking(theme.fontSize.content, "4xl"),
    },

    heading2: {
      ...webSelectableTextStyle,
      fontSize: contentHeadingSize(theme.fontSize.content, "3xl"),
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.foreground,
      marginTop: theme.spacing[6],
      marginBottom: theme.spacing[3],
      lineHeight: contentHeadingLineHeight(theme.fontSize.content, "3xl"),
      fontFamily: theme.fontFamily.ui,
      letterSpacing: contentHeadingTracking(theme.fontSize.content, "3xl"),
    },

    heading3: {
      ...webSelectableTextStyle,
      fontSize: contentHeadingSize(theme.fontSize.content, "2xl"),
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.foreground,
      marginTop: theme.spacing[4],
      marginBottom: theme.spacing[2],
      lineHeight: contentHeadingLineHeight(theme.fontSize.content, "2xl"),
      fontFamily: theme.fontFamily.ui,
      letterSpacing: contentHeadingTracking(theme.fontSize.content, "2xl"),
    },

    heading4: {
      ...webSelectableTextStyle,
      fontSize: contentHeadingSize(theme.fontSize.content, "xl"),
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.foreground,
      marginTop: theme.spacing[4],
      marginBottom: theme.spacing[2],
      lineHeight: contentHeadingLineHeight(theme.fontSize.content, "xl"),
      fontFamily: theme.fontFamily.ui,
      letterSpacing: contentHeadingTracking(theme.fontSize.content, "xl"),
    },

    heading5: {
      ...webSelectableTextStyle,
      fontSize: contentHeadingSize(theme.fontSize.content, "lg"),
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.foreground,
      marginTop: theme.spacing[3],
      marginBottom: theme.spacing[1],
      lineHeight: contentHeadingLineHeight(theme.fontSize.content, "lg"),
      fontFamily: theme.fontFamily.ui,
    },

    heading6: {
      ...webSelectableTextStyle,
      fontSize: contentHeadingSize(theme.fontSize.content, "lg"),
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.foregroundMuted,
      marginTop: theme.spacing[3],
      marginBottom: theme.spacing[1],
      lineHeight: contentHeadingLineHeight(theme.fontSize.content, "lg"),
      fontFamily: theme.fontFamily.ui,
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
    },

    // =========================================================================
    // TEXT FORMATTING
    // =========================================================================

    strong: {
      ...webSelectableTextStyle,
      fontWeight: theme.fontWeight.medium,
    },

    em: {
      ...webSelectableTextStyle,
      fontStyle: "italic" as const,
    },

    s: {
      ...webSelectableTextStyle,
      textDecorationLine: "line-through" as const,
      color: theme.colors.foregroundMuted,
    },

    link: {
      ...webSelectableTextStyle,
      color: theme.colors.accentBright,
      textDecorationLine: "none" as const,
      flexShrink: 1,
      minWidth: 0,
      overflowWrap: "anywhere" as const,
    },

    blocklink: {
      ...webSelectableTextStyle,
      color: theme.colors.accentBright,
      textDecorationLine: "none" as const,
      flexShrink: 1,
      minWidth: 0,
      overflowWrap: "anywhere" as const,
    },

    // =========================================================================
    // CODE
    // =========================================================================

    code_inline: {
      ...webSelectableTextStyle,
      backgroundColor: theme.colors.surfaceCodeInline,
      color: theme.colors.foreground,
      paddingHorizontal: 5,
      paddingVertical: 1.5,
      borderRadius: 5,
      borderWidth: 0,
      fontFamily: theme.fontFamily.mono,
      fontSize: inlineCodeSize(theme.fontSize.content),
    },

    code_block: {
      ...webSelectableTextStyle,
      backgroundColor: theme.colors.surfaceCode,
      color: theme.colors.foreground,
      padding: theme.spacing[3],
      borderRadius: theme.borderRadius.lg,
      fontFamily: theme.fontFamily.mono,
      fontSize: theme.fontSize.code,
      marginVertical: theme.spacing[2],
    },

    fence: {
      ...webSelectableTextStyle,
      backgroundColor: theme.colors.surfaceCode,
      color: theme.colors.foreground,
      padding: theme.spacing[3],
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      fontFamily: theme.fontFamily.mono,
      fontSize: theme.fontSize.code,
      marginVertical: theme.spacing[3],
    },

    pre: {
      marginVertical: theme.spacing[2],
    },

    // =========================================================================
    // TABLES
    // =========================================================================

    table: {
      borderWidth: 0,
      marginVertical: theme.spacing[3],
    },

    thead: {},

    tbody: {},

    th: {
      ...webSelectableTextStyle,
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
      borderWidth: 0,
      fontFamily: theme.fontFamily.ui,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.foreground,
      fontSize: theme.fontSize.content,
      textAlign: "left" as const,
    },

    // Rows carry the only rule in the table: a hairline under each row, header
    // included. Cells have no vertical borders.
    tr: {
      borderBottomWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: "row" as const,
    },

    td: {
      ...webSelectableTextStyle,
      paddingVertical: theme.spacing[2],
      paddingHorizontal: theme.spacing[3],
      borderWidth: 0,
      fontFamily: theme.fontFamily.ui,
      color: theme.colors.foreground,
      fontSize: theme.fontSize.content,
      flex: 1,
    },

    // =========================================================================
    // LISTS
    // =========================================================================

    bullet_list: {
      paddingLeft: 0,
      width: "100%" as const,
    },

    ordered_list: {
      paddingLeft: 0,
      width: "100%" as const,
    },

    list_item: {
      marginBottom: theme.spacing[1],
      flexDirection: "row" as const,
      alignItems: "flex-start" as const,
      flexShrink: 1,
    },

    bullet_list_content: {
      flex: 1,
      flexShrink: 1,
    },

    ordered_list_content: {
      flex: 1,
      flexShrink: 1,
    },

    bullet_list_icon: {
      ...webSelectableTextStyle,
      color: theme.colors.foregroundMuted,
      marginRight: 4,
      fontSize: theme.fontSize.content,
      lineHeight: Math.round(theme.fontSize.content * 1.4),
    },

    ordered_list_icon: {
      ...webSelectableTextStyle,
      color: theme.colors.foregroundMuted,
      marginRight: 4,
      fontSize: theme.fontSize.content,
      fontWeight: theme.fontWeight.normal,
      lineHeight: Math.round(theme.fontSize.content * 1.4),
      minWidth: 12,
    },

    // =========================================================================
    // BLOCKQUOTE
    // =========================================================================

    blockquote: {
      backgroundColor: theme.colors.surface1,
      color: `${theme.colors.foreground}cc`,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.surface2,
      paddingHorizontal: theme.spacing[4],
      paddingTop: theme.spacing[3],
      paddingBottom: 0,
      marginVertical: theme.spacing[3],
      borderRadius: theme.borderRadius.md,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },

    // =========================================================================
    // HORIZONTAL RULE
    // =========================================================================

    hr: {
      backgroundColor: theme.colors.border,
      height: 1,
      marginVertical: 10,
    },

    // =========================================================================
    // IMAGES
    // =========================================================================

    image: {
      borderRadius: theme.borderRadius.md,
      marginVertical: theme.spacing[2],
    },

    // =========================================================================
    // BREAKS
    // =========================================================================

    hardbreak: {
      height: theme.spacing[2],
    },

    softbreak: {},
  };
}

/**
 * Creates a smaller variant of markdown styles for compact UI elements
 * like thought bubbles, tooltips, or side panels.
 */
export function createCompactMarkdownStyles(theme: Theme) {
  const baseStyles = createMarkdownStyles(theme);

  return {
    ...baseStyles,

    body: {
      ...baseStyles.body,
      fontSize: theme.fontSize.content,
      lineHeight: Math.round(theme.fontSize.content * 1.4),
    },

    heading1: {
      ...baseStyles.heading1,
      fontSize: contentHeadingSize(theme.fontSize.content, "2xl"),
      marginTop: theme.spacing[4],
      marginBottom: theme.spacing[2],
      lineHeight: contentHeadingLineHeight(theme.fontSize.content, "2xl"),
    },

    heading2: {
      ...baseStyles.heading2,
      fontSize: contentHeadingSize(theme.fontSize.content, "xl"),
      marginTop: theme.spacing[3],
      marginBottom: theme.spacing[2],
      lineHeight: contentHeadingLineHeight(theme.fontSize.content, "xl"),
    },

    heading3: {
      ...baseStyles.heading3,
      fontSize: contentHeadingSize(theme.fontSize.content, "lg"),
      marginTop: theme.spacing[3],
      marginBottom: theme.spacing[1],
      lineHeight: contentHeadingLineHeight(theme.fontSize.content, "lg"),
    },

    paragraph: {
      ...baseStyles.paragraph,
      marginBottom: theme.spacing[2],
    },

    code_block: {
      ...baseStyles.code_block,
      fontSize: theme.fontSize.code,
      padding: theme.spacing[2],
    },

    fence: {
      ...baseStyles.fence,
      fontSize: theme.fontSize.code,
      padding: theme.spacing[2],
    },
  };
}

/**
 * Assistant narrative: a serif reading face at a looser leading. Only the body
 * face changes — headings, table cells and code name their own font family, so
 * they stay sans and mono inside serif prose.
 */
export function createProseMarkdownStyles(theme: Theme) {
  const baseStyles = createMarkdownStyles(theme);
  const lineHeight = Math.round(theme.fontSize.content * PROSE_LINE_HEIGHT);

  return {
    ...baseStyles,

    body: {
      ...baseStyles.body,
      fontFamily: theme.fontFamily.prose,
      lineHeight,
    },

    // Serif faces ship regular and bold; a 500 weight resolves to regular and the
    // emphasis disappears.
    strong: {
      ...baseStyles.strong,
      fontWeight: theme.fontWeight.semibold,
    },

    bullet_list_icon: {
      ...baseStyles.bullet_list_icon,
      fontFamily: theme.fontFamily.prose,
      lineHeight,
    },

    ordered_list_icon: {
      ...baseStyles.ordered_list_icon,
      fontFamily: theme.fontFamily.prose,
      lineHeight,
    },
  };
}
