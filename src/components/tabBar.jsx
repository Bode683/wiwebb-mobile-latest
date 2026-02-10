import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../assets/icons';

const { height } = Dimensions.get('window');

// Helper function to calculate height percentage
const hp = (percentage) => {
  return (height * percentage) / 100;
};

/**
 * TabBar component renders a custom tab bar for navigation.
 * The drawer hamburger button lives in the top header (Drawer.Screen headerLeft),
 * not here — this component is bottom tabs only.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.state - The navigation state object.
 * @param {Array} props.state.routes - The array of route objects.
 * @param {number} props.state.index - The index of the currently focused route.
 * @param {Object} props.descriptors - The descriptors for the routes.
 * @param {Object} props.navigation - The navigation object.
 *
 * @returns {JSX.Element} The rendered TabBar component.
 */
const TabBar = ({ state, descriptors, navigation }) => {
  const { bottom } = useSafeAreaInsets();
  const icons = {
    home: (props) => <Icon name="home" size={hp(2.5)} color={'black'} {...props} />,
    anotherPage: (props) => <Icon name="heart" size={hp(2.5)} color={'black'} {...props} />,
    thirdPage: (props) => <Icon name="camera" size={hp(2.5)} color={'black'} {...props} />,
  };

  return (
    <View style={[styles.tabbar, { paddingBottom: bottom, height: 60 + bottom }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

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
            {icons[route.name] && icons[route.name]({ focused: isFocused })}
            <Text style={{ color: isFocused ? '#673ab7' : '#222' }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: 'row',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TabBar;
