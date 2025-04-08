import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ConsulterCameraScreen({ navigation }) {
    const CAMERA_STREAM_URL = 'https://example.com'; // Remplace par l’URL réelle

    return (
        <View style={styles.container}>
            {/* Header avec flèche de retour */}
            <View style={styles.header}>

                <Text style={styles.headerTitle}>Caméra du Berceau</Text>
            </View>

            {/* Carte contenant le flux de la caméra */}
            <View style={styles.card}>
                <Text style={styles.cardTitle}>📹 Vue en direct</Text>
                <View style={styles.videoContainer}>
                    <WebView
                        source={{ uri: CAMERA_STREAM_URL }}
                        style={styles.webview}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        allowsInlineMediaPlayback={true}
                        mediaPlaybackRequiresUserAction={false}
                    />
                </View>
                <Text style={styles.statusText}>📡 Connexion au berceau en direct...</Text>
            </View>

            {/* Bouton pour accéder à d'autres fonctionnalités */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.buttonText}>Retour</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F7F7F7',  // Fond plus clair pour un effet plus aéré
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    backButton: {
        backgroundColor: '#CB68DD',
        padding: 10,
        borderRadius: 50,
    },
    headerTitle: {
        fontSize: 24,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1, // Cela force le titre à occuper tout l'espace disponible et à se centrer
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 10,
        alignItems: 'center',
        marginBottom: 30,
    },
    cardTitle: {
        fontSize: 20,
        color: '#333',
        marginBottom: 20,
        fontWeight: '700',
    },
    videoContainer: {
        width: '100%',
        height: 370,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#000',
    },
    webview: {
        flex: 1,
        borderRadius: 15,
    },
    statusText: {
        marginTop: 15,
        color: '#6c757d',
        fontStyle: 'italic',
        fontSize: 16,
    },
    footer: {
        alignItems: 'center',
    },
    backButton: {
        backgroundColor: '#FF9800',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
