import { describe, expect, it } from "vitest";
import {
  createCompactMarkdownStyles,
  createMarkdownStyles,
  createProseMarkdownStyles,
} from "./markdown-styles";
import { darkTheme } from "./theme";

describe("createMarkdownStyles", () => {
  it("uses the content size for conversation prose and list markers", () => {
    const styles = createMarkdownStyles(darkTheme);
    const proseLineHeight = Math.round(darkTheme.fontSize.content * 1.4);

    expect(styles.body).toMatchObject({
      fontSize: darkTheme.fontSize.content,
      lineHeight: proseLineHeight,
    });
    expect(styles.bullet_list_icon).toMatchObject({
      fontSize: darkTheme.fontSize.content,
      lineHeight: proseLineHeight,
    });
    expect(styles.ordered_list_icon).toMatchObject({
      fontSize: darkTheme.fontSize.content,
      lineHeight: proseLineHeight,
    });
  });

  it("applies shrink-and-wrap constraints to long markdown text and links", () => {
    const styles = createMarkdownStyles(darkTheme);

    expect(styles.body).toMatchObject({
      flexShrink: 1,
      minWidth: 0,
      width: "100%",
    });

    expect(styles.paragraph).toMatchObject({
      flexShrink: 1,
      minWidth: 0,
      width: "100%",
      flexWrap: "wrap",
    });

    expect(styles.text).toMatchObject({
      flexShrink: 1,
      minWidth: 0,
      overflowWrap: "anywhere",
    });

    expect(styles.link).toMatchObject({
      flexShrink: 1,
      minWidth: 0,
      overflowWrap: "anywhere",
    });

    expect(styles.blocklink).toMatchObject({
      flexShrink: 1,
      minWidth: 0,
      overflowWrap: "anywhere",
    });
  });

  it("keeps assistant markdown text selectable on web", () => {
    const styles = createMarkdownStyles(darkTheme);

    expect(styles.body).toMatchObject({
      userSelect: "text",
    });
    expect(styles.text).toMatchObject({
      userSelect: "text",
    });
    expect(styles.heading1).toMatchObject({
      userSelect: "text",
    });
    expect(styles.link).toMatchObject({
      userSelect: "text",
    });
    expect(styles.code_inline).toMatchObject({
      userSelect: "text",
    });
    expect(styles.code_block).toMatchObject({
      userSelect: "text",
    });
    expect(styles.fence).toMatchObject({
      userSelect: "text",
    });
    expect(styles.bullet_list_icon).toMatchObject({
      userSelect: "text",
    });
    expect(styles.ordered_list_icon).toMatchObject({
      userSelect: "text",
    });
  });

  it("uses the mono font-size token directly for block code", () => {
    const styles = createMarkdownStyles(darkTheme);
    const compactStyles = createCompactMarkdownStyles(darkTheme);

    expect(styles.code_inline).not.toHaveProperty("lineHeight");
    expect(styles.code_block).toMatchObject({
      fontFamily: darkTheme.fontFamily.mono,
      fontSize: darkTheme.fontSize.code,
    });
    expect(styles.fence).toMatchObject({
      fontFamily: darkTheme.fontFamily.mono,
      fontSize: darkTheme.fontSize.code,
    });
    expect(compactStyles.code_inline).not.toHaveProperty("lineHeight");
  });

  it("sizes inline code chips from the content size, not the code size", () => {
    const largeCodeTheme = {
      ...darkTheme,
      fontSize: { ...darkTheme.fontSize, content: 15, code: 20 },
    };

    for (const styles of [
      createMarkdownStyles(largeCodeTheme),
      createCompactMarkdownStyles(largeCodeTheme),
      createProseMarkdownStyles(largeCodeTheme),
    ]) {
      expect(styles.code_inline).toMatchObject({
        fontFamily: largeCodeTheme.fontFamily.mono,
        fontSize: 13.5,
        backgroundColor: largeCodeTheme.colors.surfaceCodeInline,
        borderRadius: 5,
      });
    }
  });

  it("puts fences on the code surface with a hairline border", () => {
    const styles = createMarkdownStyles(darkTheme);

    expect(styles.fence).toMatchObject({
      backgroundColor: darkTheme.colors.surfaceCode,
      borderWidth: 1,
      borderColor: darkTheme.colors.border,
    });
  });

  it("sets headings in the interface face with tight tracking and no rule", () => {
    const styles = createProseMarkdownStyles(darkTheme);

    for (const heading of [styles.heading1, styles.heading2, styles.heading3, styles.heading4]) {
      expect(heading.fontFamily).toBe(darkTheme.fontFamily.ui);
      expect(heading.letterSpacing).toBeCloseTo(heading.fontSize * -0.015);
      expect(heading).not.toHaveProperty("borderBottomWidth");
    }
  });

  it("keeps table rows on hairlines with no cell borders", () => {
    const styles = createMarkdownStyles(darkTheme);

    expect(styles.table.borderWidth).toBe(0);
    expect(styles.tr).toMatchObject({ borderBottomWidth: 1, borderColor: darkTheme.colors.border });
    expect(styles.th.borderWidth).toBe(0);
    expect(styles.td).toMatchObject({
      borderWidth: 0,
      paddingVertical: darkTheme.spacing[2],
      paddingHorizontal: darkTheme.spacing[3],
    });
  });

  it("scales Markdown headings from content size with safe line heights", () => {
    const largeContentTheme = {
      ...darkTheme,
      fontSize: { ...darkTheme.fontSize, content: 21 },
    };
    const styles = createMarkdownStyles(largeContentTheme);

    expect(styles.heading1.lineHeight).toBeGreaterThan(styles.heading1.fontSize);
    expect(styles.heading2.lineHeight).toBeGreaterThan(styles.heading2.fontSize);
    expect(styles.heading3.lineHeight).toBeGreaterThan(styles.heading3.fontSize);
  });

  it("keeps blockquotes quiet with a square left edge", () => {
    const styles = createMarkdownStyles(darkTheme);

    expect(styles.blockquote).toMatchObject({
      backgroundColor: darkTheme.colors.surface1,
      color: `${darkTheme.colors.foreground}cc`,
      borderLeftColor: darkTheme.colors.surface2,
      paddingTop: darkTheme.spacing[3],
      paddingBottom: 0,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    });
    expect(styles.paragraph.marginBottom).toBe(darkTheme.spacing[3]);
    expect(styles.text).not.toHaveProperty("color");
  });
});

