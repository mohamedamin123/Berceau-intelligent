#include <Arduino.h>

#define FAN_PIN 23  // Définir la broche de contrôle du ventilateur

// Fonction pour initialiser la broche du ventilateur
void initFan() {
  pinMode(FAN_PIN, OUTPUT);     // Configurer la broche comme sortie
  digitalWrite(FAN_PIN, LOW);   // Assurez-vous que le ventilateur est éteint au départ
}

// Fonction pour allumer le ventilateur
void turnOnFan() {
  digitalWrite(FAN_PIN, HIGH);  // Allumer le ventilateur
}

// Fonction pour éteindre le ventilateur
void turnOffFan() {
  digitalWrite(FAN_PIN, LOW);   // Éteindre le ventilateur
}
