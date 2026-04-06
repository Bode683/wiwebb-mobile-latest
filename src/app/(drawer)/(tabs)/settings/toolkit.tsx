import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../theme';
import { AppIcon } from '../../../../components/AppIcon';
import { spacing, borderRadius } from '../../../../theme/spacing';
import { typography } from '../../../../theme/typography';

type ToolItem = {
  key: string;
  labelKey: string;
  icon: string;
  symbol: string;
};

const TOOLS: ToolItem[] = [
  { key: 'wifiScan',           labelKey: 'toolkit.items.wifiScan',           icon: 'wifi',       symbol: 'wifi'                              },
  { key: 'wifiInterference',   labelKey: 'toolkit.items.wifiInterference',   icon: 'radio',      symbol: 'wifi.exclamationmark'              },
  { key: 'speedTest',          labelKey: 'toolkit.items.speedTest',          icon: 'activity',   symbol: 'gauge.open.with.lines.needle.33percent' },
  { key: 'pingTest',           labelKey: 'toolkit.items.pingTest',           icon: 'target',     symbol: 'scope'                             },
  { key: 'signalCalibration',  labelKey: 'toolkit.items.signalCalibration',  icon: 'bar-chart-2', symbol: 'antenna.radiowaves.left.and.right' },
];

export default function ToolkitScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation('settings');

  const s = styles(theme);

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.card}>
        {TOOLS.map((tool, i) => (
          <TouchableOpacity
            key={tool.key}
            style={[s.row, i > 0 && s.rowBorder]}
            activeOpacity={0.7}
          >
            <View style={s.iconWrap}>
              <AppIcon
                type="Feather"
                name={tool.icon}
                symbol={tool.symbol}
                size={20}
                color={theme.onSurfaceVariant}
              />
            </View>
            <Text style={s.label}>{t(tool.labelKey)}</Text>
            <AppIcon
              type="Feather"
              name="chevron-right"
              symbol="chevron.right"
              size={18}
              color={theme.onSurfaceVariant}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = (theme: ReturnType<typeof useTheme>['theme']) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.surfaceVariant,
    },
    content: {
      padding: spacing.md,
      paddingBottom: spacing.xl,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.outline,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    rowBorder: {
      borderTopWidth: 1,
      borderTopColor: theme.outline,
    },
    iconWrap: {
      width: 28,
      alignItems: 'center',
    },
    label: {
      flex: 1,
      fontSize: typography.sizes.md,
      color: theme.onSurface,
    },
  });
