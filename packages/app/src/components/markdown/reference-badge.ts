export type ReferenceBadgeKind = "pr" | "issue";

export interface ReferenceBadge {
  kind: ReferenceBadgeKind;
  label: string;
}

const REFERENCE_LABEL_RE = /^(?:(PR|MR|pull request|merge request|issue)\s+)?#(\d+)$/i;
const PR_URL_RE = /\/(?:pull|pulls|merge_requests)\/\d+(?![\w-])/;
const ISSUE_URL_RE = /\/issues\/\d+(?![\w-])/;

/**
 * Decides whether a link renders as a reference pill. The link text must itself
 * be a reference (`#667`, `PR #672`); the URL, when it names a PR or issue,
 * picks the icon. Descriptive link text stays a plain link.
 */
export function matchReferenceBadge(href: string, text: string): ReferenceBadge | null {
  const match = REFERENCE_LABEL_RE.exec(text.trim());
  if (!match) return null;
  const prefix = match[1]?.toLowerCase();
  let kind: ReferenceBadgeKind = "issue";
  if (PR_URL_RE.test(href)) kind = "pr";
  else if (ISSUE_URL_RE.test(href)) kind = "issue";
  else if (prefix === "pr" || prefix === "mr" || prefix?.endsWith("request")) kind = "pr";
  return { kind, label: text.trim() };
}
