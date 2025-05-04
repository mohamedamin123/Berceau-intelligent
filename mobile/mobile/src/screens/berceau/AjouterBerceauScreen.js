import React, { useState, useEffect, useRef } from "react";
import useAuthStore from '../../store/useAuthStore';
import { createBerceau, deleteBerceau } from '../../services/BerceauService';
import { createBebe, updateBebe, deleteBebe } from '../../services/BebeService';
import { NetworkInfo } from "react-native-network-info";
import RNBluetoothSerial from 'react-native-bluetooth-serial-next';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from "react-native";
import { PermissionsAndroid, Platform } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

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
    const [nomBerceau, setNomBerceau] = useState("Berceau de ");
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
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [bluetoothLoading, setBluetoothLoading] = useState(false);

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

    const togglePasswordVisibility = () => {
        setSecureTextEntry(!secureTextEntry);
    };

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

            // Affichage de l'alerte avant d'envoyer les données
            Alert.alert(
                "Confirmation Wi-Fi",
                `Nom du réseau : ${ssid}\nMot de passe : ${motDePasse}`,
                [
                    {
                        text: "OK",
                        onPress: async () => {
                            try {
                                await sendBluetoothMessage(ssid + " " + motDePasse + " " + berceauId);
            
                                // Si Bluetooth réussi, aller à la page d'accueil
                                navigation.navigate("Home");
                            } catch (bluetoothError) {
                                console.error("Erreur Bluetooth:", bluetoothError);
                                alert("Erreur Bluetooth: " + bluetoothError.message);
                                console.log("bebeIdRef.current : "+bebeIdRef.current);
                                console.log("berceauIdRef.current : "+berceauIdRef.current);

            
                                // En cas d'erreur Bluetooth, suppression du bébé et du berceau créés
                                if (bebeIdRef.current) {
                                    await deleteBebe(bebeIdRef.current);
                                    console.log("Bébé supprimé à cause d'une erreur Bluetooth");
                                }
                                if (berceauIdRef.current) {
                                    await deleteBerceau(berceauIdRef.current);
                                    console.log("Berceau supprimé à cause d'une erreur Bluetooth");
                                }
                            }
                        }

                    },
                    {
                        text: "Annuler",
                        style: "cancel"
                    }
                ]
            );

        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const sendBluetoothMessage = async (message) => {
        try {
            setLoading(true);
    
            const hasPermission = await requestBluetoothPermission();
            if (!hasPermission) throw new Error("Permissions Bluetooth non accordées.");
    
            const isEnabled = await RNBluetoothSerial.isEnabled();
            if (!isEnabled) {
                await RNBluetoothSerial.enable();
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
    
            const devices = await RNBluetoothSerial.list();
            const piDevice = devices.find(device =>
                device.name.includes('raspberrypi') || device.name.includes('RPi')
            );
    
            if (!piDevice) throw new Error("Raspberry Pi non trouvé.");
    
            await RNBluetoothSerial.connect(piDevice.id);
            console.log("Connecté au Raspberry Pi");
    
            await RNBluetoothSerial.write(message);
            console.log("Message envoyé:", message);
    
            // Lire réponse pendant 5 secondes
            let response = "";
            const timeout = Date.now() + 5000;
            while (Date.now() < timeout) {
                const chunk = await RNBluetoothSerial.readFromDevice();
                if (chunk) {
                    response += chunk;
                    if (response.includes("\n") || response.length > 0) {
                        break;
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 500));
            }
    
            if (response) {
                console.log("Réponse reçue:", response.trim());
                alert(`Réponse du Raspberry Pi: ${response.trim()}`);
            } else {
                throw new Error("Pas de réponse du Raspberry Pi.");
            }
    
            setTimeout(async () => {
                await RNBluetoothSerial.disconnect();
                console.log("Déconnecté");
            }, 2000);
    
        } catch (error) {
            console.error("Erreur Bluetooth:", error);
    
            // 🔥 SUPPRESSION EN CAS D'ERREUR
            if (bebeIdRef.current) {
                try {
                    await deleteBebe(bebeIdRef.current);
                    console.log("🗑️ Bébé supprimé suite à une erreur Bluetooth");
                } catch (e) {
                    console.warn("❗Erreur lors de la suppression du bébé :", e);
                }
            }
    
            if (berceauIdRef.current) {
                try {
                    await deleteBerceau(berceauIdRef.current);
                    console.log("🗑️ Berceau supprimé suite à une erreur Bluetooth");
                } catch (e) {
                    console.warn("❗Erreur lors de la suppression du berceau :", e);
                }
            }
    
            alert("Erreur Bluetooth: " + error.message);
            throw error; // optionnel : relancer pour gestion dans handleSubmit si besoin
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}> 🍼 Ajouter un nouveau Berceau</Text>

            <TextInput
                style={[styles.input, errors.nomBebe && styles.inputError]}
                placeholder="Nom du bébé"
                value={nomBebe}
                onChangeText={(text) => {
                    setNomBebe(text);
                    setNomBerceau('Berceau de ' + text); // ajouter un suffixe au nom du bébé
                }}
            />
            {errors.nomBebe && <Text style={styles.errorText}>{errors.nomBebe}</Text>}

            <TextInput
                style={[
                    styles.input,
                    errors.nomBerceau && styles.inputError,
                    { color: 'black' } // force la couleur noire du texte dans le champ Nom du berceau
                ]}
                placeholder="Nom du berceau"
                value={nomBerceau}
                editable={false}
            />


            {errors.nomBerceau && <Text style={styles.errorText}>{errors.nomBerceau}</Text>}



            <Text style={styles.label}>Sexe du bébé :</Text>
            <View style={styles.radioContainer}>
                <TouchableOpacity
                    style={[
                        styles.radioButton,
                        sexeBebe === 'F' && styles.radioButtonSelectedFille,
                    ]}
                    onPress={() => setSexeBebe('F')}
                >
                    <Text style={styles.radioText}>👧 Fille</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.radioButton,
                        sexeBebe === 'M' && styles.radioButtonSelectedGarcon,
                    ]}
                    onPress={() => setSexeBebe('M')}
                >
                    <Text style={styles.radioText}>👦 Garçon</Text>
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


            <View style={styles.passwordContainer}>
                <TextInput
                    style={[styles.input, errors.motDePasse && styles.inputError]}
                    value={motDePasse}
                    onChangeText={setMotDePasse}
                    placeholder="Mot de passe"
                    placeholderTextColor="gray"
                    secureTextEntry={secureTextEntry}
                    autoCapitalize="none"
                />
                <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                    <Icon name={secureTextEntry ? 'eye-slash' : 'eye'} size={25} color="gray" />
                </TouchableOpacity>
            </View>

            {errors.motDePasse && <Text style={styles.errorText}>{errors.motDePasse}</Text>}

            <TouchableOpacity
                style={[
                    styles.addButton,
                    { alignSelf: 'center' }, // Centrer le bouton horizontalement

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
        padding: 10,
        backgroundColor: "#FFF0F5",
        justifyContent: 'center',  // Center the content vertically

    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FF69B4',
        marginBottom: 10,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#333",
    },
    label: {
        alignSelf: 'flex-start',
        marginLeft: '5%',
        marginBottom: 8,
        fontSize: 16,
        color: '#555',
        fontWeight: '500',
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
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '90%',
        marginBottom: 20,
    },
    radioButton: {
        flex: 1,
        backgroundColor: '#FFE4E1',
        padding: 12,
        borderRadius: 12,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    radioButtonSelectedFille: {
        backgroundColor: '#FFC0CB',
    },
    radioButtonSelectedGarcon: {
        backgroundColor: '#ADD8E6',
    },
    radioText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },

    disabledButton: {
        backgroundColor: "#999",
    },
    addButton: {
        width: '90%',
        backgroundColor: '#FF69B4',
        padding: 16,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 15,
    },
});

export default AjouterBerceauScreen;
