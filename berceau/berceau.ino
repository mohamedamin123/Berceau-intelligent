#include "Bluetooth.h"
#include "Wifi.h"
#include "Firebase.h"
#include "CapteurDHT11.h"
#include "Led.h"
#include <Preferences.h> // Library for Preferences handling

Preferences preferences; // Create a Preferences object

// Define keys for saving Wi-Fi credentials
#define WIFI_NAMESPACE "wifiCreds"
#define SSID_KEY "ssid"
#define PASS_KEY "password"

void setup() {
    Serial.begin(115200);     // Initialisation de la communication série
    initCapteurDHT();         // Initialisation du capteur DHT11
    initBluetooth();
    initLed();
    preferences.begin(WIFI_NAMESPACE, false); // Open the Preferences with the given namespace

    // Attempt to connect using saved credentials
    gererFireBaseAndWifi();
}

void loop() {
    // Check if connected to Wi-Fi
    if (!isConnectedWifi()) {
        // Attempt to reconnect
        gererFireBaseAndWifi();
    } else {
        // If connected, perform your regular tasks
        Serial.println(getLedFirebase());
        changeLed(getLedFirebase());
        
        float tmp = afficherTemperature();
        float hmd = afficherHumidite();
        setHmdFirebase(hmd);
        setTmpFirebase(tmp);        
        delay(1000);
    }
}

void gererFireBaseAndWifi() {
    String ssid, password;

        if(lireSsidEtPassword(ssid,password)) {
          // Essayer de se connecter au Wi-Fi avec le SSID et le mot de passe
          connecter(ssid, password);
          return;
    }
    
    // Read stored Wi-Fi credentials from Preferences
    if (readCredentialsFromPreferences(ssid, password)) {
          connecter(ssid, password);
          return;

    }

        Serial.println("ssid : "+ssid);
        Serial.println("pass : "+password);



}

void connecter(String ssid,String password){
      if (initWifi(ssid, password)) {  // Vérifie si la connexion Wi-Fi réussit
        Serial.println("Wi-Fi connecté avec succès!");
        
        // Initialiser Firebase après une connexion Wi-Fi réussie
        if (initFirebase()) {
            Serial.println("Firebase initialisé avec succès!");
            saveCredentialsToPreferences( ssid, password);
        } else {
            Serial.println("Erreur d'initialisation de Firebase.");
        }
    } else {
        Serial.println("Échec de la connexion Wi-Fi. Vérifiez le SSID et le mot de passe.");
    }
    }

// Save Wi-Fi credentials to Preferences
void saveCredentialsToPreferences(String ssid, String password) {
    Serial.println("Sauvegarde des identifiants Wi-Fi dans Preferences.");
    preferences.putString(SSID_KEY, ssid);
    preferences.putString(PASS_KEY, password);
}

// Read Wi-Fi credentials from Preferences
bool readCredentialsFromPreferences(String &ssid, String &password) {
    ssid = preferences.getString(SSID_KEY, "");
    password = preferences.getString(PASS_KEY, "");
    return ssid.length() > 0 && password.length() > 0;  // Return true if both are non-empty
}
