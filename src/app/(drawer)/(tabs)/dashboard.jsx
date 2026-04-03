import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppIcon } from "../../../components/AppIcon";
import { ActiveSSIDsCard } from "../../../components/home/ActiveSSIDsCard";
import { APDistributionCard } from "../../../components/home/APDistributionCard";
import { DashboardHeader } from "../../../components/home/DashboardHeader";
import { DeviceSummaryCard } from "../../../components/home/DeviceSummaryCard";
import { QuickConfigSheet } from "../../../components/home/QuickConfigSheet";
import { TrafficUsageCard } from "../../../components/home/TrafficUsageCard";
import { useTheme } from "../../../theme";

const Dashboard = () => {
  const { theme } = useTheme();
  const [sheetVisible, setSheetVisible] = useState(false);

  return (
    <View style={[styles.screen, { backgroundColor: theme.surface }]}>
      <DashboardHeader />
      <ScrollView
        style={{ backgroundColor: theme.surfaceVariant }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <DeviceSummaryCard />
        <APDistributionCard />
        <TrafficUsageCard />
        <ActiveSSIDsCard />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => setSheetVisible(true)}
        activeOpacity={0.85}
      >
        <AppIcon
          type="Feather"
          name="sliders"
          symbol="sliders"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>

      <QuickConfigSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
    gap: 16,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
});

export default Dashboard;
