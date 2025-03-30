import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const BebeScreen = ({ title, items }) => {
    const [opacity, setOpacity] = useState(1);

    const handlePress = (onPress) => {
        setOpacity(0.3);
        setTimeout(() => setOpacity(1), 500);
        onPress();
    };

    return (
        <View style={[styles.container, { opacity }]}>
            <Text style={styles.screenTitle}>{title}</Text>
            {[0, 1].map(row => (
                <View key={row} style={styles.row}>
                    {items.slice(row * 2, row * 2 + 2).map(item => (
                        <TouchableOpacity 
                            key={item.label} 
                            style={styles.card} 
                            onPress={() => handlePress(item.onPress)}
                        >
                            <Text style={styles.cardTitle}>{item.label}</Text>
                            <Image source={item.image} style={styles.image} />
                            <Text style={styles.input}>{item.value}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
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
