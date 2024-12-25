import bluetooth
import time

class Reseau_Bluetooth:
    def __init__(self, name="ESP32_Bluetooth"):
        self.name = name
        self.bt = bluetooth.BLE()
        self.bt.active(True)
        self.bt.config(gap_name=self.name)
        self.bt.irq(self._irq_handler)
        self.server = None
        self.is_connected = False

    def _irq_handler(self, event, data):
        """Gestion des événements Bluetooth."""
        if event == bluetooth.BLE.GAP_EVT_CONNECTED:
            print("Périphérique connecté.")
            self.is_connected = True
        elif event == bluetooth.BLE.GAP_EVT_DISCONNECTED:
            print("Périphérique déconnecté.")
            self.is_connected = False

    def start_advertising(self):
        """Démarre la publicité BLE pour rendre l'ESP32 détectable."""
        try:
            # Données d'annonce : ici, le nom de l'appareil est simplement le nom du périphérique
            adv_data = bytearray('\x02\x01\x06' + '\x03\x03\x00\x18' + '\x0f\x09' + self.name, 'utf-8')
            
            # Démarrage de la publicité
            self.bt.gap_advertise(100, adv_data=adv_data)
            print(f"Début de la publicité BLE avec le nom: {self.name}...")
        except Exception as e:
            print(f"Erreur lors de la publicité : {e}")

    def wait_for_connection(self):
        """Attendre une connexion d'un périphérique Bluetooth."""
        try:
            while not self.is_connected:
                time.sleep(1)
            print("Périphérique connecté.")
        except Exception as e:
            print(f"Erreur lors de l'attente de connexion : {e}")

    def send_data(self, value):
        """Envoyer des données à un client connecté via BLE."""
        try:
            if self.is_connected:
                # Ici, vous enverrez des données via une caractéristique
                print(f"Envoi des données : {value}")
            else:
                print("Pas de périphérique connecté.")
        except Exception as e:
            print(f"Erreur lors de l'envoi des données : {e}")

    def stop_advertising(self):
        """Arrêter la publicité BLE."""
        try:
            self.bt.gap_advertise(None)  # Arrêter la publicité
            print("Publicité BLE arrêtée.")
        except Exception as e:
            print(f"Erreur lors de l'arrêt de la publicité : {e}")
