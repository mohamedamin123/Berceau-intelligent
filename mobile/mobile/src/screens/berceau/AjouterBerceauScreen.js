import React, { useState, useEffect, useRef } from "react";
import useAuthStore from '../../store/useAuthStore';
import { createBerceau, deleteBerceau } from '../../services/BerceauService';
import { createBebe, updateBebe, deleteBebe } from '../../services/BebeService';
import { NetworkInfo } from "react-native-network-info";
import RNBluetoothSerial from 'react-native-bluetooth-serial-next';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { PermissionsAndroid, Platform } from "react-native";

async function requestBluetoothPermission() {
    if (Platform.OS === "android" && Platform.Version >= 31) {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            ]);

            if (
                granted["android.permission.BLUETOOTH_SCAN"] !== PermissionsAndroid.RESULTS.GRANTED ||
                granted["android.permission.BLUETOOTH_CONNECT"] !== PermissionsAndroid.RESULTS.GRANTED
            ) {
                alert("Permission Bluetooth refusée !");
                return false;
            }
            return true;
        } catch (err) {
            console.warn("Erreur permissions Bluetooth :", err);
            return false;
        }
    }
    return true;
}



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
    const bebeIdRef = useRef(null);
    const berceauIdRef = useRef(null);

    NetworkInfo.getSSID().then(ssid => {
        console.log("SSID du WiFi :", ssid);
    });

    useEffect(() => {
        NetworkInfo.getSSID().then(currentSsid => {
            if (currentSsid) {
                setSsid(currentSsid);
            } else {
                console.warn("Impossible de récupérer le SSID du Wi-Fi.");
            }
        }).catch(error => console.error("Erreur récupération SSID:", error));
    }, []);

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

        setLoading(true);
        const [jour, mois, annee] = dateNaissance.split("-");
        const dateFormatee = `${annee}-${mois}-${jour}`;

        try {
            const bebeData = {
                prenom: nomBebe,
                dateNaissance: dateFormatee,
                sexe: sexeBebe,
                parentId: user?.id,
            };

            const bebeResponse = await createBebe(bebeData).catch(err => {
                throw new Error("Erreur création bébé : " + err.message);
            });

            const bebeId = bebeResponse?.data?.id;
            if (!bebeId) throw new Error("L'ID du bébé est invalide.");

            const berceauData = {
                name: nomBerceau,
                parentId: user?.id,
                bebeId: bebeId,
            };

            const berceauResponse = await createBerceau(berceauData).catch(err => {
                throw new Error("Erreur création berceau : " + err.message);
            });

            const berceauId = berceauResponse?.data?.id;
            if (!berceauId) throw new Error("L'ID du berceau est invalide.");

            const bebeUpdateData = { berceauId: berceauId };
            await updateBebe(bebeId, bebeUpdateData).catch(err => {
                throw new Error("Erreur mise à jour bébé : " + err.message);
            });
            bebeIdRef.current = bebeResponse?.data?.id;
            berceauIdRef.current = berceauResponse?.data?.id;

            // await sendBluetoothMessage(ssid+" "+motDePasse+" "+berceauId);
            navigation.navigate("Home");


        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const sendBluetoothMessage = async (message) => {
        try {
            // 1. Vérifier les permissions
            const hasPermission = await requestBluetoothPermission();
            if (!hasPermission) {
                alert("Permissions Bluetooth requises");
                return;
            }

            // 2. Activer Bluetooth si désactivé
            const isEnabled = await RNBluetoothSerial.isEnabled();
            if (!isEnabled) {
                await RNBluetoothSerial.enable();
                await new Promise(resolve => setTimeout(resolve, 1000)); // Attendre l'activation
            }

            // 3. Scanner les appareils
            console.log("Recherche d'appareils Bluetooth...");
            const devices = await RNBluetoothSerial.list();
            console.log("Appareils trouvés:", devices);

            // 4. Trouver le Raspberry Pi (ajuster le nom selon votre configuration)
            const piDevice = devices.find(device =>
                device.name.includes('raspberrypi') ||
                device.name.includes('RPi') ||
                device.id.includes('00:00:00') // Partie de l'adresse MAC
            );

            if (!piDevice) {
                alert("Raspberry Pi non trouvé");
                return;
            }

            console.log("Tentative de connexion au Pi:", piDevice.name);

            // 5. Se connecter
            await RNBluetoothSerial.connect(piDevice.id);
            console.log("Connecté avec succès");

            // 6. Envoyer des données (au format UART)
            await RNBluetoothSerial.write(message);
            console.log("Message envoyé:", message);

            // 7. Fermer la connexion (optionnel)
            setTimeout(async () => {
                await RNBluetoothSerial.disconnect();
                console.log("Déconnexion");
            }, 2000);
            alert("Berceau et bébé ajoutés avec succès !");
            navigation.navigate("Home");

        } catch (error) {
            console.error("Erreur de connexion:", error);
            if (berceauIdRef.current) {
                await deleteBerceau(berceauIdRef.current).catch(err => console.warn("Erreur suppression berceau :", err));
            }

            if (bebeIdRef.current) {
                await deleteBebe(bebeIdRef.current).catch(err => console.warn("Erreur suppression bébé :", err));
            } alert(`Erreur: ${error.message}`);
        }
    }
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
