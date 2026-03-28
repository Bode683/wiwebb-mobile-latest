import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { PlatformIcon } from './PlatformIcon';

const { height } = Dimensions.get('window');
const hp = (percentage) => (height * percentage) / 100;

const TAB_ICONS = {
  dashboard:        { feather: 'grid',     symbol: 'square.grid.2x2'    },
  devices: { feather: 'tablet',   symbol: 'laptopcomputer'     },
  monitor:   { feather: 'activity', symbol: 'waveform.path.ecg'  },
  network:     { feather: 'globe',    symbol: 'globe'              },
  more:        { feather: 'menu',     symbol: 'line.3.horizontal'  },
};

/**
 * TabBar component renders a custom bottom tab bar.
 * Icons are driven by PlatformIcon (SF Symbols on iOS, Feather on Android).
 * Colours respond to the active theme (light/dark).
 */
const TabBar = ({ state, descriptors, navigation }) => {
  const { bottom } = useSafeAreaInsets();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.tabbar,
        {
          backgroundColor: theme.sidebar,
          borderTopColor:  theme.outline,
          paddingBottom:   bottom,
          height:          60 + bottom,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;
        const color = isFocused ? theme.sidebarPrimary : theme.onSurfaceVariant;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const iconConfig = TAB_ICONS[route.name];

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}
          >
            {iconConfig && (
              <PlatformIcon
                feather={iconConfig.feather}
                symbol={iconConfig.symbol}
                size={hp(2.5)}
                color={color}
              />
            )}
            <Text style={[styles.label, { color }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});

export default TabBar;
