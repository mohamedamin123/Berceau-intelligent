import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { on, off, changeMode, getData } from '../../services/ServoService';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ConsulterServoScreen = () => {
    const [mode, setMode] = useState('auto');
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params;

    useEffect(() => {
        const fetchVentilateurData = async () => {
            try {
                const data = await getData(id);
                setMode(data.mode);
            } catch (error) {
                Alert.alert('Erreur', error.message);
            }
        };
        fetchVentilateurData();
    }, [id]);

    const handleOuvrir = async () => {
        try {
            await on(id);
            Alert.alert('Succès', 'Ventilateur activé');
        } catch (error) {
            Alert.alert('Erreur', error.message);
        }
    };

    const handleFermer = async () => {
        try {
            await off(id);
            Alert.alert('Succès', 'Ventilateur désactivé');
        } catch (error) {
            Alert.alert('Erreur', error.message);
        }
    };

    const handleModeToggle = async () => {
        try {
            const newMode = mode === "auto" ? "manuel" : "auto";
            const response = await changeMode(id, newMode);
            setMode(response.mode);
            Alert.alert('Succès', `Mode changé en : ${response.mode}`);
        } catch (error) {
            Alert.alert('Erreur', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ventilateur</Text>
            <Image source={require('../../../assets/mouvement.png')} style={styles.image} />

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonOpen} onPress={handleOuvrir}>
                    <Ionicons name="power" size={24} color="white" />
                    <Text style={styles.buttonText}>Ouvrir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonClose} onPress={handleFermer}>
                    <Ionicons name="power" size={24} color="white" />
                    <Text style={styles.buttonText}>Fermer</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.buttonMode} onPress={handleModeToggle}>
                <Ionicons name="settings" size={24} color="white" />
                <Text style={styles.buttonText}>Mode : {mode}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonRetour} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" />
                <Text style={styles.buttonText}>Retour</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ConsulterServoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 10,
    },
    image: {
        width: 170,
        height: 170,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 15,
        marginBottom: 20,
    },
    buttonOpen: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10B981',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 12,
        gap: 10,
        elevation: 3,
    },
    buttonClose: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EF4444',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 12,
        gap: 10,
        elevation: 3,
    },
    buttonMode: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3B82F6',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 12,
        gap: 10,
        elevation: 3,
        marginBottom: 20,
    },
    buttonRetour: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F59E0B',
        paddingVertical: 12,
        paddingHorizontal: 50,
        borderRadius: 12,
        gap: 10,
        elevation: 3,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});