#include <BluetoothSerial.h>

BluetoothSerial SerialBT;

void initBluetooth(){
    SerialBT.begin("ESP32_Bluetooth"); // Nom de votre appareil Bluetooth
    Serial.println("Le périphérique Bluetooth est prêt à être connecté.");
}

bool isConnectedBluetooth(){
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

bool lireSsidEtPassword(String &ssid, String &password, String &email, String &emailPassword, String &id) {
    if (SerialBT.available()) {
        // Lire tout ce qui est disponible dans SerialBT en une seule fois
        String receivedData = SerialBT.readStringUntil('\n');

        // Chercher les espaces pour séparer les différentes données
        int firstSeparatorIndex = receivedData.indexOf(' ');
        int secondSeparatorIndex = receivedData.indexOf(' ', firstSeparatorIndex + 1);
        int thirdSeparatorIndex = receivedData.indexOf(' ', secondSeparatorIndex + 1);
        int fourthSeparatorIndex = receivedData.indexOf(' ', thirdSeparatorIndex + 1);

        if (firstSeparatorIndex != -1 && secondSeparatorIndex != -1 && thirdSeparatorIndex != -1 && fourthSeparatorIndex != -1) {
            // Extraire les différentes valeurs
            ssid = receivedData.substring(0, firstSeparatorIndex);                    // SSID avant le premier espace
            password = receivedData.substring(firstSeparatorIndex + 1, secondSeparatorIndex);  // Mot de passe entre les espaces
            email = receivedData.substring(secondSeparatorIndex + 1, thirdSeparatorIndex);    // Email entre les espaces
            emailPassword = receivedData.substring(thirdSeparatorIndex + 1, fourthSeparatorIndex);  // Mot de passe email entre les espaces
            id = receivedData.substring(fourthSeparatorIndex + 1);      // ID après le dernier espace

            // Afficher les valeurs pour vérification
            Serial.print("SSID reçu: ");
            Serial.println(ssid);
            SerialBT.println("SSID reçu: " + ssid);

            Serial.print("Mot de passe reçu: ");
            Serial.println(password);
            SerialBT.println("Mot de passe reçu: " + password);

            Serial.print("Email reçu: ");
            Serial.println(email);
            SerialBT.println("Email reçu: " + email);

            Serial.print("Mot de passe email reçu: ");
            Serial.println(emailPassword);
            SerialBT.println("Mot de passe email reçu: " + emailPassword);

            Serial.print("ID reçu: ");
            Serial.println(id);
            SerialBT.println("ID reçu: " + id);

            return true;  // Les cinq valeurs sont correctement reçues
        } else {
            // Si le séparateur n'est pas trouvé pour toutes les données
            Serial.println("Erreur de format de données.");
            return false;
        }
    }
    return false;  // Retourner faux si la lecture a échoué
}
