import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { getDHTData } from '../../services/DHTService'; // Service pour récupérer les données DHT
import { useNavigation } from '@react-navigation/native';

const ConsulterBerceauScreen = () => {
    const route = useRoute();
    const { id } = route.params; // Récupère l'ID du berceau passé via la navigation
    const navigation = useNavigation();

    const [temperature, setTemperature] = useState("0.00");
    const [humidity, setHumidity] = useState("0.00");

    // Fonction pour récupérer les données DHT depuis l'API
    const fetchDHTData = async () => {
        try {
            const data = await getDHTData(id); // Récupère les données DHT en fonction de l'ID du berceau
            setTemperature(data.tmp ? `${data.tmp}°C` : "0.00°C"); // Met à jour la température avec le symbole °C
            setHumidity(data.hmd ? `${data.hmd}%` : "0.00%"); // Met à jour l'humidité avec le symbole %

        } catch (error) {
            console.log("Erreur lors de la récupération des données DHT", error);
        }
    };

    useEffect(() => {
        fetchDHTData(); // Récupérer les données DHT lors du premier rendu

        // Mettre à jour les données toutes les 5 secondes (par exemple)
        const intervalId = setInterval(fetchDHTData, 5000);

        return () => clearInterval(intervalId); // Nettoyer l'intervalle à la destruction du composant
    }, [id]); // Le useEffect se déclenche chaque fois que l'ID change

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Titre */}
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Berceau</Text>
            </View>

            {/* Section Température et Humidité */}
            <View style={styles.row}>
                {/* Température */}
                <View style={styles.card}>
                    <Text style={styles.subtitle}>Température</Text>
                    <Image source={require('./../../../assets/temperature.png')} style={styles.image} />
                    <Text style={styles.input}>{temperature}</Text>
                </View>

                {/* Humidité */}
                <View style={styles.card}>
                    <Text style={styles.subtitle}>Humidité</Text>
                    <Image source={require('./../../../assets/humidite.png')} style={styles.image} />
                    <Text style={styles.input}>{humidity}</Text>
                </View>
            </View>

            {/* Autres sections */}
            <View style={styles.row}>
                {/* Mouvement */}
                <View style={styles.card}>
                    <Text style={styles.subtitle}>Mouvement</Text>
                    <Image source={require('./../../../assets/mouvement.png')} style={styles.image} />
                    <TouchableOpacity style={styles.button} onPress={() => {
                        // Naviguer vers "ConsulterLumiere" avec l'ID
                        navigation.navigate('ConsulterServo', { id: id });
                    }}>
                        <Text style={styles.buttonText}>Consulter</Text>
                    </TouchableOpacity>
                </View>

                {/* Lumière */}
                <View style={styles.card}>
                    <Text style={styles.subtitle}>Lumière</Text>
                    <Image source={require('./../../../assets/lumiere.png')} style={styles.image} />
                    <TouchableOpacity style={styles.button} onPress={() => {
                        // Naviguer vers "ConsulterLumiere" avec l'ID
                        navigation.navigate('ConsulterLumiere', { id: id });
                    }}>
                        <Text style={styles.buttonText}>Consulter</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Section Ventilateur et Camera */}
            <View style={styles.row}>
                {/* Ventilateur */}
                <View style={styles.card}>
                    <Text style={styles.subtitle}>Ventilateur</Text>
                    <Image source={require('./../../../assets/climatiseur.png')} style={styles.image} />
                    <TouchableOpacity style={styles.button} onPress={() => {
                        // Naviguer vers "ConsulterLumiere" avec l'ID
                        navigation.navigate('ConsulterVentilateur', { id: id });
                    }}>
                        <Text style={styles.buttonText}>Consulter</Text>
                    </TouchableOpacity>
                </View>

                {/* Camera */}
                <View style={styles.card}>
                    <Text style={styles.subtitle}>Camera</Text>
                    <Image source={require('./../../../assets/camera.png')} style={styles.image} />
                    <TouchableOpacity style={styles.button} onPress={() => {
                        // Naviguer vers "ConsulterLumiere" avec l'ID
                        navigation.navigate('ConsulterCamera', { id: id });
                    }}>                       
                    <Text style={styles.buttonText}>Consulter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 15,
        backgroundColor: '#FAFAFA',
        marginTop: 30
    },
    titleContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 24,
        color: 'black',
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    card: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10,
        margin: 5,
        alignItems: "center",
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    subtitle: {
        fontSize: 18,
        color: 'black',
        marginBottom: 10,
    },
    image: {
        width: 120,
        height: 120,
        marginVertical: 10,
    },
    input: {
        fontSize: 25,
        textAlign: 'center',
        color: 'black',
        backgroundColor: 'transparent',
        width: 120,
    },
    button: {
        backgroundColor: '#CB68DD', // Background color of the button
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25, // Rounded corners for the button
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ConsulterBerceauScreen;
