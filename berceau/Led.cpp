#include <Arduino.h>  // Include the Arduino library for access to pinMode, digitalRead, etc.

#define LED_PIN 12  

void initLed() {
    pinMode(LED_PIN, OUTPUT);  // Set the motion sensor pin as input
}

void changeLed(int value){
    digitalWrite(LED_PIN,value);  
}

void allumerLed(){
  digitalWrite(LED_PIN,HIGH);  
}
void atteindreLed() {
    digitalWrite(LED_PIN,LOW);  
}
