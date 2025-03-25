import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';  // Votre BottomNavigationView
import HomeScreen from '../screens/home/HomeScreen';
import AjouterBerceauScreen from '../screens/home/AjouterBerceauScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen
                name="Home"
                component={BottomTabNavigator}  // Votre navigation en bas
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AjouterBerceau"
                component={AjouterBerceauScreen}  // Votre navigation en bas
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default MainNavigator;
