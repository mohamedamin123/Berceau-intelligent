import React, { useState } from 'react';
import {
    View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { forgot } from '../../services/AuthService';

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleResetPassword = async () => {
        if (!email.trim()) {
            setErrorMessage("Veuillez entrer votre email.");
            return;
        }

        if (!validateEmail(email)) {
            setErrorMessage("Veuillez entrer un email valide.");
            return;
        }

        setErrorMessage("");
        setLoading(true);

        try {
            await forgot(email);
            setLoading(false);
            Alert.alert("Succès", "Un code de vérification a été envoyé !");

            // Rediriger vers l'écran de vérification avec l'email en paramètre
            navigation.navigate("Verify", { email });
        } catch (error) {
            setLoading(false);
            setErrorMessage(error.response?.data?.message || "Une erreur est survenue.");
        } finally {
            setLoading(false);  // ✅ Assure que `loading` passe à `false` même en cas d'erreur
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Mot de passe oublié</Text>

            <Image source={require('../../../assets/security.png')} style={styles.image} />

            <Text style={styles.label}>Veuillez saisir votre email</Text>

            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="gray"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Continuer</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF0F5',
        padding: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FF6EB1',
        marginBottom: 20,
        fontFamily: 'Comic Sans MS',
        textAlign: 'center',
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
        borderRadius: 15,
        alignSelf: 'center',
    },
    label: {
        fontSize: 16,
        color: '#000',
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#000',
        marginBottom: 15,
        borderColor: '#FF6EB1',
        borderWidth: 1,
        fontFamily: 'Arial',
    },
    button: {
        width: '100%',
        height: 55,
        backgroundColor: '#FF6EB1',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF6EB1',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Comic Sans MS',
    },
    errorText: {
        color: '#D9534F',
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
        fontFamily: 'Arial',
    },
});

export default ForgotPasswordScreen;
