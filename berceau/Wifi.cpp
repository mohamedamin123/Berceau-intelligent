#include <WiFi.h>
#include <Arduino.h>  // Include the Arduino library for access to pinMode, digitalRead, etc.
void initWifi(String WIFI_SSID,String WIFI_PASSWORD ) {
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }  
}
