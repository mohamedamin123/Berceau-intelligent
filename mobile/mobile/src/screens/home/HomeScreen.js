import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import useAuthStore from '../../store/useAuthStore';
import { getBerceausByParentId } from '../../services/BerceauService';
import { getBebeById } from '../../services/BebeService';
import berceauImage from '../../../assets/berceau.png';
import bebeImage from '../../../assets/bebe.png';
import { useNavigation } from '@react-navigation/native';

const BerceauItem = ({ item }) => {
    const [bebeName, setBebeName] = useState("Bébé inconnu");
    const navigation = useNavigation();

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
        <View style={styles.berceauCard}>
            <View style={styles.berceauHeader}>
                <Image source={berceauImage} style={styles.berceauImage} />
                <Text style={styles.nomBerceau}>{item.name || "Nom inconnu"}</Text>
            </View>
            <View style={styles.berceauHeader}>
                <Image source={bebeImage} style={styles.bebeImage} />
                <Text style={styles.nomBebe}>{bebeName}</Text>
            </View>
        </View>
    );
};

const HomeScreen = () => {
    const [berceaux, setBerceaux] = useState([]);
    const user = useAuthStore((state) => state.user);
    const scaleAnim = useState(new Animated.Value(1))[0];
    const navigation = useNavigation();

    useEffect(() => {
        const fetchBerceaux = async () => {
            if (user?.id) {
                try {
                    const response = await getBerceausByParentId(user.id);
                    setBerceaux(Array.isArray(response?.data) ? response.data : response?.data ? [response.data] : []);
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🛏️ Mes Berceaux</Text>

            <FlatList
                data={berceaux}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <BerceauItem item={item} />}
                style={styles.list}
            />

            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={versAjouter}
                >
                    <Text style={styles.addButtonText}>Ajouter un Berceau</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
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
});

export default HomeScreen;
