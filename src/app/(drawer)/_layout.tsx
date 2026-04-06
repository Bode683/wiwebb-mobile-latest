import { Drawer } from "expo-router/drawer";
import React from "react";
import { Dimensions, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DrawerContent from "../../components/DrawerContent";
import { useTheme } from "../../theme";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = Math.min(Math.round(SCREEN_WIDTH * 0.75), 320);

/**
 * DrawerLayout — main app navigation shell.
 *
 * Platform-specific behaviour:
 * - Android: drawerType 'front' (Material standard — drawer slides over content)
 * - iOS:     drawerType 'slide' (content shifts with drawer — more iOS-native feel)
 *
 * All screens are hidden from the default drawer list; DrawerContent renders
 * navigation manually using the mobileNavConfig.
 */
export default function DrawerLayout() {
  const { theme } = useTheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: Platform.select({
            ios: "slide",
            android: "front",
            default: "front",
          }),
          drawerStyle: { width: DRAWER_WIDTH, backgroundColor: theme.sidebar },
          swipeEdgeWidth: 50,
          drawerHideStatusBarOnOpen: Platform.OS === "android",
          overlayColor: "rgba(0,0,0,0.45)",
        }}
      >
        {/* ── Existing screens ─────────────────────────────────────────── */}
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Home",
            title: "Home",
            headerShown: false,
            drawerItemStyle: { display: "none" },
          }}
        />
        <Drawer.Screen
          name="explore"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        {/* ── New sections — all hidden from default list ───────────────── */}
        <Drawer.Screen
          name="devices"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="system-info"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="users"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="organizations"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="groups"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="organization-users"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="subscriptions"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="cas"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="radius"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="monitoring"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="ipam"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="configurations"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="geographic-info"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="help"
          options={{ drawerItemStyle: { display: "none" } }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
