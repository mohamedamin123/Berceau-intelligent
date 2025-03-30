import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home/HomeScreen';
import BebeScreen from '../screens/home/BebeScreen';
import Icon from 'react-native-vector-icons/Feather';

import SettingsScreen from '../screens/home/SettingsScreen';
import DynamicTabView from './DynamicTabView';
import TabBarIcon from '../components/TabBarIcon';
import ProfileScreen from '../screens/home/ProfileScreen';  // Corrigé : SettingsScreen => ProfileScreen
import {  Baby } from 'lucide-react-native'; // Icône Baby ajoutée

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator initialRouteName="Home">
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
