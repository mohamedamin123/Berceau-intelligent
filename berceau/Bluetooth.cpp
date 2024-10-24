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

void lireDeuxMessagesEtRepondre() {
    // Vérifier si des données sont disponibles
    if (SerialBT.available()) {
        // Lire le premier message (SSID)
        String ssid = SerialBT.readStringUntil('\n'); // Lire jusqu'à un saut de ligne
        Serial.print("Premier message (SSID) reçu: ");
        Serial.println(ssid);

        // Envoyer une réponse pour confirmer la réception du SSID
        SerialBT.println("SSID reçu: " + ssid);

        // Attendre un moment avant de lire le deuxième message
        delay(500); // Délai pour éviter des lectures simultanées

        // Vérifier de nouveau si des données sont disponibles pour lire le mot de passe
        if (SerialBT.available()) {
            String password = SerialBT.readStringUntil('\n'); // Lire jusqu'à un saut de ligne
            Serial.print("Deuxième message (Mot de passe) reçu: ");
            Serial.println(password);

            // Envoyer une réponse pour confirmer la réception du mot de passe
            SerialBT.println("Mot de passe reçu: " + password);
        }
    }
}
