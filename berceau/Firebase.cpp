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

void initFirebase() {
    config.api_key = API_KEY;
    auth.user.email = USER_EMAIL;
    auth.user.password = USER_PASSWORD;
    config.database_url = DATABASE_URL;
    config.token_status_callback = tokenStatusCallback; // see addons/TokenHelper.h

    Firebase.reconnectNetwork(true);

    fbdo.setBSSLBufferSize(4096 /* Rx buffer size in ints from 512 - 16384 */, 1024 /* Tx buffer size in ints from 512 - 16384 */);

    Firebase.begin(&config, &auth);
}

uint8_t getLedFirebase() {
    uint8_t ledControl;
    Firebase.getInt(fbdo, F("/led1"), &ledControl);
    return ledControl;
}

void setLedFirebase(uint8_t value) {
    Firebase.setInt(fbdo, F("/led1"), value);
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
