#include <DHT.h>
#include "CapteurDHT11.h"

#define DHTTYPE DHT11     // Type de capteur
#define DHTPIN 4          // Pin où le capteur est connecté

DHT dht(DHTPIN, DHTTYPE); // Crée une instance du capteur DHT

void initCapteurDHT() {
    dht.begin(); // Initialisation du capteur
}

float afficherTemperature() {
    float temperature = dht.readTemperature(); // Lit la temperature
    if (isnan(temperature)) {
        Serial.println("Erreur de lecture de la temperature !");
        return -1; // Return -1 in case of an error
    } else {
  
        return temperature;
    }
}

float afficherHumidite() {
    float humidite = dht.readHumidity(); // Lit l'humidite
    if (isnan(humidite)) {
        Serial.println("Erreur de lecture de l'humidite !");
        return -1; // Return -1 in case of an error
    } else {
        return humidite;
    }
}
