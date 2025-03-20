import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import useAuthStore from '../../store/useAuthStore'; // Importer votre store Zustand
import { getUserByEmail, updateUser } from './../../services/UserService'; // Importer les fonctions d'API
const ProfileScreen = () => {
    const { user } = useAuthStore(); // Récupérer l'utilisateur depuis Zustand
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            // Récupérer les informations de l'utilisateur par son email
            const fetchUserData = async () => {
                try {
                    const response = await getUserByEmail(user.email);
                    const { prenom, nom } = response.data.data;
                    setPrenom(prenom);
                    setNom(nom);
                    setEmail(user.email);
                    setFullName(`${prenom} ${nom}`);
                } catch (error) {
                    console.error('Erreur lors de la récupération des informations de l\'utilisateur:', error);
                }
            };

            fetchUserData();
        }
    }, [user]);

    const handleUpdateProfile = async () => {
        try {
            const updatedData = { prenom, nom };
    
            // Appelle la méthode updateUser avec l'ID de l'utilisateur et les nouvelles données
            const response = await updateUser(user.id, updatedData);
    
            console.log('Réponse API après mise à jour:', response.data);
    
            // Mise à jour des états après succès
            setFullName(`${prenom} ${nom}`);
            setIsEditing(false);
            alert('Profil mis à jour avec succès !');
    
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil:', error);
            alert('Une erreur est survenue lors de la mise à jour.');
        }
    };
    

    if (!user) {
        return <Text>Utilisateur non authentifié</Text>; // Gérer l'absence d'utilisateur
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>

            {/* Formulaire de profil */}
            <View style={styles.form}>
                <Text style={styles.sectionTitle}>Informations personnelles</Text>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Prénom</Text>
                    <TextInput
                        style={styles.input}
                        value={prenom}
                        editable={isEditing}
                        onChangeText={setPrenom}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Nom</Text>
                    <TextInput
                        style={styles.input}
                        value={nom}
                        editable={isEditing}
                        onChangeText={setNom}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Nom complet</Text>
                    <TextInput
                        style={styles.input}
                        value={fullName}
                        editable={false} // Le nom complet est automatiquement mis à jour
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        editable={false} // L'email est fixe et non modifiable
                    />
                </View>

                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => {
                        if (isEditing) {
                            handleUpdateProfile();
                        } else {
                            setIsEditing(true);
                        }
                    }}
                >
                    <Text style={styles.editButtonText}>{isEditing ? 'Sauvegarder les modifications' : 'Modifier le profil'}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#f9f9f9',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        position: 'relative',
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
        marginTop:30
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '600',
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
        backgroundColor: '#4caf50',
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default ProfileScreen;
