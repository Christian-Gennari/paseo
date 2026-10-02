import { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { CircleDot, GitPullRequest } from "lucide-react-native";
import { StyleSheet } from "react-native-unistyles";
import { isWeb } from "@/constants/platform";
import type { GestureResponderEvent } from "react-native";
import type { ReferenceBadgeKind } from "./reference-badge";

interface MarkdownReferenceBadgeProps {
  kind: ReferenceBadgeKind;
  label: string;
  href?: string;
  onPress(): void;
}

export function MarkdownReferenceBadge({
  kind,
  label,
  href,
  onPress,
}: MarkdownReferenceBadgeProps) {
  const Icon = kind === "pr" ? GitPullRequest : CircleDot;
  const displayNumber = label.replace(/^[^#]*/, "");

  const handleWebClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement> | GestureResponderEvent) => {
      e.preventDefault();
      onPress();
    },
    [onPress],
  );

  if (isWeb) {
    return (
      <a
        href={href || "#"}
        target="_blank"
        rel="noreferrer"
        onClick={handleWebClick}
        className="claude-ref-pill"
      >
        <span className="claude-ref-icon">
          <Icon size={12} strokeWidth={2.2} />
        </span>
        <span className="claude-ref-text">{displayNumber}</span>
      </a>
    );
  }

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.badge}>
        <Icon size={12} color="var(--accent, #58a6ff)" strokeWidth={2.2} />
        <Text style={styles.label}>{displayNumber}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginHorizontal: 2,
    alignSelf: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: "rgba(88, 166, 255, 0.15)",
  },
  label: {
    color: "#58a6ff",
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    lineHeight: 16,
  },
}));
