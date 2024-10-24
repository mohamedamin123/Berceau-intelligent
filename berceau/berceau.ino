
#include "CapteurDHT11.h"
#include "Bluetooth.h"

#include "Wifi.h"
#include "Firebase.h"

#include "Led.h"





// Define thresholds for temperature and humidity


void setup() {
    Serial.begin(115200);     // Initialisation de la communication série
    initCapteurDHT();         // Initialisation du capteur DHT11
    initBluetooth();
    

}

void loop() {
  while(isConnectedBluethooth()){
    lireDeuxMessagesEtRepondre(); 
        delay(2000);

    }
}
