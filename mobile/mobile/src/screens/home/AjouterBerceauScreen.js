import React, { useState } from "react";
import useAuthStore from '../../store/useAuthStore';
import { createBerceau } from '../../services/BerceauService';
import { createBebe, updateBebe } from '../../services/BebeService';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator
} from "react-native";

const AjouterBerceauScreen = ({ navigation }) => {
    const [nomBerceau, setNomBerceau] = useState("");
    const [nomBebe, setNomBebe] = useState("");
    const [dateNaissance, setDateNaissance] = useState("");
    const [sexeBebe, setSexeBebe] = useState("M");
    const [ssid, setSsid] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); // Ajout de l'état loading
    const user = useAuthStore((state) => state.user);

    const validateFields = () => {
        let newErrors = {};

        if (!nomBerceau.trim()) newErrors.nomBerceau = "Nom du berceau requis.";
        if (!nomBebe.trim()) newErrors.nomBebe = "Nom du bébé requis.";

        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;
        if (!dateRegex.test(dateNaissance)) newErrors.dateNaissance = "Format: JJ-MM-AAAA";
        
        if (!ssid.trim()) newErrors.ssid = "Nom du réseau Wi-Fi requis.";
        if (motDePasse.length < 6) newErrors.motDePasse = "Mot de passe min. 6 caractères.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => { 
        if (!validateFields()) return;

        setLoading(true); // Début du chargement
        const [jour, mois, annee] = dateNaissance.split("-");
        const dateFormatee = `${annee}-${mois}-${jour}`;
        
        try {
            // 1️⃣ Création du bébé
            const bebeData = {
                prenom: nomBebe,
                dateNaissance: dateFormatee,
                sexe: sexeBebe,
                parentId: user?.id,
            };
    
            const bebeResponse = await createBebe(bebeData);
            const bebeId = bebeResponse.data.id; 
    
            console.log("Bébé créé avec succès :", bebeResponse.data);
    
            // 2️⃣ Création du berceau
            const berceauData = {
                name: nomBerceau,
                parentId: user?.id,
                bebeId: bebeId,
            };
    
            const berceauResponse = await createBerceau(berceauData);
            const berceauId = berceauResponse.data.id;
    
            console.log("Berceau créé avec succès :", berceauResponse.data);
    
            // 3️⃣ Mise à jour du bébé avec le `berceauId`
            const bebeUpdateData = {
                berceauId: berceauId, 
            };
    
            await updateBebe(bebeId, bebeUpdateData);
    
            console.log("Bébé mis à jour avec son berceauId :", bebeUpdateData);
    
            alert("Berceau et bébé ajoutés avec succès !");
            navigation.navigate("Home");
        } catch (error) {
            console.error("Erreur lors de l'ajout :", error);
            alert("Erreur lors de l'ajout. Veuillez réessayer.");
        } finally {
            setLoading(false); // Fin du chargement
        }
    };
    
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Ajouter un Berceau</Text>

            <Text style={styles.sectionTitle}>Configuration Berceau</Text>

            <TextInput
                style={[styles.input, errors.nomBerceau && styles.inputError]}
                placeholder="Nom du berceau"
                value={nomBerceau}
                onChangeText={setNomBerceau}
            />
            {errors.nomBerceau && <Text style={styles.errorText}>{errors.nomBerceau}</Text>}

            <Text style={styles.sectionTitle}>Configuration Bébé</Text>

            <TextInput
                style={[styles.input, errors.nomBebe && styles.inputError]}
                placeholder="Nom du bébé"
                value={nomBebe}
                onChangeText={setNomBebe}
            />
            {errors.nomBebe && <Text style={styles.errorText}>{errors.nomBebe}</Text>}

            <Text style={styles.label}>Sexe du bébé :</Text>
            <View style={styles.radioContainer}>
                <TouchableOpacity
                    style={[styles.radioButton, sexeBebe === "M" && styles.radioButtonSelected]}
                    onPress={() => setSexeBebe("M")}
                >
                    <Text style={styles.radioText}>M</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.radioButton, sexeBebe === "F" && styles.radioButtonSelected]}
                    onPress={() => setSexeBebe("F")}
                >
                    <Text style={styles.radioText}>F</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                style={[styles.input, errors.dateNaissance && styles.inputError]}
                placeholder="Date de naissance (JJ/MM/AAAA)"
                value={dateNaissance}
                onChangeText={(text) => {
                    let formattedText = text.replace(/[^0-9]/g, "");
                    if (formattedText.length > 2) formattedText = formattedText.slice(0, 2) + "-" + formattedText.slice(2);
                    if (formattedText.length > 5) formattedText = formattedText.slice(0, 5) + "-" + formattedText.slice(5, 9);
                    setDateNaissance(formattedText);
                }}
                keyboardType="numeric"
                maxLength={10}
            />
            {errors.dateNaissance && <Text style={styles.errorText}>{errors.dateNaissance}</Text>}

            <Text style={styles.sectionTitle}>Configuration Wi-Fi</Text>

            <TextInput
                style={[styles.input, errors.ssid && styles.inputError]}
                placeholder="Nom du réseau Wi-Fi"
                value={ssid}
                onChangeText={setSsid}
            />
            {errors.ssid && <Text style={styles.errorText}>{errors.ssid}</Text>}

            <TextInput
                style={[styles.input, errors.motDePasse && styles.inputError]}
                placeholder="Mot de passe Wi-Fi"
                value={motDePasse}
                onChangeText={setMotDePasse}
                secureTextEntry
            />
            {errors.motDePasse && <Text style={styles.errorText}>{errors.motDePasse}</Text>}

            <TouchableOpacity
                style={[
                    styles.addButton,
                    Object.keys(errors).length > 0 && styles.disabledButton,
                ]}
                onPress={handleSubmit}
                disabled={loading} // Désactiver le bouton pendant le chargement
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.addButtonText}>Ajouter</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        backgroundColor: "#FAFAFA",
        marginTop: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#6200EE",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    input: {
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 16,
        marginBottom: 10,
        fontSize: 16,
        borderColor: "#ccc",
        borderWidth: 1,
    },
    inputError: {
        borderColor: "#FF0000",
    },
    errorText: {
        color: "#FF0000",
        fontSize: 14,
        marginBottom: 10,
    },
    radioContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: 10,
    },
    radioButton: {
        borderWidth: 1,
        borderColor: "#6200EE",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 10,
    },
    radioButtonSelected: {
        backgroundColor: "#6200EE",
    },
    radioText: {
        color: "#000",
        fontWeight: "bold",
    },
    addButton: {
        backgroundColor: "#6200EE",
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 20,
    },
    disabledButton: {
        backgroundColor: "#999",
    },
    addButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default AjouterBerceauScreen;
