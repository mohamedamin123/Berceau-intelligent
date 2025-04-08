import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import './../src/config/PushNotificationConfig';

export default function App() {

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}
