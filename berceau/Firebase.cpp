#include <FirebaseESP32.h>

// Provide the token generation process info.
#include <addons/TokenHelper.h>


/* 2. Define the API Key */
#define API_KEY "AIzaSyAt8Y5awtPU6-TCGR9k_r0RXK84OFIlUmo"

/* 3. Define the RTDB URL */
#define DATABASE_URL "https://esp32-7fa75-default-rtdb.firebaseio.com/" //<databaseName>.firebaseio.com or <databaseName>.<region>.firebasedatabase.app

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

#define USER_EMAIL "amin@amin.com"
#define USER_PASSWORD "amin123"

bool initFirebase() {
    // Définir les paramètres Firebase
    config.api_key = API_KEY;
    config.database_url = DATABASE_URL;

    // Définir les informations d'authentification
    auth.user.email = USER_EMAIL;
    auth.user.password = USER_PASSWORD;

    // Activer la reconnexion automatique du réseau
    Firebase.reconnectNetwork(true);

    // Configurer les tailles des buffers pour les connexions SSL
    fbdo.setBSSLBufferSize(4096, 1024);  // Taille du buffer Rx et Tx

    // Initialiser Firebase avec la configuration et l'authentification
    Firebase.begin(&config, &auth);

    // Callback pour vérifier l'état du jeton (optionnel)
    config.token_status_callback = tokenStatusCallback;  // Voir addons/TokenHelper.h

    // Vérifier si Firebase est connecté
    if (Firebase.ready()) {
        Serial.println("Firebase initialisé avec succès.");
        return true;  // Retourner true si Firebase est prêt
    } else {
        Serial.println("Échec de l'initialisation de Firebase.");
        return false;  // Retourner false si Firebase n'est pas prêt
    }
}



String readSsid() {
    String ssid;
    if (Firebase.getString(fbdo, "/reseauInfo/ssid", &ssid)) {
        if (fbdo.dataType() == "string") {
            Serial.print(F("SSID: ")); // Utilisation de F() pour les littéraux statiques
            Serial.println(ssid);
            return ssid; // Return the SSID
        } else {
            Serial.println(F("Error reading SSID"));
        }
    } else {
        Serial.print(F("Failed to read SSID: "));
        Serial.println(fbdo.errorReason()); // Sans F() car fbdo.errorReason() est une String dynamique
    }
    return ""; // Return empty string if failed
}

String readPassword() {
    String password;
    if (Firebase.getString(fbdo, "/reseauInfo/password", &password)) {
        if (fbdo.dataType() == "string") {
            Serial.print(F("Password: "));
            Serial.println(password); // Correction ici
            return password; // Return the password
        } else {
            Serial.println(F("Error reading password"));
        }
    } else {
        Serial.print(F("Failed to read password: "));
        Serial.println(fbdo.errorReason());
    }
    return ""; // Return empty string if failed
}

int getLedFirebase() {
    int ledControl = -1; // Default to -1 if no valid data is retrieved
    if (Firebase.getInt(fbdo, F("/led1"), &ledControl)) {
        Serial.println("Firebase LED value: " + String(ledControl));
    } else {
        Serial.println("Failed to get LED value. Error: " + fbdo.errorReason());
    }
    return ledControl;
}


void setLedFirebase(int value) {
    Firebase.setInt(fbdo, F("/led1"), value);
}


void setTmpFirebase(float value) {
    Firebase.setInt(fbdo, F("/tmp"), value);
}

void setHmdFirebase(float value) {
    Firebase.setInt(fbdo, F("/hmd"), value);
}
