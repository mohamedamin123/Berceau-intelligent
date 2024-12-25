import time
import network  # For Wi-Fi functionality on platforms like ESP32 or ESP8266

class Reseau_Wifi:
    def __init__(self):
        self.sta_if = network.WLAN(network.STA_IF)  # Station interface for Wi-Fi
        self.sta_if.active(True)  # Activate the Wi-Fi interface
        self.connected = False

    def reset_wifi(self):
        """
        Resets the Wi-Fi connection to avoid conflicts with previous states.
        """
        self.sta_if.active(False)
        time.sleep(1)  # Wait for a moment before reactivating
        self.sta_if.active(True)
        time.sleep(1)  # Give some time for the interface to initialize

    def init_wifi(self, ssid, password):
        """
        Initializes the Wi-Fi connection.
        Attempts to connect to the specified SSID with the provided password.
        """
        self.reset_wifi()  # Reset the Wi-Fi interface before connecting

        self.sta_if.connect(ssid, password)
        print("Connexion Wi-Fi...")

        # Wait for connection with a timeout
        timeout = 15  # Timeout after 15 seconds
        start_time = time.time()

        while not self.sta_if.isconnected():
            if time.time() - start_time > timeout:
                print("Échec de la connexion Wi-Fi après un délai d'attente.")
                return False
            time.sleep(1)

        print("Connecté au Wi-Fi")
        print("Adresse IP :", self.sta_if.ifconfig()[0])  # Display the IP address
        return True

    def is_connected(self):
        """
        Checks if the Wi-Fi is connected.
        """
        return self.sta_if.isconnected()
