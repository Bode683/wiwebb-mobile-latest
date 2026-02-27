import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SvgLogo from "../../assets/brand-logo/wiweeb-orange.svg";
import AuthBgDark from "../../assets/common/auth-background-dark.svg";
import AuthBgLight from "../../assets/common/auth-background-light.svg";
import { borderRadius, spacing, typography, useTheme } from "../../theme";

const { width, height } = Dimensions.get("screen");

export default function WelcomeScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation("auth");
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === "en" ? "fr" : "en");
  };

  return (
    <View style={styles.container}>
      {/* Branded background */}
      {isDark ? (
        <AuthBgDark
          width={width}
          height={height}
          style={StyleSheet.absoluteFill}
          preserveAspectRatio="xMidYMid slice"
        />
      ) : (
        <AuthBgLight
          width={width}
          height={height}
          style={StyleSheet.absoluteFill}
          preserveAspectRatio="xMidYMid slice"
        />
      )}

      {/* Content sits in the upper sky area — above the landscape curves */}
      <View style={[styles.inner, { paddingTop: insets.top + spacing.lg }]}>
        <View style={styles.card}>
          {/* Logo + tagline */}
          <SvgLogo width={200} height={68} />
          <Text
            style={[
              typography.variants.bodyLarge,
              styles.tagline,
              { color: theme.onSurfaceVariant },
            ]}
          >
            {t("welcome.tagline")}
          </Text>

          {/* Buttons */}
          <View style={styles.actions}>
            <Pressable
              onPress={() => router.push("/login" as any)}
              style={[styles.primaryBtn, { backgroundColor: theme.primary }]}
            >
              <Text
                style={[
                  typography.variants.labelLarge,
                  { color: theme.onPrimary },
                ]}
              >
                {t("welcome.login")}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/signUp" as any)}
              style={[
                styles.secondaryBtn,
                {
                  borderColor: theme.outline,
                  backgroundColor: theme.surface + "CC",
                },
              ]}
            >
              <Text
                style={[
                  typography.variants.labelLarge,
                  { color: theme.onSurface },
                ]}
              >
                {t("welcome.signUp")}
              </Text>
            </Pressable>
          </View>

          {/* Language toggle */}
          <Pressable onPress={toggleLang} style={styles.langToggle}>
            <Text
              style={[
                typography.variants.bodySmall,
                { color: theme.onSurfaceVariant },
              ]}
            >
              {i18n.language === "en" ? "Français" : "English"}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Pushes card into the top ~55% of the screen (clear sky area)
  inner: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    // Reserve the bottom 25% for the landscape curves — card stays above them
    paddingBottom: height * 0.25,
  },
  // Single centered group: logo + tagline + buttons
  card: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
  },
  tagline: {
    textAlign: "center",
    marginBottom: spacing.md,
  },
  actions: {
    width: "100%",
    gap: spacing.sm,
  },
  primaryBtn: {
    height: 52,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryBtn: {
    height: 52,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  langToggle: {
    marginTop: spacing.xs,
    padding: spacing.sm,
  },
});
