import React, { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

import DeviceListScreen from './DeviceListScreen';
import DeviceDetailScreen from './DeviceDetailScreen';
import ParameterAdjustScreen from './ParameterAdjustScreen';
import AlertCenterScreen from './AlertCenterScreen';
import DashboardScreen from './DashboardScreen';
import SettingsScreen from './SettingsScreen';
import LoginScreen from './LoginScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { RootStackParamList, MainTabParamList } from './src/types/navigation';
import { HomeIcon, DeviceIcon, AlertIcon, ProfileIcon } from './src/components/icons';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function TabIcon({ name, color }: { name: string; color: string }) {
  switch (name) {
    case '首页':
      return <HomeIcon color={color} size={24} />;
    case '设备':
      return <DeviceIcon color={color} size={24} />;
    case '报警':
      return <AlertIcon color={color} size={24} />;
    case '我的':
      return <ProfileIcon color={color} size={24} />;
    default:
      return <HomeIcon color={color} size={24} />;
  }
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => (
          <TabIcon name={route.name} color={color} />
        ),
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8
        },
        headerShown: false
      })}
    >
      <Tab.Screen name="首页" component={DashboardScreen} />
      <Tab.Screen name="设备" component={DeviceListScreen} />
      <Tab.Screen name="报警" component={AlertCenterScreen} />
      <Tab.Screen name="我的" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen
            name="DeviceDetail"
            component={DeviceDetailScreen}
            options={{
              headerShown: true,
              title: '设备详情',
              headerStyle: { backgroundColor: '#10B981' },
              headerTintColor: '#fff'
            }}
          />
          <Stack.Screen
            name="ParameterAdjust"
            component={ParameterAdjustScreen}
            options={{
              headerShown: true,
              title: '参数调节',
              headerStyle: { backgroundColor: '#10B981' },
              headerTintColor: '#fff'
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC'
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280'
  }
});