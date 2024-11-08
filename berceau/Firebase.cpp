#include <FirebaseESP32.h>
#include <addons/TokenHelper.h>

/* 2. Define the API Key */
#define API_KEY "AIzaSyAt8Y5awtPU6-TCGR9k_r0RXK84OFIlUmo"

/* 3. Define the RTDB URL */
#define DATABASE_URL "https://esp32-7fa75-default-rtdb.firebaseio.com/"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
String idUser;

bool initFirebase(String USER_EMAIL, String USER_PASSWORD,String id) {
    // Set Firebase parameters
    config.api_key = API_KEY;
    config.database_url = DATABASE_URL;

    // Set authentication information
    auth.user.email = USER_EMAIL;
    auth.user.password = USER_PASSWORD;
    idUser=id;

    // Enable automatic network reconnection
    Firebase.reconnectNetwork(true);

    // Configure SSL buffer sizes for connections
    fbdo.setBSSLBufferSize(4096, 1024);

    // Initialize Firebase with config and auth
    Firebase.begin(&config, &auth);

    // Callback to check token status (optional)
    config.token_status_callback = tokenStatusCallback;

    // Check if Firebase is ready
    if (Firebase.ready()) {
        Serial.println("Firebase initialized successfully.");
       
        return true;
    } else {
        Serial.println("Failed to initialize Firebase.");
        return false;
    }
}

String readSsid() {
    String ssid;
    if (Firebase.getString(fbdo, "/reseauInfo/ssid", &ssid)) {
        if (fbdo.dataType() == "string") {
            Serial.print(F("SSID: "));
            Serial.println(ssid);
            return ssid;
        } else {
            Serial.println(F("Error reading SSID"));
        }
    } else {
        Serial.print(F("Failed to read SSID: "));
        Serial.println(fbdo.errorReason());
    }
    return "";
}

String readPassword() {
    String password;
    if (Firebase.getString(fbdo, "/reseauInfo/password", &password)) {
        if (fbdo.dataType() == "string") {
            Serial.print(F("Password: "));
            Serial.println(password);
            return password;
        } else {
            Serial.println(F("Error reading password"));
        }
    } else {
        Serial.print(F("Failed to read password: "));
        Serial.println(fbdo.errorReason());
    }
    return "";
}

int getLedFirebase() {
    int ledControl = -1;

    String path = "/users/" + idUser+ "/led1";
    
    if (Firebase.getInt(fbdo, path.c_str(), &ledControl)) {
        Serial.println("Firebase LED value: " + String(ledControl));
    } else {
        Serial.println("Failed to get LED value. Error: " + idUser);
    }
    return ledControl;
}

void setLedFirebase(int value) {
      String path = "/users/" + idUser + "/led1";
    Firebase.setInt(fbdo, path.c_str(), value);
}

void setTmpFirebase(float value) {
    String path2 = "/users/" + idUser+ "/tmp";
    Firebase.setInt(fbdo, path2.c_str(), value);
    }

void setHmdFirebase(float value) {
    String path3 = "/users/" + idUser + "/hmd";
    Firebase.setInt(fbdo, path3.c_str(), value);
}
