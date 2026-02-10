import React from 'react';
import { Tabs } from 'expo-router';
import TabBar from '../../../components/tabBar';

/**
 * _layout component sets up the tab navigation layout.
 * It uses the Tabs component from expo-router to define the tab navigation structure.
 */
const _layout = () => {
  return (
    <Tabs
      initialRouteName="home"
      tabBar={props => <TabBar {...props} />}
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="anotherPage" options={{ title: 'Another Page' }} />
      <Tabs.Screen name="thirdPage" options={{ title: 'Third Page' }} />
    </Tabs>
  );
};

export default _layout;
