import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, useColorScheme } from 'react-native';
import useAuthStore from '../../store/useAuthStore';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
    const { logout } = useAuthStore();
    const navigation = useNavigation();
    const colorScheme = useColorScheme(); // ← détecte le thème système
    const isDarkMode = colorScheme === 'dark';

    const styles = getStyles(isDarkMode);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Paramètres</Text>

            <View style={styles.card}>
                <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Profile')}>
                    <Icon name="user" size={22} color={isDarkMode ? "#fff" : "#555"} />
                    <Text style={styles.optionText}>Mon Profil</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.card, { marginBottom: 30 }]}>
                <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Bebes')}>
                    <Icon name="users" size={22} color={isDarkMode ? "#fff" : "#555"} />
                    <Text style={styles.optionText}>Mes Bébés</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <View style={styles.option}>
                    <Icon name="moon" size={22} color={isDarkMode ? "#fff" : "#555"} />
                    <Text style={styles.optionText}>Mode Sombre (Automatique)</Text>
                    <Switch 
                        value={isDarkMode}
                        disabled={true} // désactivé car automatique
                        style={styles.switch}
                    />
                </View>

                <View style={styles.option}>
                    <Icon name="bell" size={22} color={isDarkMode ? "#fff" : "#555"} />
                    <Text style={styles.optionText}>Notifications</Text>
                    <Switch 
                        value={true}
                        onValueChange={() => {}}
                        style={styles.switch}
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Icon name="log-out" size={22} color="#fff" />
                <Text style={styles.logoutButtonText}>Déconnexion</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const getStyles = (isDarkMode) => StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: isDarkMode ? '#121212' : '#FFF0F5',
        alignItems: 'center',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: isDarkMode ? '#fff' : '#FF69B4',
        marginBottom: 20,
    },
    card: {
        width: '100%',
        backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: 10
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: isDarkMode ? '#333' : '#ddd',
    },
    optionText: {
        fontSize: 18,
        color: isDarkMode ? '#fff' : '#333',
        marginLeft: 15,
        flex: 1,
    },
    switch: {
        transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF69B4',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        justifyContent: 'center',
        width: '100%',
        elevation: 3,
        marginTop: 20
    },
    logoutButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default SettingsScreen;
