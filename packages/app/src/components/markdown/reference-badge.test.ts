import { describe, expect, it } from "vitest";
import { matchReferenceBadge } from "./reference-badge";

describe("matchReferenceBadge", () => {
  it("marks PR URLs as pull requests", () => {
    expect(matchReferenceBadge("https://github.com/o/r/pull/672", "PR #672")).toEqual({
      kind: "pr",
      label: "PR #672",
    });
    expect(matchReferenceBadge("https://gitlab.com/o/r/-/merge_requests/3", "#3")?.kind).toBe("pr");
  });

  it("marks issue URLs as issues", () => {
    expect(matchReferenceBadge("https://github.com/o/r/issues/665", "#665")?.kind).toBe("issue");
  });

  it("falls back to the label prefix when the URL is unknown", () => {
    expect(matchReferenceBadge("https://example.com/x", "PR #5")?.kind).toBe("pr");
    expect(matchReferenceBadge("https://example.com/x", "#5")?.kind).toBe("issue");
  });

  it("leaves descriptive link text alone", () => {
    expect(matchReferenceBadge("https://github.com/o/r/pull/1", "the fix")).toBeNull();
    expect(
      matchReferenceBadge("https://github.com/o/r/pull/1", "https://github.com/o/r/pull/1"),
    ).toBeNull();
  });
});
