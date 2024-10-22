#include <DHT.h>
#include "CapteurDHT11.h"

#define DHTTYPE DHT11     // Type de capteur
#define DHTPIN 2          // Pin où le capteur est connecté

DHT dht(DHTPIN, DHTTYPE); // Crée une instance du capteur DHT

void initCapteurDHT() {
    dht.begin(); // Initialisation du capteur
}

void afficherTemperature() {
    float temperature = dht.readTemperature(); // Lit la temperature
    if (isnan(temperature)) {
        Serial.println("Erreur de lecture de la temperature !");
    } else {
        Serial.print("Temperature: ");
        Serial.print(temperature);
        Serial.println(" °C");
    }
}

void afficherHumidite() {
    float humidite = dht.readHumidity(); // Lit l'humidite
    if (isnan(humidite)) {
        Serial.println("Erreur de lecture de l'humidite !");
    } else {
        Serial.print("Humidite: ");
        Serial.print(humidite);
        Serial.println(" %");
    }
}
