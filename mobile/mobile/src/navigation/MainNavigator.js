import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';  // Votre BottomNavigationView
import AjouterBerceauScreen from '../screens/berceau/AjouterBerceauScreen';
import ConsulterBerceauScreen from '../screens/berceau/ConsulterBerceauScreen';
import ConsulterLumiereScreen from '../screens/berceau/ConsulterLumiereScreen';
import ConsulterVentilateurScreen from '../screens/berceau/ConsulterVentilateurScreen';
import ConsulterServoScreen from '../screens/berceau/ConsulterServoScreen';
import ConsulterCameraScreen from '../screens/berceau/ConsulterCameraScreen';
import PushNotification from 'react-native-push-notification';  // Assurez-vous d'importer la bibliothèque de notifications
import { getSon } from '../services/SonService'; // Assurez-vous d'importer la fonction getSon
import { getMouvement } from '../services/MouvementService'; // Assurez-vous d'importer la fonction getMouvement
import useBerceauStore from '../store/useBerceauStore';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    const [sonData, setSonData] = useState(null);
    const [mouvementData, setMouvementData] = useState(null);
    const [isSleeping, setIsSleeping] = useState(false); // Suivi du statut de sommeil
    const [isMouvementSleeping, setIsMouvementSleeping] = useState(false); // Suivi du statut de mouvement

    // Fonction pour envoyer une notification et attendre 1 minute avant de réessayer
    const sendNotification = (message, type) => {
        PushNotification.localNotification({
            channelId: 'default-channel-id',
            title: 'Berceau Intelligent 👶',
            message: message,
        });
        alert(message);

        // Délai de 1 minute avant de permettre de renvoyer une notification
        if (type === 'son') {
            setIsSleeping(true); // Mettre en pause les notifications de son
            setTimeout(() => {
                setIsSleeping(false); // Réactiver après 1 minute
            }, 60000); // 1 minute = 60000ms
        } else if (type === 'mouvement') {
            setIsMouvementSleeping(true); // Mettre en pause les notifications de mouvement
            setTimeout(() => {
                setIsMouvementSleeping(false); // Réactiver après 1 minute
            }, 60000); // 1 minute = 60000ms
        }
    };

    const berceaux = useBerceauStore((state) => state.berceaux);

    const checkSonAndMouvement = async () => {
        try {
            // Utiliser Promise.all pour effectuer les vérifications de manière parallèle
            await Promise.all(
                berceaux.map(async (berceau) => {
                    const { id, name } = berceau;
                    const son = await getSon(id);
                    const mouvement = await getMouvement(id);

                    console.log("id:  ", id, "name:", name);

                    if (son === true && !isSleeping) {
                        sendNotification(`Le bébé du  ${name}  pleure !`, 'son');
                    }

                    if (mouvement === true && !isMouvementSleeping) {
                        sendNotification(`Mouvement détecté dans le  ${name}  !`, 'mouvement');
                    }
                })
            );
        } catch (error) {
            console.error("Erreur lors de la récupération du son ou du mouvement:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            checkSonAndMouvement(); // Appeler la fonction de vérification chaque seconde
        }, 1000);

        // Nettoyage à la destruction du composant
        return () => clearInterval(interval);
    }, [isSleeping, isMouvementSleeping]); // Suivre l'état du sommeil pour chaque événement

    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={BottomTabNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="AjouterBerceau" component={AjouterBerceauScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ConsulterBerceau" component={ConsulterBerceauScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ConsulterLumiere" component={ConsulterLumiereScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ConsulterVentilateur" component={ConsulterVentilateurScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ConsulterServo" component={ConsulterServoScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ConsulterCamera" component={ConsulterCameraScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default MainNavigator;
