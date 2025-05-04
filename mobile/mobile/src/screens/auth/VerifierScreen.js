import React, { useState } from 'react';
import {
    View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { verifyCode } from '../../services/AuthService';

const ConfirmEmail = () => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();
    const { email } = route.params; // Récupérer l'email passé depuis l'écran précédent

    const handleVerifyCode = async () => {
        if (code.length !== 6) {
            Alert.alert("Erreur", "Le code doit contenir 6 chiffres.");
            return;
        }

        setLoading(true);

        try {
            await verifyCode(email, code);
            setLoading(false);
            Alert.alert("Succès", "Code vérifié avec succès !");
            navigation.navigate("NewPassword", { email,code }); // Rediriger vers l'écran de réinitialisation du mot de passe
        } catch (error) {
            setLoading(false);
            Alert.alert("Erreur", error.response?.data?.message || "Code incorrect.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Vérification Email</Text>

            <Image source={require('../../../assets/security.png')} style={styles.image} />

            <Text style={styles.messageText}>
                Veuillez entrer le code envoyé à votre email.
            </Text>

            <TextInput
                style={styles.pinInput}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="Entrez le code"
                placeholderTextColor="#999"
                value={code}
                onChangeText={setCode}
            />

            <TouchableOpacity disabled={loading} style={styles.continueButton} onPress={handleVerifyCode}>
                {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Vérifier</Text>}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#FFF0F5',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    header: {
        marginTop:20,
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FF69B4',
        marginBottom: 10,
        textAlign: "center"
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 20,
    },
    messageText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    pinInput: {
        width: '80%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        borderWidth: 1.5,
        borderColor: '#FFB6C1',
        color: '#333',
        marginBottom: 20,
    },
    continueButton: {
        width: '80%',
        height: 50,
        backgroundColor: '#FF69B4',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ConfirmEmail;
