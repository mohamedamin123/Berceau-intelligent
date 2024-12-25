#include <Arduino.h>  // Include the Arduino library for access to pinMode, digitalRead, etc.

#define MVT_PIN 13  

void initCapteurMVT() {
    pinMode(MVT_PIN, INPUT);  // Set the motion sensor pin as input
}

int detecterMVT() {
    int motionDetected = digitalRead(MVT_PIN);  

    if (motionDetected == HIGH) {
        Serial.println("Motion detected!"); 
        return HIGH;  // Return 1 for motion detected
    } else {
        Serial.println("No motion.");   
        return LOW;  // Return 0 for no motion
    }
}
