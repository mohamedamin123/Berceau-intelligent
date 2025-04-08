import time
import os
import subprocess

class WifiServeur:
    def __init__(self):
        self.connected = False

    def reset_wifi(self):
        """
        Resets the Wi-Fi connection to avoid conflicts with previous states.
        """
        # Disable and enable the Wi-Fi interface to reset
        subprocess.call(['sudo', 'ifconfig', 'wlan0', 'down'])
        time.sleep(1)
        subprocess.call(['sudo', 'ifconfig', 'wlan0', 'up'])
        time.sleep(1)  # Give some time for the interface to initialize

    def init_wifi(self, ssid, password, max_retries=5, retry_delay=5):
        """
        Initializes the Wi-Fi connection.
        Attempts to connect to the specified SSID with the provided password.
        Retries if the connection is unsuccessful.
        """
        self.reset_wifi()  # Reset the Wi-Fi interface before connecting

        # Create a wpa_supplicant.conf file with the Wi-Fi credentials
        config_file = "/etc/wpa_supplicant/wpa_supplicant.conf"
        with open(config_file, 'a') as file:
            file.write(f"\nnetwork={{\n    ssid=\"{ssid}\"\n    psk=\"{password}\"\n}}\n")

        # Restart the network service to apply the changes
        subprocess.call(['sudo', 'wpa_cli', 'reconfigure'])
        time.sleep(2)

        # Try to connect until successful or max retries are reached
        retries = 0
        while retries < max_retries:
            if self.is_connected():
                print("Connecté au Wi-Fi")
                ip_address = self.get_ip_address()
                print(f"Adresse IP : {ip_address}")
                return True
            else:
                retries += 1
                print(f"Échec de la connexion Wi-Fi. Tentative {retries}/{max_retries}.")
                time.sleep(retry_delay)

        print("Échec de la connexion Wi-Fi après plusieurs tentatives.")
        return False

    def is_connected(self):
        """
        Checks if the Wi-Fi is connected by pinging a known address.
        """
        try:
            # Ping Google's DNS server (8.8.8.8) to check for an active internet connection
            response = subprocess.call(['ping', '-c', '1', '8.8.8.8'], stdout=subprocess.PIPE)
            return response == 0
        except subprocess.CalledProcessError:
            return False

    def get_ip_address(self):
        """
        Get the IP address of the Raspberry Pi.
        """
        try:
            ip_address = subprocess.check_output(['hostname', '-I']).decode().strip()
            return ip_address
        except subprocess.CalledProcessError:
            return None