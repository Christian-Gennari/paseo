import { describe, expect, it } from "vitest";
import { createAssistantMarkdownParser } from "./assistant-markdown-parser";

describe("createAssistantMarkdownParser", () => {
  it("keeps bold text bold through every partial closing marker", () => {
    const parser = createAssistantMarkdownParser({ streaming: true });

    for (const source of ["**bold", "**bold*", "**bold**"]) {
      expect(parser.renderInline(source)).toBe("<strong>bold</strong>");
    }
  });

  it("shows the growing link label and only links a complete destination", () => {
    const parser = createAssistantMarkdownParser({ streaming: true });
    const source = "[docs](https://example.com/path)";
    for (let length = 1; length < source.length; length++) {
      expect(parser.renderInline(source.slice(0, length))).toBe(
        "docs".slice(0, Math.max(0, length - 1)),
      );
    }
    expect(parser.renderInline(source)).toBe('<a href="https://example.com/path">docs</a>');
  });

  it.each([
    ["**", "strong"],
    ["__", "strong"],
    ["*", "em"],
    ["_", "em"],
    ["~~", "s"],
    ["`", "code"],
    ["``", "code"],
  ])("keeps %s formatting stable as text and closing markers arrive", (marker, tag) => {
    const parser = createAssistantMarkdownParser({ streaming: true });
    for (let length = 1; length <= 4; length++) {
      expect(parser.renderInline(marker + "text".slice(0, length))).toBe(
        `<${tag}>${"text".slice(0, length)}</${tag}>`,
      );
    }
    for (let length = 0; length <= marker.length; length++) {
      expect(parser.renderInline(marker + "text" + marker.slice(0, length))).toBe(
        `<${tag}>text</${tag}>`,
      );
    }
  });

  it("keeps combined and nested emphasis stable through closing markers", () => {
    const parser = createAssistantMarkdownParser({ streaming: true });
    for (const closing of ["", "*", "**", "***"]) {
      expect(parser.renderInline("***both" + closing)).toBe("<em><strong>both</strong></em>");
    }
    expect(parser.renderInline("**bold and *italic")).toBe(
      "<strong>bold and <em>italic</em></strong>",
    );
    expect(parser.renderInline("*italic and **bold")).toBe(
      "<em>italic and <strong>bold</strong></em>",
    );
  });

  it.each(["*", "**", "***", "_", "__", "~~", "`", "``"])(
    "hides an opening %s while waiting for its text",
    (marker) => {
      expect(
        createAssistantMarkdownParser({ streaming: true }).renderInline("hello " + marker),
      ).toBe("hello ");
    },
  );

  it.each([
    "[docs](https://example.com/a(b)c)",
    '[docs](https://example.com "a title)")',
    "[docs](<https://example.com/a(b)>)",
    "[docs](file:///tmp/example.ts)",
  ])("waits for the entire destination of %s", (source) => {
    const parser = createAssistantMarkdownParser({ streaming: true });
    for (let length = 6; length < source.length; length++) {
      expect(parser.renderInline(source.slice(0, length))).toBe("docs");
    }
    expect(parser.renderInline(source)).toBe(createAssistantMarkdownParser().renderInline(source));
  });

  it("preserves formatting in incomplete labels and around incomplete links", () => {
    const parser = createAssistantMarkdownParser({ streaming: true });
    expect(parser.renderInline("[**bold")).toBe("<strong>bold</strong>");
    expect(parser.renderInline("[**bold**](https://exam")).toBe("<strong>bold</strong>");
    expect(parser.renderInline("**see [docs](https://exam")).toBe("<strong>see docs</strong>");
  });

  it("does not auto-link a URL label before the destination is complete", () => {
    const parser = createAssistantMarkdownParser({ streaming: true });
    expect(parser.renderInline("Read [example.com](https://exam")).toBe("Read example.com");
    expect(parser.renderInline("Read [example.com](https://example.org)")).toBe(
      'Read <a href="https://example.org">example.com</a>',
    );
  });

  it.each([
    "\\*literal",
    "\\[literal",
    "some_identifier",
    "some__identifier",
    "`**literal [link](url`",
    "``a ` b``",
    "**already closed** after",
    "[bad](javascript:alert(1))",
    "<component",
    "$$price",
    "20~25",
  ])("preserves literal and complete inline text: %s", (source) => {
    expect(createAssistantMarkdownParser({ streaming: true }).renderInline(source)).toBe(
      createAssistantMarkdownParser().renderInline(source),
    );
  });

  it.each([
    "```md\n**literal [link](url",
    "~~~md\n**literal [link](url",
    "    **literal [link](url",
    "**earlier\n\nplain tail",
    "- **earlier\n- plain tail",
  ])("leaves literal code and earlier blocks alone: %s", (source) => {
    expect(createAssistantMarkdownParser({ streaming: true }).render(source)).toBe(
      createAssistantMarkdownParser().render(source),
    );
  });

  it("completes inline formatting inside the final list item", () => {
    expect(createAssistantMarkdownParser({ streaming: true }).render("- first\n- **bold")).toBe(
      "<ul>\n<li>first</li>\n<li><strong>bold</strong></li>\n</ul>\n",
    );
  });

  it("hides incomplete images until their source is complete", () => {
    const parser = createAssistantMarkdownParser({ streaming: true });
    expect(parser.renderInline("before ![alt](https://exam")).toBe("before ");
    expect(parser.renderInline("before ![alt](https://example.com/image.png)")).toBe(
      'before <img src="https://example.com/image.png" alt="alt">',
    );
  });

  it("keeps ordinary parsing for completed messages", () => {
    const parser = createAssistantMarkdownParser();
    expect(parser.renderInline("**unfinished")).toBe("**unfinished");
    expect(parser.renderInline("[unfinished")).toBe("[unfinished");
  });

  it("renders agent text verbatim", () => {
    const parser = createAssistantMarkdownParser();

    // The reported bug, plus the substitutions that share its cause.
    expect(parser.renderInline("(c) (C) (r) (tm) (p)")).toBe("(c) (C) (r) (tm) (p)");
    expect(parser.renderInline("wait for it...")).toBe("wait for it...");
    expect(parser.renderInline("a -- b")).toBe("a -- b");
    // Smart quotes are off too: a curled quote is not pasteable into a shell.
    expect(parser.renderInline(`run --name="my repo"`)).toBe("run --name=&quot;my repo&quot;");
    expect(parser.renderInline("it's fine")).toBe("it's fine");
  });

  it("allows file:// links, unlike every other parser", () => {
    const parser = createAssistantMarkdownParser();

    expect(parser.render("[open](file:///tmp/a.ts)")).toContain('href="file:///tmp/a.ts"');
  });

  it("still rejects javascript: links", () => {
    const parser = createAssistantMarkdownParser();

    expect(parser.render("[x](javascript:alert(1))")).not.toContain("href");
  });

  it("folds a parenthesized URL into the reference it repeats", () => {
    const parser = createAssistantMarkdownParser();
    const url = "https://github.com/Christian-Gennari/Nostos/pull/672";

    expect(
      parser.renderInline(`The fix is merged into \`main\` as PR #672 (${url}), squash-merged.`),
    ).toBe(
      `The fix is merged into <code>main</code> as <a href="${url}">PR #672</a>, squash-merged.`,
    );
    expect(parser.renderInline(`#672 (${url})`)).toBe(`<a href="${url}">#672</a>`);
    expect(parser.renderInline(`See issue #12 (<https://github.com/o/r/issues/12>).`)).toBe(
      'See <a href="https://github.com/o/r/issues/12">issue #12</a>.',
    );
    expect(
      parser.renderInline("Landed in abc1234 (https://github.com/o/r/commit/abc1234def)"),
    ).toBe('Landed in <a href="https://github.com/o/r/commit/abc1234def">abc1234</a>');
  });

  it("folds a parenthesized URL into the formatted span before it", () => {
    const parser = createAssistantMarkdownParser();

    expect(parser.renderInline("Use `zod` (https://zod.dev) here")).toBe(
      'Use <a href="https://zod.dev"><code>zod</code></a> here',
    );
    expect(parser.renderInline("**Zod *docs*** (https://zod.dev)")).toBe(
      '<a href="https://zod.dev"><strong>Zod <em>docs</em></strong></a>',
    );
  });

  it("folds parenthesized URLs while streaming and inside blocks", () => {
    const parser = createAssistantMarkdownParser({ streaming: true });

    expect(parser.render("- PR #3 (https://github.com/o/r/pull/3)")).toBe(
      '<ul>\n<li><a href="https://github.com/o/r/pull/3">PR #3</a></li>\n</ul>\n',
    );
  });

  it.each([
    "see the docs (https://example.com) for more",
    "PR #672 (https://github.com/o/r/pull/673)",
    "PR #672 (see https://github.com/o/r/pull/672)",
    "PR #672 (https://github.com/o/r/pull/672 and more)",
    "PR #672 https://github.com/o/r/pull/672",
    "[**docs**](https://a.example) (https://b.example)",
    "`PR #1 (https://github.com/o/r/pull/1)`",
  ])("keeps the URL when the label is ambiguous: %s", (source) => {
    const plain = createAssistantMarkdownParser();
    plain.core.ruler.disable("collapse_parenthesized_links");

    expect(createAssistantMarkdownParser().renderInline(source)).toBe(plain.renderInline(source));
  });
});
