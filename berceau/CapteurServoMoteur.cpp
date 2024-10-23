#include <ESP32Servo.h>
#include "CapteurServoMoteur.h"

Servo myServo;       
int servoPin = 9;     
int minAngle = 60;   
int maxAngle = 120;   
int currentAngle = minAngle;  

// Function to initialize the servo motor
void initServo() {
  myServo.attach(servoPin);  
}


void changePosition() {
  // Move from minAngle to maxAngle
  
  for (currentAngle = minAngle; currentAngle <= maxAngle; currentAngle += 1) {
    myServo.write(currentAngle);   // Set the servo to the current angle
    delay(30);                     // Adjust delay for slower movement
  }
  
  delay(1000);  // Pause at the max angle for 1 second

  // Move back from maxAngle to minAngle
  for (currentAngle = maxAngle; currentAngle >= minAngle; currentAngle -= 1) {
    myServo.write(currentAngle);   // Set the servo to the current angle
    delay(30);                     // Adjust delay for slower movement
  }
  
  delay(1000);  // Pause at the min angle for 1 second
}

void initPosition() {
  myServo.write(minAngle);   // Set the servo to the initial position
  delay(500);                // Optional: Wait for 0.5 seconds for the servo to reach the position
}
