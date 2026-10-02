import type MarkdownIt from "markdown-it";
import type StateCore from "markdown-it/lib/rules_core/state_core.mjs";
import type Token from "markdown-it/lib/token.mjs";

const NUMBERED_REFERENCE_RE =
  /(?:(?:PR|MR|pull request|merge request|issue|discussion)\s+)?#(\d+)$/i;
const NUMBERED_URL_RE = /\/(?:pull|pulls|issues|discussions|merge_requests)\/(\d+)(?![\w-])/;
const COMMIT_REFERENCE_RE = /(?<![\w-])[0-9a-f]{7,40}$/i;
const COMMIT_URL_RE = /\/commits?\/([0-9a-f]{7,40})(?![\w-])/i;
const WRAPPABLE_CLOSE_TYPES = new Set(["strong_close", "em_close", "s_close"]);

/**
 * Folds `label (https://url)` into a link on the label, the way agents write
 * `PR #672 (https://github.com/o/r/pull/672)`. Only a bare URL that fills the
 * whole parenthesis collapses, and only when the label is unambiguous: a
 * PR/issue/commit reference the URL itself confirms, or an adjacent inline
 * code, bold, italic or strikethrough span. Plain prose keeps its URL because
 * nothing says where the label starts.
 */
export function enableParenthesizedLinkCollapse(parser: MarkdownIt): void {
  parser.core.ruler.after("linkify", "collapse_parenthesized_links", (state) => {
    for (const block of state.tokens) {
      if (block.type === "inline" && block.children) {
        block.children = collapseParenthesizedLinks(state, block.children);
      }
    }
  });
}

function collapseParenthesizedLinks(state: StateCore, tokens: Token[]): Token[] {
  const out: Token[] = [];
  let index = 0;
  while (index < tokens.length) {
    const consumed = collapseAt(state, tokens, index, out);
    if (consumed === 0) out.push(tokens[index]);
    index += consumed || 1;
  }
  return out;
}

/** Collapses the bare URL opening at `index` into `out`; returns how many tokens it consumed. */
function collapseAt(state: StateCore, tokens: Token[], index: number, out: Token[]): number {
  const [open, , close, after] = tokens.slice(index, index + 4);
  const before = out.at(-1);
  if (!isBareUrlOpen(open) || close?.type !== "link_close") return 0;
  if (before?.type !== "text" || !before.content.endsWith("(")) return 0;
  if (after?.type !== "text" || !after.content.startsWith(")")) return 0;

  const lead = before.content.slice(0, -1).trimEnd();
  if (lead) {
    const label = matchReferenceLabel(lead, open.attrGet("href") ?? "");
    if (!label) return 0;
    const labelToken = new state.Token("text", "", 0);
    labelToken.content = label;
    labelToken.level = open.level + 1;
    before.content = lead.slice(0, -label.length);
    if (!before.content) out.pop();
    out.push(open, labelToken, close);
  } else {
    const wrapStart = findWrappableSpanStart(out, out.length - 2);
    if (wrapStart === -1) return 0;
    out.pop();
    const wrapped = out.splice(wrapStart);
    for (const token of wrapped) token.level += 1;
    out.push(open, ...wrapped, close);
  }
  after.content = after.content.slice(1);
  return after.content ? 3 : 4;
}

function isBareUrlOpen(token: Token): boolean {
  return token.type === "link_open" && (token.markup === "linkify" || token.markup === "autolink");
}

function matchReferenceLabel(lead: string, href: string): string | null {
  const numbered = NUMBERED_REFERENCE_RE.exec(lead);
  if (numbered) {
    return NUMBERED_URL_RE.exec(href)?.[1] === numbered[1] ? numbered[0] : null;
  }
  const commit = COMMIT_REFERENCE_RE.exec(lead);
  const sha = COMMIT_URL_RE.exec(href)?.[1];
  if (commit && sha?.toLowerCase().startsWith(commit[0].toLowerCase())) return commit[0];
  return null;
}

function findWrappableSpanStart(out: Token[], end: number): number {
  const last = out[end];
  if (!last) return -1;
  if (last.type === "code_inline") return end;
  if (!WRAPPABLE_CLOSE_TYPES.has(last.type)) return -1;
  const openType = last.type.replace("_close", "_open");
  for (let index = end - 1; index >= 0; index--) {
    const token = out[index];
    // A link cannot nest inside another link.
    if (token.type === "link_open" || token.type === "link_close") return -1;
    if (token.type === openType && token.level === last.level) return index;
  }
  return -1;
}
