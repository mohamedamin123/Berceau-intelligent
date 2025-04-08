import React, { useState, useEffect } from "react";
import { useWindowDimensions, Text, Modal, TouchableOpacity, View, StyleSheet } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import BebeScreen from "../screens/home/BebeScreen";
import { getBebesByParentId, updateBebe } from "../services/BebeService";
import useAuthStore from "../store/useAuthStore"; // Importer ton store Zustand

const images = {
    lait: require("./../../assets/lait_bebe.png"),
    dormir: require("./../../assets/bebe_dormit.png"),
    repas: require("./../../assets/repas_bebe.png"),
    couche: require("./../../assets/couche_bebe.png"),
};

const DynamicTabView = () => {
    const { user } = useAuthStore(); // Récupérer l'utilisateur depuis Zustand
    const parentId = user?.id; // Récupérer l'id de l'utilisateur comme parentId
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [bebes, setBebes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBebe, setSelectedBebe] = useState(null);
    const [selectedField, setSelectedField] = useState("");

    // Fonction pour récupérer l'heure actuelle au format hh:mm
    const getFormattedTime = () => {
        const currentDate = new Date();
        const hours = currentDate.getHours().toString().padStart(2, '0');  // Ajoute un zéro si l'heure est inférieure à 10
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');  // Idem pour les minutes
        return `${hours}:${minutes}`;  // Retourne l'heure formatée
    };

    // useEffect pour récupérer les bébés quand parentId change
    useEffect(() => {
        const fetchBebes = async () => {
            if (!parentId) return;

            try {
                const response = await getBebesByParentId(parentId);
                console.log(response); // Vérification de la réponse
                if (response && response.data && response.data.length > 0) {
                    setBebes(response.data);
                } else {
                    setBebes([]);
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des bébés", error);
            }
        };

        fetchBebes();
    }, [parentId]); // L'effet se déclenche quand parentId change

    // Si aucun bébé n'est trouvé, affiche un message
    if (bebes.length === 0) {
        return <Text>Chargement ou aucun bébé trouvé...</Text>;
    }

    // Définir les routes en fonction des bébés récupérés
    const routes = bebes.map(bebe => ({
        key: bebe.id.toString(),
        title: `👶 Suivi Bébé : ${bebe.prenom}`,
    }));

    // Fonction pour récupérer la valeur ou "0.00" si la valeur est manquante
    const getValueOrDefault = (value) => {
        return value ? value : "0.00";
    };

    // Fonction pour afficher la modal et mettre à jour la valeur
    const handleUpdateValue = (bebe, field) => {
        const currentValue = getValueOrDefault(bebe[field]);
        console.log(`handleUpdateValue appelé pour ${field} de ${bebe.prenom} avec valeur actuelle ${currentValue}`);
        
        setSelectedBebe(bebe);
        setSelectedField(field);
        setModalVisible(true);
    };

    // Fonction pour mettre à jour la base de données et fermer la modal
    const handleConfirmUpdate = async () => {
        const currentTime = getFormattedTime(); // Utilisation de la nouvelle fonction pour l'heure
        const updateData = { [selectedField]: currentTime }; // Données à mettre à jour
        console.log(`Données à mettre à jour :`, updateData);

        // Mettre à jour dans le BebeService et la base de données
        try {
            const updatedBebe = await updateBebe(selectedBebe.id, updateData); // Mise à jour de la base de données
            console.log(`Bébé mis à jour avec succès :`, updatedBebe);

            // Mise à jour de l'état local
            const updatedBebeLocal = { ...selectedBebe, [selectedField]: currentTime };
            setBebes(bebes.map(b => (b.id === selectedBebe.id ? updatedBebeLocal : b))); // Mise à jour de l'état
            setModalVisible(false);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du bébé", error);
        }
    };

    const renderScene = ({ route }) => {
        const bebe = bebes.find(b => b.id.toString() === route.key);  // Trouver le bébé correspondant à l'onglet

        return (
            <BebeScreen
                title={`👶 Consultation Bébé : ${bebe.prenom}`}
                items={[
                    { label: "🍼 Lait", image: images.lait, value: getValueOrDefault(bebe.lait), onPress: () => handleUpdateValue(bebe, "lait") },
                    { label: "😴 Dormir", image: images.dormir, value: getValueOrDefault(bebe.dormir), onPress: () => handleUpdateValue(bebe, "dormir") },
                    { label: "🍽️ Repas", image: images.repas, value: getValueOrDefault(bebe.repas), onPress: () => handleUpdateValue(bebe, "repas") },
                    { label: "🧷 Couche", image: images.couche, value: getValueOrDefault(bebe.couche), onPress: () => handleUpdateValue(bebe, "couche") },
                ]}
            />
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={{ width: layout.width }}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        style={{
                            backgroundColor: "#ff8c00",
                            elevation: 4,
                            shadowOpacity: 0.2,
                        }}
                        labelStyle={{ fontSize: 16, fontWeight: "bold", color: "white" }}
                        indicatorStyle={{ backgroundColor: "white", height: 3, borderRadius: 2 }}
                    />
                )}
            />
            
            {/* Modal personnalisé */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Modifier {selectedField} pour {selectedBebe?.prenom}
                        </Text>
                        <Text style={styles.modalMessage}>
                            Valeur actuelle : {getFormattedTime()} {/* Affiche l'heure actuelle */}
                        </Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                <Text style={styles.buttonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleConfirmUpdate} style={styles.confirmButton}>
                                <Text style={styles.buttonText}>Confirmer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
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
        backgroundColor: "#ff8c00",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default DynamicTabView;
