import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ThemeContext } from '../../components/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../../store/useAuthStore';
import { getUserByEmail, updateUser } from './../../services/UserService';

const ProfileScreen = () => {
    const { user } = useAuthStore();
    const { isDarkMode } = useContext(ThemeContext);
    const navigation = useNavigation();
    const styles = getStyles(isDarkMode);

    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchUserData = async () => {
                try {
                    const response = await getUserByEmail(user.email);
                    const { prenom, nom } = response.data.data;
                    setPrenom(prenom);
                    setNom(nom);
                    setEmail(user.email);
                    setFullName(`${prenom} ${nom}`);
                } catch (error) {
                    Alert.alert('Erreur', "Impossible de récupérer les données.");
                } finally {
                    setLoading(false);
                }
            };
            fetchUserData();
        }
    }, [user]);

    const handleUpdate = async () => {
        try {
            const updatedData = { prenom, nom };
            await updateUser(user.id, updatedData);
            setFullName(`${prenom} ${nom}`);
            Alert.alert("Succès", "Profil mis à jour !");
        } catch (error) {
            Alert.alert('Erreur', 'La mise à jour du profil a échoué.');
        }
    };

    if (!user) return <Text style={styles.errorText}>Utilisateur non authentifié</Text>;
    if (loading) return <ActivityIndicator size="large" color="#CB68DD" style={styles.loader} />;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Image source={require('./../../../assets/family.png')} style={styles.avatar} />
                <Text style={styles.username}>{fullName}</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.sectionTitle}>👨‍👩‍👧‍👦 Mon Profil</Text>

                <View style={styles.row}>
                    <View style={styles.inputGroupSmall}>
                        <Text style={styles.inputLabel}>Prénom</Text>
                        <TextInput
                            style={styles.input}
                            value={prenom}
                            onChangeText={setPrenom}
                        />
                    </View>

                    <View style={styles.inputGroupSmall}>
                        <Text style={styles.inputLabel}>Nom</Text>
                        <TextInput
                            style={styles.input}
                            value={nom}
                            onChangeText={setNom}
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Nom Complet</Text>
                    <TextInput
                        style={styles.inputDisabled}
                        value={fullName}
                        editable={false}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                        style={styles.inputDisabled}
                        value={email}
                        editable={false}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Icon name="save" size={24} color="#fff" />
                    <Text style={styles.buttonText}>Mettre à jour</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const getStyles = (isDarkMode) => StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: isDarkMode ? '#121212' : '#FFF0F5',
        padding: 20,
        alignItems: "center",
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#CB68DD',
        marginBottom: 10,
        backgroundColor: isDarkMode ? "#333" : "#fff",
    },
    username: {
        fontSize: 22,
        fontWeight: '700',
        color: '#CB68DD',
    },
    form: {
        backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
        width: '100%',
        padding: 25,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
    },
    sectionTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: '#FF69B4',
        marginBottom: 25,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    inputGroupSmall: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 15,
        color: isDarkMode ? '#ccc' : '#555',
        marginBottom: 5,
    },
    input: {
        height: 48,
        borderColor: isDarkMode ? '#555' : '#eee',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        fontSize: 16,
        color: isDarkMode ? '#fff' : '#333',
        backgroundColor: isDarkMode ? '#2c2c2c' : '#f9f9f9',
    },
    inputDisabled: {
        height: 48,
        borderColor: isDarkMode ? '#555' : '#eee',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        fontSize: 16,
        color: isDarkMode ? '#999' : '#aaa',
        backgroundColor: isDarkMode ? '#2c2c2c' : '#f0f0f0',
    },
    button: {
        backgroundColor: '#CB68DD',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 30,
        marginTop: 20,
        gap: 8,
        shadowColor: '#CB68DD',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        textAlign: 'center',
        color: 'red',
        fontSize: 18,
        marginTop: 50,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProfileScreen;
