import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { on, off, changeMode, getData } from '../../services/VentilateurService';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const ConsulterVentilateurScreen = () => {
    const [temperature, setTemperature] = useState('');
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
            <Image source={require('../../../assets/climatiseur.png')} style={styles.image} />
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
                <Ionicons name="sync" size={24} color="white" />
                <Text style={styles.buttonText}>Mode : {mode}</Text>
            </TouchableOpacity>

{/* 
<View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>Température :</Text>
    <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Saisir"
        value={temperature}
        onChangeText={setTemperature}
    />
</View> 
*/}

            <TouchableOpacity style={styles.buttonRetour} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="white" />
                <Text style={styles.buttonText}>Retour</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ConsulterVentilateurScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E3F2FD',
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#01579B',
        marginBottom: 10,
    },
    image: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    buttonOpen: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#43A047',
        padding: 12,
        borderRadius: 10,
        width: '40%',
        justifyContent: 'center',
    },
    buttonClose: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D32F2F',
        padding: 12,
        borderRadius: 10,
        width: '40%',
        justifyContent: 'center',
    },
    buttonMode: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0288D1',
        padding: 12,
        borderRadius: 10,
        width: '80%',
        justifyContent: 'center',
        marginBottom: 20,
    },
    buttonRetour: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFA000',
        padding: 12,
        borderRadius: 10,
        width: '80%',
        justifyContent: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        borderRadius: 8,
        width: '80%',
        borderWidth: 1,
        borderColor: '#BDBDBD',
    },
    inputLabel: {
        fontSize: 16,
        color: '#01579B',
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 40,
        textAlign: 'center',
        fontSize: 18,
    },
});
