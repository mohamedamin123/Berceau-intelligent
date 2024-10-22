#include "CapteurDHT11.h"

void setup() {
    Serial.begin(115200);  // Initialisation de la communication série
    initCapteurDHT();      // Initialisation du capteur DHT11
}

void loop() {
    afficherTemperature();  // Affiche la température
    afficherHumidite();     // Affiche l'humidité
    delay(2000);            // Délai de 2 secondes entre chaque lecture
}
