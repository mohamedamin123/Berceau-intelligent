import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import BebeScreen from '../screens/home/BebeScreen';
import Icon from 'react-native-vector-icons/Feather';

import SettingsScreen from '../screens/home/SettingsScreen';
import DynamicTabView from './../components/DynamicTabView';
import TabBarIcon from '../components/TabBarIcon';
import ProfileScreen from '../screens/home/ProfileScreen';  // Corrigé : SettingsScreen => ProfileScreen
import NotificationScreen from '../screens/home/NotificationScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                tabBarStyle: { backgroundColor: '#FF69B4' }, // Couleur de fond de la barre
                tabBarActiveTintColor: 'white', // blanc pour l’icône sélectionnée.
                tabBarInactiveTintColor: 'gray', //  gris pour les icônes non sélectionnées.
            }} // 🔥 Enlève tous les headers
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <TabBarIcon name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <TabBarIcon name="person" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Bebes"
                component={DynamicTabView}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="users" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Notification"
                component={NotificationScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="bell" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="Paramètres"
                component={SettingsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <TabBarIcon name="settings" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};


export default BottomTabNavigator;
