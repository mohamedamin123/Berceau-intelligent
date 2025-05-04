import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import './../src/config/PushNotificationConfig';
import { ThemeProvider } from './components/ThemeContext'

export default function App() {

  return (
    <ThemeProvider>
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
    </ThemeProvider>
  );
}
