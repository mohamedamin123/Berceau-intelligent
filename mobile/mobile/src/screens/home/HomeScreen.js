import React, { useState, useEffect,useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Animated, Alert, Linking, Platform, StatusBar,useColorScheme } from 'react-native';
import useAuthStore from '../../store/useAuthStore';
import { getBerceausByParentId, deleteBerceau } from '../../services/BerceauService';
import { deleteNotificationsByBerceauId } from '../../services/NotificationService';

import useBerceauStore from '../../store/useBerceauStore';
import { getBebeByBerceauId, deleteBebe,deleteAllBebeByBerceau,getBebeById } from '../../services/BebeService';
import berceauImage from '../../../assets/berceau.png';
import bebeImage from '../../../assets/bebe.png';
import { useNavigation } from '@react-navigation/native';
import { Modal, Portal, Button, TextInput, Provider } from 'react-native-paper';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { NetworkInfo } from "react-native-network-info";
import { ThemeContext } from '../../components/ThemeContext';
import ConfirmModal from '../../components/ConfirmModal';

const BerceauItem = ({ item, onPress }) => {
    const [bebeName, setBebeName] = useState("Bébé inconnu");
    useEffect(() => {
        const fetchBebeName = async () => {
          try {
            const bebeData = await getBebeByBerceauId(item.id);
            const bebes = bebeData?.data || [];
    
            if (bebes.length > 0) {
              // Trier les bébés par date de création décroissante (plus récent d'abord)
              bebes.sort((a, b) => {
                const aTime = a.created_at._seconds * 1000 + a.created_at._nanoseconds / 1e6;
                const bTime = b.created_at._seconds * 1000 + b.created_at._nanoseconds / 1e6;
                return bTime - aTime;
              });
    
              setBebeName(bebes[0].prenom || "Bébé inconnu"); // dernier bébé ajouté
            }
          } catch (error) {
            console.error("Erreur lors de la récupération du bébé:", error);
          }
        };
    
        fetchBebeName();
      }, [item]);
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

        if (!ssid || ssid.match("<unknown ssid>")) {
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
    const { isDarkMode } = useContext(ThemeContext);
    const theme = useColorScheme();  // Récupère le thème actuel
    const [confirmVisible, setConfirmVisible] = useState(false);

    useEffect(() => {
        const fetchBerceaux = async () => {
            if (user?.id) {
                try {
                    const response = await getBerceausByParentId(user.id);
                    const fetchedBerceaux = Array.isArray(response?.data) ? response.data : response?.data ? [response.data] : [];
                    setBerceaux(fetchedBerceaux);

                    // Mettre à jour le store avec les IDs et les noms des berceaux
                    const berceauxWithIdAndName = fetchedBerceaux.map(b => ({
                        id: b.id,
                        name: b.name, // Assurez-vous que le nom existe dans la réponse
                    }));

                    useBerceauStore.getState().setBerceaux(berceauxWithIdAndName);

                } catch (error) {
                    //console.error("Erreur lors de la récupération des berceaux:", error);
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
    const handleDelete = () => {
        if (!selectedBerceau) return;
        setConfirmVisible(true);  // Affiche le modal de confirmation
    };
    
    
    const handleConsult = () => {
        console.log("Consulter le Berceau", selectedBerceau);
        setModalVisible(false);
        navigation.navigate("ConsulterBerceau", { id: selectedBerceau.id }); // Pass the id as a parameter
    };

    const handleModifier = () => {
        console.log("Consulter le Berceau", selectedBerceau);
        setModalVisible(false);
        navigation.navigate("ModifierBerceau", { berceauId: selectedBerceau.id }); // Pass the id as a parameter
    };

    const handleConfirmDelete = async () => {
        if (!selectedBerceau) return;
    
        try {
            // 1. Suppression des bébés liés (si existants)
            try {
                await deleteAllBebeByBerceau(selectedBerceau.id);
                console.log("Bébés supprimés avec succès !");
            } catch (error) {
                console.warn("Erreur suppression bébés (ignorée) :", error.message);
            }
    
            // 2. Suppression des notifications (si existantes)
            try {
                await deleteNotificationsByBerceauId(selectedBerceau.id);
                console.log("Notifications supprimées avec succès !");
            } catch (error) {
                console.warn("Erreur suppression notifications (ignorée) :", error.message);
            }
            console.log("id : "+selectedBerceau.id)

    
            // 3. Suppression du berceau (quoi qu'il arrive)
            try {
                await deleteBerceau(selectedBerceau.id);
                console.log("Berceau supprimé avec succès !");
            } catch (error) {
                console.error("Erreur suppression berceau :", error.message);
                return; // Ne continue pas si la suppression échoue vraiment ici
            }
    
            // 4. Mise à jour de la liste
            setBerceaux(prev =>
                prev.filter(berceau => berceau.id !== selectedBerceau.id)
            );
    
            // 5. Fermeture du modal
            setConfirmVisible(false);
    
            // 6. Navigation
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
    
        } catch (error) {
            console.error("Erreur générale lors de la suppression :", error);
        }
    };
    
    return (
        <Provider>
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#FFF0F5' }]}>
            <StatusBar backgroundColor={isDarkMode ? '#121212' : '#FFF0F5'} barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

            <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#FF69B4' }]}>🛏️ Mes Berceaux</Text>

            {berceaux.length === 0 ? (
                <Text style={[styles.emptyText, { color: isDarkMode ? '#fff' : '#666' }]}>Aucun berceau trouvé</Text>
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
                    onPress={() => checkBluetoothBeforeAction(versAjouter)}
                >
                    <Text style={styles.addButtonText}>Ajouter un Berceau</Text>
                </TouchableOpacity>
            </Animated.View>

            <Portal>
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                    <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#FF69B4' }]}>Options du Berceau</Text>

                    <TouchableOpacity style={styles.modalButton} onPress={handleConsult}>
                        <Text style={styles.modalButtonText}>Consulter</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalButton} onPress={handleModifier}>
                        <Text style={styles.modalButtonText}>Modifier</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalButton} onPress={handleDelete}>
                        <Text style={styles.modalButtonText}>Supprimer</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.modalCloseButtonText}>Fermer</Text>
                    </TouchableOpacity>
                </Modal>

                
            </Portal>
            <ConfirmModal
                visible={confirmVisible}
                onConfirm={handleConfirmDelete}
                onCancel={() => setConfirmVisible(false)}
                berceauName={selectedBerceau?.name}
            />
        </View>
    </Provider>
    );
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
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
        backgroundColor: '#FF69B4',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 50,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: "#4B0082",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
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
    },
    modalContainer: {
        backgroundColor: "#FFF0F5",

        padding: 25,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        width: '85%',
        alignSelf: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 25,
    },
    modalButton: {
        backgroundColor: '#FF69B4',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginBottom: 15,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalCloseButton: {
        backgroundColor: '#fff',
        borderColor: '#FF69B4',
        borderWidth: 2,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: '#FF69B4',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
export default HomeScreen;
