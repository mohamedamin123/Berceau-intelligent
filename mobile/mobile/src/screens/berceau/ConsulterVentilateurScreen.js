import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, ScrollView, StyleSheet,Modal,TextInput } from 'react-native';
import { on, off, changeMode, getData,setTemperature } from '../../services/VentilateurService';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ConsulterVentilateurScreen = () => {
    const [mode, setMode] = useState('automatique');
    const [etat, setEtat] = useState('Éteint');
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params;
    const [lastActionTime, setLastActionTime] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [newTemperature, setNewTemperature] = useState('');
    const [temperature, setTemperatureState] = useState('');

    useEffect(() => {
        const fetchVentilateurData = async () => {
            try {
                const data = await getData(id);
                setMode(data.mode);
                setEtat(data.etat ? 'Allumé' : 'Éteint');
                if (data.time) {
                    setLastActionTime(new Date(data.time)); // <<< Ajouté ici
                }
                if (data.temperature) {
                    setTemperatureState(data.temperature)
                    console.log("tmp ; ",data.temperature)
                }

            } catch (error) {
                Alert.alert('Erreur', error.message);
            }
        };
        fetchVentilateurData();
    }, [id]);



// Inside handleConfirmTemperature
const handleConfirmTemperature = async () => {
    try {
        const tempValue = parseFloat(newTemperature);
        if (isNaN(tempValue)) {
            Alert.alert('Erreur', 'Veuillez entrer une valeur numérique valide.');
            return;
        }
        await setTemperature(id, tempValue);  // Make sure this is updating on the server or service
        setTemperatureState(tempValue);  // Update the local state to reflect the new temperature
        setModalVisible(false);
        Alert.alert('Succès', 'Température mise à jour.');
    } catch (error) {
        Alert.alert('Erreur', error.message);
    }
};



    const handleAllumer = async () => {
        try {
            await on(id);
            setEtat('Allumé');
            Alert.alert('Succès', 'Ventilateur activé');
            setLastActionTime(new Date());
        } catch (error) {
            Alert.alert('Erreur', error.message);
        }
    };

    const handleEteindre = async () => {
        try {
            await off(id);
            setEtat('Éteint');
            Alert.alert('Succès', 'Ventilateur désactivé');
            setLastActionTime(new Date());
        } catch (error) {
            Alert.alert('Erreur', error.message);
        }
    };

    const toggleMode = async () => {
        try {
            const newMode = mode === "automatique" ? "manuel" : "automatique";
            const response = await changeMode(id, newMode);
            setMode(response.mode);
            setLastActionTime(new Date());
            setEtat('Ouvert');
            Alert.alert('Succès', `Mode changé en : ${response.mode}`);
        } catch (error) {
            Alert.alert('Erreur', error.message);
        }
    };

    const getTimeAgo = () => {
        if (!lastActionTime) return 'Aucune action';
        const now = new Date();
        const diffInSeconds = Math.floor((now - lastActionTime) / 1000);

        if (diffInSeconds < 60) return `Il y a ${diffInSeconds} seconde${diffInSeconds > 1 ? 's' : ''}`;
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
    };


    const isAuto = mode === 'automatique';

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Ventilateur Bébé 🌬️</Text>

            <View style={styles.card}>
                <Text style={styles.label}>État :</Text>
                <Text style={styles.value}>{etat}</Text>

                <Text style={styles.label}>Mode :</Text>
                <Text style={styles.value}>{isAuto ? 'Automatique' : 'Manuel'}</Text>
                <Text style={styles.label}>température souhaitée :</Text>

                <TouchableOpacity onPress={() => {
                    setNewTemperature(temperature?.toString() || '');
                    setModalVisible(true);
                }}>
                <Text style={[styles.value]}>
                    {temperature !== null ? `${temperature} °C` : 'Non définie'}
                </Text>

                </TouchableOpacity>


                
                <Text style={styles.label}>Dernière action :</Text>
                <Text style={styles.value}>{getTimeAgo()}</Text>


            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.btnOn} onPress={handleAllumer}>
                    <Ionicons name="power" size={20} color="#333" style={styles.icon} />
                    <Text style={styles.btnText}>Allumer</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnOff} onPress={handleEteindre}>
                    <Ionicons name="power" size={20} color="#333" style={styles.icon} />
                    <Text style={styles.btnText}>Éteindre</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.btnToggle} onPress={toggleMode}>
                    <Ionicons name="sync" size={20} color="#333" style={styles.icon} />
                    <Text style={styles.btnText}>
                        Mode {isAuto ? 'Automatique' : 'Manuel'}
                    </Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Modifier la température souhaitée</Text>
                        <TextInput
                            style={styles.input}
                            value={newTemperature}
                            onChangeText={setNewTemperature}
                            placeholder="Ex : 24.5"
                            keyboardType="numeric"
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.buttonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleConfirmTemperature} style={styles.confirmButton}>
                                <Text style={styles.buttonText}>Confirmer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
        
        


    );
    
};

export default ConsulterVentilateurScreen;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#FFF0F5',
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6A5ACD',
        marginBottom: 20,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#B0C4DE',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
        marginBottom: 30,
    },
    label: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
        color: '#8A2BE2',
    },
    value: {
        fontSize: 18,
        color: '#555',
        marginBottom: 5,
    },
    buttonContainer: {
        alignItems: 'center',
        gap: 15,
    },
    btnOn: {
        backgroundColor: '#98FB98',
        padding: 14,
        borderRadius: 12,
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnOff: {
        backgroundColor: '#FFB6C1',
        padding: 14,
        borderRadius: 12,
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnToggle: {
        backgroundColor: '#ADD8E6',
        padding: 14,
        borderRadius: 12,
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: '#333',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
    icon: {
        marginRight: 5,
    },
 modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#FF69B4",
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
    },
    cancelButton: {
        backgroundColor: "#ccc",
        padding: 10,
        borderRadius: 5,
    },
    confirmButton: {
        backgroundColor: "#FF69B4",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: "#FF69B4",
        borderRadius: 5,
        padding: 10,
        width: "100%",
        marginBottom: 20,
        fontSize: 16,
    },
    emptyContainer: {
        marginTop:20,
        flex: 1,
        alignItems: "center",
        padding: 20,
        backgroundColor:  "#F8F8F8",
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#FF69B4",
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 16,
        color:  "#666666",
        marginBottom: 20,
        textAlign: "center",
    },
    emptyImage: {
        width: 200,
        height: 200,
        opacity: 0.8,
    },

});
