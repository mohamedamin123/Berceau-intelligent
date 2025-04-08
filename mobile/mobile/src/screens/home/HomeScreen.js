import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Animated, Alert, Linking, Platform,PermissionsAndroid } from 'react-native';
import useAuthStore from '../../store/useAuthStore';
import { getBerceausByParentId, deleteBerceau } from '../../services/BerceauService';
import { getBebeById, deleteBebe } from '../../services/BebeService';
import berceauImage from '../../../assets/berceau.png';
import bebeImage from '../../../assets/bebe.png';
import { useNavigation } from '@react-navigation/native';
import { Modal, Portal, Button, TextInput, Provider } from 'react-native-paper';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { NetworkInfo } from "react-native-network-info";
import PushNotification from 'react-native-push-notification';


const BerceauItem = ({ item, onPress }) => {
    const [bebeName, setBebeName] = useState("Bébé inconnu");

    useEffect(() => {
        const fetchBebeName = async () => {
            if (item.bebeId) {
                try {
                    const bebeData = await getBebeById(item.bebeId);
                    setBebeName(bebeData?.data.prenom || "Bébé inconnu");
                } catch (error) {
                    console.error("Erreur lors de la récupération du bébé:", error);
                }
            }
        };

        fetchBebeName();
    }, [item.bebeId]);

    return (
        <TouchableOpacity style={styles.berceauCard} onPress={() => onPress(item)}>
            <View style={styles.berceauHeader}>
                <Image source={berceauImage} style={styles.berceauImage} />
                <Text style={styles.nomBerceau}>{item.name || "Nom inconnu"}</Text>
            </View>
            <View style={styles.berceauHeader}>
                <Image source={bebeImage} style={styles.bebeImage} />
                <Text style={styles.nomBebe}>{bebeName}</Text>
            </View>
        </TouchableOpacity>
    );
};


const checkNotificationBeforeAction = (action) => {
    PushNotification.checkPermissions((permissions) => {
        if (!permissions.alert) {
            Alert.alert(
                "Notifications désactivées",
                "Veuillez activer les notifications pour recevoir des alertes importantes.",
                [
                    { text: "Annuler", style: "cancel" },
                    { text: "Paramètres", onPress: () => Linking.openSettings() }
                ]
            );
        } else {
            // Si autorisées, on exécute l'action
            action();
        }
    });
};

const handleNotification = () => {
    console.log("vv");
    PushNotification.localNotification({
        channelId: 'default-channel-id',
        title: 'Berceau Intelligent 👶',
        message: 'Une notification locale a été déclenchée !',
    });
    console.log("cc");

}


const checkBluetoothBeforeAction = async (action) => {
    try {
        const bluetoothState = await BluetoothStateManager.getState();
        if (bluetoothState !== "PoweredOn") {
            Alert.alert(
                "Bluetooth désactivé",
                "Veuillez activer le Bluetooth pour continuer.",
                [
                    { text: "Annuler", style: "cancel" },
                    { text: "Activer", onPress: openBluetoothSettings }
                ]
            );
            return;
        }

        // Vérifier le SSID du WiFi
        const ssid = await NetworkInfo.getSSID();
        console.log("SSID du WiFi :", ssid);

        if (!ssid) {
            Alert.alert(
                "WiFi non détecté",
                "Veuillez activer la localisation et vous connecter à un réseau WiFi.",
                [
                    { text: "Annuler", style: "cancel" },
                    { text: "Paramètres", onPress: openLocationSettings }
                ]
            );
            return;
        }

        // Si tout est OK, on exécute l’action
        action();
    } catch (error) {
        console.error("Erreur lors de la vérification du Bluetooth ou du WiFi :", error);
    }
};

const openLocationSettings = () => {
    Linking.openSettings();
};

const openBluetoothSettings = () => {
    if (Platform.OS === "android") {
        Linking.openSettings();
    } else {
        Linking.openURL("App-Prefs:Bluetooth").catch(() => {
            Alert.alert("Non supporté", "Impossible d’ouvrir les paramètres Bluetooth sur cet appareil.");
        });
    }
};