describe("createProseMarkdownStyles", () => {
  it("sets assistant narrative in the prose face at a 1.62 leading", () => {
    const styles = createProseMarkdownStyles(darkTheme);
    const proseLineHeight = Math.round(darkTheme.fontSize.content * 1.62);

    expect(styles.body).toMatchObject({
      fontFamily: darkTheme.fontFamily.prose,
      fontSize: darkTheme.fontSize.content,
      lineHeight: proseLineHeight,
    });
    expect(styles.bullet_list_icon).toMatchObject({
      fontFamily: darkTheme.fontFamily.prose,
      lineHeight: proseLineHeight,
    });
    expect(styles.ordered_list_icon).toMatchObject({
      fontFamily: darkTheme.fontFamily.prose,
      lineHeight: proseLineHeight,
    });
  });

  it("keeps the serif out of tables and code", () => {
    const styles = createProseMarkdownStyles(darkTheme);

    expect(styles.th.fontFamily).toBe(darkTheme.fontFamily.ui);
    expect(styles.td.fontFamily).toBe(darkTheme.fontFamily.ui);
    expect(styles.code_inline.fontFamily).toBe(darkTheme.fontFamily.mono);
    expect(styles.fence.fontFamily).toBe(darkTheme.fontFamily.mono);
  });

  it("leaves the shared and compact variants in the interface face", () => {
    expect(createMarkdownStyles(darkTheme).body).not.toHaveProperty("fontFamily");
    expect(createCompactMarkdownStyles(darkTheme).body).not.toHaveProperty("fontFamily");
  });

  it("uses a weight for strong text that a serif face can render", () => {
    expect(createProseMarkdownStyles(darkTheme).strong.fontWeight).toBe(
      darkTheme.fontWeight.semibold,
    );
  });
});
