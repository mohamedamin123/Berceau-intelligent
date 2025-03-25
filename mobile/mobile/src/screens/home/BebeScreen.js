import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const BebeScreen = ({ title = "Titre", items = [] }) => {
    const [opacity, setOpacity] = useState(1); // Gérer l'opacité de la vue

    // Fonction qui est appelée quand on appuie sur un élément
    const handlePress = () => {
        setOpacity(0.3); // Réduit l'opacité de la vue
        setTimeout(() => {
            setOpacity(1); // Restaure l'opacité après 500ms
        }, 500);
    };

    return (
        <View style={[styles.container, { opacity }]}> {/* Appliquer l'opacité sur la vue */}
            <View style={styles.row}>
                {items.slice(0, 2).map((item, index) => (
                    <View key={index} style={styles.card}>
                        <Text style={styles.cardTitle}>{item.label}</Text>
                        <Image source={item.image} style={styles.image} />
                        <TouchableOpacity onPress={() => { item.onPress(); handlePress(); }}>
                            <Text style={styles.input}>{item.value}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <View style={styles.row}>
                {items.slice(2, 4).map((item, index) => (
                    <View key={index} style={styles.card}>
                        <Text style={styles.cardTitle}>{item.label}</Text>
                        <Image source={item.image} style={styles.image} />
                        <TouchableOpacity onPress={() => { item.onPress(); handlePress(); }}>
                            <Text style={styles.input}>{item.value}</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 10,
    },
    card: {
        flex: 1,
        backgroundColor: "#fff", // white background for the card
        padding: 10,
        margin: 5,
        alignItems: "center",
        borderRadius: 30, // rounded corners, similar to your XML
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 4, 
        elevation: 5, // For Android shadow
    },
    cardTitle: {
        fontSize: 20,
        color: "black",
    },
    image: {
        width: 120,
        height: 120,
        marginVertical: 10,
    },
    input: {
        fontSize: 25,
        color: "black",
        textAlign: "center",
        backgroundColor: "transparent",
    },
});

export default BebeScreen;
