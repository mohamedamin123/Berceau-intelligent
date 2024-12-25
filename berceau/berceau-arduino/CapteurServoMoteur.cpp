#include <ESP32Servo.h>
#include "CapteurServoMoteur.h"

// Déclaration du servomoteur et du pin de contrôle
Servo myServo;       
int servoPin = 5;     
int minAngle = 60;   
int maxAngle = 120;   
int currentAngle = minAngle;  


void initServo() {
  myServo.attach(servoPin);  // Connecter le servomoteur au pin
}

void changePosition() {
  // Déplacer de minAngle à maxAngle
  for (currentAngle = minAngle; currentAngle <= maxAngle; currentAngle += 1) {
    myServo.write(currentAngle);  // Déplacer le servomoteur à l'angle courant
    delay(30);                    // Ajuster la vitesse du mouvement
  }
  

  // Déplacer de maxAngle à minAngle
  for (currentAngle = maxAngle; currentAngle >= minAngle; currentAngle -= 1) {
    myServo.write(currentAngle);  // Déplacer le servomoteur à l'angle courant
    delay(30);                    // Ajuster la vitesse du mouvement
  }
 
}

void initPosition() {
  myServo.write(minAngle);  // Position initiale du servomoteur
  delay(500);                // Attendre que le servomoteur atteigne la position initiale
}
