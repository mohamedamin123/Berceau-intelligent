
#include "CapteurDHT11.h"
#include "CapteurServoMoteur.h"
#include "CapteurMVT.h"

#include "Wifi.h"
#include "Firebase.h"

#include "Led.h"


// Define thresholds for temperature and humidity
float tempThreshold = 30.0;   // Example: Rock the cradle if temperature exceeds 30°C
float humidityThreshold = 60.0;  // Example: Rock the cradle if humidity exceeds 60%

void setup() {
    Serial.begin(115200);     // Initialisation de la communication série
    initCapteurDHT();         // Initialisation du capteur DHT11
    initServo();              // Initialisation du moteur servo
    initCapteurMVT();         // Initialisation du capteur de mouvement
    String ssid = readSsid();
    String password = readPassword();
        Serial.println("connexion");

    Serial.println(ssid);
    Serial.println(password);
    initWifi(ssid,password);    // Initialisation Wifi
    initFirebase();
    initLed();
}

void loop() {
    changeLed(getLedFirebase());
    delay(1000);
}
