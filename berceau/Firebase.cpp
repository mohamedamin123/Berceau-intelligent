#include <Arduino.h>  // Include the Arduino library for access to pinMode, digitalRead, etc.

#include <FirebaseESP32.h>

// Provide the token generation process info.
#include <addons/TokenHelper.h>

// Provide the RTDB payload printing info and other helper functions.
#include <addons/RTDBHelper.h>


/* 2. Define the API Key */
#define API_KEY "AIzaSyAt8Y5awtPU6-TCGR9k_r0RXK84OFIlUmo"

/* 3. Define the RTDB URL */
#define DATABASE_URL "https://esp32-7fa75-default-rtdb.firebaseio.com/" //<databaseName>.firebaseio.com or <databaseName>.<region>.firebasedatabase.app

FirebaseData fbdo;

FirebaseAuth auth;
FirebaseConfig config;


#define USER_EMAIL "amin@amin.com"
#define USER_PASSWORD "amin123"


void initFirebase(){

config.api_key = API_KEY;

  /* Assign the user sign in credentials */
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  /* Assign the RTDB URL (required) */
  config.database_url = DATABASE_URL;

  /* Assign the callback function for the long running token generation task */
  config.token_status_callback = tokenStatusCallback; // see addons/TokenHelper.h

  // Comment or pass false value when WiFi reconnection will control by your code or third party library e.g. WiFiManager
  Firebase.reconnectNetwork(true);

  // Since v4.4.x, BearSSL engine was used, the SSL buffer need to be set.
  // Large data transmission may require larger RX buffer, otherwise connection issue or data read time out can be occurred.
  fbdo.setBSSLBufferSize(4096 /* Rx buffer size in bytes from 512 - 16384 */, 1024 /* Tx buffer size in bytes from 512 - 16384 */);

  Firebase.begin(&config, &auth);
}

int getLedFirebase(){
     int ledControl ;
    Firebase.getInt(fbdo, F("/led1"),&ledControl);
    return  ledControl;
 }

 void setLedFirebase(int value){
   Firebase.setInt(fbdo, F("/led1"), value); 
 }


 String readSsid() {
    String ssid;
    // Read the SSID from Firebase
    if (Firebase.getString(fbdo, "/reseauInfo/ssid", &ssid)) {
        if (fbdo.dataType() == "string") {
            Serial.println("SSID: " + ssid);
            return ssid; // Return the SSID
        } else {
            Serial.println("Error reading SSID");
        }
    } else {
        Serial.println("Failed to read SSID: " + fbdo.errorReason());
    }
    return ""; // Return empty string if failed
}

String readPassword() {
    String password;
    // Read the password from Firebase
    if (Firebase.getString(fbdo, "/reseauInfo/password", &password)) {
        if (fbdo.dataType() == "string") {
            Serial.println("Password: " + password);
            return password; // Return the password
        } else {
            Serial.println("Error reading password");
        }
    } else {
        Serial.println("Failed to read password: " + fbdo.errorReason());
    }
    return ""; // Return empty string if failed
}
