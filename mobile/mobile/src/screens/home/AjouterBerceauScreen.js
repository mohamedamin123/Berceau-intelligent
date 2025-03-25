import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import WifiManager from 'react-native-wifi-reborn';

const AjouterBerceauScreen = ({ navigation }) => {
    const [nomBerceau, setNomBerceau] = useState('');
    const [nomBebe, setNomBebe] = useState('');
    const [dateNaissance, setDateNaissance] = useState('');
    const [ssid, setSsid] = useState('');
    const [motDePasse, setMotDePasse] = useState('');

    useEffect(() => {
        // Obtenir le nom du Wi-Fi auquel l'appareil est connecté
        WifiManager.getCurrentWifiSSID()
            .then((ssid) => {
                setSsid(ssid);
            })
            .catch((error) => {
                console.log('Erreur lors de la récupération du SSID: ', error);
            });
    }, []);

    const handleSubmit = () => {
        // Ajouter la logique pour envoyer ces données ou les traiter
        console.log({
            nomBerceau,
            nomBebe,
            dateNaissance,
            ssid,
            motDePasse
        });
        // Naviguer vers un autre écran après l'ajout
        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Ajouter un Berceau</Text>

            <Text style={styles.sectionTitle}>Configuration Berceau</Text>
            <TextInput
                style={styles.input}
                placeholder="Nom du berceau"
                value={nomBerceau}
                onChangeText={setNomBerceau}
            />
            <TextInput
                style={styles.input}
                placeholder="Nom du bébé"
                value={nomBebe}
                onChangeText={setNomBebe}
            />
            <TextInput
                style={styles.input}
                placeholder="Date de naissance (JJ/MM/AAAA)"
                value={dateNaissance}
                onChangeText={(text) => {
                    // Formatage automatique de la date
                    let formattedText = text.replace(/[^0-9]/g, '');
                    if (formattedText.length > 2) {
                        formattedText = formattedText.substring(0, 2) + '/' + formattedText.substring(2);
                    }
                    if (formattedText.length > 5) {
                        formattedText = formattedText.substring(0, 5) + '/' + formattedText.substring(5, 9);
                    }
                    setDateNaissance(formattedText);
                }}
                keyboardType="numeric"
                maxLength={10}
            />

            <Text style={styles.sectionTitle}>Configuration Wi-Fi</Text>
            <TextInput
                style={styles.input}
                placeholder="Nom du réseau Wi-Fi"
                value={ssid}
                onChangeText={setSsid}
                editable={false} // Désactiver l'édition du champ ssid
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe Wi-Fi"
                value={motDePasse}
                onChangeText={setMotDePasse}
                secureTextEntry
            />

            <TouchableOpacity style={styles.addButton} onPress={handleSubmit}>
                <Text style={styles.addButtonText}>Ajouter</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: '#FAFAFA',
        marginTop: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#6200EE',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    input: {
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 16,
        marginBottom: 12,
        fontSize: 16,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    addButton: {
        backgroundColor: '#6200EE',
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AjouterBerceauScreen;
