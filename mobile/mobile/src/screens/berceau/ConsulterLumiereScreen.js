import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation, useRoute } from '@react-navigation/native';
import { changeLightIntensity, getLightData } from './../../services/LumiereService';

const ConsulterLumiereScreen = () => {
    const [intensity, setIntensity] = useState(null);
    const [isLightOn, setIsLightOn] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    const { id } = route.params;

    useEffect(() => {
        const fetchLightData = async () => {
            try {
                const data = await getLightData(id);
                setIsLightOn(data.etat);
                setIntensity(data.intensite*100);
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

    const openLight = async () => {
        try {
            await changeLightIntensity(id,1);
            setIsLightOn(true);
            setIntensity(100); // Éteindre la lumière = intensité 0

        } catch (error) {
            console.error('Erreur lors de l\'allumage de la lumière:', error);
        }
    };

    const closeLight = async () => {
        try {
            await changeLightIntensity(id,0);
            setIsLightOn(false);
            setIntensity(0); // Éteindre la lumière = intensité 0
        } catch (error) {
            console.error('Erreur lors de l\'extinction de la lumière:', error);
        }
    };

    const updateIntensity = async (newIntensity) => {
        try {
            const normalizedIntensity = newIntensity / 100; // Normaliser la valeur entre 0 et 100
            setIntensity(newIntensity); // Mettre à jour localement
    
            await changeLightIntensity(id, normalizedIntensity); // Mettre à jour dans Firebase
    
            if (normalizedIntensity > 0 && !isLightOn) {
                setIsLightOn(true);
            } else if (normalizedIntensity === 0) {
                setIsLightOn(false);
            }
        } catch (error) {
            console.error('Erreur lors de la modification de l\'intensité de la lumière:', error);
        }
    };
    

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>Lumière</Text>
            </View>

            <View style={styles.imageContainer}>
                <Image 
                    source={require('./../../../assets/lumiere.png')} 
                    style={styles.image} 
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[styles.buttonOpen, isLightOn && styles.buttonDisabled]} 
                    onPress={openLight} 
                    disabled={isLightOn}
                >
                    <Text style={styles.buttonText}>Ouvrir</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.buttonClose, !isLightOn && styles.buttonDisabled]} 
                    onPress={closeLight} 
                    disabled={!isLightOn}
                >
                    <Text style={styles.buttonText}>Fermer</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.intensityContainer}>
                <Text style={styles.intensityText}>Intensité</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={100}
                    step={1}
                    value={intensity}
                    onSlidingComplete={updateIntensity} // Mettre à jour Firebase après avoir relâché le slider
                    minimumTrackTintColor="#1CD223"
                    maximumTrackTintColor="#BDBDBD"
                    thumbTintColor="#FF5722"
                />
                <Text style={styles.intensityValue}>{intensity}%</Text>
            </View>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>Retour</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        padding: 20,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    titleText: {
        fontSize: 28,
        color: 'black',
        fontWeight: 'bold',
        fontStyle: 'italic',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 250,
        height: 250,
        marginVertical: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginVertical: 15,
    },
    buttonOpen: {
        backgroundColor: '#1CD223',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonClose: {
        backgroundColor: '#FF5722',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#BDBDBD',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    intensityContainer: {
        alignItems: 'center',
        marginVertical: 15,
    },
    intensityText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    slider: {
        width: '80%',
        marginVertical: 10,
    },
    intensityValue: {
        fontSize: 18,
        color: 'black',
    },
    backButton: {
        backgroundColor: '#FF9800',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 20,
    },
});

export default ConsulterLumiereScreen;
