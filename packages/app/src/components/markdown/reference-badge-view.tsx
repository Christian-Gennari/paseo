import { Pressable, Text, View } from "react-native";
import { CircleDot, GitPullRequest } from "lucide-react-native";
import { StyleSheet } from "react-native-unistyles";
import type { ReferenceBadgeKind } from "./reference-badge";

interface MarkdownReferenceBadgeProps {
  kind: ReferenceBadgeKind;
  label: string;
  onPress(): void;
}

const ICON_SIZE = 12;

export function MarkdownReferenceBadge({ kind, label, onPress }: MarkdownReferenceBadgeProps) {
  const Icon = kind === "pr" ? GitPullRequest : CircleDot;
  const displayNumber = label.replace(/^[^#]*/, "");

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.badge}>
        <Icon size={ICON_SIZE} color="#58a6ff" />
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
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: "rgba(56, 139, 253, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(56, 139, 253, 0.25)",
  },
  label: {
    color: "#58a6ff",
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    lineHeight: 16,
  },
}));
