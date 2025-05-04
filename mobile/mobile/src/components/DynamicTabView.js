import React, { useState, useEffect,useContext } from "react";
import { useWindowDimensions, Text, Modal, TouchableOpacity, View, StyleSheet,TextInput,Image } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import BebeScreen from "../screens/home/BebeScreen";
import { getBebesByParentId, updateBebe } from "../services/BebeService";
import useAuthStore from "../store/useAuthStore";
import { ThemeContext } from "../components/ThemeContext"; // adapte le chemin si besoin

const images = {
    lait: require("./../../assets/lait_bebe.png"),
    dormir: require("./../../assets/bebe_dormit.png"),
    repas: require("./../../assets/food.png"),
    couche: require("./../../assets/couche_bebe.png"),
};

const DynamicTabView = () => {
    const { user } = useAuthStore();
    const parentId = user?.id;
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [bebes, setBebes] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBebe, setSelectedBebe] = useState(null);
    const [selectedField, setSelectedField] = useState("");
    const [inputValue, setInputValue] = useState("");
    const { theme } = useContext(ThemeContext); 
    const styles = getStyles(theme === "dark");
    


    const getFormattedTime = () => {
        const currentDate = new Date();
        const hours = currentDate.getHours().toString().padStart(2, '0');
        const minutes = currentDate.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    useEffect(() => {
        const fetchBebes = async () => {
          if (!parentId) return;
          try {
            const response = await getBebesByParentId(parentId);
            const allBebes = response?.data || [];
      
            // Grouper par berceauId
            const latestBebesMap = {};
      
            allBebes.forEach((bebe) => {
              const berceauId = bebe.berceauId;
              const current = latestBebesMap[berceauId];
      
              const currentTime = current
                ? current.created_at._seconds * 1000 + current.created_at._nanoseconds / 1e6
                : 0;
              const bebeTime =
                bebe.created_at._seconds * 1000 + bebe.created_at._nanoseconds / 1e6;
      
              if (!current || bebeTime > currentTime) {
                latestBebesMap[berceauId] = bebe;
              }
            });
      
            // Transformer le résultat en tableau
            const latestBebes = Object.values(latestBebesMap);
            setBebes(latestBebes); // ou tout autre state que tu utilises
          } catch (error) {
            console.error("Erreur lors de la récupération des bébés", error);
          }
        };
      
        fetchBebes();
      }, [parentId]);
      

    if (bebes.length === 0) {
        return (
            <View style={styles.emptyContainer}>            
                <Text style={styles.emptyTitle}>👶 Aucun bébé trouvé</Text>
                <Text style={styles.emptySubtitle}>Ajoutez un bébé pour commencer le suivi</Text>
            </View>
        );
    }
    
    const routes = bebes.map(bebe => ({
        key: bebe.id.toString(),
        title: `👶 Suivi Bébé : ${bebe.prenom}`,
    }));

    const getValueOrDefault = (value) => value || "0.00";

    const handleUpdateValue = (bebe, field) => {
        setSelectedBebe(bebe);
        setSelectedField(field);
        setInputValue(getFormattedTime()); // <= ajoute cette ligne
        setModalVisible(true);
    };

    const handleConfirmUpdate = async () => {
        const currentTime = getFormattedTime();
        const updateData = { [selectedField]: inputValue };

        try {
            const updatedBebe = await updateBebe(selectedBebe.id, updateData);
            const updatedBebeLocal = { ...selectedBebe, [selectedField]: inputValue };
            setBebes(bebes.map(b => (b.id === selectedBebe.id ? updatedBebeLocal : b)));
            setModalVisible(false);
        } catch (error) {
            console.error("Erreur lors de la mise à jour du bébé", error);
        }
    };

    const renderScene = ({ route }) => {
        const bebe = bebes.find(b => b.id.toString() === route.key);

        return (
            <BebeScreen
                title={`👶 Consultation Bébé : ${bebe.prenom}`}
                items={[
                    { label: "🍼 Lait", txt: "biberon", image: images.lait, value: getValueOrDefault(bebe.lait), bgColor: '#FFF0F5', onPress: () => handleUpdateValue(bebe, "lait") },
                    { label: "😴 Dodo", txt: "sommeil", image: images.dormir, value: getValueOrDefault(bebe.dormir), bgColor: '#F0F8FF', onPress: () => handleUpdateValue(bebe, "dormir") },
                    { label: "🍽️ Repas", txt: "repas", image: images.repas, value: getValueOrDefault(bebe.repas), bgColor: '#F5FFFA', onPress: () => handleUpdateValue(bebe, "repas") },
                    { label: "🧷 Couche", txt: "couche", image: images.couche, value: getValueOrDefault(bebe.couche), bgColor: '#FFFACD', onPress: () => handleUpdateValue(bebe, "couche") },
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
                        style={styles.tabBar}
                        labelStyle={styles.tabLabel}
                        indicatorStyle={styles.tabIndicator}
                    />
                )}
            />
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
                        <TextInput
                            style={styles.input}
                            value={inputValue}
                            onChangeText={setInputValue}
                        />

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

const getStyles = (isDarkMode) => StyleSheet.create({
    tabBar: {
        backgroundColor: "#FF69B4",
        elevation: 4,
        shadowOpacity: 0.2,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 5,
    },
    tabLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "white",
    },
    tabIndicator: {
        backgroundColor: "white",
        height: 3,
        borderRadius: 2,
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
        backgroundColor: isDarkMode ? "#121212" : "#F8F8F8",
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#FF69B4",
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 16,
        color: isDarkMode ? "#CCCCCC" : "#666666",
        marginBottom: 20,
        textAlign: "center",
    },
    emptyImage: {
        width: 200,
        height: 200,
        opacity: 0.8,
    },
    
    
});

export default DynamicTabView;
