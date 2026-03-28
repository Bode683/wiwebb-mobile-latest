import { Tabs } from "expo-router";
import TabBar from "../../../components/tabBar";

/**
 * _layout component sets up the tab navigation layout.
 * It uses the Tabs component from expo-router to define the tab navigation structure.
 */
const _layout = () => {
  return (
    <Tabs
      initialRouteName="dashboard"
      tabBar={(props) => <TabBar {...props} />}
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
      <Tabs.Screen name="devices" options={{ title: "Devices" }} />
      <Tabs.Screen name="monitor" options={{ title: "Monitor" }} />
      <Tabs.Screen name="network" options={{ title: "Network" }} />
      <Tabs.Screen name="more" options={{ title: "More" }} />
    </Tabs>
  );
};

export default _layout;
