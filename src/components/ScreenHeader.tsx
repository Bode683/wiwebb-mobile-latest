import { useNavigation, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../theme";
import { AppIcon } from "./AppIcon";

// ─── Variant prop shapes ───────────────────────────────────────────────────────

interface BackProps {
  variant?: "back";
  /** Screen title — centered between back button and optional right slot */
  title: string;
  /** Override the default router.back() behaviour */
  onBack?: () => void;
  /** Optional icon/button anchored to the right (mirrors the 44 px back slot) */
  rightSlot?: React.ReactNode;
}

interface DashboardProps {
  variant: "dashboard";
  /** Tab title shown next to the hamburger */
  title: string;
  /** Primary site/location name shown in the centre selector */
  siteName?: string;
  /** Organisation or secondary label shown below siteName */
  siteSubtitle?: string;
  onSitePress?: () => void;
  onBellPress?: () => void;
}

export type ScreenHeaderProps = BackProps | DashboardProps;

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Unified screen header with two variants:
 *
 * `variant="back"` (default) — back arrow + centred title + optional right slot.
 * Used by all sub-screens pushed onto a stack (headerShown: false).
 *
 * `variant="dashboard"` — drawer hamburger + site selector + bell.
 * Used by the main dashboard tab.
 *
 * Handles the top safe-area inset internally so screens don't need to.
 */
export function ScreenHeader(props: ScreenHeaderProps) {
  const { theme } = useTheme();
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const navigation = useNavigation();

  // ── Dashboard variant ──────────────────────────────────────────────────────
  if (props.variant === "dashboard") {
    const { title, siteName, siteSubtitle, onSitePress, onBellPress } = props;

    const openDrawer = () => {
      // Navigate up to the Drawer navigator and toggle it
      (navigation.getParent() as any)?.openDrawer?.();
    };

    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.surface, paddingTop: top },
        ]}
      >
        <View style={[styles.dashRow, styles.rowHeight]}>
          {/* Left: hamburger */}
          <TouchableOpacity
            style={styles.dashLeft}
            onPress={openDrawer}
            activeOpacity={0.7}
          >
            <AppIcon
              type="Feather"
              name="menu"
              symbol="line.3.horizontal"
              size={24}
              color={theme.onBackground}
            />
          </TouchableOpacity>

          {/* Centre: site selector */}
          {siteName ? (
            <TouchableOpacity
              style={styles.siteSelector}
              onPress={onSitePress}
              activeOpacity={0.7}
            >
              <View style={styles.siteNameRow}>
                <Text style={[styles.siteName, { color: theme.onBackground }]}>
                  {siteName}
                </Text>
                <AppIcon
                  type="Feather"
                  name="chevron-down"
                  symbol="chevron.down"
                  size={16}
                  color={theme.onBackground}
                />
              </View>
              {siteSubtitle ? (
                <Text
                  style={[
                    styles.siteSubtitle,
                    { color: theme.onSurfaceVariant },
                  ]}
                >
                  {siteSubtitle}
                </Text>
              ) : null}
            </TouchableOpacity>
          ) : (
            // Keep the layout balanced when there's no site selector
            <View />
          )}

          {/* Right: bell */}
          <TouchableOpacity
            style={[styles.iconBtn, { backgroundColor: theme.secondary }]}
            onPress={onBellPress}
            activeOpacity={0.7}
          >
            <AppIcon
              type="Feather"
              name="bell"
              symbol="bell"
              size={20}
              color={theme.onBackground}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── Back variant (default) ─────────────────────────────────────────────────
  const { title, onBack, rightSlot } = props as BackProps;

  return (
    <View
      style={[
        styles.container,
        styles.backBorder,
        {
          backgroundColor: theme.surface,
          paddingTop: top,
          borderBottomColor: theme.outline,
        },
      ]}
    >
      <View style={[styles.backRow, styles.rowHeight]}>
        {/* Left: back button (44 px slot — mirrors design's headerLeft) */}
        <TouchableOpacity
          style={styles.sideSlot}
          onPress={onBack ?? (() => router.back())}
          activeOpacity={0.7}
          hitSlop={8}
        >
          <AppIcon
            type="Feather"
            name="arrow-left"
            symbol="arrow.left"
            size={22}
            color={theme.onBackground}
          />
        </TouchableOpacity>

        {/* Centre: title */}
        <Text
          style={[styles.backTitle, { color: theme.onBackground }]}
          numberOfLines={1}
        >
          {title}
        </Text>

        {/* Right: mirrors the 44 px back slot to keep the title centred */}
        <View style={styles.sideSlot}>{rightSlot ?? null}</View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const ROW_HEIGHT = 52;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  rowHeight: {
    height: ROW_HEIGHT,
  },

  // ── Back ──────────────────────────────────────────────────────────────────
  backBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sideSlot: {
    width: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  backTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },

  // ── Dashboard ─────────────────────────────────────────────────────────────
  dashRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dashLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dashTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  siteSelector: {
    alignItems: "center",
    gap: 2,
  },
  siteNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  siteName: {
    fontSize: 16,
    fontWeight: "700",
  },
  siteSubtitle: {
    fontSize: 11,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
