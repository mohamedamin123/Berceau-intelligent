import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { signUp } from '../../services/AuthService'; // Importer la fonction signUp
import { useNavigation } from '@react-navigation/native'; // Ajouter l'importation de useNavigation

const RegisterScreen = () => {
    const navigation = useNavigation(); // Utilisation de useNavigation pour accéder à la navigation

    // Définition de l'état pour les champs
    const [prenom, setPrenom] = useState('');
    const [nom, setNom] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [securePassword, setSecurePassword] = useState(true); // Pour masquer/afficher le mot de passe
    const [secureConfirmPassword, setSecureConfirmPassword] = useState(true); // Pour masquer/afficher la confirmation du mot de passe
    const [loading, setLoading] = useState(false); // État pour gérer le chargement

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Fonction de gestion de l'inscription
    const check = async () => {
        if (!prenom || !nom || !email || !password || !confirmPassword) {
            Alert.alert('Erreur', 'Tous les champs doivent être remplis.');
            return;
        }

        if (password.length < 8) {
            Alert.alert('Erreur', 'Le mot de passe doit comporter au moins 8 caractères.');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
            return;
        }

        // Vérification de l'email
        if (!validateEmail(email)) {
            Alert.alert('Erreur', 'L\'email est invalide.');
            return;
        }

        // Si toutes les validations passent
        setLoading(true); // Met l'état en "chargement"
        try {
            await signUp(nom, prenom, email, password); // Appel API pour l'inscription
            // Rediriger vers la page de connexion après succès
            Alert.alert('Succès', 'Compte créé avec succès!');
            navigation.navigate('Login'); // Utilisation de navigation.navigate() pour rediriger vers la page Login
        } catch (error) {
            setLoading(false); // Arrête le chargement en cas d'erreur
            Alert.alert('Erreur', 'Une erreur est survenue.');
        }
    };

    // Fonction pour basculer la visibilité du mot de passe
    const togglePasswordVisibility = () => {
        setSecurePassword(!securePassword);
    };

    // Fonction pour basculer la visibilité de la confirmation du mot de passe
    const toggleConfirmPasswordVisibility = () => {
        setSecureConfirmPassword(!secureConfirmPassword);
    };

    return (
        
        <View style={styles.container}>
            <StatusBar backgroundColor="#FFF0F5" barStyle="dark-content" />

            <Text style={styles.title}>Créer un compte</Text>

            <Image
                source={require('../../../assets/add-user.png')}
                style={styles.image}
            />
            <Text style={styles.subtitle}>Inscris-toi pour commencer à surveiller ton bébé</Text>
            <View style={styles.formContainer}>
                <View style={styles.row}>
                    <TextInput
                        style={[styles.input, { marginRight: 10 }]}
                        placeholder="Prénom"
                        value={prenom}
                        onChangeText={setPrenom}
                        keyboardType="default"
                    />
                    <View style={styles.space} />
                    <TextInput
                        style={styles.input}
                        placeholder="Nom"
                        value={nom}
                        onChangeText={setNom}
                        keyboardType="default"
                    />
                </View>

                <TextInput
                    style={styles.input2}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Mot de passe"
                        secureTextEntry={securePassword}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                        <Icon name={securePassword ? 'eye-slash' : 'eye'} size={25} color="gray" />
                    </TouchableOpacity>
                </View>

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirmer le mot de passe"
                        secureTextEntry={secureConfirmPassword}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
                        <Icon name={secureConfirmPassword ? 'eye-slash' : 'eye'} size={25} color="gray" />
                    </TouchableOpacity>
                </View>

                {/* Affichage du bouton ou de l'indicateur de chargement */}
                <TouchableOpacity style={styles.button} onPress={check} disabled={loading}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Continuer</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.textLink}>Déjà un compte ? Se connecter</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF0F5',
        padding: 8,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        marginBottom: 15,
    },
    image: {
        width: 150,
        height: 150,
        marginBottom: 20,//Ajoute une marge extérieure de 20 pixels en dessous de l’élément.
        resizeMode: 'contain',// l’image garde ses proportions d’origine (rapport hauteur/largeur) et est entièrement visible dans le cadre défini.
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FF69B4',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 15,
        color: '#555',
        marginBottom: 30,
        fontWeight:"bold"
    },
    formContainer: {
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    input: {
        height: 50,
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#FFB6C1',
        textTransform: 'capitalize', // Permet d'afficher la première lettre en majuscule
    },
    input2: {
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
    button: {
        backgroundColor: '#FF69B4',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginTop: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        justifyContent: "center",
        alignItems: "center", // ✅ Ajoute ceci pour centrer le texte horizontalement
    },
    
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    textLink: {
        fontSize: 18,
        textAlign: 'center',
        color: '#FF69B4',
        marginTop: 10,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
