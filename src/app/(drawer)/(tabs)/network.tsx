import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { selectUser } from "../../../features/auth/slice/authSlice";
import { useAppSelector } from "../../../store/hooks";
import { spacing, useTheme } from "../../../theme";

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation("common");
  const insets = useSafeAreaInsets();
  const user = useAppSelector(selectUser);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ paddingBottom: insets.bottom + spacing.xl }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },

  title: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm + 2,
    paddingBottom: spacing.xs,
    letterSpacing: 0.8,
  },
});
