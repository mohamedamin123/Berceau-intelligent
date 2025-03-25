import React, { useState } from 'react';
import {
    ScrollView, View, Text, TextInput, Image,
    TouchableOpacity, StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { signIn } from '../../services/AuthService';
import useAuthStore from '../../store/useAuthStore'; // Importation du store Zustand

const LoginScreen = () => {
    const navigation = useNavigation();
    const login = useAuthStore((state) => state.login); // Récupère la fonction login de Zustand
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [loading, setLoading] = useState(false);
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const handleLogin = async () => {
        if (buttonDisabled) {
            Alert.alert('Trop de tentatives', 'Veuillez attendre 1 minute avant de réessayer.');
            return;
        }

        setLoading(true);
        try {
            const response = await signIn(email, password);
            if (response.token) {
                setErrorMessage('');
                login({ token: response.token, email: email,user:response.user }); // Stocke l'utilisateur avec Zustand
                setFailedAttempts(0);
            } else {
                setErrorMessage('Erreur de connexion');
                incrementFailedAttempts();
            }
        } catch (error) {
            console.log("Erreur de connexion :", error);
            setErrorMessage(error.response?.data?.message || "Identifiants incorrects");
            incrementFailedAttempts();
        } finally {
            setLoading(false);
        }
    };

    const incrementFailedAttempts = () => {
        setFailedAttempts((prevAttempts) => {
            const newFailedAttempts = prevAttempts + 1;
            if (newFailedAttempts >= 5) {
                setButtonDisabled(true);
                Alert.alert('Trop de tentatives', 'Veuillez attendre 1 minute avant de réessayer.');
                setTimeout(() => {
                    setButtonDisabled(false);
                    setFailedAttempts(0);
                }, 60000);
            }
            return newFailedAttempts;
        });
    };

    const togglePasswordVisibility = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.header}>Connecter</Text>

                <Image source={require('../../../assets/client.png')} style={styles.image} />

                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    placeholderTextColor="gray"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Mot de passe"
                        placeholderTextColor="gray"
                        secureTextEntry={secureTextEntry}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                        <Icon name={secureTextEntry ? 'eye-slash' : 'eye'} size={25} color="gray" />
                    </TouchableOpacity>
                </View>

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}
                    disabled={loading || buttonDisabled}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Se connecter</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Oublier')}>
                    <Text style={styles.textLink}>Mot de passe oublié ?</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.textLink}>Créer un compte</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        marginTop: 20
    },
    innerContainer: {
        padding: 16,
        justifyContent: 'center',
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
        borderRadius: 8,
        height: 50,
        width: '100%',
        backgroundColor: 'white',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 50,
        width: '100%',
        backgroundColor: 'white',
    },
    passwordInput: {
        flex: 1,
        height: '100%',
    },
    eyeIcon: {
        padding: 10,
    },
    errorText: {
        color: 'red',
        fontSize: 18,
        textAlign: 'center',
    },
    textLink: {
        fontSize: 18,
        textAlign: 'center',
        color: '#000',
        marginTop: 10,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: "#4fafff",
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
