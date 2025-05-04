import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getDHTData } from '../../services/DHTService'; // Service pour récupérer les données DHT

const ConsulterBerceauScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params; // Récupère l'ID du berceau

    const [temperature, setTemperature] = useState("0.00°C");
    const [humidity, setHumidity] = useState("0.00%");
    const theme = useColorScheme();  // Récupère le thème actuel

    const fetchDHTData = async () => {
        try {
            const data = await getDHTData(id);
            setTemperature(data?.tmp ? `${data.tmp}°C` : "0.00°C");
            setHumidity(data?.hmd ? `${data.hmd}%` : "0.00%");
        } catch (error) {
            console.error("Erreur lors de la récupération des données DHT:", error);
        }
    };

    useEffect(() => {
        fetchDHTData();
        const intervalId = setInterval(fetchDHTData, 5000);
        return () => clearInterval(intervalId);
    }, [id]);

    return (
        <ScrollView contentContainerStyle={styles.container(theme)}>
            {/* Titre */}
            <View style={styles.titleContainer}>
                <Text style={styles.title(theme)}>Détails du Berceau</Text>
            </View>

            {/* Température et Humidité */}
            <View style={styles.row}>
                <View style={styles.card(theme)}>
                    <Text style={styles.subtitle(theme)}>Température</Text>
                    <Image source={require('./../../../assets/temperature.png')} style={styles.icon} />
                    <Text style={styles.valueText(theme)}>{temperature}</Text>
                </View>

                <View style={styles.card(theme)}>
                    <Text style={styles.subtitle(theme)}>Humidité</Text>
                    <Image source={require('./../../../assets/humidite.png')} style={styles.icon} />
                    <Text style={styles.valueText(theme)}>{humidity}</Text>
                </View>
            </View>

            {/* Mouvement et Lumière */}
            <View style={styles.row}>
                <View style={styles.card(theme)}>
                    <Text style={styles.subtitle(theme)}>Mouvement</Text>
                    <Image source={require('./../../../assets/mouvement.png')} style={styles.icon} />
                    <TouchableOpacity
                        style={styles.button(theme)}
                        onPress={() => navigation.navigate('ConsulterServo', { id })}
                    >
                        <Text style={styles.buttonText}>Consulter</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card(theme)}>
                    <Text style={styles.subtitle(theme)}>Lumière</Text>
                    <Image source={require('./../../../assets/lumiere.png')} style={styles.icon} />
                    <TouchableOpacity
                        style={styles.button(theme)}
                        onPress={() => navigation.navigate('ConsulterLumiere', { id })}
                    >
                        <Text style={styles.buttonText}>Consulter</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Ventilateur et Caméra */}
            <View style={styles.row}>
                <View style={styles.card(theme)}>
                    <Text style={styles.subtitle(theme)}>Ventilateur</Text>
                    <Image source={require('./../../../assets/climatiseur.png')} style={styles.icon} />
                    <TouchableOpacity
                        style={styles.button(theme)}
                        onPress={() => navigation.navigate('ConsulterVentilateur', { id })}
                    >
                        <Text style={styles.buttonText}>Consulter</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.card(theme)}>
                    <Text style={styles.subtitle(theme)}>Caméra</Text>
                    <Image source={require('./../../../assets/camera.png')} style={styles.icon} />
                    <TouchableOpacity
                        style={styles.button(theme)}
                        onPress={() => navigation.navigate('ConsulterCamera', { id })}
                    >
                        <Text style={styles.buttonText}>Consulter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: (theme) => ({
        padding: 20,
        backgroundColor: theme === 'dark' ? '#333' : '#FFF0F5',
        flexGrow: 1,
    }),
    titleContainer: {
        marginBottom: 20,
    },
    title: (theme) => ({
        fontSize: 26,
        fontWeight: 'bold',
        color: theme === 'dark' ? '#FF69B4' : '#FF69B4',
        textAlign: 'center',
    }),
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    card: (theme) => ({
        width: '47%',
        backgroundColor: theme === 'dark' ? '#444' : '#fff',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
        shadowColor: theme === 'dark' ? '#fff' : '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    }),
    icon: {
        width: 70,
        height: 70,
        marginBottom: 10,
    },
    subtitle: (theme) => ({
        fontSize: 18,
        fontWeight: '600',
        color: theme === 'dark' ? '#fff' : '#333',
        marginBottom: 10,
    }),
    valueText: (theme) => ({
        fontSize: 20,
        fontWeight: 'bold',
        color: theme === 'dark' ? '#FF69B4' : '#FF69B4',
    }),
    button: (theme) => ({
        backgroundColor: theme === 'dark' ? '#FF69B4' : '#FF69B4',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginTop: 10,
    }),
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default ConsulterBerceauScreen;
