#include <BluetoothSerial.h>

BluetoothSerial SerialBT;

void initBluetooth(){
      SerialBT.begin("ESP32_Bluetooth"); // Nom de votre appareil Bluetooth
    Serial.println("Le périphérique Bluetooth est prêt à être connecté.");
  }

bool isConnectedBluethooth(){
      if (SerialBT.connected()) { // Vérifier si un appareil est connecté
        return true;
    }
    return false;
 }

void sendMessageParBluetooth(){
   // Vérifiez si des données sont reçues
    if (SerialBT.available()) {
        String message = SerialBT.readString();
        Serial.print("Message reçu: ");
        Serial.println(message);
        
        // Répondre à l'application mobile
        SerialBT.println("Message reçu: " + message);
    }

    // Envoyer un message de temps en temps
    delay(2000);
    SerialBT.println("Salut du ESP32!");
  }

bool lireSsidEtPassword(String &ssid, String &password) {
    if (SerialBT.available()) {
        ssid = SerialBT.readStringUntil('\n');  // Lire le SSID
        Serial.print("Premier message (SSID) reçu: ");
        Serial.println(ssid);
        SerialBT.println("SSID reçu: " + ssid);
        
        delay(500);  // Petit délai avant de lire le mot de passe
        
        if (SerialBT.available()) {
            password = SerialBT.readStringUntil('\n');  // Lire le mot de passe
            Serial.print("Deuxième message (Mot de passe) reçu: ");
            Serial.println(password);
            SerialBT.println("Mot de passe reçu: " + password);
            return true;  // Retourner vrai si les deux sont reçus
        }
    }
    return false;  // Retourner faux si la lecture a échoué
}
