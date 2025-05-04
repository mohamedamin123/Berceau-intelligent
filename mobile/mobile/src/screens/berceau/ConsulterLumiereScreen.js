import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation, useRoute } from '@react-navigation/native';
import { changeLightIntensity, getLightData } from './../../services/LumiereService';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ConsulterLumiereScreen = () => {
    const [intensity, setIntensity] = useState(null);
    const [isLightOn, setIsLightOn] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params;
    const [lastChange, setLastChange] = useState(null);


    useEffect(() => {
        const fetchLightData = async () => {
            try {
                const data = await getLightData(id);
                setIsLightOn(data.etat);
                setIntensity(data.intensite * 100);
                setLastChange(data.time); // <- ajouter ici
            } catch (error) {
                console.error('Erreur lors de la récupération des données de la lumière:', error);
            }
        };
        fetchLightData();
    }, [id]);

    if (isLightOn === null || intensity === null) {
        return (
            <View style={styles.container}>
                <Text>Chargement...</Text>
            </View>
        );
    }

    const formatDate = (timestamp) => {
        if (!timestamp) return "Inconnu";

        const date = new Date(timestamp);
        const options = {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return date.toLocaleDateString('fr-FR', options);
    };


    const openLight = async () => {
        try {
            await changeLightIntensity(id, 1);
            setIsLightOn(true);
            setIntensity(100);
        } catch (error) {
            console.error("Erreur lors de l'allumage de la lumière:", error);
        }
    };

    const closeLight = async () => {
        try {
            await changeLightIntensity(id, 0);
            setIsLightOn(false);
            setIntensity(0);
        } catch (error) {
            console.error("Erreur lors de l'extinction de la lumière:", error);
        }
    };

    const toggleLight = () => {
        if (isLightOn) {
            closeLight();
        } else {
            openLight();
        }
    };

    const updateIntensity = async (newIntensity) => {
        try {
            const normalizedIntensity = newIntensity / 100;
            setIntensity(newIntensity);
            await changeLightIntensity(id, normalizedIntensity);
            if (normalizedIntensity > 0 && !isLightOn) {
                setIsLightOn(true);
            } else if (normalizedIntensity === 0) {
                setIsLightOn(false);
            }
        } catch (error) {
            console.error("Erreur lors de la modification de l'intensité:", error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Icon name="lightbulb-on" size={32} color="#FFD700" />
                <Text style={styles.title}>Lumière du Berceau</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.row}>
                    <Icon
                        name={isLightOn ? "power-plug" : "power-plug-off"}
                        size={24}
                        color={isLightOn ? "#32CD32" : "#FF6347"}
                    />
                    <Text style={[styles.label, { marginLeft: 8 }]}>
                        État : <Text style={styles.value}>{isLightOn ? 'Allumée' : 'Éteinte'}</Text>
                    </Text>
                </View>

                <View style={styles.row}>
                    <Icon name="white-balance-sunny" size={24} color="#FFD700" />
                    <Text style={[styles.label, { marginLeft: 8 }]}>
                        Intensité : <Text style={styles.value}>{intensity}%</Text>
                    </Text>
                </View>

                <View style={styles.sliderContainer}>
                    <Text style={styles.sliderLabel}>
                        {isLightOn ? "Glissez pour ajuster" : "Allumez la lumière pour régler"}
                    </Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={100}
                        step={1}
                        value={intensity}
                        onValueChange={val => isLightOn && updateIntensity(val)}
                        thumbTintColor="#FFD700"
                        minimumTrackTintColor="#FFD700"
                        maximumTrackTintColor="#E0E0E0"
                        disabled={!isLightOn}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, !isLightOn && styles.buttonActive]}
                        onPress={closeLight}
                        activeOpacity={0.8}
                    >
                        <Icon name="toggle-switch-off-outline" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Éteindre</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, isLightOn && styles.buttonActive]}
                        onPress={openLight}
                        activeOpacity={0.8}
                    >
                        <Icon name="toggle-switch-outline" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Allumer</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.footerText}>
                    <Icon name="history" size={16} color="#888" /> Dernier changement : {formatDate(lastChange)}
                </Text>

            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#FFF0F5',
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: '900',
        color: '#32CD32',
        marginLeft: 10,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    label: {
        fontSize: 18,
        color: '#333',
        fontWeight: '600',
    },
    value: {
        fontSize: 18,
        color: '#555',
        fontWeight: '700',
    },
    sliderContainer: {
        marginVertical: 20,
    },
    sliderLabel: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 8,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#CCC',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 30,
        width: '48%',
        justifyContent: 'center',
    },
    buttonActive: {
        backgroundColor: '#32CD32',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 6,
    },
    footerText: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
        marginTop: 20,
    },
});

export default ConsulterLumiereScreen;
