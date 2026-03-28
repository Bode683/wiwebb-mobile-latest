import React from 'react';
import { View, Text } from 'react-native';
import { useTheme, typography, spacing } from '../../../theme';

const More = () => {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background, padding: spacing.md }}>
      <Text style={[typography.variants.titleMedium, { color: theme.onBackground }]}>More</Text>
      <Text style={[typography.variants.bodyMedium, { color: theme.onSurfaceVariant, marginTop: spacing.xs }]}>
        Additional options coming soon.
      </Text>
    </View>
  );
};

export default More;
