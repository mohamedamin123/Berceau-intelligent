import subprocess
import socket

class WifiServeur:

    def __init__(self):
        pass  # Aucun attribut � initialiser pour l'instant

    def connect(self, ssid, password):
        if not ssid or not password:
            print("? SSID ou mot de passe manquant.")
            return False
        try:
            # Utilisation des param�tres fournis
            subprocess.run(["nmcli", "dev", "wifi", "connect", ssid, "password", password], check=True)
            print(f"? Connect� � {ssid}")
            return True
        except subprocess.CalledProcessError:
            print(f"? �chec de la connexion � {ssid}")
            return False

    def is_connected(self):
        try:
            # Ping une IP externe pour tester la connectivit� (ex: 8.8.8.8 = Google DNS)
            subprocess.run(["ping", "-c", "1", "8.8.8.8"],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            return True
        except subprocess.CalledProcessError:
            return False

    def get_ip_address(self):
        try:
            hostname = socket.gethostname()
            ip_address = socket.gethostbyname(hostname)
            return ip_address
        except socket.error:
            return None
        
    def disconnect(self):
        try:
            # D�terminer le nom de l'interface r�seau connect�e (souvent "wlan0" ou similaire)
            result = subprocess.run(["nmcli", "-t", "-f", "DEVICE,STATE", "dev"], capture_output=True, text=True)
            for line in result.stdout.strip().split("\n"):
                device_info = line.split(":")
                if len(device_info) == 2 and device_info[1] == "connected":
                    device_name = device_info[0]
                    # D�connecter l'appareil Wi-Fi
                    subprocess.run(["nmcli", "dev", "disconnect", device_name], check=True)
                    print(f"? Wi-Fi d�connect� sur l'interface {device_name}.")
                    return True
            print("?? Aucun p�riph�rique connect� trouv�.")
            return False
        except subprocess.CalledProcessError as e:
            print(f"? �chec de la d�connexion Wi-Fi : {e}")
            return False
