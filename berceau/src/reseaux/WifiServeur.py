import subprocess
import socket

class WifiServeur:

    def __init__(self):
        pass  # Aucun attribut ï¿½ initialiser pour l'instant

    def connect(self, ssid, password):
        if not ssid or not password:
            print("? SSID ou mot de passe manquant.")
            return False
        try:
            # Utilisation des paramï¿½tres fournis
            subprocess.run(["nmcli", "dev", "wifi", "connect", ssid, "password", password], check=True)
            print(f"? Connectï¿½ ï¿½ {ssid}")
            return True
        except subprocess.CalledProcessError:
            print(f"? ï¿½chec de la connexion ï¿½ {ssid}")
            return False

    def is_connected(self):
        try:
            # Ping une IP externe pour tester la connectivitï¿½ (ex: 8.8.8.8 = Google DNS)
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
