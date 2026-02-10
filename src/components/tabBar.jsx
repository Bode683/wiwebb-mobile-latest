import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../assets/icons';
import { useTheme } from '../theme';

const { height } = Dimensions.get('window');
const hp = (percentage) => (height * percentage) / 100;

/**
 * TabBar component renders a custom bottom tab bar.
 * Colours are driven by the active theme so it responds to light/dark mode.
 */
const TabBar = ({ state, descriptors, navigation }) => {
  const { bottom } = useSafeAreaInsets();
  const { theme } = useTheme();

  const icons = {
    home:        (props) => <Icon name="home"   size={hp(2.5)} {...props} />,
    anotherPage: (props) => <Icon name="heart"  size={hp(2.5)} {...props} />,
    thirdPage:   (props) => <Icon name="camera" size={hp(2.5)} {...props} />,
  };

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

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}
          >
            {icons[route.name] && icons[route.name]({ color, focused: isFocused })}
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
