import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import AjouterBerceauScreen from '../screens/berceau/AjouterBerceauScreen';
import ConsulterBerceauScreen from '../screens/berceau/ConsulterBerceauScreen';
import ConsulterLumiereScreen from '../screens/berceau/ConsulterLumiereScreen';
import ConsulterVentilateurScreen from '../screens/berceau/ConsulterVentilateurScreen';
import ConsulterServoScreen from '../screens/berceau/ConsulterServoScreen';
import ConsulterCameraScreen from '../screens/berceau/ConsulterCameraScreen';
import PushNotification from 'react-native-push-notification';
import { getSon } from '../services/SonService';
import { getMouvement } from '../services/MouvementService';
import { createNotification } from '../services/NotificationService';
import useBerceauStore from '../store/useBerceauStore';
import useAuthStore from '../store/useAuthStore'; // Ajouté pour récupérer parentId
import RNBluetoothSerial from 'react-native-bluetooth-serial-next';
import { NativeEventEmitter, NativeModules, Platform, PermissionsAndroid } from 'react-native';
import ModifierBerceauScreen from '../screens/berceau/ModifierBerceauScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    const [isSleeping, setIsSleeping] = useState(false);
    const [isMouvementSleeping, setIsMouvementSleeping] = useState(false);

    const berceaux = useBerceauStore((state) => state.berceaux);
    const parentId = useAuthStore((state) => state.user?.id); // 👈 Récupère l'id du parent connecté

    // Fonction pour envoyer une notification locale
    const sendNotification = async (message, type, berceauId) => { 
        PushNotification.localNotification({
            channelId: 'default-channel-id',
            title: 'Berceau Intelligent 👶',
            message: message,
        });
        alert(message);
        await createNotification({
            parentId: parentId,
            berceauId: berceauId,
            message: message,
            type: type,
        });
    };
    
    const checkSonAndMouvement = async () => {
        try {
            for (const berceau of berceaux) {
                const { id: berceauId, name } = berceau;
    
                const son = await getSon(berceauId);
                const mouvement = await getMouvement(berceauId);
    
                if (son?.etat && !isSleeping) {
                    const message = `Le bébé du ${name} pleure a (${son.type.toLowerCase()}) !`;
                    const type = son.type;
    
                    sendNotification(message, type, berceauId);
    
                    setIsSleeping(true);
                    setTimeout(() => setIsSleeping(false), 60000);
                }
    
                if (mouvement && !isMouvementSleeping) {
                    const message = `Mouvement détecté dans le ${name} !`;
                    const type = "Mouvement";
    
                    sendNotification(message, type, berceauId);
    
                    setIsMouvementSleeping(true);
                    setTimeout(() => setIsMouvementSleeping(false), 60000);
                }
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du son ou du mouvement:", error);
        }
    };
    

    useEffect(() => {
        const interval = setInterval(() => {
            checkSonAndMouvement();
        }, 1000);

        return () => clearInterval(interval);
    }, [isSleeping, isMouvementSleeping, berceaux]);

    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="AjouterBerceau" component={AjouterBerceauScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ConsulterBerceau" component={ConsulterBerceauScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ConsulterLumiere" component={ConsulterLumiereScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ConsulterVentilateur" component={ConsulterVentilateurScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ConsulterServo" component={ConsulterServoScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ConsulterCamera" component={ConsulterCameraScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ModifierBerceau" component={ModifierBerceauScreen} options={{ headerShown: false }} />

        </Stack.Navigator>
    );
};

export default MainNavigator;
