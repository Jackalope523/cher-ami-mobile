import { Colors } from '@/constants/Colors';
import { Tabs } from 'expo-router';
import React from 'react';

import NestIconSelected from '@/assets/icons/bird-fill-colored.svg';
import NestIconRest from '@/assets/icons/bird-outline.svg';
import WallIconSelected from '@/assets/icons/column-fill-colored.svg';
import WallIconRest from '@/assets/icons/column-outline-v3.svg';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.canarySand,
          borderTopWidth: 2,
          borderTopColor: Colors.canaryDark,
        },
      }}>
      <Tabs.Screen
        name="upload"
        options={{
          tabBarIcon: ({ color, focused, size }) =>
            focused ? (
              <WallIconSelected height={32} width={32} />
            ) : (
              <WallIconRest height={32} width={32} />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused, size }) =>
            focused ? (
              <NestIconSelected height={32} width={32} />
            ) : (
              <NestIconRest height={32} width={32} />
            ),
        }}
      />
    </Tabs>
  );
}