const HomeScreen = () => {
    const [berceaux, setBerceaux] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBerceau, setSelectedBerceau] = useState(null);
    const user = useAuthStore((state) => state.user);
    const scaleAnim = useState(new Animated.Value(1))[0];
    const navigation = useNavigation();

    useEffect(() => {
        const fetchBerceaux = async () => {
            if (user?.id) {
                try {
                    const response = await getBerceausByParentId(user.id);
                    const fetchedBerceaux = Array.isArray(response?.data) ? response.data : response?.data ? [response.data] : [];
                    setBerceaux(fetchedBerceaux);
                } catch (error) {
                    console.error("Erreur lors de la récupération des berceaux:", error);
                }
            }
        };

        fetchBerceaux();
    }, [user]);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const versAjouter = () => {
        navigation.navigate("AjouterBerceau");
    };

    const handleBerceauPress = (item) => {
        setSelectedBerceau(item);
        setModalVisible(true);
    };



    const handleDelete = async () => {
        if (!selectedBerceau) return;

        try {
            // Suppression du bébé si un bebeId est associé
            if (selectedBerceau.bebeId) {
                await deleteBebe(selectedBerceau.bebeId);
                console.log("Bébé supprimé avec succès !");
            }

            // Suppression du berceau
            await deleteBerceau(selectedBerceau.id);
            console.log("Berceau supprimé avec succès !");

            // Mise à jour de la liste des berceaux
            setBerceaux(prevBerceaux => prevBerceaux.filter(berceau => berceau.id !== selectedBerceau.id));

            // Réinitialiser la navigation pour forcer un rechargement de l'écran
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });

            // Fermeture du modal
            setModalVisible(false);
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };




    const handleConsult = () => {
        console.log("Consulter le Berceau", selectedBerceau);
        setModalVisible(false);
        navigation.navigate("ConsulterBerceau", { id: selectedBerceau.id }); // Pass the id as a parameter
    };

    return (
        <Provider>
            <View style={styles.container}>
                <Text style={styles.title}>🛏️ Mes Berceaux</Text>

                {berceaux.length === 0 ? (
                    <Text style={styles.emptyText}>Aucun berceau trouvé</Text>
                ) : (
                    <FlatList
                        data={berceaux}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => <BerceauItem item={item} onPress={handleBerceauPress} />}
                        style={styles.list}
                    />
                )}

                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        //onPress={() => checkBluetoothBeforeAction(versAjouter)}
                        onPress={() => checkNotificationBeforeAction(handleNotification)}
                    >
                        <Text style={styles.addButtonText}>Ajouter un Berceau</Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* Modal pour afficher les options */}
                <Portal>
                    <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Options du Berceau</Text>
                        <Button mode="contained" onPress={handleConsult} style={styles.modalButton}>
                            Consulter
                        </Button>

                        <Button mode="contained" onPress={handleDelete} style={styles.modalButton}>
                            Supprimer
                        </Button>
                        <Button mode="outlined" onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                            Fermer
                        </Button>
                    </Modal>
                </Portal>
            </View>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#6200EE',
    },
    list: {
        flex: 1,
    },
    berceauCard: {
        backgroundColor: "#fff",
        padding: 15,
        marginVertical: 8,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 6,
    },
    berceauHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    berceauImage: {
        width: 55,
        height: 55,
        borderRadius: 10,
        marginRight: 12,
    },
    bebeImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    nomBerceau: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    nomBebe: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
    },
    addButton: {
        backgroundColor: '#6200EE',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginVertical: 20,
        shadowColor: "#6200EE",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 6,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#666',
    },
    // Modal Styles
    modalContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%', // Ajustez si vous voulez un modal plus petit
        maxWidth: 300, // Limiter la largeur du modal
        alignSelf: 'center', // Centrer le modal sur l'écran
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButton: {
        marginBottom: 10,
        width: '100%', // Remplir toute la largeur
    },
    modalCloseButton: {
        width: '100%',
        marginTop: 15,
    },
});

export default HomeScreen;
