#include <WiFi.h>
#include <Arduino.h>  // Include the Arduino library for access to pinMode, digitalRead, etc.
bool initWifi(String WIFI_SSID, String WIFI_PASSWORD) {
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to Wi-Fi");

    unsigned long startAttemptTime = millis();  // Record the start time
    const unsigned long timeout = 10000;        // Timeout period of 30 seconds (30,000 milliseconds)

    // Loop until connected or timeout
    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.print(".");
        delay(300);  // Wait 300ms before checking again
        
        // Check if the timeout period has been exceeded
        if (millis() - startAttemptTime >= timeout) {
            Serial.println("\nFailed to connect to Wi-Fi within 30 seconds.");
            return false;  // Return false if unable to connect within the timeout period
        }
    }

    Serial.println("\nConnected to Wi-Fi!");
    return true;  // Return true if connected successfully
}


bool isConnectedWifi(){
  return (WiFi.status() == WL_CONNECTED); 
 }
