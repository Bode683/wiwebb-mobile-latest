import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, typography, spacing, borderRadius, shadows } from '../../../theme';

// ─── Small reusable card ──────────────────────────────────────────────────────

const Card = ({ title, subtitle, accent }) => {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: accent ? theme.primaryContainer : theme.surface,
          borderColor: theme.outline,
          ...shadows.sm,
        },
      ]}
    >
      <Text style={[typography.variants.titleSmall, { color: accent ? theme.onPrimaryContainer : theme.onSurface }]}>
        {title}
      </Text>
      <Text style={[typography.variants.bodySmall, { color: theme.onSurfaceVariant, marginTop: 2 }]}>
        {subtitle}
      </Text>
    </View>
  );
};

// ─── Colour swatch ────────────────────────────────────────────────────────────

const Swatch = ({ label, color, textColor }) => (
  <View style={[styles.swatch, { backgroundColor: color }]}>
    <Text style={[styles.swatchLabel, { color: textColor }]}>{label}</Text>
  </View>
);

// ─── Home screen (theme demo) ─────────────────────────────────────────────────

const Home = () => {
  const { theme, colorScheme, toggleTheme } = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: theme.background }}
      contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* Header */}
      <View style={styles.section}>
        <Text style={[typography.variants.headlineSmall, { color: theme.onBackground }]}>
          Theme Preview
        </Text>
        <Text style={[typography.variants.bodyMedium, { color: theme.onSurfaceVariant, marginTop: 4 }]}>
          Amber · {colorScheme === 'dark' ? 'Dark' : 'Light'} mode
        </Text>
      </View>

      {/* Toggle */}
      <TouchableOpacity
        style={[styles.toggleBtn, { backgroundColor: theme.primary }]}
        onPress={toggleTheme}
        activeOpacity={0.8}
      >
        <Text style={[typography.variants.labelLarge, { color: theme.onPrimary }]}>
          Switch to {colorScheme === 'dark' ? 'Light' : 'Dark'} mode
        </Text>
      </TouchableOpacity>

      {/* Colour palette */}
      <View style={styles.section}>
        <Text style={[typography.variants.titleMedium, { color: theme.onBackground, marginBottom: spacing.sm }]}>
          Colour palette
        </Text>
        <View style={styles.swatchRow}>
          <Swatch label="primary"   color={theme.primary}           textColor={theme.onPrimary} />
          <Swatch label="secondary" color={theme.secondary}         textColor={theme.onSecondary} />
          <Swatch label="accent"    color={theme.primaryContainer}  textColor={theme.onPrimaryContainer} />
          <Swatch label="error"     color={theme.error}             textColor={theme.onError} />
        </View>
        <View style={styles.swatchRow}>
          <Swatch label="surface"   color={theme.surface}           textColor={theme.onSurface} />
          <Swatch label="variant"   color={theme.surfaceVariant}    textColor={theme.onSurfaceVariant} />
          <Swatch label="chart 2"   color={theme.chart[2]}          textColor="#fff" />
          <Swatch label="chart 3"   color={theme.chart[3]}          textColor="#fff" />
        </View>
      </View>

      {/* Typography scale */}
      <View style={[styles.section, styles.typoSection, { backgroundColor: theme.surface, borderColor: theme.outline }]}>
        <Text style={[typography.variants.titleMedium, { color: theme.onSurface, marginBottom: spacing.sm }]}>
          Type scale
        </Text>
        {[
          ['headlineSmall', 'Headline Small'],
          ['titleLarge',    'Title Large'],
          ['bodyLarge',     'Body Large'],
          ['bodyMedium',    'Body Medium'],
          ['labelSmall',    'LABEL SMALL'],
        ].map(([variant, sample]) => (
          <Text key={variant} style={[typography.variants[variant], { color: theme.onSurface }]}>
            {sample}
          </Text>
        ))}
      </View>

      {/* Cards */}
      <View style={styles.section}>
        <Text style={[typography.variants.titleMedium, { color: theme.onBackground, marginBottom: spacing.sm }]}>
          Cards
        </Text>
        <View style={styles.cardRow}>
          <Card title="Surface card"  subtitle="Uses surface colour"        accent={false} />
          <Card title="Accent card"   subtitle="Uses primaryContainer"      accent={true} />
        </View>
      </View>

      {/* Elevation levels */}
      <View style={styles.section}>
        <Text style={[typography.variants.titleMedium, { color: theme.onBackground, marginBottom: spacing.sm }]}>
          Elevation levels
        </Text>
        <View style={styles.elevationRow}>
          {Object.entries(theme.elevation).map(([level, color]) => (
            <View
              key={level}
              style={[styles.elevationChip, { backgroundColor: color, borderColor: theme.outline }]}
            >
              <Text style={[styles.elevationLabel, { color: theme.onSurfaceVariant }]}>{level}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    gap: spacing.lg,
    paddingBottom: spacing['3xl'],
  },
  section: {
    gap: 0,
  },
  toggleBtn: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  swatchRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  swatch: {
    flex: 1,
    height: 56,
    borderRadius: borderRadius.sm,
    justifyContent: 'flex-end',
    padding: 4,
  },
  swatchLabel: {
    fontSize: 9,
    fontWeight: '600',
  },
  typoSection: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    gap: spacing.xs,
  },
  cardRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  card: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  elevationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  elevationChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  elevationLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export default Home;
