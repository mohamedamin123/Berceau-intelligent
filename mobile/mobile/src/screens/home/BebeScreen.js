import React, { useState, useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ThemeContext } from '../../components/ThemeContext'; // << OK

const BebeScreen = ({ title, items }) => {
    const [opacity, setOpacity] = useState(1);
    const { isDarkMode } = useContext(ThemeContext); // << Utiliser DarkMode ici
    const styles = getStyles(isDarkMode); // << Styles dynamiques

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
                            style={[styles.card, { backgroundColor: item.bgColor }]}
                            onPress={() => handlePress(item.onPress)}
                        >
                            <Text style={styles.cardTitle}>{item.label}</Text>
                            <Image source={item.image} style={styles.image} />
                            <Text style={styles.txt}>Dernier {item.txt} : {item.value}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
        </View>
    );
};

const getStyles = (isDarkMode) => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
        backgroundColor: isDarkMode ? '#121212' : '#FFF5F7',
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 10,
    },
    txt: {
        textAlign: "center",
        color: isDarkMode ? '#ccc' : '#333',
    },
    card: {
        flex: 1,
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
    cardTitle: {
        fontSize: 20,
        color: "#FF69B4",
    },
    image: {
        width: 120,
        height: 120,
        marginVertical: 10,
    },
    input: {
        fontSize: 25,
        color: isDarkMode ? '#fff' : 'black',
        textAlign: "center",
        backgroundColor: "transparent",
    },
});

export default BebeScreen;
