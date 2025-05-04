import React, { useState } from 'react';
import {
    ScrollView, View, Text, TextInput, Image,
    TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { signIn } from '../../services/AuthService';
import useAuthStore from '../../store/useAuthStore'; // Importation du store Zustand
import { StatusBar } from 'react-native';

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
                login({ token: response.token, email: email, user: response.user });
                setFailedAttempts(0);
                // Remplacer la navigation et aller à l'écran principal
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
<StatusBar backgroundColor="#FFF0F5" barStyle="dark-content" />

                <Image source={require('../../../assets/add-user.png')} style={styles.image} />

                <Text style={styles.title}>Bienvenue, maman 💖</Text>
                <Text style={styles.subtitle}>Connecte-toi pour surveiller ton bébé</Text>

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
        backgroundColor: '#FFF0F5',
    },
    innerContainer: {
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center', // <-- ajoute cette ligne

    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color:"#FF69B4"
    },
    image: {
        resizeMode: "contain",
        marginBottom: 20,
        width: 150,
        height: 150,
        marginBottom: 20,

    },
    input: {
        borderColor: '#FFB6C1',
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
        borderColor: '#FFB6C1',
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
        color: '#FF69B4',
        marginTop: 10,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    button: {
        backgroundColor: '#FF69B4',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginTop: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FF69B4',
        marginBottom: 10,
        textAlign: "center"
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 30,
        textAlign: "center",
        fontWeight: 'bold',

    },
});

export default LoginScreen;
