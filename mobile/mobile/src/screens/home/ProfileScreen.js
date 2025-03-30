import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Image, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import useAuthStore from '../../store/useAuthStore';
import { getUserByEmail, updateUser } from './../../services/UserService';

const ProfileScreen = () => {
    const { user } = useAuthStore();
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
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

    const handleUpdateProfile = async () => {
        try {
            const updatedData = { prenom, nom };
            await updateUser(user.id, updatedData);
            setFullName(`${prenom} ${nom}`);
            setIsEditing(false);
            Alert.alert('Succès', 'Profil mis à jour avec succès !');
        } catch (error) {
            Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour.');
        }
    };

    if (!user) return <Text style={styles.errorText}>Utilisateur non authentifié</Text>;
    if (loading) return <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Image de Profil */}
            <View style={styles.header}>
                <Image source={require('./../../../assets/client.png')} style={styles.avatar} />

            </View>

            {/* Formulaire de profil */}
            <View style={styles.form}>
                <Text style={styles.sectionTitle}>Informations personnelles</Text>
                {[{ label: "Prénom", value: prenom, setter: setPrenom },
                { label: "Nom", value: nom, setter: setNom },
                { label: "Nom complet", value: fullName, editable: false },
                { label: "Email", value: email, editable: false }].map((item, index) => (
                    <View style={styles.inputGroup} key={index}>
                        <Text style={styles.inputLabel}>{item.label}</Text>
                        <TextInput
                            style={styles.input}
                            value={item.value}
                            editable={item.editable !== false && isEditing}
                            onChangeText={item.setter}
                        />
                    </View>
                ))}
            </View>

            {/* Bouton Modifier / Sauvegarder */}
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => (isEditing ? handleUpdateProfile() : setIsEditing(true))}>
                <Ionicons name={isEditing ? "save" : "create"} size={20} color="#fff" />
                <Text style={styles.editButtonText}>{isEditing ? 'Sauvegarder' : 'Modifier'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#FAFAFA',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#6200EE',
    },
    editIcon: {
        position: 'absolute',
        bottom: 5,
        right: 110,
        backgroundColor: '#6200EE',
        padding: 8,
        borderRadius: 20,
    },
    form: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    input: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: 10,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fff',
    },
    editButton: {
        backgroundColor: '#6200EE',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 10,
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
    }
});

export default ProfileScreen;