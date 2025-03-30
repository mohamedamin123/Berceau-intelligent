import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';  // Votre BottomNavigationView
import HomeScreen from '../screens/home/HomeScreen';
import AjouterBerceauScreen from '../screens/berceau/AjouterBerceauScreen';
import ConsulterBerceauScreen from '../screens/berceau/ConsulterBerceauScreen';
import ConsulterLumiereScreen from '../screens/berceau/ConsulterLumiereScreen';
import ConsulterVentilateurScreen from '../screens/berceau/ConsulterVentilateurScreen';
import ConsulterServoScreen from '../screens/berceau/ConsulterServoScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="AjouterBerceau" component={AjouterBerceauScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ConsulterBerceau" component={ConsulterBerceauScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ConsulterLumiere" component={ConsulterLumiereScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ConsulterVentilateur" component={ConsulterVentilateurScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ConsulterServo" component={ConsulterServoScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default MainNavigator;
