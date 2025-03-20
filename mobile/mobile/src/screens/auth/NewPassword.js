import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Image
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { updatePassword } from "../../services/AuthService";
import { Ionicons } from "@expo/vector-icons"; // Icônes modernes

const ResetPasswordScreen = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();
    const route = useRoute();

    const { email, code } = route.params; // Récupère l'email et le code

    // Fonction de validation du mot de passe
    const validatePassword = (password) => password.length >= 8;

    // Fonction pour soumettre le nouveau mot de passe
    const handleUpdatePassword = async () => {
        if (!validatePassword(newPassword)) {
            setErrorMessage("Le mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("Les mots de passe ne correspondent pas.");
            return;
        }

        setErrorMessage("");
        setLoading(true);

        try {
            await updatePassword(email, newPassword, code);
            Alert.alert("Succès", "Mot de passe mis à jour avec succès !");
            navigation.navigate("Login"); // Redirige vers la connexion
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Erreur lors de la mise à jour du mot de passe.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Nouveau mot de passe</Text>
            <Image source={require('../../../assets/security.png')} style={styles.image} />

            <Text style={styles.label}>Entrez un mot de passe sécurisé</Text>

            {/* Champ de saisie du mot de passe */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Nouveau mot de passe"
                    placeholderTextColor="gray"
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
                </TouchableOpacity>
            </View>

            {/* Champ de confirmation du mot de passe */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirmez le mot de passe"
                    placeholderTextColor="gray"
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="gray" />
                </TouchableOpacity>
            </View>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            {/* Bouton de confirmation */}
            <TouchableOpacity style={styles.button} onPress={handleUpdatePassword} disabled={loading}>
                {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Valider</Text>}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
        backgroundColor: "#F5F7FA",
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
        marginTop:20
    },
    label: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF",
        borderRadius: 8,
        paddingHorizontal: 10,
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#DDD",
        marginBottom: 15,
    },
    input: {
        flex: 1,
        fontSize: 18,
        color: "#000",
    },
    button: {
        width: "100%",
        height: 50,
        backgroundColor: "#4fafff",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        fontSize: 16,
        marginBottom: 10,
        textAlign: "center",
    },
    image: { width: '100%', height: 200, resizeMode: 'contain', marginBottom: 20 },

});

export default ResetPasswordScreen;
