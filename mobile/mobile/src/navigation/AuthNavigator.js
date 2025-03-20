import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import OublierScreen from '../screens/auth/OublierScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import VerifierScreen from '../screens/auth/VerifierScreen';
import NewPassword from '../screens/auth/NewPassword';
import AuthChecker from '../components/AuthChecker';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
                name="AuthChecker"
                component={AuthChecker}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Oublier"
                component={OublierScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Verify"
                component={VerifierScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="NewPassword"
                component={NewPassword}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default AuthNavigator;